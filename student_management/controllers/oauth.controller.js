
import jwt from 'jsonwebtoken';
import { FRONT_URL, GOOGLE_LINK_CALLBACK_URL, GOOGLE_LOGIN_CALLBACK_URL,GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_REFRESH_SECRET } from "../config/env.js";
import { confCookieOptions, oauthCookieOptions } from "../config/confCookies.js";
import User from '../models/user.model.js';
import { base64url } from '../config/confCookies.js';
import crypto from "crypto";
import { signAccessToken, signRefreshToken } from '../helpers/generate-token.js';
import { setRefreshCookie } from '../helpers/manage-cookies.js';

export const googleLinkStart = async (req, res, next) => {
  try {

    const refreshToken = req.cookies?.stdrefresh;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const userId = decoded.id.toString();

    // state anti-CSRF + associer au user
    const state = base64url(crypto.randomBytes(24));
    const payload = JSON.stringify({ state, userId });

    // cookie court pour valider le callback
    res.cookie("g_state", state, oauthCookieOptions);
    res.cookie("g_uid", userId, oauthCookieOptions);

    const scope = encodeURIComponent("openid email profile");
    const redirectUri = encodeURIComponent(GOOGLE_LINK_CALLBACK_URL);

    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${encodeURIComponent(state)}`;

    return res.redirect(url);

  } catch (error) {
    next(error);
  }
};

// 2) Callback: échanger code -> token -> userinfo -> update user.providers
export const googleCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;

    const stateCookie = req.cookies?.g_state;
    const userId = req.cookies?.g_uid;

    if (!code || !state) return res.status(400).send("Missing code/state");
    if (!stateCookie || stateCookie !== state) return res.status(401).send("Invalid state");
    if (!userId) return res.status(401).send("Missing user context");

    // échanger code contre tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_LINK_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(400).json({ message: "Google token exchange failed", error: tokenJson });
    }

    const accessToken = tokenJson.access_token;
    if (!accessToken) return res.status(400).send("No access token");

    // userinfo
    const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const info = await infoRes.json();
    console.log({ info });

    if (!infoRes.ok) {
      return res.status(400).json({ message: "Google userinfo failed", error: info });
    }

    // info: { sub, email, email_verified, name, picture, ... }
    const providerId = info.sub;
    const providerEmail = info.email;

    // sécurité: vérifier user existe
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    // empêcher liaison si ce providerId est déjà pris par un autre user
    const alreadyUsed = await User.exists({
      _id: { $ne: user._id },
      providers: { $elemMatch: { type: "google", providerId } },
    });

    if (alreadyUsed) {
      return res.redirect(`${FRONT_URL}/profile?google=already_linked`);
    }

    // ajouter/mettre à jour provider
    const idx = (user.providers || []).findIndex(
      (p) => p.type === "google"
    );

    const providerObj = { type: "google", providerId, email: providerEmail };

    if (idx >= 0) user.providers[idx] = providerObj;
    else user.providers.push(providerObj);

    // optionnel: si email google vérifié, marquer mailVerified
    if (info.email_verified === true) user.mailVerified = true;

    await user.save();

    // nettoyer cookies temporaires
    res.clearCookie("g_state", { httpOnly: true, secure: true, sameSite: "None" });
    res.clearCookie("g_uid", { httpOnly: true, secure: true, sameSite: "None" });

    return res.redirect(`${FRONT_URL}/profile?google=linked`);
  } catch (err) {
    next(err);
  }
};

export const googleLoginStart = async (req, res, next) => {
  try {
    const state = base64url(crypto.randomBytes(24));
    res.cookie("g_login_state", state, oauthCookieOptions);

    const scope = encodeURIComponent("openid email profile");
    const redirectUri = encodeURIComponent(GOOGLE_LOGIN_CALLBACK_URL);

    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${encodeURIComponent(state)}`;

    return res.redirect(url);
  } catch (err) {
    next(err);
  }
};

export const googleLoginCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;
    const stateCookie = req.cookies?.g_login_state;

    if (!code || !state) return res.status(400).send("Missing code/state");
    if (!stateCookie || stateCookie !== state) {
      return res.status(401).send("Invalid state");
    }

    // 1. Échanger code → token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_LOGIN_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
    });

    const token = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(400).json({ message: "Token exchange failed", token });
    }

    // 2. User info
    const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const info = await infoRes.json();

    if (!infoRes.ok) {
      return res.status(400).json({ message: "Userinfo failed", info });
    }

    const providerId = info.sub;
    const email = info.email;

    // 3. Trouver user par provider Google
    let user = await User.findOne({
      providers: { $elemMatch: { type: "google", providerId } },
    });

    // 4. Sinon → fallback email
    if (!user) {
      return res.redirect(`${FRONT_URL}/login?google=no_account`);
    }


    // 6. Générer tokens (comme login classique)
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    setRefreshCookie(res, refreshToken, confCookieOptions);
    // res.cookie("stdrefresh", refreshToken, confCookieOptions);

    res.clearCookie("g_login_state", oauthCookieOptions);

    return res.redirect(`${FRONT_URL}/`);
  } catch (err) {
    next(err);
  }
};
