import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const validateToken = async (req, res, next) => {
  const cookie = req.cookies["jwt"];

  if (!cookie) {
    return res.status(401).json({ err: "Jelentkezzen be!" });
  }

  jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET, (err, claims) => {
    if (err) return res.status(401).json({ err: "Nincs hitelesítve!" });
    req.user = claims;
    next();
  });
};

export { validateToken };
