export const dynamic = 'force-dynamic';
import { connectToDB } from "@mongodb";
import NhomLop from "@models/NhomLop";

const Model = NhomLop;

export const GET = async (req, res) => {
  try {
    await connectToDB();

    const all = await Model.find().populate('khoa');

    return new Response(JSON.stringify(all), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get all classes", { status: 500 });
  }
};

export const POST = async (req, res) => {
  try {
    await connectToDB();
    const { tenLop, soSV, khoa } = await req.json();

    // Kiểm tra lớp học có tồn tại không, nếu có thì cập nhật, nếu không thì tạo mới
    let existing = await Model.findOne({ tenLop });

    if (existing) {
      existing.soSV = soSV;
      existing.khoa = khoa;
      await existing.save();

      return new Response(JSON.stringify(existing), { status: 200 });
    } else {
      const news = new Model({
        tenLop,
        soSV,
        khoa
      });

      await news.save();
      return new Response(JSON.stringify(news), { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return new Response("Failed to create or update class", { status: 500 });
  }
};

export const PUT = async (req, res) => {
  try {
    await connectToDB();
    const {  tenLop, soSV, khoa } = await req.json();

    const Update = await Model.findById(id);

    if (!Update) {
      return new Response("Class not found", { status: 404 });
    }

    Update.tenLop = tenLop;
    Update.soSV = soSV;
    Update.khoa = khoa;

    await Update.save();

    return new Response(JSON.stringify(Update), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update class", { status: 500 });
  }
};

export const DELETE = async (req, res) => {
  try {
    await connectToDB();
    const { id } = await req.json();

    const Delete = await Model.findByIdAndDelete(id);

    if (!Delete) {
      return new Response("Class not found", { status: 404 });
    }

    return new Response("Class deleted successfully", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to delete class", { status: 500 });
  }
};
