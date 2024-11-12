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

    if (loaiKyThi) {
      filter.loaiKyThi = loaiKyThi;
    }
    if (namHoc) {
      filter.namHoc = namHoc;
    }
    if (ky && ky !== 'null' && ky !== 'undefined') {
      filter.ky = ky;
    }
    if (loai) {
      filter.loai = loai;
    }

    // Lấy danh sách phân công chấm thi
    const assignments = await PcChamThi.find(filter);

    // Tính tổng số bài từ trường 'soBai'
    const totalSoBai = assignments.reduce((total, assignment) => {
      // Kiểm tra và cộng dồn trường 'soBai'
      return total + (Number(assignment.soBai) || 0);
    }, 0);

    // Trả về kết quả tổng số bài
    return new Response(JSON.stringify({ totalSoBai }), { status: 200 });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách phân công chấm thi:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};
