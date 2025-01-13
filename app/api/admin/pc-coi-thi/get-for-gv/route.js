export const dynamic = 'force-dynamic';
import { connectToDB } from '@mongodb';
import PcCoiThi from "@models/PcCoiThi";
import { getHeaders } from '../../../../../lib/cors';  


export const GET = async (req) => {
  try {
    await connectToDB();
    
    // Lấy các tham số từ query
    const { searchParams } = new URL(req.url);
    const namHoc = searchParams.get('namHoc');

    const ky = searchParams.get('ky');
    //const gvGiangDay = searchParams.get('gvGiangDay');
    const cb = searchParams.get('gvGiangDay') || 'Nguyễn Quốc Dũng';

    let filter = {};
    
    if (namHoc) {
      filter.namHoc = namHoc;
    }

    if (ky) {
      filter.ky = ky;
    }

   
    if (cb) {
      filter.$or = [
        { cb1: { $regex: cb, $options: 'i' } },
        { cb2: { $regex: cb, $options: 'i' } }
      ];
    }

    // if (!namHoc ) {
    //   return new Response("Thiếu tham số namHoc .", { status: 400 });
    // }

    const pcGiangDays = await PcCoiThi.find(filter);

    return new Response(JSON.stringify(pcGiangDays), {
      status: 200,
      headers: getHeaders(),  // Sử dụng hàm getHeaders
    });
  } catch (err) {
    console.error("Error fetching PcCoiThi:", err);
    return new Response(`Lỗi: ${err.message}`, {  status: 500,
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
