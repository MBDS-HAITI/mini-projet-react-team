// services/mail/mailer.js

import nodemailer from "nodemailer";
import {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
  MAIL_FROM_NAME,
} from "../../config/env.js";

function assertEnv(name, value) {
  if (!value) throw new Error(`${name} missing in env`);
}

assertEnv("MAIL_HOST", MAIL_HOST);
assertEnv("MAIL_PORT", MAIL_PORT);
assertEnv("MAIL_USER", MAIL_USER);
assertEnv("MAIL_PASS", MAIL_PASS);
assertEnv("MAIL_FROM", MAIL_FROM);

export const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  secure: false, // 587 => STARTTLS
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export const fromIdentity = {
  name: MAIL_FROM_NAME || "React Team",
  address: MAIL_FROM,
};
