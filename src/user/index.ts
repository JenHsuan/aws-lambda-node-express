import * as _ from 'lodash';
import * as db from "@aws-sdk/client-dynamodb";

const authentication = require('../authentication/index');

const dyamodb = new db.DynamoDB({
  region: 'ap-southeast-2',
  apiVersion: '2012-08-10'
});

const tableId = "userDemo";

/**
 * Retrieves a list of users from the userDemo table.
 * If a userId is provided, it retrieves a specific user.
 * If no userId is provided, it retrieves all users.
 * @param {object} event - The event object containing the query parameters.
 * @param {object} res - The response object to send the list of users.
 */
module.exports.list = async (event: any, res: any) => {
  const userId = event.query["userId"];

  const token = event.headers["authorization"];
  if (_.isNil(token)) {
    res.status(401).send("Unauthorized");
  }

  const isTokenValid = await authentication.verify(token);
  if (!isTokenValid) {
    res.status(401).send("Unauthorized");
  }

  if (_.isNil(userId)) {
    //all
    const params = {
      TableName: tableId
    }

    dyamodb.scan(params, function(err: any, data: any) {
      if (err) {
        console.log(err);
        res.status(500).send({ error: err.errorMessage});
      } 
      
      const items = data.Items.map((dataField: any) => {
        return {
          age: +dataField.Age.N,
          height: +dataField.Height.N,
          income: +dataField.Income.N
        }
      });
      res.json(items);
    });
  } else {
    //specific
    const params = {
      Key: {
        "UserId": {
          S: `user_${userId}`
        }
      },
      TableName: tableId
    }

    dyamodb.getItem(params, function(err: any, data: any) {
      if (err) {
        console.log(err);
        res.status(500).send({ error: err.errorMessage});
      } 
      
      const item = {
        age: +data.Item.Age.N,
        height: +data.Item.Height.N,
        income: +data.Item.Income.N
      }
      
      res.json([ item ]);
    });
  }
};

/**
 * Creates a new user in the userDemo table.
 * @param {object} params - The parameters for creating a new user.
 * @param {object} params.Item - The item object containing user details.
 * @param {string} params.Item.UserId - The user ID.
 * @param {number} params.Item.Age - The user's age.
 * @param {number} params.Item.Height - The user's height.
 * @param {number} params.Item.Income - The user's income.
 * @param {string} params.TableName - The name of the table to insert the user into.
 */
module.exports.create = async (event: any, res: any) => {
  const token = event.headers["authorization"];
  if (_.isNil(token)) {
    res.status(401).send("Unauthorized");
  }

  const isTokenValid = await authentication.verify(token);
  if (!isTokenValid) {
    res.status(401).send("Unauthorized");
  }

  const { userId, age, height, income } = JSON.parse(event.body);
  
  const params = {
    Item: {
      "UserId": {
        S: `user_${userId}`
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
      res.status(500).send({ error: err.errorMessage});
    } else {
     console.log(data);
     res.json(data);
    }
  });
};

/**
 * Retrieves the parameters for fetching a user from the database.
 * @param userId - The ID of the user.
 * @param tableId - The ID of the table.
 * @returns The parameters object for fetching the user.
 */
module.exports.delete = async (event: any, res: any) => {
  const token = event.headers["authorization"];
  if (_.isNil(token)) {
    res.status(401).send("Unauthorized");
  }

  const isTokenValid = await authentication.verify(token);
  if (!isTokenValid) {
    res.status(401).send("Unauthorized");
  }
  
  const userId = event.query["userId"];
  if (_.isNil(userId)) {
    res.status(400).send("userId is required");
  }

  const params = {
    Key: {
      "UserId": {
        S: `user_${userId}`
      }
    },
    TableName: tableId
  }

  dyamodb.deleteItem(params, function(err: any, data: any) {
    if (err) {
      console.log(err);
      res.status(500).send({ error: err.errorMessage});
    } else {
      console.log(data);
      return {
        statusCode: 200,
        body: null,
      };
    }
  });
}