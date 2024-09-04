import mongoose from "mongoose";

const PhongThiSchema = new mongoose.Schema({
  tenPhong: {
    type: String,
    required: true,
    unique: true,
  },
  soCho: {
    type: Number,
  },
});

const PhongThi = mongoose.models.PhongThi || mongoose.model("PhongThi", PhongThiSchema);

export default PhongThi;
