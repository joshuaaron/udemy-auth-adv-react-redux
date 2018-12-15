const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define our model
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
		})
	});
});

// compare password helper.
userSchema.methods.comparePassword = function(candidatePassword, callback) {
	crpyt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) { return callback(err); }
		callback(null, isMatch);
	})
}

// create the model class - represents all users (class of users);
const ModelClass = mongoose.model('user', userSchema);

// export the model
module.exports = ModelClass;