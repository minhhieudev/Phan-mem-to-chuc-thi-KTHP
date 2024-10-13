import { connectToDB } from '@mongodb';
import PcChamThi from '@models/PcChamThi';

export const GET = async (req) => {
  try {
    await connectToDB();

    // Lấy query parameters từ request
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('user');
    const namHoc = searchParams.get('namHoc');
    const ky = searchParams.get('ky');

    // Tạo đối tượng điều kiện tìm kiếm
    let filter = {};

    // Kiểm tra và thêm điều kiện tìm kiếm nếu có
    if (namHoc) {
      filter.namHoc = namHoc;
    }

    if (ky && ky !== 'null'&& ky !== 'undefined') {
      filter.ky = ky;
    }

    // Kiểm tra điều kiện username cho cán bộ coi thi 1 hoặc 2
    if (username) {
      filter.$or = [
        { cb1: { $regex: username, $options: 'i' } },
        { cb2: { $regex: username, $options: 'i' } }
      ];
    }

    // Tìm dữ liệu từ cơ sở dữ liệu
    const listData = await PcChamThi.find(filter);

    // Trả về phản hồi thành công với dữ liệu đã tìm
    return new Response(JSON.stringify(listData), { status: 200 });
  } catch (err) {
    // Bắt lỗi và trả về phản hồi lỗi
    console.error("Lỗi khi lấy danh sách phân công chấm thi:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};
