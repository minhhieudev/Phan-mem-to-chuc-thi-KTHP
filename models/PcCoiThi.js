import mongoose from "mongoose";

const PcCoiThiSchema = new mongoose.Schema({
  maHocPhan: {
    type: [String],  // Lưu trữ mảng các học phần
  },
  hocPhan: {
    type: [String],  // Lưu trữ mảng các học phần
  },
  lop: {
    type: [[String]],  // Lưu trữ mảng các lớp
  },
  ngayThi: {
    type: String,  // Lưu ngày thi
  },
  ca: {
    type: Number,  // Ca thi
  },
  cbo1: {
    type: [String]  // Cán bộ 1
  },
  cbo2: {
    type: [String]  // Cán bộ 2
  },
  hinhThuc: {
    type: [String],  // Hình thức thi
  },
  thoiGian: {
    type: [String],  // Lưu trữ mảng thời gian (nếu có nhiều thời gian thi)
  },
  phong: {
    type: [String],  // Lưu trữ mảng phòng thi
  },
  diaDiem: {
    type: String,  // Địa điểm thi
  },
  ghiChu: {
    type: String,  // Ghi chú liên quan đến thi
  },
  namHoc: {
    type: String,  // Năm học
  },
  loaiKyThi: {
    type: String,  // Loại kỳ thi
  },
  loaiDaoTao: {
    type: String,  
  },
  ky: {
    type: String,
  },
  id: {
    type: String,  
  },

  soLuong: {
    type: [Number], 
  },
  tc: {
    type: [String], 
  },

  danhSachThiSinh: {
    type: [
      {
        maSV: { type: String, required: true },  // Mã sinh viên
        hoTen: { type: String, required: true },  // Họ tên sinh viên
        lop: { type: String, required: true }  // Lớp của sinh viên
      }
    ],
    default: []  // Giá trị mặc định là một mảng rỗng
  },
}, {
  timestamps: true,  // Tự động thêm trường thời gian tạo và cập nhật
});

const PcCoiThi = mongoose.models.PcCoiThi || mongoose.model('PcCoiThi', PcCoiThiSchema);

export default PcCoiThi;
