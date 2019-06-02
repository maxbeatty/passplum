// @flow

const DynamoDB = require("aws-sdk/clients/dynamodb");

// beware ZEIT reserved environment variables
const dynamodb = new DynamoDB({
  apiVersion: "2012-08-10",
  region: process.env.PP_AWS_REGION,
  accessKeyId: process.env.PP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.PP_AWS_SECRET_ACCESS_KEY
});

const env = process.env.NODE_ENV || "development";
const usedHashesTableName = `passplum_used_hashes_${env}`;
const wordsTableName = `passplum_words_${env}`;

module.exports = {
  async hasBeenUsed(hash /*: string */) /*: Promise<void> */ {
    const data = await dynamodb
      .getItem({
        TableName: usedHashesTableName,
        Key: {
          phrase_hash: {
            S: hash
          }
        }
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
            S: hash
          },
          created_at: {
            N: Date.now().toString()
          }
        }
      })
      .promise();
  },

  countWordUse(words /*: Array<string> */) /*: Promise<Array<any>> */ {
    return Promise.all(
      words.map(w =>
        dynamodb
          .updateItem({
            TableName: wordsTableName,
            Key: {
              word: {
                S: w
              }
            },
            ExpressionAttributeNames: {
              "#U": "used_count",
              "#L": "last_used"
            },
            ExpressionAttributeValues: {
              ":u": {
                N: "1"
              },
              ":l": {
                N: Date.now().toString()
              }
            },
            UpdateExpression: "SET #L = :l ADD #U :u"
          })
          .promise()
      )
    );
  }
};
