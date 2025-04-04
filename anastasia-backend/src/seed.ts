// src/seed.ts

import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import connectDB from "./config/connect";
import User from "./models/user.models";
import { hashPassword } from "./utils/authUtils";

const seedUsers = async () => {
  await connectDB();
  console.log("✅ Connected to MongoDB");

  await User.deleteMany({});
  console.log("🗑️ All existing users deleted");

  const adminUser = {
    name: "Orhan",
    email: "orhanguzell@gmail.com",
    password: await hashPassword("123456"),
    role: "admin",
    phone: "+905401234567",
    profileImage: "https://via.placeholder.com/150",
    isActive: true,
    bio: "Sistem yöneticisi.",
    birthDate: new Date("1980-01-01"),
    socialMedia: {
      facebook: null,
      twitter: null,
      instagram: null,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
    },
    addresses: [
      {
        street: "Gazi Cd.",
        city: "Bursa",
        postalCode: "16000",
        country: "Turkey",
        isDefault: true,
      },
    ],
  };

  const fakeUsers = Array.from({ length: 3 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(10),
    role: "user",
    phone: faker.phone.number("+90 5##-###-####"),
    profileImage: "https://via.placeholder.com/150",
    isActive: true,
    bio: faker.lorem.sentence(),
    birthDate: faker.date.birthdate({ min: 1990, max: 2005, mode: "year" }),
    socialMedia: {
      facebook: faker.internet.url(),
      twitter: faker.internet.url(),
      instagram: faker.internet.url(),
    },
    notifications: {
      emailNotifications: faker.datatype.boolean(),
      smsNotifications: faker.datatype.boolean(),
    },
    addresses: [
      {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        isDefault: true,
      },
    ],
  }));

  await User.insertMany([adminUser, ...fakeUsers]);
  console.log("🌱 Dummy users inserted successfully");

  await mongoose.disconnect();
  console.log("🔌 MongoDB connection closed");
};

seedUsers().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});