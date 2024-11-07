import HocPhanThi from "@models/HocPhanThi"; // Import mô hình HocPhanThi
import { connectToDB } from "@mongodb";

// Lưu mô hình vào biến
const HocPhanThiModel = HocPhanThi;

export const GET = async (req, res) => {
  try {
    await connectToDB();

    // Sử dụng biến HocPhanThiModel để truy vấn dữ liệu
    const allHocPhanThi = await HocPhanThiModel.find();

    return new Response(JSON.stringify(allHocPhanThi), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get all HocPhanThi", { status: 500 });
  }
};

export const POST = async (req, res) => {
  try {
    await connectToDB();
    const { tenHocPhan, soTinChi, maHocPhan, hinhThuc, thoiGian, giangVien, thiT7CN } = await req.json();

    // Kiểm tra nếu học phần với maHocPhan đã tồn tại, nếu có thì cập nhật, nếu không thì tạo mới
    let existingHocPhanThi = await HocPhanThiModel.findOne({ maHocPhan });

    if (existingHocPhanThi) {
      existingHocPhanThi.tenHocPhan = tenHocPhan;
      existingHocPhanThi.soTinChi = soTinChi;
      existingHocPhanThi.hinhThuc = hinhThuc;
      existingHocPhanThi.thoiGian = thoiGian;
      existingHocPhanThi.giangVien = giangVien;
      existingHocPhanThi.thiT7CN = thiT7CN;

      await existingHocPhanThi.save();

      return new Response(JSON.stringify(existingHocPhanThi), { status: 200 });
    } else {
      const newHocPhanThi = new HocPhanThiModel({
        tenHocPhan,
        soTinChi,
        maHocPhan,
        hinhThuc,
        thoiGian,
        giangVien,
        thiT7CN,
      });

      await newHocPhanThi.save();
      return new Response(JSON.stringify(newHocPhanThi), { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return new Response("Failed to create or update HocPhanThi", { status: 500 });
  }
};


export const PUT = async (req, res) => {
  try {
    await connectToDB();
    const { tenHocPhan, soTinChi, maHocPhan, id, hinhThuc, thoiGian, giangVien, thiT7CN } = await req.json();

    const hocPhanThiToUpdate = await HocPhanThiModel.findById(id);

    if (!hocPhanThiToUpdate) {
      return new Response("HocPhanThi not found", { status: 404 });
    }

    hocPhanThiToUpdate.tenHocPhan = tenHocPhan;
    hocPhanThiToUpdate.soTinChi = soTinChi;
    hocPhanThiToUpdate.maHocPhan = maHocPhan;

    hocPhanThiToUpdate.hinhThuc = hinhThuc;
    hocPhanThiToUpdate.thoiGian = thoiGian;
    hocPhanThiToUpdate.giangVien = giangVien;
    hocPhanThiToUpdate.thiT7CN = thiT7CN;

    await hocPhanThiToUpdate.save();

    return new Response(JSON.stringify(hocPhanThiToUpdate), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update HocPhanThi", { status: 500 });
  }
};

export const DELETE = async (req, res) => {
  try {
    await connectToDB();
    const { id } = await req.json();

    const hocPhanThiToDelete = await HocPhanThiModel.findByIdAndDelete(id);

    if (!hocPhanThiToDelete) {
      return new Response("HocPhanThi not found", { status: 404 });
    }

    return new Response("HocPhanThi deleted successfully", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to delete HocPhanThi", { status: 500 });
  }
};
