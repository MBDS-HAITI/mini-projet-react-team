// scripts/migrate-courses-credits.js
import mongoose from "mongoose";
import Course from "../models/course.model.js";
import { MONGODB_URI } from "../config/env.js";

await mongoose.connect(MONGODB_URI);

console.log("DB:", mongoose.connection.name);
console.log("Collection:", Course.collection.name);

// combien de cours sans credits
const before = await Course.countDocuments({
  $or: [
    { credits: { $exists: false } },
    { credits: null }
  ]
});
console.log("Courses missing credits (before):", before);

// mise à jour
const res = await Course.updateMany(
  {
    $or: [
      { credits: { $exists: false } },
      { credits: null }
    ]
  },
  { $set: { credits: 20 } }
);

console.log("Modified:", res.modifiedCount ?? res.nModified);

// vérification
const after = await Course.countDocuments({
  $or: [
    { credits: { $exists: false } },
    { credits: null }
  ]
});
console.log("Courses missing credits (after):", after);

await mongoose.disconnect();
process.exit(0);
