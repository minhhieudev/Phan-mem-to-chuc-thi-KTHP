import { connectToDB } from '@mongodb';
import PcCoiThi from '@models/PcCoiThi';

export const GET = async (req) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const namHoc = searchParams.get('namHoc');
    const loaiKyThi = searchParams.get('loaiKyThi');
    const loai = searchParams.get('loai');

    let filter = {};

    if (loaiKyThi) {
      filter.loaiKyThi = loaiKyThi;
    }
    if (namHoc) {
      filter.namHoc = namHoc;
    }

    if (loai) {
      filter.loai = loai;
    }

    // Tìm kiếm các bản ghi phân công giảng dạy theo điều kiện filter
    const assignments = await PcCoiThi.find(filter);

    // Trả về phản hồi thành công
    return new Response(JSON.stringify(assignments), { status: 200 });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};


export const POST = async (req) => {
  try {
    await connectToDB();

    const data = await req.json();

    const { hocPhan, nhomLop, ngayThi, namHoc, loaiKyThi } = data;
    if (!hocPhan || !nhomLop || !ngayThi || !namHoc || !loaiKyThi) {
      return new Response(JSON.stringify({ message: "Dữ liệu không hợp lệ, vui lòng điền đầy đủ các trường bắt buộc." }), { status: 400 });
    }

    // Tạo một bản ghi mới cho Phân Công Giảng Dạy
    const newAssignment = new PcCoiThi({
      hocPhan: Array.isArray(hocPhan) ? hocPhan : [hocPhan],
      nhomLop: Array.isArray(nhomLop) ? nhomLop : [nhomLop],
      ngayThi,
      ca: data.ca || 0,
      cb1: data.cb1 || '',
      cb2: data.cb2 || '',
      time: Array.isArray(data.time) ? data.time : [data.time] || '',
      diaDiem: data.diaDiem || 0,
      ghiChu: data.ghiChu || '',
      phongThi:data.phongThi,
      namHoc,
      loaiKyThi:data.loaiKyThi,
      loai: data.loai || ""
    });

    await newAssignment.save();

    return new Response(JSON.stringify(newAssignment), { status: 201 });
  } catch (err) {
    console.error("Lỗi khi thêm mới bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    await connectToDB();

    const { id, ...data } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ message: "ID bản ghi không được cung cấp." }), { status: 400 });
    }

    const updatedAssignment = await PcCoiThi.findByIdAndUpdate(id, data, { new: true });

    if (!updatedAssignment) {
      return new Response(JSON.stringify({ message: "Không tìm thấy bản ghi để cập nhật." }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedAssignment), { status: 200 });
  } catch (err) {
    console.error("Lỗi khi cập nhật bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    await connectToDB();

    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ message: "ID bản ghi không được cung cấp." }), { status: 400 });
    }

    const deletedAssignment = await PcCoiThi.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return new Response(JSON.stringify({ message: "Không tìm thấy bản ghi để xóa." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Bản ghi đã được xóa thành công." }), { status: 200 });
  } catch (err) {
    console.error("Lỗi khi xóa bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};