// models/user.model.js
import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema({
  type: { type: String, enum: ["google"], required: true },
  providerId: { type: String, required: true },
  email: { type: String, required: true },
}, { _id: false });


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, unique: true, sparse: true, trim: true },
  passwordHash: { type: String , required: true}, 
  role: { type: String, enum: ["ADMIN","SCOLARITE","STUDENT"], required: true },

  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
  providers: { type: [ProviderSchema], default: [] },

  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null },
}, { timestamps: true });

UserSchema.index({ "providers.type": 1, "providers.providerId": 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", UserSchema);
export default User 