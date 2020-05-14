const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token not provided!",
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, "covid6712635");

    req.id = decoded.id;

    return next();
  } catch (e) {
    return res.status(401).json({
      message: "Token invalido",
    });
  }
};
