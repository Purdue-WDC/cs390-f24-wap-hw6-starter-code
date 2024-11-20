# HW6: MongoDB + Security

## Objective
To practice building full-stack applications, in this assignment, you will be expanding upon HW5 to use a proper database (MongoDB). For extra credit, you have several options. This includes creating MongoDB indexes and applying basic security protocols (salted password hashing and JWTs).

The frontend and backend folders have already been set up for React and Express. However, if you would like to use other frameworks, feel free to do so (as long as all requirements are fulfilled).

## Running Both Apps
To run both the React and Express apps, simply open 2 terminals and follow the guides given in each folder's `README.md` file.

## Template Code Explained

### React Template
This is the same as HW5.

### Express Template
Here, I have added quite a bit to HW5's template. Now it also includes `db.js` (where I provide basic MongoDB client connectivity) and `security.js` (where I provide easy-to-use functions for password hashing and JWTs).

Note: You have my permission to use this template for hackathons (like BoilerMake), personal projects, etc. Just don't forget a citation.

## Instructions/Requirements

Note that all instructions are written under the assumption that HW5 was completed. If you did not fulfill all of HW5's requirements, make sure to go back and read them so you are on the same page as to my intentions/expectations.

### Setup (5 points)

- Create a MongoDB cluster (consider using MongoDB Atlas as shown in class). Note: I will assume the cluster is name `Cluster0` as that is the default. (2 points)
- Within that cluster, create a database named `hw6`. (1 point)
- Within that database, create two collections. One named `users`. One named `gameLogs`. (2 points)

### Signup (7 points)

To check if a user with the same username exists:
- Use `collection.findOne/find/etc.` to find the document of a user with the same username. Note: If you chose to add a unique index on username, you could catch mongodb's `DuplicateKey` error when inserting a new user. (1 points)
- Ensure no such document was found (MongoDB's `NoMatchingDocument` error) prior to inserting the new user into the database. If an error did occur, respond to the request with a 409 Conflict status code and empty/null body (1 points)

To insert a user in the `users` collection:
- Use `collection.insertOne` to insert the new user document into the user collection. (1 points)
- Ensure `collection.insertOne` does not unexpectedly error. If it errors, respond to the request with a 500 Internal Server Error status code and empty/null body. (1 points)

To return the new user's document:
- Use `collection.findOne` to retrieve the document of the newly inserted user by using the id returned by the `collection.insertOne` call. Make sure the id string is converted into a mongodb id via `ObjectId(id_string)` (1 points)
- Ensure the last `collection.findOne` invocation does not unexpectedly error. If it errors, respond to the request with a 500 Internal Server Error status code and empty/null body. (1 point)
- Respond to the request with a 201 Created status code and the user's document. (1 point)

### Login (4 points)

To identify if a user with the same username and password exists:
- Use `collection.findOne` to find the document of a user with the same username. (1 points)
- Ensure `collection.findOne` did not error (ex. MongoDB's `NoMatchingDocument` error). If it errors, respond to the request with a 401 Not Authorized status code and body indicative of an incorrect username. (1 points)
- Verify that the inputted password matches the password from the user's document. If it does not match, respond to the request with a 401 Not Authorized status code and body indicative of an incorrect password. (1 point)
- Respond to the request with a 200 status code and the user's document.

### Game (2 points)
Note: Consider replacing your entire frontend directory with that of HW5.

To insert game result logs into the `gameLogs` collection:
- Use `collection.insertOne` to insert the new game log into the `gameLog` collection. (1 points)
- Ensure `collection.insertOne` does not unexpectedly error. If it errors, respond to the request with a 500 Internal Server Error status code and empty/null body. (1 points)

### Code Readability (2 points)
- Proper indentation (1 point)
- Meaningful variable names (1 point)

### Extra Features (14 bonus points)

#### Scalability: MongoDB Indexes (4 points)
Background: Before we retrieve, update, or delete a document from a collection, the database must first identify where the document is collected on disk. Without any optimization, the database would need to linearly scan each document and check if its fields match some condition. While this is not much of an issue when there are tens of records, when the number of records grows to thousands, scanning that much data from disk will be noticeably slow. To solve this, databases allow us to set up "indexes" on collections. Indexes are data structures, most commonly B-Trees, that allow us to locate a record in logarithmic time (much faster than linear time) by a particular field (or set of fields).

Your Job:
- Because we query users by username a lot, set up an index on the `users` collection for the username field. Consider this [resource](https://www.mongodb.com/docs/manual/core/indexes/create-index/) for more instructions. Place your code in the `initIndexes` function in `db.js`, and uncomment where `initIndexes` is called. (2 points)
- Create another index you think might be useful. Next to your `createIndex` invoking, write a comment about which queries will use that index or what type of queries might use that index. (2 points)

#### Security: Password hashing (4 points)
Background: A common vulnerability of storing plaintext passwords in a database is that if the database is ever breached, the attacker will instantly all of your user's passwords. This can be very bad as many people use the same username/email + passwords across multiple sites. To protect against such a vulnerability, passwords are commonly hashed before being stored in a database.

Your Job:
- Using the `hashPassword` function provided in `security.js`, hash the password before inserting it in the database (in signup). (2 points)
- Using the `isPasswordCorrect` function provided in `security.js`, verify that an inputted password (in login) matches the hash stored in the database. If it does not, response with a 401 Not Authorized status code and appropriate error message. (2 points)

#### Security: JSON Web Tokens (JWT) (4 points)
Background: When a user attempts to perform a protected action (such as editing their account), the web server will require a way to ensure that the user is who they say they are (authentication) and has the credentials to perform that particular action (authorization). The simplest solution is to have users store their passwords in session storage and repeatedly send their passwords to the server when requesting to make each protected action. However, if a hacker gained access to a user's computer, they would end up learning the user's password (which doesn't expire). Also, if we had implemented 2FA logins, we would have rendered them useless as only the password is required to perform protected actions. To solve these issues, upon sign-in, we generate an encrypted token only the server can decrypt containing a "user claim" and an expiration time. Because only the server can decrypt it and it expires, when the user stores it in session storage, they need not worry that a hacker who gains access to their computer can steal their password (or tamper with this token).

Your Job:
- When a user logs in or signs up, use the `attachJWT` function provided in `security.js` to generate a new JWT token and set the JWT header ("Authorization"). When the frontend sees the HTTP response, access and store the JWT header in sessionStorage (or just a local variable if you prefer). (2 points)
- When a user asks to insert a log (or some other protected action), have the frontend send the JWT token via the JWT header ("Authorization") and use `extractJWT` function provided in `security.js` to verify that the JWT in the request object is valid. If it is not, respond with a 401 Not Authorized status code and an appropriate error message. (2 points)

#### Security: Injection Prevention (2 points)
Background: As discussed in class, a common method to avoid script injection is to sanitize any inputs on arrival to the server.

Your Job:
- When taking in a username for signup, ensure the username only contains alphanumeric characters. If it does not, throw a 400 Bad Request error with an appropriate error message. (2 points)

## Submission Guidelines

Your repository should include:
1. All files necessary to run your application.
2. A video where you walk through the requirements of the assignment.
 - After demonstrating each requirement, refresh the database to show it is functional.
 - You do NOT need to demonstrate errors described as occurring "unexpectedly" in the requirements section.
 - If easier, consider showcasing the backend directly via Postman rather than going through a frontend.
 - If easier, submit this video via BrightSpace instead.

Please do NOT push `node_modules` folders and `.env` files to your repository. To avoid this, refrain from modifying the `.gitignore` file.
