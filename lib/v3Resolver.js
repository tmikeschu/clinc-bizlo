const GET_BALANCE_TO_ACCT_TRANSFER = "get_balance_to_acct_transfer";
const GET_BALANCE = "get_balance";

const account = {
  checking: 123,
  savings: 3000
};

const conversationResolver = body => {
  // get balance to acct transfer
  if (body.intent === GET_BALANCE_TO_ACCT_TRANSFER) {
    const balance_acct = body.slots._ACCT_TYPE_;
    delete body.slots._ACCT_TYPE_;

    if (!body.slots._DESTINATION_ACCT_) {
      body.slots._DESTINATION_ACCT_ = balance_acct;
    } else if (!body.slots._SOURCE_ACCT_) {
      body.slots._SOURCE_ACCT_ = balance_acct;
    }

    Object.keys(body.slots).forEach(slot => {
      body.slots[slot].values[0].resolved = 1;
    });

    return body;
  }

  // get balance state with ACCT_TYPE slot
  if (body.state === GET_BALANCE && body.slots._ACCT_TYPE_) {
    const account_type = body.slots._ACCT_TYPE_.values[0].tokens;
    const balance = account[account_type] || "Not found";

    Object.keys(body.slots).forEach(slot => {
      body.slots[slot].values[0].resolved = 1;
    });

    const responseData = {
      balance,
      account: account_type
    };

    body.response_slots = {
      response_type: body.state,
      speakables: responseData,
      visuals: responseData
    };

    return body;
  }
};

module.exports = conversationResolver;
