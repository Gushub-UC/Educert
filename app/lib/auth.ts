import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@prisma/client";

export const COOKIE_NAME = "educert_session";

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 8,
};

export type SessionUser = {
  userId: string;
  email: string;
  role: Role;
  name: string;
};

export function getJwtSecret() {
  return process.env.JWT_SECRET ?? "development-secret-change-me";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload: SessionUser) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "8h" });
}

export function verifyToken(token: string): SessionUser {
  const decoded = jwt.verify(token, getJwtSecret());
  return decoded as SessionUser;
}

export async function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, authCookieOptions);
  return response;
}

export async function clearAuthCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", { ...authCookieOptions, maxAge: 0 });
  return response;
}

export async function getSessionFromCookies() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function hasAnyRole(session: SessionUser | null, roles: Role[]) {
  if (!session) return false;
  return roles.includes(session.role);
}
