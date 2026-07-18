import bcrypt from "bcrypt";
import ApiError from "../../shared/errors/api-error";
import { LoginInput, RegisterInput } from "./auth.validation";
import prisma from "../../config/prisma";
import { generateAccessToken } from "../../shared/utils/jwt";

const PASSWORD_SALT_ROUNDS = 12;

class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(
      input.password,
      PASSWORD_SALT_ROUNDS,
    );

    const user = await prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(payload: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError(
        403,
        "Your account is not active. Please contact the administrator.",
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        lastLoginAt: true,
      },
    });

    const accessToken = generateAccessToken({
      userId: updatedUser.id,
      role: updatedUser.role,
    });

    return {
      user: updatedUser,
      accessToken,
    };
  }
}



export default new AuthService();