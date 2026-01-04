

import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { FRONT_URL, GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_SECRET, NODE_ENV } from "../config/env.js";
import User from "../models/user.model.js";
import crypto from "crypto";

// helper to base64url-encode
function base64url(str) {
  return Buffer.from(str).toString("base64url");
}
const isProd = NODE_ENV === "production";

const confCookieOptions = {
      httpOnly: true,
      secure: isProd, 
      sameSite:  isProd ? "None" : "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

const oauthCookieOptions = {
  httpOnly: true,
  secure: isProd,                
  sameSite: isProd ? "None" : "Lax",
  path: "/",
  maxAge: 10 * 60 * 1000,
};

export const signIn = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1) Récupérer user (inclure password si ton schema a select:false)
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // (Optionnel) bloquer comptes inactifs
    if (user.isActive === false) {
      const error = new Error("Account is disabled");
      error.statusCode = 403;
      throw error;
    }

    // 2) Vérifier password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Username or password incorrect");
      error.statusCode = 401;
      throw error;
    }

    // 3) Mettre à jour la date de dernière connexion
    user.lastLoginAt = new Date();
    await user.save();

    // 4) Générer tokens
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    // 5) Cookie refresh
    res.cookie("stdrefresh", refreshToken, confCookieOptions);

    // 6) Ne pas renvoyer password
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      success: true,
      message: "User signed in successfuly",
      data: {
        token,
        user: userObj,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const refreshAccessToken = async (req, res, next) => {
    try {

        const refreshToken = req.cookies?.stdrefresh;
        
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);



        const user = await User.findOne({ _id: decoded.id });

        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
                username: user.username
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.status(200).json({ token: accessToken });
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized" });
    }
};

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie("stdrefresh",confCookieOptions);
        return res.status(200).json({ success: true, message: "Logged out" });
    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
}

export const me = async (req, res, next) => {
    try {
        const user = req.user;
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

export const googleLinkStart = async (req, res, next) => {
  try {
    console.log("Bonjour from googleLinkStart");
    
    
    // const userId = req.user._id.toString();

    // state anti-CSRF + associer au user
    const state = base64url(crypto.randomBytes(24));
    const payload = JSON.stringify({ state });
    // const payload = JSON.stringify({ state, userId });

    // cookie court pour valider le callback
    res.cookie("g_state", state, oauthCookieOptions);
    // res.cookie("g_uid", userId, oauthCookieOptions);

    const scope = encodeURIComponent("openid email profile");
    const redirectUri = encodeURIComponent(GOOGLE_CALLBACK_URL);

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
    // const userId = req.cookies?.g_uid;

    if (!code || !state) return res.status(400).send("Missing code/state");
    if (!stateCookie || stateCookie !== state) return res.status(401).send("Invalid state");
    // if (!userId) return res.status(401).send("Missing user context");

    // échanger code contre tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_CALLBACK_URL,
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
    console.log({info});
    
    if (!infoRes.ok) {
      return res.status(400).json({ message: "Google userinfo failed", error: info });
    }

    // info: { sub, email, email_verified, name, picture, ... }
    const providerId = info.sub;
    const providerEmail = info.email;

    // // sécurité: vérifier user existe
    // const user = await User.findById(userId);
    // if (!user) return res.status(404).send("User not found");

    // empêcher liaison si ce providerId est déjà pris par un autre user
    // const alreadyUsed = await User.exists({
    //   _id: { $ne: user._id },
    //   providers: { $elemMatch: { type: "google", providerId } },
    // });
    if (alreadyUsed) {
      return res.redirect(`${FRONT_URL}/profile?google=already_linked`);
    }

    // // ajouter/mettre à jour provider
    // const idx = (user.providers || []).findIndex(
    //   (p) => p.type === "google"
    // );

    const providerObj = { type: "google", providerId, email: providerEmail };

    if (idx >= 0) user.providers[idx] = providerObj;
    else user.providers.push(providerObj);

    // optionnel: si email google vérifié, marquer mailVerified
    // if (info.email_verified === true) user.mailVerified = true;

    await user.save();

    // nettoyer cookies temporaires
    res.clearCookie("g_state", { httpOnly: true, secure: true, sameSite: "None" });
    res.clearCookie("g_uid", { httpOnly: true, secure: true, sameSite: "None" });

    return res.redirect(`${FRONT_URL}/profile?google=linked`);
  } catch (err) {
    next(err);
  }
};