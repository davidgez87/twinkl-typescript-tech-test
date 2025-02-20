# Twinkl TypeScript Test

- [Description](#description)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Packages](#packages)
- [Testing](#testing)

### Description
This project is a TypeScript-based Express.js API designed to handle user authentication and data retrieval. It uses Prisma as an ORM for database interactions, ensuring type safety and scalability. The API includes validation with Zod, logging with Pino, and follows best practices for testing with Jest and Supertest.

- User Processing – Secure user sign-up and data retrieval
- Express.js Framework – Lightweight and efficient API structure
- Prisma ORM – Simplified database management with type safety
- Zod Validation – Ensures request data integrity
- Comprehensive Testing – Jest and Supertest for unit testing
- Logging – Uses Pino for high-performance logging

### Architecture
| Folder            | Layer         | Purpose                                               |
|-------------------|---------------|-------------------------------------------------------|
| src               | Core files    | Entry point for the app                               |
| src/config        | Configuration | Handles DB connection                                 |
| src/routes        | Routing       | Defines endpoints and maps to controllers             |
| src/controllers   | Controller    | Handles requests, calls services and returns responses|
| src/services      | Service       | Implements business logic, calls repositorys          |
| src/repositories  | Repository    | DB interactions                                       |
| src/middleware    | Middleware    | Handles validation and error handling                 |
| src/untils        | Utilities     | Helper functions                                      |
| tests/unit        | Testing       | Contains unit tests                                   |
| prisma            | ORM           | Stores schema & migration files                       |

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/): Ensure that Node.js, preferably version 16 or higher, is installed on your system, as this project utilizes the latest versions of TypeScript and Nodemon.
- [npm](https://www.npmjs.com/): npm is the package manager for Node.js and comes with the Node.js installation.

### Installation

Install the dependencies:

```
npm i
```

### Usage

In development the following command will start the server and use `nodemon` to auto-reload the server based on file changes

```
npm run dev
```

There are also commands to build and start a server without nodemon:

```
npm run build
npm start
```

The server will start at `http://localhost:3000` by default. You can change the port in `src/index.ts` 

### Packages

- [express](https://www.npmjs.com/package/express): is a fast, unopinionated, minimalist web framework for Node.js. It simplifies routing, middleware handling, and HTTP request/response management.
- [pino](https://www.npmjs.com/package/pino): Very low overhead Node.js logger.
- [zod](https://www.npmjs.com/package/zod): TypeScript-first schema validation with static type inference. 
- [prisma client](https://www.npmjs.com/package/@prisma/client): Prisma Client JS is an auto-generated query builder that enables type-safe database access and reduces boilerplate. 
- [crypto-js](https://www.npmjs.com/package/crypto-js): Prisma Client JS is an auto-generated query builder that enables type-safe database access and reduces boilerplate. 


### Testing
To run the unit tests a command is available to run:

```
npm run test
```

To view the api in the swagger editor navigate to [swagger editor](https://editor.swagger.io/) and copy and paste the contents of openapi.yaml located at the route of the repo

To manual test via curl you can use the following commands in a terminal

#### Sign Up
201 
```
curl -X POST http://localhost:3000/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "David Geraghty",
    "email": "davidgeraghty@example.com",
    "password": "Password123",
    "createdDate": "18-01-2025",
    "userType": "student"
  }'
```

400 - Missing full name
```
curl -X POST http://localhost:3000/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "",
    "email": "davidgeraghty@example.com",
    "password": "Password123",
    "createdDate": "18-01-2025",
    "userType": "not a valid user type"
  }'
```

400 - Invalid email
```
curl -X POST http://localhost:3000/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "David Geraghty",
    "email": "Not an email",
    "password": "Password123",
    "createdDate": "18-01-2025",
    "userType": "student"
  }'
```

400 - Invalid password
```
curl -X POST http://localhost:3000/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "David Geraghty",
    "email": "david@email.com",
    "password": "pass",
    "createdDate": "18-01-2025",
    "userType": "student"
  }'
```

400 - Missing created date
```
curl -X POST http://localhost:3000/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "David Geraghty",
    "email": "david@email.com",
    "password": "Password123",
    "createdDate": "",
    "userType": "student"
  }'
```

400 - Invalid user type
```
curl -X POST http://localhost:3000/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "",
    "email": "davidgeraghty@example.com",
    "password": "Password123",
    "createdDate": "18-01-2025",
    "userType": "not a valid user type"
  }'
```

#### User Details

200 - if user has been created
```
curl -X GET http://localhost:3000/user/1
```

400 - invalid request param
```
curl -X GET http://localhost:3000/user/notARequestParam
```

404 - if user has not been created
```
curl -X GET http://localhost:3000/user/10
```