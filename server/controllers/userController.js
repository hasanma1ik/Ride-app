const JWT = require('jsonwebtoken')
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const usermodel = require("../models/usermodel");
const Driver = require("../models/drivermodel")


const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Validation
        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'Name is required',
            });
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Email is required',
            });
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password is required and should be at least 6 characters long",
            });
        }

        // Check existing user
        const existingUser = await usermodel.findOne({ email });
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: 'User already registered with this email'
            });
        }
        //hashed password
        const hashedPassword = await hashPassword(password)
        // save user
        const user = await usermodel({
            name, 
            email,
             password:hashedPassword,
            }).save()

        // Assume user is created here as the actual user creation logic is not shown
        res.status(201).send({
            success: true,
            message: 'Registration successful, please login'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Register API',
            error: 'Internal Server Error'
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const driverProfile = await Driver.findOne({ userId: user._id });
        const isDriver = !!driverProfile; // Convert to boolean: true if driverProfile exists, false otherwise

        const token = JWT.sign({
            _id: user._id,
            role: user.role,
            isDriver: isDriver
        }, process.env.JWT_SECRET, { expiresIn: '27d' });
        

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                isDriver: isDriver // Return the isDriver status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
}
const getUserById = async (req, res) => {
    console.log("Fetching user with ID:", req.params.id);  // Add this line
    try {
        const user = await usermodel.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



module.exports = { registerController, loginController, getUserById};
