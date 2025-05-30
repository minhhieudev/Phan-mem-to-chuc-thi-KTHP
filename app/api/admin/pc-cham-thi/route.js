export const dynamic = 'force-dynamic';
import { connectToDB } from '@mongodb';
import PcChamThi from '@models/PcChamThi';

export const GET = async (req) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const namHoc = searchParams.get('namHoc');
    const loaiKyThi = searchParams.get('loaiKyThi');
    const loai = searchParams.get('loai');
    const ky = searchParams.get('hocKy');

    let filter = {};

    if  (loaiKyThi && loaiKyThi !== 'null'&& loaiKyThi !== 'undefined'){
      filter.loaiKyThi = loaiKyThi;
    }
    if (namHoc) {
      filter.namHoc = namHoc;
    }
    if (ky && ky !== 'null'&& ky !== 'undefined') {
      filter.ky = ky;
    }

    if (loai) {
      filter.loai = loai;
    }
    const assignments = await PcChamThi.find(filter);

    console.log('HHHHH',filter)

    return new Response(JSON.stringify(assignments), { status: 200 });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách phân công chấm thi:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};


export const POST = async (req) => {
  try {
    await connectToDB();

    // Lấy dữ liệu từ request
    const data = await req.json();

    // Kiểm tra xem dữ liệu có hợp lệ không
    const { hocPhan, nhomLop, ngayThi, namHoc, loaiKyThi,soBai,hinhThucThoiGianThi, ky } = data;
    if (!hocPhan || !nhomLop || !ngayThi || !namHoc || !loaiKyThi) {
      return new Response(JSON.stringify({ message: "Dữ liệu không hợp lệ, vui lòng điền đầy đủ các trường bắt buộc." }), { status: 400 });
    }

    // Tạo một bản ghi mới cho Phân Công Giảng Dạy
    const newAssignment = new PcChamThi({
      hocPhan,
      nhomLop,
      ngayThi,
      cb1: data.cb1 || '',
      cb2: data.cb2 || '',
      diaDiem: data.diaDiem || 0,
      namHoc,
      soBai,
      hinhThucThoiGianThi,
      loaiKyThi:data.loaiKyThi,
      loai: data.loai || "",
      ky
    });

    // Lưu bản ghi mới vào database
    await newAssignment.save();

    // Trả về phản hồi thành công
    return new Response(JSON.stringify(newAssignment), { status: 201 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Lỗi khi thêm mới bản ghi phân công chấm thi:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    await connectToDB();

    // Lấy dữ liệu và ID từ request
    const { id, ...data } = await req.json();

    // Kiểm tra xem ID có tồn tại không
    if (!id) {
      return new Response(JSON.stringify({ message: "ID bản ghi không được cung cấp." }), { status: 400 });
    }

    // Cập nhật bản ghi dựa trên ID
    const updatedAssignment = await PcChamThi.findByIdAndUpdate(id, data, { new: true });

    if (!updatedAssignment) {
      return new Response(JSON.stringify({ message: "Không tìm thấy bản ghi để cập nhật." }), { status: 404 });
    }

    // Trả về phản hồi thành công
    return new Response(JSON.stringify(updatedAssignment), { status: 200 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Lỗi khi cập nhật bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    await connectToDB();

    // Lấy ID từ request body
    const { id } = await req.json();

    // Kiểm tra xem ID có tồn tại không
    if (!id) {
      return new Response(JSON.stringify({ message: "ID bản ghi không được cung cấp." }), { status: 400 });
    }

    // Xóa bản ghi dựa trên ID
    const deletedAssignment = await PcChamThi.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return new Response(JSON.stringify({ message: "Không tìm thấy bản ghi để xóa." }), { status: 404 });
    }

    // Trả về phản hồi thành công
    return new Response(JSON.stringify({ message: "Bản ghi đã được xóa thành công." }), { status: 200 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Lỗi khi xóa bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};