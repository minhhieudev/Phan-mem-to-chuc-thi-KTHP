import { Inter } from "next/font/google";
import SideBar from "@components/SideBar";
import TopBar from "@components/TopBar";
import "../globals.css";
import Provider from "@components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hệ thống quản lý giờ lao động",
  description: "TRƯỜNG ĐẠI HỌC PHÚ YÊN ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-200`}>
        <Provider>
          <TopBar />
          <div className="flex justify-between h-[45vh] ml-3">
            <div className="w-[15%]"><SideBar /></div>
            <div className="w-[83%] mx-auto">{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
