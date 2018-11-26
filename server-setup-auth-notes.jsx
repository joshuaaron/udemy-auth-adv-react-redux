'Server Setup Authentication'

// -------------------------------------------------------
'Tech Stack'
/** 
- Low-level Request Handling:
	- HTTP Module: Handle HTTP Requests

- Routing, Server Logic:
	- BodyParser: Help parse incoming HTTP requests
	- Morgan: Logging
	- Express: Parse response + routing

- Database:
	- MongoDB: Storing Data
	- Mongoose: Working with MongoDB

- Authentication:
	- Bcrypt-Nodejs: Storing a users password safely
	- Passport-JWT: Authenticating users with a Json Web Token
	- Passport-Local: Authenticating users w/ username/password
	- PassportJS: Authenticating users.

*/

// -------------------------------------------------------
'Introduction to Authentication'
/**
 * Authentication process:
 * The exchange of credentials or information from client side to server side and the response
 * 
 *   Undertaken by react app:          Undertaken by backend/node app/api
 * 
 *             CLIENT                |          SERVER                    
 * Username, Password             ==> Looks at usename, password
 *
 *                                <== Credentials are good. You are auth'd
 * Client can make authenticated      Here is an identifying piece of info,
 * Requests                           include it in all future requests 
 * 
 * I need a protected resource,   ==> I see your identifying piece of info
 * Here is my identifying piece       that authenticates you. Here is your
 * of information                     protected resource
 *
 * ...
 * Here is my cookie OR token     ==> ...
 * ...
 * 
 */


// -------------------------------------------------------
'Cookies vs Tokens'
/**
 * Cookies included with HTTP requests as default in your browser.
 * The purpose is to bring 'state' into what is inherintly a stateless protocol - HTTP
 * HTTP protocol has no concept of state
 * 
 * A server can choose to place info on a users cookie that identifies them uniquely to
 * that particular server
 * If they were logging into a website we were making, we could place info on the cookie
 * saying they were userID: 123
 * Any subsequent requests that user made, they would have a cookie userID 123 that told us
 * it was the same user etc
 * 
 * Cookies:
 * - Automatically included on all HTTP requests.
 * - Unique to each domain - IMPORTANT (google.com vs ebay.com etc)
 * - Cannot be sent to different domains (sessions can't be hijacked)
 *
 * Request:
 * Headers: cookie: {}
 * Body: { color: 'red' }
 *
 * -------------------------------------------------------------------------------
 *
 * Tokens really isnt a codified idea, its been introduced as a convention to use in place of 
 * cookies where they fall off etc
 * We MUST manually include them into the HTTP header.
 * The benefit of tokens is they can be sent to ANY domain. If we want to make an authenticated request
 * from google to ebay.com etc then we can do so with a token.
 * We'd make our request and include our token and we can be authenticated there.
 * This is very useful if we start using a distributed system.
 *
 * Tokens:
 * - Have to manually wire up
 * - Can be sent to any domain
 *
 * Request
 * Headers: authorization: jas9efa....
 * Body: { color: 'red' }
 *
 */


// -------------------------------------------------------
'Scalable Architecture'
/**
 * We will be using a token based authentication for this app.
 * 
 * Our website is ourapp.com
 * When they visit they will be given an index.html + bundle.js file.
 * Everything required for the app.
 * 
 * itll be hosted on something called a 'content server' whos only job is to serve
 * those two files, with no concept of users/auth etc. We can make this server very
 * simple and set it up to be easily redistributed.
 * 
 * If we visited our app and we were served our app from this content server but we had
 * our apis on a different domain, we would not be able to access that API server with cookies
 * because it's on a different domain - hence why we're using tokens.
 * 
 * This is also relevant if we were building a mobile app to serve alongside our web app.
 * Maybe our web app and mobile app need to use the same API for authentication etc so it 
 * makes more sense to have a single location to serve our API that isn't 100% tied to the 
 * web app or to the mobile app - instead it is its own unit
 * It will be easier to update our API in the future too.
 * 
 * 
 * Scaling with this approach is also easier
 * 
 * Lets say our content server maybe we only need to serve to 1000 people.
 * But maybe our mobile app where we have 5000000 users, and we need tremendous demand 
 * on the API for those users.
 * 
 * If we follow this approach, where our content server is different, and a diff API for any
 * requests, we can scale out the API to be extremely large for the mobile app and it will
 * be localised on that API and wouldnt have to touch our front end whatsoever.
 * 
 */


