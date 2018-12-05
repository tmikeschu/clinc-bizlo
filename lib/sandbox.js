const { prop, toUpper, defaultTo, pipe } = require("ramda");

const toSlotName = name => `_${toUpper(name)}_`;
const getSlot = body => slotName =>
  defaultTo({})(prop(toSlotName(slotName), body));
const slotValues = prop("values");

const resolveSlot = slot => ({
  ...slot,
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

    const { account_dest: accountDest, ...values } = pipe(
      fromSlots,
      slotValues
    )("accounts");

    if (Boolean(accountDest)) {
      const account = defaultTo({ noAccount: true })(
        prop(accountDest, accounts)
      );

      const result = resolveSlot({
        ...fromSlots("accounts"),
        values: {
          ...values,
          ...account
        }
      });

      return resolvedSlots(body, {
        [toSlotName("accounts")]: result
      });
    }
  }
};

module.exports = conversationResolver;
