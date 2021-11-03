const jwt = require("jsonwebtoken");
// We are going to be interacting with the token assigned to each session (whenever a user logs in or signs up). This means that we need to import the JWT package.

const { User } = require("../models");
//We also want to find out more information about a specific user. We need to communicate with our user model in our database. 

const validateJWT = async(req, res, next) => {
//An asynchronous fat arrow function called validateJWT is declared. This function takes in three (3) parameters: req, res, and next .

    if (req.method == "OPTIONS") {
        //The function starts with a conditional statement checking the method of the request. Sometimes, the request comes in as an OPTIONS rather than the POST, GET, PUT, or DELETE. OPTIONS is the first part of the preflighted request. This determines if the actual request is safe to send. 

        next();
        //f we do have a preflight request, we pass it the third parameter declared in the asynchronous function. This asynchronous function is a middleware function and it is a part of express. Req, res, and next are parameters that can only be accessed by express middleware functions. next() is a nested middleware function that, when called, passes control to the next middleware function.

    } else if(
        req.headers.authorization &&
        req.headers.authorization.includes("Bearer")
        //If we are dealing with a POST, GET, PUT, or DELETE request, we want to see if there is any data in authorization header of the incoming request AND if that string includes the word Bearer.
    ){
        const { authorization } = req.headers;
        //Next, we use object deconstruction to pull the value of the authorization header and store it in a variable called authorization.
        console.log("authorization -->", authorization);

        const payload = authorization
        ? jwt.verify(
            authorization.includes("Bearer")
            //This is a ternary. This ternary verifies the token if authorization contains a truthy value. If it does not contain a truthy value, this ternary returns a value of undefined which is then stored in a variable called payload.
            //If the token contains a truthy value we call upon the JWT package and invoke the verify method.
            //The verify method decodes the token.
            
            ? authorization.split(" ")[1]
            : authorization,
            process.env.JWT_SECRET
        )
        : undefined;
            //another ternary w/in the ternary. If we have token that includes the word "Bearer", we extrapolate and return just the token from the whole string (authorization.split(" ")[1])
            //If the word "Bearer" was not included in the authorization header, then return just the token. 
            //Long story short, dependent on the token and the conditional statement, the value of payload will either be the token excluding the word "Bearer" OR undefined.
            console.log("payload -->", payload);

        if (payload) {
            //Here is another conditional statement that checks for a truthy value in payload

            let foundUser = await User.findOne({ where: { id: payload.id }});
            //If payload comes back as a truthy value, we use Sequelize's findOne method to look for a user in our User where the ID of the user in database matches the ID stored in the token. It then stores the value of the located user in a variable called foundUser.
            console.log("foundUser -->", foundUser);

            if (foundUser) {
                //Another nested conditional statement! This one checks if the value of foundUsers is truthy.
                console.log("request -->", req);

                req.user = foundUser;
                //If we managed to find a user in the database that matches the information from the token, we create a new property called user to express's request object.
                //The value of this new property is the information stored in foundUser . Recall that this includes the email and password of the user.
                //This is crucial because we will now have access to this information when this big middleware function gets invoked.

                next();
                //Since we are creating a middleware function, we have access to that third parameter we established earlier: next(). As said earlier, the next function simply exits us out of this function.

            } else {
                res.status(400).send({ message: "Not Authorized"});
                //If our code was unable to locate a user in the database, it will return a response with a 400 status code and a message that says "Not Authorized".
            }
        } else {
            res.status(401).send({ message: "Invalid token"});
            //If payload came back as undefined, we return a response with a 401 status code and a message that says "Invalid token".
        }
    } else {
        res.status(403).send({ message: "Forbidden"});
        //If the authorization object in the headers object of the request is empty or does not include the word "Bearer", it will return a response with a 403 status code and a message that says "Forbidden".
    }
};

module.exports = validateJWT;