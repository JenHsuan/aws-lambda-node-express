import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import {
	ReasonPhrases,
	StatusCodes,
} from 'http-status-codes';
import express, { Request, Response } from 'express';

const utility = require('../utility/index');

const POOL_DATA = {
  UserPoolId: process.env.UserPoolId!,
  ClientId: process.env.ClientId!
};

const userPool = new CognitoUserPool(POOL_DATA);

/**
 * Sign in function that handles user authentication.
 * @param event - The event object containing the request details.
 * @param res - The response object used to send the response.
 */
module.exports.signin = async (event: Request, res: Response) => {
  if (!utility.isJsonString(event.body)) {
    res.status(StatusCodes.UNAUTHORIZED).send({ error: "Invalid request body"});
    return;
  }

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
      res.status(StatusCodes.OK).send(result.getAccessToken().getJwtToken());
      return;
    },
    onFailure: (err) => {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: err.errorMessage});
      return;
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