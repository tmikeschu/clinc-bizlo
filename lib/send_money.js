const conversationResolver = body => {
  const { state } = body;

  if (state === "zelle_send") {
    const { slots } = body;

    Object.keys(slots).forEach(slot => {
      slots[slot].values.forEach(value => {
        if (slot === "_RECIPIENT_") {
          /* db .. api ...  */

          slots["_FOUND_RECIPIENTS_"] = {
            values: [
              {
                resolved: 1,
                firstName: "Tim",
                lastName: "Walker",
                phone: "3213213211"
              },
              {
                resolved: 1,
                firstName: "Tim",
                lastName: "Walker",
                phone: "1231231233"
              },
              {
                resolved: 1,
                firstName: "Tim",
                lastName: "Runner",
                phone: "9879879877"
              }
            ]
          };

          slots["_ERROR_FOUND_RECIPIENTS_"] = {
            values: [{ value: "multiple recipients found", resolved: 1 }]
          };
        } else {
          value.resolved = 1;
          value.value = value.tokens;
        }
      });
    });

    return body;
  }
};

module.exports = conversationResolver;
