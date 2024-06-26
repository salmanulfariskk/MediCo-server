const errorHandler = require("../utils/error.js");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token)
    return next(
      errorHandler(401, "Your token has expired. Please log in again.")
    );

  jwt.verify(token, process.env.JWT_ADMIN_SECRET_KEY, (err, user) => {
    if (err) return next(errorHandler(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
