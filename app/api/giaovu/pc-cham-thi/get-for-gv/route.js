import { connectToDB } from '@mongodb';
import PcChamThi from "@models/PcChamThi";


export const GET = async (req) => {
  try {
    await connectToDB();
    
    // Lấy các tham số từ query
    const { searchParams } = new URL(req.url);
    const namHoc = searchParams.get('namHoc');
    const ky = searchParams.get('ky');
    //const gvGiangDay = searchParams.get('gvGiangDay');
    const gvGiangDay = 'Nguyễn Quốc Dũng'

    // Tạo đối tượng điều kiện tìm kiếm
    let filter = {};
    
    // Nếu có tham số namHoc, thêm vào điều kiện tìm kiếm
    if (namHoc) {
      filter.namHoc = namHoc;
    }

    // Nếu có tham số ky, thêm vào điều kiện tìm kiếm
    if (ky) {
      filter.ky = ky;
    }

    if (gvGiangDay) {
      filter.gvGiangDay = gvGiangDay;
    }

    // Nếu không có cả namHoc lẫn ky thì trả về lỗi
    if (!namHoc && !ky) {
      return new Response("Thiếu tham số namHoc hoặc kiHoc.", { status: 400 });
    }

    // Tìm kiếm các bản ghi phân công giảng dạy theo điều kiện filter
    const PcChamThis = await PcChamThi.find(filter);

    // Trả về phản hồi thành công
    return new Response(JSON.stringify(PcChamThis), { status: 200 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Error fetching PcChamThi:", err);
    return new Response(`Lỗi: ${err.message}`, { status: 500 });
  }
};

