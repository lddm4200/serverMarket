import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if(!token) {
            return res.status(401).json({msg: "No token, authorization denied"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if(!user) {
            return res.status(401).json({msg: "User not found, authorization denied"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({msg: "Token is not valid"});
    }
};

export default protectRoute;
