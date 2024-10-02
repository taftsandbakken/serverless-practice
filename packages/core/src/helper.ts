export * as User from "./user";
import { QueryCommandOutput, UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyResult } from "aws-lambda";

export const USER_NOT_FOUND = "User not found";
export const TOO_MANY_EMAILS_MSG = "User is not allowed to have that many emails";
export const USERID_IS_REQUIRED_MSG = "userID is required";
export const MISSING_PARAMS_MSG = "Missing required params";
export const QUERY_FAILED_MSG = "Query failed";

export const MAX_EMAILS_PER_USER = 3;

export interface User {
  userID: string;
  userName: string;
  dob: string;
  emails: string[]
};

export const USERID_IS_REQUIRED_RESPONSE: APIGatewayProxyResult = {
  statusCode: 400,
  body: JSON.stringify({ message: USERID_IS_REQUIRED_MSG }),
};

export const MISSING_REQUIRED_PARAMS_RESPONSE: APIGatewayProxyResult = {
  statusCode: 400,
  body: JSON.stringify({ message: MISSING_PARAMS_MSG }),
};

export const TOO_MANY_EMAILS_RESPONSE: APIGatewayProxyResult = {
  statusCode: 400,
  body: JSON.stringify({ message: TOO_MANY_EMAILS_MSG }),
};

export const MISSING_USER_RESPONSE: APIGatewayProxyResult = {
  statusCode: 404,
  body: JSON.stringify({ message: USER_NOT_FOUND }),
};

export const getUserResponse = (result: QueryCommandOutput): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: JSON.stringify(getUserFromResult(result)),
  };
};

export const getUserResponseFromUpdate = (result: UpdateCommandOutput): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: JSON.stringify(getUserFromUpdateResult(result)),
  };
};

export const getQueryFailedResponse = (error: string): APIGatewayProxyResult => {
  return {
    statusCode: 500,
    body: JSON.stringify({ message: QUERY_FAILED_MSG, error }),
  };
};

// Attempt to get the user object out of a query command
export const getUserFromResult = (result: QueryCommandOutput): User => {
  if (!result.Items || result.Items.length === 0)
    throw MISSING_USER_RESPONSE;
  return {
    userID: result.Items[0].userID,
    userName: result.Items[0].userName,
    dob: result.Items[0].dob,
    emails: JSON.parse(result.Items[0].emails)
  };
};

// Attempt to get the user object out of an update command
export const getUserFromUpdateResult = (result: UpdateCommandOutput): User => {
  if (!result.Attributes)
    throw MISSING_USER_RESPONSE;
  return {
    userID: result.Attributes.userID,
    userName: result.Attributes.userName,
    dob: result.Attributes.dob,
    emails: JSON.parse(result.Attributes.emails)
  };
};

// Check if input query params are valid
export const isValidQueryParams = (userName: string, dob: string, emails: string[]): boolean => {
  return !(!userName || !dob || !emails || emails.length === 0);
};

// Dedupe list of strings
export const getUniqueStringsFromList = (strings: string[]): string[] => {
  return Array.from(new Set<string>([...strings]));
};

// Get the properties out of a body object
export const getBodyProperties = (body: any) => {
  try {
    const { userName, dob, emails } = JSON.parse(body);
    if (!isValidQueryParams(userName, dob, emails))
      throw MISSING_REQUIRED_PARAMS_RESPONSE;
    return { userName, dob, emails };
  } catch (error) {
    throw MISSING_REQUIRED_PARAMS_RESPONSE;
  }
};

// Handle errors of multiple types
export const getError = (error: APIGatewayProxyResult|object): APIGatewayProxyResult => {
  if (isAPIGatewayProxyResult(error))
    return error;
  return getQueryFailedResponse(error.toString());
};

// Make sure the email length isn't too big
export const isValidEmailLength = (emails: string[]): boolean => {
  return emails.length <= MAX_EMAILS_PER_USER;
}

// Check if an object is of type APIGatewayProxyResult
function isAPIGatewayProxyResult(param: APIGatewayProxyResult | object): param is APIGatewayProxyResult {
  return (param as APIGatewayProxyResult).statusCode !== undefined && (param as APIGatewayProxyResult).body !== undefined;
}
