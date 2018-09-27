const express = require('express')
const app = express()
const port = 3000

/*
POST /<BL-URL> HTTP/1.1
{
    "qid": "6d090a7e-ba91-4b49-b9d5-441f179ccbbe",
    "lat": 42.2730207,
    "lon": -83.7517747,
    "state": "transfer"
    "dialog": "lore36ho5l4pi9mh2avwgqmu5mv6rpxz/98FJ",
    "device": "web",
    "query": "I want to transfer $400 from John's checking account to my credit card account.
    "time_offset": 300,
    "slots": {
        "_ACCOUNT_FROM_": {
            "type": "string",
            "values": [
                {
                "tokens": "John's checking account",
                "resolved": -1
                }
            ]
        },
        "_ACCOUNT_TO_": {
            "type": "string",
            "values": [
                {
                "tokens": "credit card",
                "resolved": -1
                }
            ]
        },
        "_TRANSFER_AMOUNT_": {
            "type": "string",
            "values": [
                {
                "tokens": "$400",
                "resolved": -1
                }
            ]
        }
    }
}
*/

app.post('/clinc-bizlo', (req, res) => {
  console.log(req)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    "lat": 42.2730207,
    "qid": "6d090a7e-ba91-4b49-b9d5-441f179ccbbe",
    "lon": -83.7517747,
    "classifier_state": "transfer",
    "dialog": "lore36ho5l4pi9mh2avwgqmu5mv6rpxz/98FJ",
    "device": "web",
    "query": "I want to transfer $400 from John's checking account to my credit card account.",
    "time_offset": 300,
    "state": "clean_hello",
    "slots": {
      "_METHOD_NAME_": {
        "type": "string",
        "values": [
          {
            "tokens": "John's checking account",
            "resolved": 1,
            "value": "College Checking Account",
            "account_id": "353675",
            "balance": "5824.24",
            "currency": "USD"
          }
        ]
      },
      "_ACCOUNT_TO_": {
        "type": "string",
        "values": [
          {
            "tokens": "credit card",
            "resolved": 1,
            "value": "Sapphire Credit Card Account",
            "account_id": "7725485",
            "balance": "332.21",
            "currency": "USD"
          }
        ]
      },
      "_TRANSFER_AMOUNT_": {
        "type": "money",
        "values": [
          {
            "tokens": "$400",
            "resolved": 1,
            "value": "400.00",
            "currency": "USD"
          }
        ]
      }
    }
  }));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
