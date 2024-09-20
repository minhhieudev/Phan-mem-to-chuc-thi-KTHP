import mongoose from "mongoose";

const HocPhanThiSchema = new mongoose.Schema({
  maHocPhan: {
    type: String,
    unique: true,
  },
  tenHocPhan: {
    type: String,
  },
  soTinChi: {
    type: Number,
  },
  soSVDK: {
    type: Number,
  },
  lop: {
    type: [String],
  },
  hinhThuc: {
    type: String,
  },
  thoiGian: {
    type: String,
  },
  giangVien: {
    type: String,
  },
  thiT7CN: {
    type: Boolean
  }

});

const HocPhanThi = mongoose.models.HocPhanThi || mongoose.model("HocPhanThi", HocPhanThiSchema);

export default HocPhanThi;
