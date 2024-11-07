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
    type: Number,
    default: 0
  },

  // namHoc: {
  //   type: String,  
  // },
  // loai: {
  //   type: String,  
  // },
  // ky: {
  //   type: String,
  // },

});

const HocPhanThi = mongoose.models.HocPhanThi || mongoose.model("HocPhanThi", HocPhanThiSchema);

export default HocPhanThi;
