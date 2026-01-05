// services/mail/templates.js

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { transporter, fromIdentity } from "./mailer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const emailsDir = path.resolve(__dirname, "../../templates/emails");

async function loadTemplate(filename) {
  const p = path.join(emailsDir, filename);
  return fs.readFile(p, "utf-8");
}

// remplace {{key}} par variables[key]
function render(html, variables = {}) {
  return html.replace(/{{\s*([\w.-]+)\s*}}/g, (_, key) => {
    const val = variables[key];
    return val === undefined || val === null ? "" : String(val);
  });
}

export async function sendMail({ to, subject, templateFile, variables }) {
  const raw = await loadTemplate(templateFile);
  const html = render(raw, variables);

  const info = await transporter.sendMail({
    from: fromIdentity,
    to,
    subject,
    html,
  });

  return info;
}
