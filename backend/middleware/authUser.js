    import jwt from 'jsonwebtoken'

    const authUser = async (req, res, next) => {

    const authHeader = req.headers.authorization
    const token = authHeader?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized Login Again' })
    }

    try {

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = token_decode.id

        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({ success: false, message: 'Invalid or Expired Token' })
    }

    }

    export default authUser