// -------------------------------------------------------
'Server Setup'
/**
 * Create a new folder in our root directory to hold our API server.
 * Call it server.
 * This server will use no boilerplate.
 *
 * The next step is to change into that folder and create a package.json
 * to hold all our dependancies.
 * To do this, we use npm init, go through all these.
 *
 * Now lets install some dependancies:
 * npm install --save express mongoose morgan body-parser
 * 
 * next create a new file called index.js which will be the main starting
 * point of the application. 
 * server 
 * - index.js
 * - package.json
 *
 * If we're using git, by default node modules directory will be able to be committed to
 * the github repo - but we dont want to do that so lets create a file called
 * '.gitignore'
 * and add a line called node_modules
 *
 */


// -------------------------------------------------------
'More Server Setup'
// Top of our index.js:
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

'App setup'
/**
 * Key: Setup Express working the way we want to
 * The first few lines are required boilerplate:
 * Tell our app.use(morgan('combined')) */
// Next line say app.use(bodyParser.json({ type: '*/*' })) 
/**
 * In both cases here, morgan and bodyParser are what we refer to as middleware in Express
 * Middleware in Express is something that any incoming request will be passed into, so any request
 * into our server will be passed into morgan and bodyparser by default.
 * That is what app.use() does.
 * 
 * Morgan is a logging framework - Mostly used to debug. Logs incoming requests
 * BodyParser is used to parse incoming requests - specifically into JSON.
 * It will attempt to do so no matter what the request type is.
 * 
 */

'Server setup'
/**
 * Key: Get Express to talk to the outside world:
 * 
 * - First step is to define a port what our server will run on our local machine
 * const port = process.env.PORT || 3090
 * This line says if there is a environment variable already defined used that, otherwise use port 3090
 *
 * Next step is to create an app at the top - we do this via creating an instance of express
 * const app = express();
 *
 * Next underneath our port,
 * const server = http.createServer(app)
 * the http library is a native node library - working low level with HTTP requests incoming
 * What that line does is create a HTTP server that knows how to receive requests, and anything that comes in
 * forward it to our express application.
 * 
 * Once we create the server, we'll tell the server to listen to the port we created above
 * server.listen(port)
 * 
 * This is the initial setup for Server
 */

// One more thing - we will install nodemon
// What nodemon does is that it watches our project dir for file changes
// if a file ever changes, it will restart the server for us, so we don't have to keep stop/restarting
// the server when we make changes
// We wire it up by creating a new script in package.json: (define command line commands)
// "dev": "nodemon index.js"
// Now we use npm run dev to start this.


// -------------------------------------------------------
'Express Route Handler'
/**
 * One thing we havent done, is to handle any actual routes or
 * respond with some data. Lets fix that by handling some route handlers
 * We will move route handlers to a separate file called router.js
 * 
 * It works by export a function from this file, then import it into our index.js
 * then pass app into that function.
 * 
 * Inside the router, we export the function that receives app as a argument
 * 
 * Then inside our index, we simply call the router with the app:
 * router(app)
 * 
 * Now inside router, we have access to our Express app (the brains of our app)
 * So we're trying to define a route for the user to visit
 * To add route handlers, we say app.get('/', function() {})
 * 
 * This get function on app, maps directly to the type of HTTP request thats gonna be issued
 * So we can say app.get or app.post etc
 * 
 * But in this case we are using a get request to come in,
 * The first argument to .get is the route that we are trying to handle.
 * If the user visits our app which is essentially the homepage (/) then run this function
 * The function that handles the route gets called with 3 important args
 * 
 * they are req, res and next
 * Req = request which is an object that represents the incoming HTTP resuest
 * Lots of data about the actual request is stored in it.
 * 
 * Res = response which we will send back to whoever made the request
 * When we deal with a response, this is where we get the ability to respond to the user
 * 
 * Next = mostly for error handling.
 * 
 * To send back some JSON to whoever is making the request:
 * res.send(['test', 'phone', 'paper', 'water']);
 * 
 * Now if we reload our localhost:3090 page, we can see these results on the page!
 * 
 */


