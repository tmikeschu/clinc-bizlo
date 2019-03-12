const GET_BALANCE_TO_ACCT_TRANSFER = "get_balance_to_acct_transfer";
const conversationResolver = body => {
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
};

module.exports = conversationResolver;
