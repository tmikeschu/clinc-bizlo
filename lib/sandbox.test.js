const test = require("tape");

const sandboxResolver = require("./sandbox");

const request = {
  ai_version: "33fac95a-bcbd-4684-b07b-decac8fb25ce",
  device: "default",
  dialog: "5ddH6dNuPG1OJxdLH01d8Cw69GNBpbRx",
  lat: 0,
  lon: 0,
  time_offset: 0,
  external_user_id: "1",
  query: "What is my checking account number?",
  qid: "24f5e756-2967-40f2-9c2c-d3141bfcefe5",
  state: "account_and_routing_number",
  slots: {
    _ACCOUNTS_: {
      type: "string",
      values: [{ resolved: -1, tokens: "checking", account_dest: "checking" }]
    }
  },
  intent: "account_and_routing_number_start"
};

test("resolves checking", t => {
  t.plan(1);

  const actual = sandboxResolver(request);
  const expected = {
    ...request,
    state: "account_and_routing_number_otp",
    slots: {
      ...request.slots,
      _ACCOUNTS_: {
        type: "string",
        values: [
          {
            resolved: 1,
            tokens: "checking",
            account_dest: "checking",
            routing_number: 1234,
            account_number: 4321,
            state: "account_and_routing_number_otp"
          }
        ]
      }
    }
  };

  t.same(actual, expected, "Expected objects to be equal");
});
