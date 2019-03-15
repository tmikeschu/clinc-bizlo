const resolveAccountTransfer = require("./resolveAccountTransfer");
const resolveAARN = require("./resolveAARN");
const resolveGetBalance = require("./resolveGetBalance");

const conversationResolver = body => {
  const stateIs = x => body.state === x;

  if (
    ["account_and_routing_number", "account_and_routing_number_otp"].some(
      stateIs
    )
  ) {
    return resolveAARN(body);
  } else if (["account_transfer", "account_transfer_confirmed"].some(stateIs)) {
    return resolveAccountTransfer(body);
  } else if (stateIs("get_balance")) {
    return resolveGetBalance(body);
  }
};

module.exports = conversationResolver;
