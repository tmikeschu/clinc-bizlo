const totallyRealAccounts = {
  checking: 100,
  savings: 500
};

const transfer = ({ account, source, destination, amount }) => {
  if (account[source] > amount) {
    account[source] -= amount;
    account[destination] += amount;

    return { success: true };
  } else {
    return { success: false, error: "insufficient funds" };
  }
};

const conversationResolver = body => {
  const { state } = body;

  if (state === "get_balance") {
    const {
      slots: { ["_SOURCE_ACCOUNT_"]: source }
    } = body;

    if (source) {
      console.log("Retrieving balance...");
      Object.assign(body.slots["_SOURCE_ACCOUNT_"].values[0], {
        resolved: 1
      });
      const { [source.values[0].tokens]: balance } = totallyRealAccounts;
      if (balance) {
        Object.assign(body.slots["_SOURCE_ACCOUNT_"].values[0], {
          balance
        });
      } else {
        Object.assign(body.slots["_SOURCE_ACCOUNT_"].values[0], {
          error: "invalid account type"
        });
      }
      return body;
    }
  } else if (state === "account_transfer_confirmed") {
    console.log("Initiating transfer...");

    const transferSlots = [
      "_SOURCE_ACCOUNT_",
      "_DESTINATION_ACCOUNT_",
      "_AMOUNT_"
    ];
    const [source, destination, amount] = transferSlots.map(
      slot => body.slots[slot].values[0].tokens
    );
    const transferData = { source, destination, amount: Number(amount) };

    body.slots["_TRANSFER_"] = {};
    Object.assign(body.slots["_TRANSFER_"], {
      values: [{ ...transferData, resolved: 1 }]
    });

    const invalidTypes = [source, destination].filter(
      account => !totallyRealAccounts.hasOwnProperty(account)
    );
    if (invalidTypes.length > 0) {
      Object.assign(body.slots["_TRANSFER_"].values[0], {
        success: false,
        error: `${invalidTypes}: invalid account type(s)`
      });
    } else {
      const { success, error } = transfer({
        ...transferData,
        account: totallyRealAccounts
      });

      if (success) {
        Object.assign(body.slots["_TRANSFER_"].values[0], { success });
        body.state = "get_balance";
      } else {
        Object.assign(body.slots["_TRANSFER_"].values[0], { error });
      }
    }
    return body;
  }
};

module.exports = conversationResolver;
