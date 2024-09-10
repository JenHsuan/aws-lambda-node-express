import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";

const POOL_DATA = {
  UserPoolId: 'xxx',
  ClientId: 'xxx'
};

const userPool = new CognitoUserPool(POOL_DATA);

module.exports.signin = async (event: any, res: any) => {
  const { username, password } = JSON.parse(event.body);
  const authData = {
    Username: username,
    Password: password
  };

  const authenticationDetails = new AuthenticationDetails(authData);
  
  const userData = {
    Username: username,
    Pool: userPool
  };

  const cognitoUser = new CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result: CognitoUserSession) => {
      console.log(result.getIdToken().getJwtToken())
      res.status(200).send(result.getIdToken().getJwtToken());
    },
    onFailure: (err) => {
      console.log(err);
      res.status(500).send({ error: err.errorMessage});
    }
  });
}