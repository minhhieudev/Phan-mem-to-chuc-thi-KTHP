export const dynamic = 'force-dynamic';

import { connectToDB } from '@mongodb';
import PcChamThi from '@models/PcChamThi';

export const GET = async (req) => {
  try {
    await connectToDB();

    // Kiểm tra xem req.url có tồn tại không
   // const url = req.url || 'http://localhost'; // hoặc một URL mặc định nào đó
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
    
    const assignments = await PcChamThi.find(filter);

    return new Response(JSON.stringify(assignments), { status: 200 });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách phân công chấm thi:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};
