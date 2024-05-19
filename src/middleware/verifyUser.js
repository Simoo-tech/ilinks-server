const jwt = require("jsonwebtoken");

const VerifyUser = async (req, res, next) => {
  const token = req.headers.access_token;
  if (!token) {
    console.log(token);
    return res
      .status(400)
      .send({ success: false, message: "no token provided" });
  }
  try {
    const decode = jwt.verify(token, process.env.TOKEN_KEY_LOGIN);
    if (!decode) {
      res.status(401).send({ success: false, message: "user not allowed" });
    }
    next();
  } catch (error) {
    return res.send(error);
  }
};

module.exports = { VerifyUser };
