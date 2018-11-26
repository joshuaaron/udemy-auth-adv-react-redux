const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

// logic to process a request.
exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide both email and password'})
	}

	// See if a user with the email exists
	User.findOne({ email: email }, function(err, existingUser) {
		if (err) { return next(err); }

		if (existingUser) {
			return res.status(422).send({ error: 'Email is already in use' });
		}

		// create new user
		const user = new User({ email: email, password: password })
		user.save(function(err) {
			if (err) { return next(err); }

			// Respond to request indicating the user was created.
			res.json({ token: tokenForUser(user) });
		});
	});
}