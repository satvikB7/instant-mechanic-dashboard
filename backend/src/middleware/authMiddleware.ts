import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
  id: number;
  email: string;
  role: string;
}

export interface AuthenticatedRequest
  extends Request {
  user?: AuthPayload;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const parts = authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = parts[1];

    const jwtSecret =
      process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        message: "JWT secret is not configured",
      });
    }

    const decoded = jwt.verify(
      token,
      jwtSecret
    ) as AuthPayload;

    req.user = decoded;

    next();

  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}