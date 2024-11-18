const bcrypt = require('bcrypt');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// PASSWORD HASHING (Extra Credit)

/**
 * Takes a password, and returns a salted hash.
 * @param {string} password - The user's password string.
 * @returns {string} The salted password hash string.
 */
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

/**
 * Determine if a password matches a salted password hash.
 * @param {string} entered_password - The password the user enters on the login page.
 * @param {string} password_hash - The password hash stored in the database.
 * @returns {boolean} Whether the password matches the hash.
 */
async function isPasswordCorrect(entered_password, password_hash) {
    return await bcrypt.compare(entered_password, password_hash);
}

// JSON WEB TOKENS (Extra Credit)

/**
 * Attach a JWT containing the user's claim to an express response object. Note that 2 hours is the default
 * @param {Response} response - The express response we are attaching the JWT to.
 * @param {object} user_claim - The data we want the JWT to store about the user. ex. { "user_id": <id> } 
 * @param {string | int} expires_in - The time after which the JWT expires. The jsonwebtoken npm library uses this library for the option: https://github.com/vercel/ms.
 */
async function attachJWT(response, user_claim, expires_in = "2h") {
    const { JWT_SECRET_KEY, JWT_HEADER_KEY } = await security_env_promise;

    const token = jwt.sign(user_claim, JWT_SECRET_KEY, {
        expiresIn: expires_in // make the jwt expire in the given time.
    });
    response.set(JWT_HEADER_KEY, token);
}

/**
 * Extract and verify the JWT from the express request object.
 * NOTE: This function throws errors. So, wrap the line where you await the promise in a try-catch.
 * @param {Request} request - The express request object we are extracting the JWT from.
 * @returns {object} - The user_claim stored in the JWT. Note that it will also include the JWT's iat (issued at time) and exp (expiration time).
 * @throws Errors for JWT header not being set and JWT expiration.
 */
async function extractJWT(request) {
    const { JWT_SECRET_KEY, JWT_HEADER_KEY } = await security_env_promise;

    const token = request.get(JWT_HEADER_KEY);
    if (token === undefined) {
        throw new Error("JWT header not set in request object.");
    }

    const data = jwt.verify(token, JWT_SECRET_KEY);
    return data;
}

// NOTE: The code below automatically creates a security.env file containing your JWT secret. Do not change it unless you are sure. 

const security_env_promise = genSecurityEnv();

async function genSecurityEnv() {
    if (fs.existsSync("security.env")) {
        const text = fs.readFileSync("security.env", { encoding: "utf-8" });
        const entries = text.split("\n").map(line => line.split("="));
        const object = Object.fromEntries(entries);
        return object;
    } else {
        const object = {
            "JWT_SECRET_KEY": crypto.randomBytes(32).toString('hex'),
            "JWT_HEADER_KEY": "Authorization"
        };
        const entries = Object.entries(object);
        const text = entries.map(entry => entry.join("=")).join("\n");
        fs.writeFileSync("security.env", text, { encoding: "utf-8" });
        return object;
    }
}

module.exports = { hashPassword, isPasswordCorrect, attachJWT, extractJWT };