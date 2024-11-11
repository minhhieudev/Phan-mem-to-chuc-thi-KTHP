import HocPhanThi from "@models/HocPhanThi";
import { connectToDB } from "@mongodb";
export const dynamic = 'force-dynamic';

export const POST = async (req) => {
  try {
    await connectToDB();

    const { hocPhans } = await req.json();

    console.log("Dữ liệu nhận được:", hocPhans);

    if (!hocPhans || !Array.isArray(hocPhans)) {
      return new Response(JSON.stringify({ message: "Invalid data format" }), { status: 400 });
    }

    const processedUsers = await Promise.all(
      hocPhans.map(async (hp) => {
        const maHocPhan = hp[0];

        const updatedUser = await HocPhanThi.findOneAndUpdate(
          { maHocPhan },
          {
            tenHocPhan: hp[1], 
            soTinChi: hp[2],
            hinhThuc: hp[3],
            thoiGian: hp[4],
           
          },
          { new: true, upsert: true } 
        );

        return updatedUser;
      })
    );

    return new Response(JSON.stringify(processedUsers), { status: 201 });

  } catch (err) {
    console.error("Lỗi khi xử lý yêu cầu:", err);
    return new Response(JSON.stringify({ message: "Failed to process hocphans" }), { status: 500 });
  }
};
