// @flow

const AWS = require('aws-sdk');
const KeenTracking = require("keen-tracking");

const dynamodb = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  region: process.env.AWS_DEFAULT_REGION
});

const keen = new KeenTracking({
  projectId: process.env.KEEN_PROJECT_ID,
  writeKey: process.env.KEEN_WRITE_KEY
});

const env = process.env.NODE_ENV || "development";
const usedHashesTableName = `passplum_used_hashes_${env}`;
const wordsTableName = `passplum_words_${env}`

module.exports = {
  async hasBeenUsed(hash /*: string */) /*: Promise<void> */ {
    const data = await new Promise((resolve, reject) => {
      dynamodb.getItem({
        TableName: usedHashesTableName,
        Key: {
          "phrase_hash": {
            S: hash
          }
        }
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log(data);
          resolve(data);
        }
      });
    });

    if (data.Item) {
      throw new Error("Passphrase has been used before");
    }

    return new Promise((resolve, reject) => {
      dynamodb.putItem(
        {
          TableName: usedHashesTableName,
          Item: {
            "phrase_hash": {
              S: hash
            },
            "created_at": {
              N: Date.now().toString()
            }
          }
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            console.log(data);
            resolve();
          }
        }
      );
    })
  },
  async saveAnalysis(analysis /*: $FlowFixMe */) /*: Promise<void> */ {
    return new Promise((resolve, reject) => {
      const evt = {
        guesses: analysis.guesses.toString(),
        calc_time: analysis.calc_time, // eslint-disable-line camelcase
        /* eslint-disable camelcase */
        crack_times_seconds: {
          online_throttling_100_per_hour: analysis.crack_times_seconds.online_throttling_100_per_hour.toString(),
          online_no_throttling_10_per_second: analysis.crack_times_seconds.online_no_throttling_10_per_second.toString(),
          offline_slow_hashing_1e4_per_second: analysis.crack_times_seconds.offline_slow_hashing_1e4_per_second.toString(),
          offline_fast_hashing_1e10_per_second: analysis.crack_times_seconds.offline_fast_hashing_1e10_per_second.toString(),
        },
        /* eslint-enable */
        crack_times_display: analysis.crack_times_display, // eslint-disable-line camelcase
        score: analysis.score
      };
      console.log(evt);
      keen.recordEvent("phrase_created", evt, (err, res) => {
        if (err) {
          reject(err);
        } else {
          console.log(res);
          resolve();
        }
      });
    })
  },
  async countWordUse(words /*: Array<string> */) /*: Promise<Array<any>> */ {
    return Promise.all(words.map(w => new Promise((resolve, reject) => {
      dynamodb.updateItem({
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
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      });
    })));
  }
};