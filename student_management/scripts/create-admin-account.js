// scripts/migrate-students.js
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { MONGODB_URI } from "../config/env.js";
import bcrypt from 'bcryptjs';

await mongoose.connect(MONGODB_URI);

console.log("DB:", mongoose.connection.name);
console.log("Collection:", Student.collection.name);

const adminCount = await User.countDocuments({role: "ADMIN"});
if(adminCount == 0){

    const username = "admin";
    const email = 'admin@react.team';
    const role = "ADMIN";
    const plainPassword = "Admin123#";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newUser = await User.create({ email, username, password: hashedPassword, role, student: null });
}

const newAdminCount = await User.countDocuments({role: "ADMIN", username});
if(newAdminCount > 0){
    console.log(`SUCCESS: Un compte Admin a ete cree : \n username : ${username} \n username : ${plainPassword}`);
}else{
    console.log(`WARNING: Aucun compte créé!`)
}

await mongoose.disconnect();
process.exit(0);
