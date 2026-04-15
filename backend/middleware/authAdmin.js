    import jwt from "jsonwebtoken";

    const authAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({
            success: false,
            message: "Not Authorized Login Again",
        });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch (error) {
        return res.json({
        success: false,
        message: "Not Authorized Login Again",
        });
    }
    };

    export default authAdmin;