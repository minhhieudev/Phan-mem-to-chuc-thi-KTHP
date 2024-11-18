export const dynamic = 'force-dynamic';
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
    console.error("Lỗi khi lấy danh sách lịch thi:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    await connectToDB();

    // Nhận toàn bộ body
    const list = await req.json();

    if (!list || !Array.isArray(list)) {
      return new Response(JSON.stringify({ message: "Invalid data format" }), { status: 400 });
    }

    const processedItems = await Promise.all(
      list.map(async (item) => {
        const {
          _id,
          ca,
          cbo1,
          cbo2,
          hocPhan,
          loaiKyThi,
          namHoc,
          ngayThi,
          lop,
          phong,
          hinhThuc,
          thoiGian,
          loaiDaoTao,
          hocKy,
          maHocPhan,
          tc,
          diaDiem,
          soLuong,
          danhSachThiSinh
        } = item;

        // Chuyển cbo1 và cbo2 từ chuỗi thành mảng các phần tử
        const cbo1Array = cbo1 ? cbo1.split(' - ') : [];
        const cbo2Array = cbo2 ? cbo2.split(' - ') : [];

        // Làm phẳng danh sách thí sinh nếu tồn tại
        const flatDanhSachThiSinh = danhSachThiSinh ? danhSachThiSinh.flat() : [];

        // Trích xuất mảng tenPhong từ phong
        const flatPhong = phong ? phong.map(p => p.tenPhong).flat() : [];

        const flatSoLuong = Array.isArray(soLuong) ? soLuong.flat() : [soLuong];

        // Tìm và cập nhật nếu tồn tại, nếu không thì tạo mới
        const updatedItem = await PcCoiThi.findOneAndUpdate(
          { id: _id },
          {
            $set: {
              maHocPhan,
              hocPhan,
              ca,
              cbo1: cbo1Array, // Lưu mảng thay vì chuỗi
              cbo2: cbo2Array, // Lưu mảng thay vì chuỗi
              phong: flatPhong, // Lưu mảng chỉ chứa tenPhong
              ngayThi,
              loaiDaoTao,
              hinhThuc,
              thoiGian,
              lop,
              namHoc,
              loaiKyThi,
              ky: hocKy,
              tc,
              diaDiem,
              soLuong: flatSoLuong,
              danhSachThiSinh: flatDanhSachThiSinh // Sử dụng danh sách đã được làm phẳng
            }
          },
          { new: true, upsert: true }
        );

        return updatedItem;
      })
    );


    // Trả về danh sách đã xử lý
    return new Response(JSON.stringify({}), { status: 201 });

  } catch (err) {
    console.error("Lỗi khi xử lý yêu cầu:", err);
    return new Response(JSON.stringify({ message: "Failed to process" }), { status: 500 });
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