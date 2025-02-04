import jwt from "jwt-simple";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.SECRET_KEY;

const createToken = (user) => {
  // Convertir _id a string si es necesario
  const userId = user._id?.toString() || user.id;

  const payload = {
    id: userId,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };

  return jwt.encode(payload, secret);
};

export { secret, createToken };