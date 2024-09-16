const User = require("../models/User")
const { sendToken } = require("../Utils/Token")
const jwt = require('jsonwebtoken')



//   Register the Users //


exports.Register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role = 'Investor' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: 'User with this email already exists'
            });
        }

        // Create a new user instance
        const Signup = new User({
            firstName,
            lastName,
            email,
            password,
            role
        });

        // Save user to the database
        const Result = await Signup.save();

        // Generate and send token (assuming sendToken sends the response)
        sendToken(Result, 201, res);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};



// Login Controller //
exports.Login = async (req, res) => {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: 'Email not found.' });
        }

        // If the user has no password set (e.g., OAuth login)
        if (!user.password) {
            if (user.activeToken) {
                // If active token exists, return it
                return res.status(200).json({
                    success: true,
                    user: {
                        _id: user._id,
                        firstname: user.firstName,
                        lastname: user.lastName,
                        email: user.email,
                    },
                    token: user.activeToken,
                });
            } else {
                // If no active token exists, generate a new one
                const token = user.getSignedToken();  // Use getSignedToken to generate token

                // Update user with the new active token
                await User.findByIdAndUpdate(
                    user._id.toString(),
                    { activeToken: token },
                    { new: true }
                );

                return res.status(200).json({
                    success: true,
                    user: {
                        _id: user._id,
                        firstname: user.firstName,
                        lastname: user.lastName,
                        email: user.email,
                    },
                    token: token,
                });
            }
        }

        // Check if the password matches
        const isMatch = await user.matchPasswords(password);
        if (isMatch) {
            // If active token already exists, return it
            if (user.activeToken) {
                return res.status(200).json({
                    success: true,
                    user: {
                        _id: user._id,
                        firstname: user.firstName,
                        lastname: user.lastName,
                        email: user.email,
                    },
                    token: user.activeToken,
                });
            } else {
                // Generate a new token if no active token exists
                const token = user.getSignedToken();

                // Update user with the new active token
                await User.findByIdAndUpdate(
                    user._id.toString(),
                    { activeToken: token },
                    { new: true }
                );

                return res.status(200).json({
                    success: true,
                    user: {
                        _id: user._id,
                        firstname: user.firstName,
                        lastname: user.lastName,
                        email: user.email,
                    },
                    token: token,
                });
            }
        } else {
            // If password is incorrect
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'An internal server error occurred.', error: error.message });
    }
};


// Logout Controller ///


exports.logout = async (req, res) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Please login to access this resource' });
        }

        // const token = authHeader.split(' ')[1]
        // if (!token) {
        //     return res.status(401).json({ message: 'Authorization token not provided' });
        // }

        const token = authHeader

        const decodedData = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        if (!decodedData) {
            return res.status(400).json({ message: 'Token is not verify' })
        }

        const userData = await User.findOne({ _id: decodedData.id })

        // Check if user exists and token matches the activeToken
        if (!userData || userData.activeToken !== token) {
            return res
                .status(401)
                .json({ message: 'Invalid session or token, please login again' });
        }

        // Clear the active token (logout)
        await User.findByIdAndUpdate(userData._id, { $unset: { activeToken: "" } }, { new: true })
        return res.status(200).json({
            message: `${userData._id} has logged out successfully`,
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired, please login again' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token, please login again' });
        } else {
            console.error('Server error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }



}


// Verify token api

exports.verifytoken = async(req,res)=>{
    try{
    const token = req.headers.authorization

    if(!token){
        res.status(400).json({message:'Please Login to Access this resources'})
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const NewUser = await User.findOne({_id:decodedData.id}).select('-password -activeToken')
    return res.status(200).json({
        message:'success',
        data:NewUser
    })

    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired, please login again' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token, please login again' });
        } else {
            console.error('Server error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}










