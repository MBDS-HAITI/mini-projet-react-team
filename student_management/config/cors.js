import { FRONT_URL } from "./env.js";

export const CORS_OPTIONS = {
  origin:  FRONT_URL,
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-CSRF-Token"],
};
