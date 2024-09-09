const db = require("@aws-sdk/client-dynamodb");

const dyamodb = new db.DynamoDB({
  region: 'ap-southeast-2',
  apiVersion: '2012-08-10'
});

module.exports.create = async (event: any) => {
  const { age, height, income } = JSON.parse(event.body);
  
  const params = {
    Item: {
      "UserId": {
        S: `user_${Math.random()}`
        //S: `${event.userId}`
      },
      "Age": {
        N: `${age}`
      },
      "Height": {
        N: `${height}`
      },
      "Income": {
        N: `${income}`
      }
    },
    TableName: "userDemo"
  }

  dyamodb.putItem(params, function(err: any, data: any) {
    if (err) {
      console.log(err);
      return {
        statusCode: 500,
        body: err.errorMessage,
      };
    } else {
     console.log(data);
     return {
       statusCode: 200,
       body: null,
     };
    }
  });
};