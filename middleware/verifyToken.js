const jwt = require("jsonwebtoken")
const JWTKey = process.env.JWT_KEY

module.exports = function(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: "No token provided" })

  const parts = header.split(" ")
  if (parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({ message: "No token provided" })
  }

  try {
    const decoded = jwt.verify(parts[1], JWTKey)
    req.adminId = decoded.id
    next()
  } catch (e) {
    return res.status(403).json({ message: "Invalid token" })
  }
}
