import { sendMail } from "./templates.js";
import { FRONT_URL } from "../../config/env.js";

export async function sendWelcomeEmail({ to, name, username, password }) {
    return sendMail({
        to,
        subject: "Bienvenue sur Student Management System by React Team",
        templateFile: "welcome.html",
        variables: {
            name,
            loginLink: `${FRONT_URL}/login`,
            username,
            password,
        },
    });
}

export async function sendVerifyEmail({ to, name, token }) {
    return sendMail({
        to,
        subject: "Activez votre compte",
        templateFile: "verify-email.html",
        variables: {
            name,
            verifyLink: `${FRONT_URL}/verify-email?token=${token}`,
        },
    });
}

export async function sendResetPasswordEmail({ to, name, token }) {
    return sendMail({
        to,
        subject: "Réinitialisation du mot de passe",
        templateFile: "reset-password.html",
        variables: {
            name,
            resetLink: `${FRONT_URL}/reset-password?token=${token}`,
            expiresIn: "15 minutes",
        },
    });
}
