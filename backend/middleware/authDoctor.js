    import jwt from "jsonwebtoken";

    // doctor authentication middleware
    const authDoctor = async (req, res, next) => {
    try {
        let token;

        // ✅ الطريقة القياسية (Authorization: Bearer <token>)
        if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
        }
        // ✅ الطريقة القديمة (dtoken) — عشان ما نبوظش حاجة
        else if (req.headers.dtoken) {
        token = req.headers.dtoken;
        }

        if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized Login Again",
        });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.docId = decoded.id;

        next();
    } catch (error) {
        return res.json({
        success: false,
        message: "Not Authorized Login Again",
        });
    }
    };

    export default authDoctor;