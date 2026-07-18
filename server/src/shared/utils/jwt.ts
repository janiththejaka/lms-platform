import jwt, { Secret, SignOptions } from "jsonwebtoken";

interface AccessTokenPayload {
  userId: string;
  role: string;
}

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "7d";

if (!jwtSecret) {
  throw new Error(
    "JWT_SECRET is missing. Add it to the server/.env file.",
  );
}

const secret: Secret = jwtSecret;

const accessTokenOptions: SignOptions = {expiresIn: jwtExpiresIn as SignOptions["expiresIn"],};

export const generateAccessToken = (
  payload: AccessTokenPayload,
): string => {
  return jwt.sign(payload, secret, accessTokenOptions);
};