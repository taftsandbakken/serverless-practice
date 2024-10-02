export * as User from "./user";
import crypto from "crypto";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  QueryCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommandInput, 
  PutCommandInput, 
  UpdateCommandInput, 
  DeleteCommandInput 
} from "@aws-sdk/lib-dynamodb";

import * as helper from "./helper";

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const USER_TABLE_NAME = "tafts-my-sst-app-UsersTable";

const createUserParams = (userID: string, userName: string, dob: string, emails: string[]): PutCommandInput => {
  return {
    TableName: USER_TABLE_NAME,
    Item: {
      userID,
      userName,
      dob,
      emails: JSON.stringify(emails)
    }
  }
};

const getUserParams = (userID: string): QueryCommandInput => {
  return {
    TableName: USER_TABLE_NAME,
    KeyConditionExpression: "userID = :userID",
    ExpressionAttributeValues: {
      ":userID": userID,
    },
  }
};

const updateUserParams = (userID: string, userName: string, dob: string, emails: string[]): UpdateCommandInput => {
  return {
    TableName: USER_TABLE_NAME,
    Key: {
      userID: userID
    },
    UpdateExpression: "set userName = :userName, dob = :dob, emails = :emails",
    ExpressionAttributeValues: {
      ":userName": userName,
      ":dob": dob,
      ":emails": JSON.stringify(emails),
    },
    ReturnValues: "UPDATED_NEW",
  }
};

const deleteUserParams = (userID: string): DeleteCommandInput => {
  return {
    TableName: USER_TABLE_NAME,
    Key: {
      userID: userID
    },
    ReturnValues: "ALL_OLD",
  }
};

const createUserForDynamoDB = async (userID: string, userName: string, dob: string, emails: string[]) => {
    return await dynamoDb.send(new PutCommand(createUserParams(userID, userName, dob, emails)));
};

const getUserFromDynamoDB = async (userID: string) => {
    return await dynamoDb.send(new QueryCommand(getUserParams(userID)));
};

const updateUserForDynamoDB = async (userID: string, userName: string, dob: string, emails: string[]) => {
    return await dynamoDb.send(new UpdateCommand(updateUserParams(userID, userName, dob, emails)));
};

const deleteUserFromDynamoDB = async (userID: string) => {
    return await dynamoDb.send(new DeleteCommand(deleteUserParams(userID)));
};

export async function createUser(userName: string, dob: string, emails: string[]) {
  const userID = crypto.randomUUID();
  await createUserForDynamoDB(userID, userName, dob, helper.getUniqueStringsFromList(emails));
  return await getUser(userID);
}

export async function getUser(userID: string) {
  return await getUserFromDynamoDB(userID);
}

export async function updateUser(userID: string, userName: string, dob: string, emails: string[]) {
  const result = await getUserFromDynamoDB(userID);
  // Check if user exists. If not, it will throw an exception
  helper.getUserFromResult(result);

  return await updateUserForDynamoDB(userID, userName, dob, emails);
}

export async function deleteUser(userID: string) {
  return await deleteUserFromDynamoDB(userID);
}
