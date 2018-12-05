const {
  concat,
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
  const { state, slots } = body;
  const fromSlots = getSlot(slots);

  if (state === "account_and_routing_number") {
    const accounts = {
      credit: {
        accountNumber: 9876
      },
      checking: {
        routingNumber: 1234,
        accountNumber: 4321
      }
    };
    const values = pipe(
      fromSlots,
      slotValues
    )("accounts");

    const { account_dest: accountDest } = head(values);

    if (Boolean(accountDest)) {
      const account = defaultTo({ noAccount: true })(
        prop(accountDest, accounts)
      );

      const result = {
        ...fromSlots("accounts"),
        values: [
          resolveSlot({
            ...head(values),
            ...account
          }),
          ...tail(values)
        ]
      };

      return resolvedSlots(body, {
        [toSlotName("accounts")]: result
      });
    }
  }
};

module.exports = conversationResolver;
