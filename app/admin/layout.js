import { Inter } from "next/font/google";
import SideBar from "@components/SideBar";
import TopBar from "@components/TopBar";
import "../globals.css";
import Provider from "@components/Provider";
import { Toaster } from "react-hot-toast"; // Import Toaster từ react-hot-toast

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Phần mềm tổ chức thi KTHP",
  description: "TRƯỜNG ĐẠI HỌC PHÚ YÊN ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-200`}>
        <Provider>
          <TopBar />
          <div className="flex justify-between  ml-1">
            <div className="w-[14%]"><SideBar /></div>
            <div className="w-[85%] mx-auto h-[90vh]">{children}</div>
          </div>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
