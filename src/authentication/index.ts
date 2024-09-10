import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const POOL_DATA = {
  UserPoolId: 'xxx',
  ClientId: 'xxx'
};

const userPool = new CognitoUserPool(POOL_DATA);

/**
 * Sign in function that handles user authentication.
 * @param event - The event object containing the request details.
 * @param res - The response object used to send the response.
 */
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
      console.log(result)
      res.status(200).send(result.getAccessToken().getJwtToken());
    },
    onFailure: (err) => {
      console.log(err);
      res.status(500).send({ error: err.errorMessage});
    }
  });
}

/**
 * Verify function that checks the validity of an access token.
 * @param accessToken - The access token to be verified.
 * @returns A promise that resolves to a boolean indicating whether the token is valid or not.
 */
module.exports.verify = async (accessToken: string): Promise<boolean> => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: POOL_DATA.UserPoolId,
    clientId: POOL_DATA.ClientId,
    tokenUse: "access",
  });

  try {
    const payload = await verifier.verify(accessToken);
    console.log("Token is valid. Payload:", payload);
    return true;
  } catch {
    console.log("Token not valid!");
    return false;
  }
};