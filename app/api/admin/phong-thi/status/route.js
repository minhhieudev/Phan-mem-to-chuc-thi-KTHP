export const dynamic = 'force-dynamic';
import PhongThi from "@models/PhongThi"; // Import mô hình PhongThi
import { connectToDB } from "@mongodb";

// Lưu mô hình vào biến
const PhongThiModel = PhongThi;

export const GET = async (req, res) => {
  try {
    await connectToDB();

    // Sử dụng biến PhongThiModel để truy vấn dữ liệu
    const allPhongThi = await PhongThiModel.find({ tinhTrang: 1 });

    return new Response(JSON.stringify(allPhongThi), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get all PhongThi", { status: 500 });
  }
};

