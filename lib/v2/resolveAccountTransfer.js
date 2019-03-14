// state === account_transfer
module.exports = body => {
  // if source_account is present, set acct_type to destination
  // else if destination_account is present, set acct_type to source

  if (body.intent === "get_balance_to_account_transfer") {
    if (!body.slots._DESTINATION_ACCOUNT_) {
      body.slots._DESTINATION_ACCOUNT_ = body.slots._ACCT_TYPE_;
    } else if (!body.slots._SOURCE_ACCOUNT_) {
      body.slots._SOURCE_ACCOUNT_ = body.slots._ACCT_TYPE_;
    }
    delete body.slots._ACCT_TYPE_;

    // set resolved to 1
    Object.keys(body.slots).forEach(slot => {
      body.slots[slot].values.forEach(value => {
        value.resolved = 1;
      });
    });

    return body;
  }

  if (body.intent === "cs_yes") {
    // how to trigger business logic transition
    body.state = "get_balance";
    return body;
  }
};
