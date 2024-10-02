import { User } from "../../core/src/user";
import { APIGatewayProxyHandler } from "aws-lambda";

import * as helper from "../../core/src/helper";

// Handle creating the user from the route
export const createUser: APIGatewayProxyHandler = async (event: any) => {
  try {
    let { userName, dob, emails } = helper.getBodyProperties(event.body);
    
    emails = helper.getUniqueStringsFromList(emails);
    if (!helper.isValidEmailLength(emails))
      return helper.TOO_MANY_EMAILS_RESPONSE;

    const user = await User.createUser(userName, dob, emails);
    return helper.getUserResponse(user);
  } catch (error: any) {
    return helper.getError(error);
  }
};

// Handle getting the user from the route
export const getUser: APIGatewayProxyHandler = async (event: any) => {
  try {
    const userID = event.pathParameters?.userID;

    if (!userID) {
      return helper.USERID_IS_REQUIRED_RESPONSE;
    }

    const user = await User.getUser(userID);
    return helper.getUserResponse(user);
  } catch (error: any) {
    return helper.getError(error);
  }
};

// Handle updating the user from the route
export const updateUser: APIGatewayProxyHandler = async (event: any) => {
  try {
    const userID = event.pathParameters?.userID;
    let { userName, dob, emails } = helper.getBodyProperties(event.body);
    
    if (!helper.isValidQueryParams(userName, dob, emails) || !userID) {
      return helper.MISSING_REQUIRED_PARAMS_RESPONSE;
    }

    emails = helper.getUniqueStringsFromList(emails);
    if (!helper.isValidEmailLength(emails))
      return helper.TOO_MANY_EMAILS_RESPONSE;

    const result = await User.updateUser(userID, userName, dob, emails);
    return helper.getUserResponseFromUpdate(result);
  } catch (error: any) {
    return helper.getError(error);
  }
};

// Handle deleting the user from the route
export const deleteUser: APIGatewayProxyHandler = async (event: any) => {
  try {
    const userID = event.pathParameters?.userID;

    if (!userID) {
      return helper.USERID_IS_REQUIRED_RESPONSE;
    }

    const user = await User.deleteUser(userID);
    return helper.getUserResponseFromUpdate(user);
  } catch (error: any) {
    return helper.getError(error);
  }
};
