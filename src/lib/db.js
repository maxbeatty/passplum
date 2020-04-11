// @flow

const DynamoDB = require("aws-sdk/clients/dynamodb");

// beware ZEIT reserved environment variables
const dynamodb = new DynamoDB({
  apiVersion: "2012-08-10",
  region: process.env.PP_AWS_REGION,
  accessKeyId: process.env.PP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.PP_AWS_SECRET_ACCESS_KEY,
});

const env = process.env.NODE_ENV || "development";
const vocabTableName = `passplum_vocab_${env}`;
const usedHashesTableName = `passplum_used_hashes_${env}`;
const wordsTableName = `passplum_words_${env}`;

module.exports = {
  async loadVocab() /*: Promise<Array<string>> */ {
    const vocab_id = process.env.PASSPLUM_VOCAB_ID || "";
    const data = await dynamodb
      .getItem({
        TableName: vocabTableName,
        Key: {
          vocab_id: { S: vocab_id },
        },
      })
      .promise();

    if (!data.Item) {
      const err = new Error("Item not found: vocab_id");
      err.name = vocab_id;
      throw err;
    }

    /*
    {
      words: {
        L: [
          { S: "aliceblue" },
          { S: "aqua" },
          ...
        ]
      }
    } => ["aliceblue", "aqua"]
    */
    return data.Item.words.L.map((w) => w.S);
  },

  async hasBeenUsed(hash /*: string */) /*: Promise<void> */ {
    const data = await dynamodb
      .getItem({
        TableName: usedHashesTableName,
        Key: {
          phrase_hash: {
            S: hash,
          },
        },
      })
      .promise();

    if (data.Item) {
      throw new Error("Passphrase has been used before");
    }

    return dynamodb
      .putItem({
        TableName: usedHashesTableName,
        Item: {
          phrase_hash: {
            S: hash,
          },
          created_at: {
            N: Date.now().toString(),
          },
        },
      })
      .promise();
  },

  countWordUse(words /*: Array<string> */) /*: Promise<Array<any>> */ {
    return Promise.all(
      words.map((w) =>
        dynamodb
          .updateItem({
            TableName: wordsTableName,
            Key: {
              word: {
                S: w,
              },
            },
            ExpressionAttributeNames: {
              "#U": "used_count",
              "#L": "last_used",
            },
            ExpressionAttributeValues: {
              ":u": {
                N: "1",
              },
              ":l": {
                N: Date.now().toString(),
              },
            },
            UpdateExpression: "SET #L = :l ADD #U :u",
          })
          .promise()
      )
    );
  },
};
