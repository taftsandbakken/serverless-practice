import { StackContext, Api, Table } from "sst/constructs";

export function API({ stack }: StackContext) {
  // Create a DynamoDB table
  const userTable = new Table(stack, "UsersTable", {
    fields: {
      userID: "string",
      userName: "string",
      dob: "string",
      emails: "string",  // Store list as a serialized string
    },
    primaryIndex: { partitionKey: "userID" },
  });

  // Setup the API routes
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          TABLE_NAME: userTable.tableName,
        },
        permissions: [userTable]
      },
    },
    routes: {
      "POST /users": "packages/functions/src/user.createUser",
      "GET /users/{userID}": "packages/functions/src/user.getUser",
      "PUT /users/{userID}": "packages/functions/src/user.updateUser",
      "DELETE /users/{userID}": "packages/functions/src/user.deleteUser",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
