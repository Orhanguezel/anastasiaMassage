import { Schema, model, Document } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default model<ISetting>("Setting", settingSchema);
