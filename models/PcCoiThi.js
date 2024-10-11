import mongoose from "mongoose";

const PcCoiThiSchema = new mongoose.Schema({
  hocPhan: {
    type: String,  
  },
  lop: {
    type: String,  
  },
  // hocPhan: {
  //   type: [String],  
  // },
  // lop: {
  //   type: [String],  
  // },
  ngayThi: {
    type: String,  
  },
  ca: {
    type: Number, 
  },
  cbo1: {
    type: String,  
  },
  cbo2: {
    type: String,  
  },
  hinhThuc: {
    type: String,  
  },
  thoiGian: {
    type: String,  
  },
  phong: {
    type: String,  
  },
  diaDiem: {
    type: String,  
  },
  ghiChu: {
    type: String,  
  },
  namHoc: {
    type: String,  
  },
  loaiKyThi: {
    type: String,  
  },
  loaiDaoTao: {
    type: String,  
  },
  ky: {
    type: String,
  },
}, {
  timestamps: true,
});

const PcCoiThi = mongoose.models.PcCoiThi || mongoose.model('PcCoiThi', PcCoiThiSchema);

export default PcCoiThi;

