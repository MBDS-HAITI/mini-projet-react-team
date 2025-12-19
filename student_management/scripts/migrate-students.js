// scripts/migrate-students.js
import mongoose from "mongoose";
import Student from "../models/student.model.js";
import { MONGODB_URI } from "../config/env.js";

await mongoose.connect(MONGODB_URI);

console.log("DB:", mongoose.connection.name);
console.log("Collection:", Student.collection.name);

const before = await Student.countDocuments({ createdAt: { $exists: false } });
console.log("Docs missing createdAt (before):", before);

// Exemple: ajouter champs manquants avec valeurs par défaut
await Student.updateMany(
  { dateOfBith: { $exists: false } },
  { $set: { dateOfBith: null } }
);

await Student.updateMany(
  { sex: { $exists: false } },
  { $set: { sex: null } } // ou null si tu préfères
);

await Student.updateMany(
  { phone: { $exists: false } },
  { $set: { phone: "" } }
);

await Student.updateMany(
  { address: { $exists: false } },
  { $set: { address: "" } }
);

await Student.updateMany(
  { createdAt: { $exists: false } },
  { $set: { createdAt: new Date() } },
  { strict: false }
);

await Student.updateMany(
  { updatedAt: { $exists: false } },
  { $set: { updatedAt: new Date() } }
);

const after = await Student.countDocuments({ createdAt: { $exists: false } });
console.log("Docs missing createdAt (after):", after);
await mongoose.disconnect();
process.exit(0);