// -------------------------------------------------------
'Mongoose Models'
/**
 * MongoDB is not something we'll work with by itself, we'll use Mongoose
 * that sits between us and MongoDB. It is an ORM that interfaces with a database
 * in a way so we dont have to.
 * 
 * We already installed mongoose, but we need to make use of it.
 * To do so: the first thing is we create a user model.
 * This is a model (data model) that represents a user.
 *
 * Most users, will have two attributes: an email and a password.
 * We need to tell mongoose about these two properties we expect the user model to have
 *
 * Create a new directory at root level called models and a file inside called user.js
 * which is our local definition of what a user is.
 * require mongoose inside the file and then pull one property called 'Schema' from it.
 *
 * const mongoose = require('mongoose');
 * const Schema = mongoose.Schema;
 *
 * Schema is what we use to tell mongoose about the very particular fields that our model 
 * will have.
 * 
 * The first thing we do is define our model, here is the model of the user with the email and password
 * properties
 * 
 * Next we will create the model class, then export the model so other files inside our app
 * can make use of it.
 * 
 * Defining our model: To create it, we create a schema
 * const userSchema = new Schema({ })
 * We pass it an object and inside this object we pass the properties that this model will have
 * The other thing that is relavant is the type of data that they are (string, number, obj)
 * 
 * In both cases, email and password are of type string.
 */
const userSchema = new Schema({
	email: String,
	password: String,
});

/**
 * We've defined two properties on our Schema, both are type string. In just about every App
 * whatever is used as the username or identifying piece of info, this email/ identifying property
 * has to be unique. 
 * So we can't use a user with the same email etc.
 *
 * We want to enforce uniqueness on this email. To do this, we will pass an additional prop 
 * to this email field.Instead of passing String, we will assign it an object instead.
 * We will keep the type as string, but we will pass an extra prop of unique and assign it to true
 */
const userSchema = new Schema({
	email: { type: String, unique: true },
	password: String
});

/**
 * One side effect though is MongoDB does not enforce case sensitivity when doing these checks
 * aka steve@gmail and STEVE@gmail.com will be treated as two separate unique accounts
 * 
 * To make sure these get saved as lowercase characters, we can add another property of
 * lowercase: true. So when any string is saved to the database, it will be converted to 
 * lowercase first
 * 
 * 
 * To create the model class, we need to make use of mongoose.
 * make a new variable 'ModelClass' and say mongoose.model('user', userSchema);
 * 
 * This basically loads the schema into mongoose. It corresponds to a collection we called 'user'
 * const ModelClass = mongoose.model('user', userSchema);
 * 
 * Finally, we will export this new class.
 * module.exports = ModelClass;
 */


// -------------------------------------------------------
'MongoDB Setup'

/**
 * We need to install MongoDB here, for mac, these steps are as follows.
 * Open our browser and search mongoDB, find the docs section on their site and click installation
 * 
 * install via brew with 
 * brew install mongodb
 * 
 * The first thing we need to do is 'Create the Data Directory'
 * Mongo needs a place to actually save the data it collects.
 * Next step will be to create this with
 * mkdir -p /data/db
 * 
 * Now we need to set permissions for the data directory.
 * This directory we've created requires special permissions to access
 * 
 * sudo chown -R $USER /data/db
 * change ownership of the directory to the user
 * 
 * To start it we type mongod
 * 
 * One thing to keep in mind, by default if you wanna use mongo, we need to run mongod
 * So if you restart your laptop etc. run mongod
 */


// -------------------------------------------------------
'Inspecting the Database'

/**
 * We have mongoose running on our server, but we haven't connected mongoose and mongo yet
 * We need to do this manually and tell it specifically.
 * 
 * To do so, write some setup code in our index.js
 * First require mongoose, then make a new section called DB Setup - this is where we tell
 * mongoose to connect to the instance of mongo - Write
 */
mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true })
/**
 * Internally this creates a new DB inside mongo called Auth. We can change the last keyword
 * for the name.
 * Once we restart our nodemon script, we can view that the connection got accepted in our mongoose 
 * instance
 * 
 * There is one more interesting thing:
 * Right now when we run mongodb, we can't really see any of the data.
 * There is a fantastic tool called robomongo we can download for this.
 * 
 * Once we open Robomongo/Robo 3T, we wont have have any connections listed.
 * The connections these are references to, a connection is a connection to an actual mongo db
 * Create a new connection - and the default settings are fantastic so don't change. 
 * We change the name to Localhost
 * 
 * Save it and then click connect
 * 
 */


// -------------------------------------------------------
'Authentication Controller'

/**
 * We can now start saving user models to our database based on incoming requests
 * We can implement our sign up route - We need to change the structure of our route handler.
 * 
 * Our current route handler has all its logic inside the handler.
 * Lets create our sign in/auth logic in a separate file and then pull it into our router
 */
'Diagram:'

'Incoming Request'
	-> 'Router'
		-> 'Comments Controller' -> 'Response'
		-> 'Authentication Controller' -> 'Response'
		-> 'Posts Controller' -> 'Response'

