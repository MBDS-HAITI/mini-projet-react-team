import { NODE_ENV } from "./env.js";

export const isProd = NODE_ENV === "production";

export const confCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const oauthCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  path: "/",
  maxAge: 10 * 60 * 1000,
};
// helper to base64url-encode
export function base64url(str) {
  return Buffer.from(str).toString("base64url");
}