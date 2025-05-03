import mongoose from "mongoose";
import Khoa from "./Khoa"; // Đảm bảo model Khoa được nhập đúng cách

const NhomLopSchema = new mongoose.Schema({
  tenLop: {
    type: String,
    required: true,
    unique: true,
  },
  soSV: {
    type: Number,
    required: true,
  },
  khoa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Khoa',
    default: null, // Xem xét việc sử dụng null thay vì chuỗi rỗng
  },
});

const NhomLop = mongoose.models.NhomLop || mongoose.model("NhomLop", NhomLopSchema);

export default NhomLop;
