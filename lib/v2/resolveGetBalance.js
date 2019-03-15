const accounts = {
  checking: { balance: 123 },
  savings: { balance: 987 },
  "credit card": { balance: 4 }
};

module.exports = body => {
  const accts = body.slots._ACCT_TYPE_.values.map(({ tokens }) => tokens);
  let responseSlots = {
    response_slots: {
      response_type: body.state,
      speakables: {},
      visuals: {}
    }
  };

  switch (accts.length) {
    case 0: {
      const responseKey = "invalid_slot";
      const data = { response_key: responseKey };

      Object.assign(responseSlots, {
        speakables: data,
        visuals: data
      });
      break;
    }

    case 1: {
      const responseKey = "single_account";
      const acct = accts[0];
      const data = {
        response_key: responseKey,
        account: acct,
        balance: accounts[acct]
      };

      Object.assign(responseSlots, {
        speakables: data,
        visuals: data
      });
      break;
    }
    default: {
      const responseKey = "multiple_accounts";
      const data = {
        response_key: responseKey,
        accounts: Object.entries(accounts).map(([name, info]) =>
          Object.assign(info, { name })
        )
      };

      Object.assign(responseSlots, {
        speakables: data,
        visuals: data
      });
    }
  }

  return Object.assign(body, responseSlots);
};
