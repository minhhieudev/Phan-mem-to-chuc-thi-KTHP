import User from "@models/User";
import { connectToDB } from "@mongodb";
export const dynamic = 'force-dynamic';

export const GET = async (req, res) => {
  try {
    await connectToDB();

    const usersWithUserRole = await User.find({ role: 'user' });

    return new Response(JSON.stringify(usersWithUserRole), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get users with 'user' role", { status: 500 });
  }
};
