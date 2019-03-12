const conversationResolver = body => {
  if (body.state === "acct_transfer" && body.intent === "get_balance_to_acct_transfer") {
    const balance_acct = body.slots._ACCT_TYPE_
    delete body.slots._ACCT_TYPE_

    if (!body.slots._DESTINATION_ACCT_) {
      body.slots._DESTINATION_ACCT_ = balance_acct
      delete body.slos
    } else if (!body.slots._SOURCE_ACCT_) {
      body.slots._SOURCE_ACCT_ = balance_acct
    }

    Object.keys(body.slots).forEach(key => {
      body.slots[key].values[0].resolved = 1
    })

    return body
  }
};

module.exports = conversationResolver;
