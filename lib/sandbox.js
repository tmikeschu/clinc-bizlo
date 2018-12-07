const {
  concat,
  equals,
  curry,
  isEmpty,
  keys,
  tail,
  head,
  prop,
  toUpper,
  defaultTo,
  pipe,
  toLower,
  zipObj,
  values,
  map
} = require("ramda");

const snakeCase = str => str.replace(/([A-Z])/g, x => concat("_", toLower(x)));

const parseValues = curry((fn, obj) => {
  if (isEmpty(keys(obj))) {
    return obj;
  } else {
    return mapKeys(fn, obj);
  }
});
const mapKeys = curry((fn, obj) =>
  zipObj(map(fn, keys(obj)), map(parseValues(fn), values(obj)))
);

const toSlotName = name => `_${toUpper(name)}_`;
const getSlot = body => slotName =>
  defaultTo({})(prop(toSlotName(slotName), body));
const slotValues = prop("values");

const resolveSlot = slot => ({
  ...mapKeys(snakeCase, slot),
  resolved: 1
});

const resolvedSlots = (body, slots) => ({
  ...body,
  slots: {
    ...body.slots,
    ...slots
  }
});

const conversationResolver = body => {
  const { state, slots, query, intent } = body;
  const fromSlots = getSlot(slots);
  const stateIs = equals(state);
  const intentIs = equals(intent);
  const accounts = pipe(
    fromSlots,
    slotValues,
    defaultTo([{}])
  )("accounts");

  const {
    tokens,
    account_dest: accountDest,
    resolved: accountsResolved,
    authenticated
  } = head(accounts);

  const accountType = accountDest || tokens;

  const resolveAccounts = (data = {}) => ({
    ...fromSlots("accounts"),
    values: [
      resolveSlot({
        ...head(accounts),
        ...data
      }),
      ...tail(accounts)
    ]
  });

  const resolveResponse = data => ({
    ...resolvedSlots(body, {
      [toSlotName("accounts")]: data.accounts
    }),
    state: data.state || state
  });

  if (stateIs("account_and_routing_number")) {
    if (!intentIs("cs_cancel")) {
      return resolveResponse({
        accounts: resolveAccounts({
          ...account,
          cancel: true,
          state: "account_and_routing_number"
        })
      });
    }

    const ACCOUNTS = {
      credit: {
        accountNumber: 9876
      },
      checking: {
        routingNumber: 1234,
        accountNumber: 4321
      }
    };

    if (Boolean(accountType) && accountsResolved === -1) {
      const account = defaultTo({ noAccount: true })(
        prop(accountDest, ACCOUNTS)
      );

      return resolveResponse({
        accounts: resolveAccounts({
          ...account,
          state: "account_and_routing_number_otp"
        }),
        state: "account_and_routing_number_otp"
      });
    } else if (authenticated) {
      return resolveResponse({
        accounts: resolveAccounts({
          state: "account_and_routing_number"
        })
      });
    }
  } else if (stateIs("account_and_routing_number_otp")) {
    if (query === "123456") {
      return resolveResponse({
        accounts: resolveAccounts({
          state: "account_and_routing_number",
          authenticated: true
        }),
        state: "account_and_routing_number"
      });
    } else if (intentIs("account_and_routing_number_otp_update")) {
      return resolveResponse({ accounts: resolveAccounts({ error: true }) });
    } else if (intent.includes("account_and_routing_number_start")) {
      return resolveResponse({ accounts: resolveAccounts() });
    }
  }
};

module.exports = conversationResolver;
