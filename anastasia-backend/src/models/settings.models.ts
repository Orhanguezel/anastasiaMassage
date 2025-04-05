import { Schema, model, Document } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: string;
}

const settingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<ISetting>("Setting", settingSchema);
