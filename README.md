# Serverless Practice 2024

Develop a CRUD (Create, Read, Update, Delete) microservice deployable on AWS Lambda, accessible via AWS API Gateway, utilizing the Serverless framework for setup and deployment.

# Installation

```sh
npm i

npx sst dev
(enter the name you would like for your personal stage, or just use the default. This may take a while)
```

# Usage

I tested this api with Postman. 
Take the url you get when the above command finishes. It should look similar to:

```sh
ApiEndpoint: https://2vsqvwb9z3.execute-api.us-east-1.amazonaws.com
```

This is your base url for testing the api.

## API

```sh
POST <url>/users
This adds a new user to the DB. It does not let you add more than three email addresses and auto dedupes them.

GET <url>/users/<userID>
This lets you get any existing user in the db.

PUT <url>/users/<userID>
This lets your update the fields of any user. It allows you to add new email addresses but not remove them. This was done by treating the email property as emails to be added and auto dedupes them. 

DELETE <url>/users/<userID>
This lets you delete any existing user in the db.

For the POST and PUT endpoints, you need to add a body with the following properties:
{
    "userName": "Mario",
    "dob": "1/1/1990",
    "emails": ["mario@gmail.com"]
}

Adding a user to the service returns the userID you can use with the other endpoints.
```

## Running Unit Tests

```sh
npm test
```

## Running Unit Test Coverage

```sh
npm test -- --coverage
```

### Current Code Coverage

File           | % Stmts | % Branch | % Funcs | % Lines |                       
---------------|---------|----------|---------|---------|
All files      |   75.75 |    63.15 |   33.33 |   72.88 | 