/**
 * So an incoming request always goes through the router but then the router decides
 * where it wants to send the request off to
 * Imagine, We can have controllers for comments, posts and auth (we'll just have auth in this app)
 * 
 * We will define the logic to handle these requests inside of controllers. 
 * Each controller will be individually responsible for creating a response and sending it 
 * back to whoever made the request.
 * Our goal is to create this auth controller and create our sign up route handler and place
 * that inside our router
 * 
 * In our root directory, create a controllers folder, and inside a file called 
 * authentication.js which will handle this logic.
 * 
 * We will define a function and then export it.
 * exports.signup = function(req, res, next) {}
 * 
 * Lets wire this up to our router 
 * 
 * Whenever a user visits a particular route, we want to send them to that 
 * auth controller. So import it at the top
 * const Authentication = require('./controllers/authentication'
 * 
 * We can remove the dummy route and replace it with this new one.
 * It will be a post request as the user is posting the username/password
 * and post it to something like /signup
 * 
 * so write app.post('/signup', Authentication.signup);
 */
// router.js
const Authentication = require('./controllers/authentication');
module.exports = function(app) {
	app.post('/signup', Authentication.signup);
}


// -------------------------------------------------------
'Searching for Users'

/**
 * Our goal now is to read in a user if one is passed, check to see
 * if the user account already exists etc and if one doesnt exist
 * we'll save the record and respond to the request saying user has been created
 *
 * - So first step is see if user with given email exists
 * - If user exists, return an error
 * - If user doesn't exist, create and save user record
 * - Then finally respond to request indicating the user was created
 *
 * But first in the first step - we need to pull information from the request object
 * and get the data.
 *
 * To pull data from the req object when it is a post req, we can make reference to the 
 * req.body property.
 * .body means anything contained within this post request.
 * Then we can pull email and password as properties from that body property
 *
 * Now we have the email, we need to search through the database to check if an existing 
 * user exists with this email.
 * We need an ability to search our database.
 * To do that, we will use the user model we created using mongoose.
 *
 * Import our user model -
 * const User = require('../models/user');
 * Then the usermodel has a method (as the user is a class - it represents all users)
 * called findOne()
 * findOne is a method whose first arg is the search criteria we want to use
 * findOne({ email: email }, callback);
 *
 * Once that search is completed the callback will fire and it receives an err object 
 * and what we'll call 'existingUser' - where that is basically a user who exists with that
 * email we got from the request.
 * If existingUser returns null, that means it is a fresh account and no user was found.
 */

// so far:
const User = require('../models/user');
exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email: email }, function(err, existingUser) {

	});
}

// --------------------------------------------
'NOTE'
// To silence deprecation warnings, pass createNewIndex to our mongoose.connect call:
mongoose.connect('mongodb://localhost:auth/auth', { 
	useNewUrlParser: true,
	useCreateIndex: true 
});


// -------------------------------------------------------
'Creating User Records'

/**
 * Moving onto step two - if the existing user has a value, we want to return an error
 * We will handle also the search throws an error (which is the err object recieved which
 * can be if the database connection didn't exist)
 *
 * handle this by if (err) { return next(err) };
 *
 * now check for existingUser if (existingUser) { ... }
 *
 * To return an error on our request, we can write
 * return res.status which sets the HTTP code on our response. 
 * Set it equal to 422 => unprocessable error - we couldnt process it the data was bad(already exists)
 * 
 * Then send the response off with:
 * return res.status(422).send({ error: 'Email is already in use' })
 *
 * Lets handle now an email / user does not exist - so we want to create and save the user
 *
 * We will use the new keyword on our user class.
 * const user = new User({ email, password })
 * 
 * This creates it - but doesn't save it. It's created in memory.
 * 
 * To save it to the database, we need to call user.save(); - which saves it 
 * to the database
 * 
 * Now - this is another operation to the database which is async.
 * So to know when this has completed, we need to pass a callback in.
 * 
 * user.save(function(err) {})
 *
 * It gets called with an err obj - so if the user failed to save etc.
 * Check for the err:
 * if (err) { return next(err); }
 * 
 * Otherwise we have successfully saved the user, we can respond to the request indicating this
 * we do this:
 * 
 * res.json({ success: true })
*/
exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email: email }, function(err, existingUser) {
		if (err) { return next(err); }

		if (existingUser) {
			return res.status(422).send({ error: 'Email is already in use' });
		}

		const user = new User({ email: email, password: password })
		user.save(function(err) {
			if (err) { return next(err); }

			res.json({ success: true });
		});
	});
}

