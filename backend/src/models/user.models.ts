import { Schema, model, Document, Types, Model } from "mongoose";
import {
  hashPassword,
  isPasswordHashed,
  comparePasswords,
} from "../utils/authUtils";

// 📌 Kullanıcı adresi tipi
interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

// 📌 Bildirim tercihleri
interface Notifications {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

// 📌 Sosyal medya bağlantıları
interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

// 📌 User modelinin temel interface'i
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "customer" | "moderator" | "staff";
  addresses?: Address[];
  phone?: string;
  orders?: Types.ObjectId[];
  profileImage?: string;
  isActive: boolean;
  favorites?: Types.ObjectId[];
  bio?: string;
  birthDate?: Date;
  socialMedia?: SocialMedia;
  notifications?: Notifications;
  createdAt?: Date;
  updatedAt?: Date;

  // Metodlar
  comparePassword(candidatePassword: string): Promise<boolean>;
  isPasswordHashed(): boolean;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "user", "customer", "moderator", "staff"],
      default: "user",
    },
    addresses: [
      {
        street: String,
        city: String,
        postalCode: String,
        country: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    phone: { type: String },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    profileImage: { type: String, default: "https://via.placeholder.com/150" },
    isActive: { type: Boolean, default: true },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    bio: { type: String, default: "" },
    birthDate: { type: Date },
    socialMedia: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// 🔐 Parola hashleme - sadece parola değiştiyse ve zaten hash değilse
userSchema.pre<IUser>("save", async function (next) {
  try {
    if (this.isModified("password") && !isPasswordHashed(this.password)) {
      this.password = await hashPassword(this.password);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 🔑 Parola karşılaştırma
userSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return comparePasswords(candidatePassword, this.password);
};

// 🔍 Parolanın hash'li olup olmadığını kontrol eder
userSchema.methods.isPasswordHashed = function (this: IUser): boolean {
  return isPasswordHashed(this.password);
};

const User = model<IUser, IUserModel>("User", userSchema);
export default User;
