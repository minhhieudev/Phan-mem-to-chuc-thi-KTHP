export const dynamic = 'force-dynamic';
import User from "@models/User";
import Khoa from "@models/Khoa";
import { connectToDB } from "@mongodb";


export const GET = async (req, res) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const gvKhoa = searchParams.get('khoa');


    const userInfo = await User.findOne({ role: 'user', username: gvKhoa });

    const usersWithUserRole = await User.find({ role: 'user', khoa: userInfo.khoa });

    return new Response(JSON.stringify(usersWithUserRole), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get users with khoa", { status: 500 });
  }
};