/**
 * Whenever we save a new record in our database it auto creates an _id property
 * which is an identifier of that record.
 * 
 * One thing though, we can currently make a post request with just the password, and
 * not supply a password.
 * Lets add a check to guard against these:
 * 
 * if (!email || !password) {
 * return res.status(422).send({ error: 'You must provide both email and password' })
 * }
 *
 *
 * One other thing is that this would save the password in the database as plain text
 * which is a big no.
 *
 * Whenever we store a password, we want it to be encrypted.
 * So we need to update our logic that will save our password.
 * 
 * To handle this, we'll use a library called BCrypt.
 * It is a separate package that we need to install - npm install --save bcrypt-nodejs
 * 
 * BCrypt caveat is it's not the easiest thing to understand.
 * Here is the code:
 */

// models/user:
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String
});

// On save hook, encrypt password.
userSchema.pre('save', function(next) {
	const user = this;

	bcrypt.genSalt(10, function(err, salt) {
		if (err) { return next(err); }

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) { return next(err); }

			user.password = hash;
			next();
		});
	});
});

const ModelClass = mongoose.model('user', userSchema);
module.exports = ModelClass;


// -------------------------------------------------------
'Salting a Password'

// Before saving a model - run this function.
userSchema.pre('save', function(next) {
	// the context of the user IS the usermodel (user.email)
	const user = this;

	// generate a salt - then run callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) { return next(err); }

		// Then going to hash our password using the salt - By hash we mean encrypt.
		// Then we get that hash in the next callback
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) { return next(err); }

			// overwrite plain text password with encrypted password.
			user.password = hash;
			// save the model.
			next();
		});
	});
})

/**
 * First step of bcrypt - saving a password
 * Second step of bcrypt - comparing a password (sign in)
 *
 * Saving a password:
 * Salt + plain password = Salt + Hashed Password
 *
 * A salt is an encrypted string of characters randomly generated.
 * By combining a salt and a plain password we get a hashed password.
 * The generated hashed password contains the salt and the plain password.
 */


// -------------------------------------------------------
'JSON Web Token Overview (JWT)'

/**
 * We said we'd pass back an identifying piece of info when a user has a successful
 * sign in, and to include it on future requests.
 * So our user.save method where we are just sending some json with success: true doesn't
 * fit this at the moment.
 *
 * What we want is that identifying info/token that the user
 * can use in the future to make authenticated requests
 *
 * WHen a user signs up/in, give a token in exchange for an ID.
 * UserID + Our Secret String = JSON Web Token
 * 
 * When a user makes an authenticated request in the future, they should include the JWT
 * JSON Web Token + Our Secret String = User ID
 * 
 * The userID will be combined/encrypted with a secret string we will create
 * that will produce the JWT
 * 
 * If the user gives us a token, we can decrypt it with our secret string and that
 * will return the user id and we can check if they're authenticated.
 *
 * We need to make sure this secret string remains 100% secret.
 */


// -------------------------------------------------------
'Creating a JWT'

/**
 * We will use a library called JWT Simple for creating this.
 * npm install --save jwt-simple
 * 
 * We need to create this secret string, so to house this string
 * we'll create a new file in our root dir called config.js and export
 * an object.
 *
 * module.exports = { secret: 'la2s9234s87dsfbkjhbq3eds34sd' }
 *
 * Also - ensure we add this file to our gitignore.
 *
 * Then in our authentication controller, we'll import the jwt library
 * and the secret string
 *
 * // authentication.js
 * const jwt = require('jwt-simple');
 * const config = require('../config');
 * 
 * We'll now create a function that receives a userID and encodes it
 * with our secret.
 * Call it tokenForUser(user)
 * 
 * It returns:
 * jwt.encode({ }, config.secret);
 * 
 * The first arg is the info we want to encode
 * The second is the secret string that will encrypt it
 * 
 * So what do we want to encode? The users id would be great
 * Why not the email? Emails can change over time.
 * If they did this, and had some existing tokens then it could cause
 * issues.
 * The userId always remains the same
 * 
 * The second thing we need to think about is that encode takes an object.
 * The key we are calling sub.
 * 
 * JWT is a standard/convention. As a convention JWT have a sub property (subject)
 * meaning Who is this token about so the subject of this token is this user.id
 *
 * One other thing we will add will be a timestamp of when this token was
 * issued with new Date().getTime()
 * Add another property to the encode object called IAT. which is another convetion
 * short for issued at time.
 */
function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

/**
 * So now we can use this via our response to the request indicatinmg the user was created,
 * passing it back this token:
 * res.json({ token: tokenForUser(user) });
 */
