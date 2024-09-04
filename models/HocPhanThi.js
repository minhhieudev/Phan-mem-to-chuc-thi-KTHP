import mongoose from "mongoose";

const HocPhanThiSchema = new mongoose.Schema({
  maHocPhan: {
    type: String,
    unique: true,
  },
  tenHocPhan: {
    type: String,
    required: true,
  },
  soTinChi: {
    type: Number,
  },
});

const HocPhanThi = mongoose.models.HocPhanThi || mongoose.model("HocPhanThi", HocPhanThiSchema);

export default HocPhanThi;
