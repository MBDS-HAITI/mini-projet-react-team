// scripts/migrate-students.js
import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
// import { MONGODB_URI } from "../config/env.js";

await mongoose.connect("mongodb+srv://pdawens78_db_user:Sefyetem2023@cluster0.byvsbzk.mongodb.net/?appName=Cluster0");

console.log("DB:", mongoose.connection.name);
console.log("Collection:", User.collection.name);

const username = "admin";
const email = 'admin@react.team';
const role = "ADMIN";
const plainPassword = "Admin123#";
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(plainPassword, salt);

const adminCount = await User.countDocuments({username: "admin"});
if(adminCount == 0){


    const newUser = await User.create({ email, username, password: hashedPassword, role, student: null });
}

const newAdminCount = await User.countDocuments({role: "ADMIN", username});
if(newAdminCount > 0){
    console.log(`SUCCESS: Un compte Admin a ete cree : \n username : ${username} \n password : ${plainPassword}`);
}else{
    console.log(`WARNING: Aucun compte créé!`)
}

await mongoose.disconnect();
process.exit(0);
