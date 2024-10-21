import mongoose from "mongoose";

const PhongThiSchema = new mongoose.Schema({
  tenPhong: {
    type: String,
    unique: true,
  },
  soCho: {
    type: Number,
  },
  loai: {
    type: String,
  },
});

const PhongThi = mongoose.models.PhongThi || mongoose.model("PhongThi", PhongThiSchema);

export default PhongThi;
