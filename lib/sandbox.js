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

  if (stateIs("account_and_routing_number")) {
    const ACCOUNTS = {
      credit: {
        accountNumber: 9876
      },
      checking: {
        routingNumber: 1234,
        accountNumber: 4321
      }
    };
    const accounts = pipe(
      fromSlots,
      slotValues,
      defaultTo([{}])
    )("accounts");

    const {
      account_dest: accountDest,
      resolved: accountsResolved,
      authenticated
    } = head(accounts);

    if (Boolean(accountDest) && accountsResolved === -1) {
      const account = defaultTo({ noAccount: true })(
        prop(accountDest, ACCOUNTS)
      );

      const result = {
        ...fromSlots("accounts"),
        values: [
          resolveSlot({
            ...head(accounts),
            ...account,
            state: "account_and_routing_number_otp"
          }),
          ...tail(accounts)
        ]
      };

      return {
        ...resolvedSlots(body, {
          [toSlotName("accounts")]: result
        }),
        state: "account_and_routing_number_otp"
      };
    } else if (authenticated) {
      const result = {
        ...fromSlots("accounts"),
        values: [
          resolveSlot({
            ...head(accounts),
            state: "account_and_routing_number"
          }),
          ...tail(accounts)
        ]
      };

      return {
        ...resolvedSlots(body, {
          [toSlotName("accounts")]: result
        })
      };
    }
  } else if (stateIs("account_and_routing_number_otp")) {
    const accounts = pipe(
      fromSlots,
      slotValues,
      defaultTo([{}])
    )("accounts");

    if (query === "123456") {
      const result = {
        ...fromSlots("accounts"),
        values: [
          resolveSlot({
            ...head(accounts),
            state: "account_and_routing_number",
            authenticated: true
          }),
          ...tail(accounts)
        ]
      };

      return {
        ...resolvedSlots(body, {
          [toSlotName("accounts")]: result
        }),
        state: "account_and_routing_number"
      };
    } else if (intent === "account_and_routing_number_otp_update") {
      const result = {
        ...fromSlots("accounts"),
        values: [
          resolveSlot({
            ...head(accounts),
            error: true
          }),
          ...tail(accounts)
        ]
      };

      return {
        ...resolvedSlots(body, {
          [toSlotName("accounts")]: result
        }),
        state: "account_and_routing_number"
      };
    } else if (intent === "account_and_routing_number_start") {
      const values = pipe(
        fromSlots,
        slotValues
      )("accounts");

      const result = {
        ...fromSlots("accounts"),
        values: [resolveSlot(head(values)), ...tail(values)]
      };

      return resolvedSlots(body, {
        [toSlotName("accounts")]: result
      });
    }
  }
};

module.exports = conversationResolver;
