"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { 
  DashboardOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  BookOutlined, 
  FormOutlined, 
  FileTextOutlined, 
  MailFilled, 
  SolutionOutlined, 
  TeamOutlined, 
  DatabaseOutlined, 
  PieChartOutlined
} from "@ant-design/icons";

const SideBar = () => {
  const pathname = usePathname();

  const iconStyles = {
    dashboard: { color: pathname === "/admin/dashboard" ? "red" : "orange" },
    coiThi: { color: pathname === "/admin/pc-coi-thi" ? "red" : "purple" },
    chamThi: { color: pathname === "/admin/pc-cham-thi" ? "red" : "teal" },
    thongKeCoiThi: { color: pathname === "/admin/thong-ke-coi-thi" ? "red" : "aqua" },
    thongKeChamThi: { color: pathname === "/admin/thong-ke-cham-thi" ? "red" : "lightgreen" },
    hocPhanThi: { color: pathname === "/admin/hoc-phan-thi" ? "red" : "darkgreen" },
    phongThi: { color: pathname === "/admin/phong-thi" ? "red" : "blue" },
    giangVien: { color: pathname === "/admin/giang-vien-coi-thi" ? "red" : "darkblue" },
    user: { color: pathname === "/admin/user" ? "red" : "violet" },
    khoa: { color: pathname === "/admin/khoa" ? "red" : "darkorange" },
    email: { color: pathname === "/admin/email" ? "red" : "pink" },
  };

  const textColor = (path) => (pathname === path ? "text-red-500" : "text-gray-800");

  return (
    <div className="flex flex-col gap-3 bg-white shadow-xl py-3 px-2 rounded-xl mt-2 h-[90vh] font-semibold overflow-y-auto text-[14px]">
      <h2 className="text-xl font-bold text-gray-800 mb-4">ADMIN</h2>
      
      <Link href="/admin/dashboard" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/dashboard")}`}>
        <DashboardOutlined style={{ fontSize: "20px", ...iconStyles.dashboard }} />
        <span>Dashboard</span>
      </Link>
      
      <Link href="/admin/pc-coi-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/pc-coi-thi")}`}>
        <ClockCircleOutlined style={{ fontSize: "20px", ...iconStyles.coiThi }} />
        <span>Phân công coi thi</span>
      </Link>
      
      <Link href="/admin/pc-cham-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/pc-cham-thi")}`}>
        <FileTextOutlined style={{ fontSize: "20px", ...iconStyles.chamThi }} />
        <span>Quản lý chấm thi</span>
      </Link>

      <Link href="/admin/thong-ke-coi-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/thong-ke-coi-thi")}`}>
        <PieChartOutlined style={{ fontSize: "20px", ...iconStyles.thongKeCoiThi }} />
        <span>Quản lý coi thi</span>
      </Link>

      {/* <Link href="/admin/thong-ke-cham-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/thong-ke-cham-thi")}`}>
        <DatabaseOutlined style={{ fontSize: "20px", ...iconStyles.thongKeChamThi }} />
        <span>Thống kê chấm thi</span>
      </Link> */}
      
      <Link href="/admin/hoc-phan-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/hoc-phan-thi")}`}>
        <BookOutlined style={{ fontSize: "20px", ...iconStyles.hocPhanThi }} />
        <span>Học phần thi</span>
      </Link>
      
      <Link href="/admin/phong-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/phong-thi")}`}>
        <FormOutlined style={{ fontSize: "20px", ...iconStyles.phongThi }} />
        <span>Phòng thi</span>
      </Link>
      
      <Link href="/admin/user" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/user")}`}>
        <TeamOutlined style={{ fontSize: "20px", ...iconStyles.user }} />
        <span>Quản lý người dùng</span>
      </Link>
      
      <Link href="/admin/khoa" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/khoa")}`}>
        <BookOutlined style={{ fontSize: "20px", ...iconStyles.khoa }} />
        <span>Quản lý khoa</span>
      </Link>

      <Link href="/admin/send-email" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/send-email")}`}>
        <MailFilled style={{ fontSize: "20px", ...iconStyles.email }} />
        <span>Gửi Email</span>
      </Link>
    </div>
  );
};

export default SideBar;
