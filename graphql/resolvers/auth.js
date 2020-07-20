const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// User model
const User = require('../../model/user');

module.exports = {
    /**
     * Create a new user
     */
    createUser: async (args) => {
        try {
            const { email, password } = args.userInput;
            if (!email || !password) {
                return new Error("Email and Password is required");
            }
            const isUser = await User.findOne({ email });
            if (isUser) {
                return new Error("Email is already taken");
            }
            const encryptedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                email,
                password: encryptedPassword
            })
            const result = await user.save();
            return { ...result._doc, password: null };
        }
        catch (err) {
            return err;
        }
    },
    /**
     * Login
     */
    login: async (args) => {
        try {
            const { email, password } = args.userInput;
            // Check the email and password has data
            if (!email || !password) {
                return new Error("Email and Password is required");
            }
            // Fetching the user data from database
            const user = await User.findOne({ email });
            // If the user not found
            if (!user) {
                return new Error("User does not exist!");
            }
            // Comparing the password with hased password 
            const isEqual = await bcrypt.compare(password, user.password);
            // Check for valid password
            if (!isEqual) {
                return new Error("Password is incorrect!");
            }
            // Generating the jwt token
            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_KEY, { expiresIn: '1h' });
            return {
                userId: user.id,
                token,
                tokenExpiration: 1
            }
        }
        catch (err) {
            return err;
        }
    }
}