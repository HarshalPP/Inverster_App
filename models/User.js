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
    isPasswordSet:{
     type:String,
     enum:['false' , 'true'],
     default:false
    },
    activeToken:{type:String},
    tokenExpiry: { type: Date }, // Add expiry date for the token
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

UserSchema.methods.isTokenExpired = function() {
    if (!this.tokenExpiry) return true;
    return new Date() > this.tokenExpiry;
};


// Sign and return a JWT token


// Method to generate a new signed token
UserSchema.methods.getSignedToken = function() {
    const payload = { id: this._id , role:this.role};
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); // Set expiry for the token
    this.tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    return token;
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
