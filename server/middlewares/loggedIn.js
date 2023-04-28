const jwt = require("jsonwebtoken")

const loggedInNext = async (req, res, next) => {
    try {
        const cookie = req.cookies.user
        const verify = jwt.verify(cookie, process.env.JWT_SECRET_KEY)

        verify.user === process.env.USER ? next() : res.redirect("/login")
    } catch (e) {
        res.redirect("/login")
    }
}

const loggedInRedirect = async (req, res, next) => {
    try {
        const cookie = req.cookies.user
        const verify = jwt.verify(cookie, process.env.JWT_SECRET_KEY)

        verify.user === process.env.USER ? res.redirect("/") : next()
    } catch (e) {
        next()
    }
}

module.exports.loggedInNext = loggedInNext
module.exports.loggedInRedirect = loggedInRedirect