export const dynamic = 'force-dynamic';
import { connectToDB } from '@mongodb';
import HocPhanThi from '@models/HocPhanThi';

export const POST = async (req) => {
  try {
    await connectToDB();

    const { data } = await req.json();
    const trimmedData = data.map(item => item.trim());

    // Lấy các đối tượng có 'maHocPhan' nằm trong mảng 'data'
    const hocPhanList = await HocPhanThi.find({
      maHocPhan: {
        $in: trimmedData.map(ma => new RegExp(`^${ma}$`, 'i')) // 'i' cho phép không phân biệt chữ hoa/chữ thường
      }
    });
    

    // Trả về phản hồi thành công với danh sách các đối tượng tìm được
    return new Response(JSON.stringify(hocPhanList), { status: 200 });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách thông tin học phần:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};
