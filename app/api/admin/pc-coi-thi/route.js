export const dynamic = 'force-dynamic';
import { connectToDB } from '@mongodb';
import PcCoiThi from '@models/PcCoiThi';
import { getHeaders } from '../../../../lib/cors';  // Import hàm getHeaders

const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Lấy URL từ biến môi trường

export const GET = async (req) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const namHoc = searchParams.get('namHoc');
    const loaiKyThi = searchParams.get('loaiKyThi');
    const loai = searchParams.get('loai');
    const hocKy = searchParams.get('hocKy');


    let filter = {};
    if (loaiKyThi && loaiKyThi !== 'null' && loaiKyThi !== 'undefined') filter.loaiKyThi = loaiKyThi;
    if (namHoc) filter.namHoc = namHoc;
    if (loai) filter.loaiDaoTao = loai;
    if (hocKy && hocKy !== 'null' && hocKy !== 'undefined') filter.ky = hocKy;

    const assignments = await PcCoiThi.find(filter);

    return new Response(JSON.stringify(assignments), {
      status: 200,
      headers: getHeaders(),  // Sử dụng hàm getHeaders
    });
  } catch (err) {
    console.error("Error fetching assignments:", err);
    return new Response(JSON.stringify({ message: `Error: ${err.message}` }), {
      status: 500,
      headers: getHeaders(),  // Sử dụng hàm getHeaders
    });
  }
};

// Xử lý yêu cầu preflight
export const OPTIONS = () => {
  return new Response(null, {
    status: 204,
    headers: getHeaders(),  // Sử dụng hàm getHeaders
  });
};

export const POST = async (req) => {
  try {
    await connectToDB();

    const data = await req.json();

    const transformedData = {
      hocPhan: data.hocPhan.split(',').map(item => item.trim()),
      lop: data.lop.split(',').map(item => item.trim()),
      ngayThi: data.ngayThi,
      ca: data.ca || 0,
      cbo1: data.cbo1.split(',').map(item => item.trim()),
      cbo2: data.cbo2.split(',').map(item => item.trim()),
      thoiGian: data.thoiGian.split(',').map(item => item.trim()),
      phong: data.phong.split(',').map(item => item.trim()),
      diaDiem: data.diaDiem || '',
      ghiChu: data.ghiChu || '',
      namHoc: data.namHoc,
      loaiKyThi: data.loaiKyThi,
      hocKy: data.hocKy,
      hinhThuc: data.hinhThuc.split(',').map(item => item.trim()),
      tc: data.tc.split(',').map(item => item.trim()),
      loai: data.loai || ""
    };

    const { hocPhan, lop, ngayThi, namHoc, loaiKyThi } = transformedData;
    if (!hocPhan || !lop || !ngayThi || !namHoc || !loaiKyThi) {
      return new Response(JSON.stringify({ message: "Dữ liệu không hợp lệ, vui lòng điền đầy đủ các trường bắt buộc." }), {
        status: 400,
        headers: getHeaders(),  // Sử dụng hàm getHeaders
      });
    }

    const newAssignment = new PcCoiThi(transformedData);
    await newAssignment.save();

    return new Response(JSON.stringify(newAssignment), {
      status: 201,
      headers: getHeaders(),  // Sử dụng hàm getHeaders
    });
  } catch (err) {
    console.error("Lỗi khi thêm mới bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), {
      status: 500,
      headers: getHeaders(),  // Sử dụng hàm getHeaders
    });
  }
};

export const PUT = async (req) => {
  try {
    await connectToDB();

    const { id, ...data } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ message: "ID bản ghi không được cung cấp." }), {
        status: 400,
        headers: getHeaders(),
      });
    }

    // Convert cbo1 and cbo2 to arrays, if they are provided as strings
    const transformedData = {
      ...data,
      cbo1: data.cbo1 ? data.cbo1.split(',').map(item => item.trim()) : [],
      cbo2: data.cbo2 ? data.cbo2.split(',').map(item => item.trim()) : []
    };

    const updatedAssignment = await PcCoiThi.findByIdAndUpdate(id, transformedData, { new: true });
    if (!updatedAssignment) {
      return new Response(JSON.stringify({ message: "Không tìm thấy bản ghi để cập nhật." }), {
        status: 404,
        headers: getHeaders(),
      });
    }

    return new Response(JSON.stringify(updatedAssignment), {
      status: 200,
      headers: getHeaders(),
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), {
      status: 500,
      headers: getHeaders(),
    });
  }
};


export const DELETE = async (req) => {
  try {
    await connectToDB();

    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ message: "ID bản ghi không được cung cấp." }), {
        status: 400,
        headers: getHeaders(),  // Sử dụng hàm getHeaders
      });
    }

    const deletedAssignment = await PcCoiThi.findByIdAndDelete(id);
    if (!deletedAssignment) {
      return new Response(JSON.stringify({ message: "Không tìm thấy bản ghi để xóa." }), {
        status: 404,
        headers: getHeaders(),  // Sử dụng hàm getHeaders
      });
    }

    return new Response(JSON.stringify({ message: "Bản ghi đã được xóa thành công." }), {
      status: 200,
      headers: getHeaders(),  // Sử dụng hàm getHeaders
    });
  } catch (err) {
    console.error("Lỗi khi xóa bản ghi phân công giảng dạy:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), {
      status: 500,
      headers: getHeaders(),  // Sử dụng hàm getHeaders
    });
  }
};
