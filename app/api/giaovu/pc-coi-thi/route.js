import { connectToDB } from '@mongodb';
import PcCoiThi from "@models/PcCoiThi"; // Đảm bảo mô hình này đã được tạo tương ứng

// GET - Lấy danh sách phân công giảng dạy theo năm học và loại kỳ thi
export const GET = async (req) => {
  try {
    await connectToDB();
    
    // Lấy các tham số từ query
    const { searchParams } = new URL(req.url);
    const namHoc = searchParams.get('namHoc');
    const loaiKyThi = searchParams.get('loaiKyThi');

    // Tạo đối tượng điều kiện tìm kiếm
    let filter = {};
    
    // Nếu có tham số namHoc, thêm vào điều kiện tìm kiếm
    if (namHoc) {
      filter.namHoc = namHoc;
    }

    // Nếu có tham số loaiKyThi, thêm vào điều kiện tìm kiếm
    if (loaiKyThi) {
      filter.loaiKyThi = loaiKyThi;
    }

    // Nếu không có cả namHoc lẫn loaiKyThi thì trả về lỗi
    if (!namHoc && !loaiKyThi) {
      return new Response("Thiếu tham số năm học hoặc loại kỳ thi.", { status: 400 });
    }

    // Tìm kiếm các bản ghi phân công giảng dạy theo điều kiện filter
    const assignments = await PcCoiThi.find(filter);

    // Trả về phản hồi thành công
    return new Response(JSON.stringify(assignments), { status: 200 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Error fetching assignments:", err);
    return new Response(`Lỗi: ${err.message}`, { status: 500 });
  }
};

// POST - Thêm mới bản ghi
export const POST = async (req) => {
  try {
    // Kết nối tới MongoDB
    await connectToDB();
    
    // Lấy dữ liệu từ request
    const data = await req.json();
    
    // Kiểm tra xem dữ liệu có hợp lệ không
    if (!data.hocPhan || !data.nhomLop || !data.ngayThi || !data.gvGiangDay || !data.namHoc || !data.loaiKyThi) {
      return new Response("Dữ liệu không hợp lệ, vui lòng điền đầy đủ các trường bắt buộc.", { status: 400 });
    }

    // Tạo một bản ghi mới cho Phân Công Giảng Dạy
    const newAssignment = new PcCoiThi({
      hocPhan: data.hocPhan,
      nhomLop: data.nhomLop,
      ngayThi: data.ngayThi,
      ca: data.ca || 0,
      gvGiangDay: data.gvGiangDay,
      cb1: data.cb1 || '',
      cb2: data.cb2 || '',
      time: data.time || '',
      diaDiem: data.diaDiem || 0,
      ghiChu: data.ghiChu || '',
      namHoc: data.namHoc,
      loaiKyThi: data.loaiKyThi
    });

    // Lưu bản ghi mới vào database
    await newAssignment.save();

    // Trả về phản hồi thành công
    return new Response(JSON.stringify(newAssignment), { status: 201 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Error saving assignment:", err);
    return new Response(`Lỗi: ${err.message}`, { status: 500 });
  }
};

// PUT - Cập nhật bản ghi
export const PUT = async (req) => {
  try {
    // Kết nối tới MongoDB
    await connectToDB();

    // Lấy dữ liệu và ID từ request
    const { id, ...data } = await req.json();

    // Kiểm tra xem ID có tồn tại không
    if (!id) {
      return new Response("ID bản ghi không được cung cấp.", { status: 400 });
    }

    // Cập nhật bản ghi dựa trên ID
    const updatedAssignment = await PcCoiThi.findByIdAndUpdate(id, data, { new: true });

    if (!updatedAssignment) {
      return new Response("Không tìm thấy bản ghi để cập nhật.", { status: 404 });
    }

    // Trả về phản hồi thành công
    return new Response(JSON.stringify(updatedAssignment), { status: 200 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Error updating assignment:", err);
    return new Response(`Lỗi: ${err.message}`, { status: 500 });
  }
};

// DELETE - Xóa bản ghi
export const DELETE = async (req) => {
  try {
    // Kết nối tới MongoDB
    await connectToDB();

    // Lấy ID từ request body
    const { id } = await req.json();

    // Kiểm tra xem ID có tồn tại không
    if (!id) {
      return new Response("ID bản ghi không được cung cấp.", { status: 400 });
    }

    // Xóa bản ghi dựa trên ID
    const deletedAssignment = await PcCoiThi.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return new Response("Không tìm thấy bản ghi để xóa.", { status: 404 });
    }

    // Trả về phản hồi thành công
    return new Response("Bản ghi đã được xóa thành công.", { status: 200 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Error deleting assignment:", err);
    return new Response(`Lỗi: ${err.message}`, { status: 500 });
  }
};
