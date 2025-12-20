// models/user.model.js
import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema({
  type: { type: String, enum: ["google"], required: true },
  providerId: { type: String, required: true },
  email: { type: String, required: true },
}, { _id: false });


const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email adress']
  },
  mailVerified:{
    type: Boolean,
    default: false 
  },
  username: { type: String,
    lowercase: true, 
    unique: true, 
    sparse: true, 
    trim: true 
  },
  password: { 
    type: String , 
    required: true,
    minLength: 6,
  }, 
  role: { type: String, enum: ["ADMIN","SCOLARITE","STUDENT"], required: true, default: "STUDENT" },

  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    validate:{
            validator: function (v) {
            // si STUDENT => doit avoir un studentId
            if (this.role === "STUDENT") return v != null;
            // si pas STUDENT => doit être null
            return v == null;
          },
          message: "Le champ student est requis."
        },
    default: null
  },
  providers: { type: [ProviderSchema], default: [] },

  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null },
}, { timestamps: true });

UserSchema.index({ "providers.type": 1, "providers.providerId": 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", UserSchema);
export default User 