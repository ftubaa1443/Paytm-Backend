const JWT_SECRET_key = require("../config");

const Middleware = (req, res, next) => {
  const token = req.headers.authorization;

  const split = token.split(" ");

  const finaltoken = split[1];

  const decoded = jwt.verify(finaltoken, JWT_SECRET_key);
  try {
    req.userId = decoded.userId;
  } catch (err) {
    res.status();
  }
};

module.exports = Middleware;
