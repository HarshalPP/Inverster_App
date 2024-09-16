const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    investments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
    role: { type: String, enum: ['Investor', 'Admin'], default: 'Investor' },
    activeToken:{type:String},
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, 
{
    timestamps: true
}

);

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match user-entered password with hashed password in the database
UserSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Verify the Token

UserSchema.methods.verifytoken = async function (token){
    return await jwt.verify(token, process.env.JWT_SECRET); // Verify token
}



// Sign and return a JWT token
UserSchema.methods.getSignedToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Generate and hash a password reset token
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash the reset token and set it to the schema
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expiration time (10 minutes)
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
