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
  MailFilled 
} from "@ant-design/icons";

const SideBar = () => {
  const pathname = usePathname();

  // Đặt màu sắc riêng cho mỗi icon
  const iconStyles = {
    dashboard: { color: pathname === "/admin/dashboard" ? "red" : "orange" },
    coiThi: { color: pathname === "/admin/pc-coi-thi" ? "red" : "purple" },
    chamThi: { color: pathname === "/admin/pc-cham-thi" ? "red" : "teal" },
    hocPhanThi: { color: pathname === "/admin/hoc-phan-thi" ? "red" : "green" },
    phongThi: { color: pathname === "/admin/phong-thi" ? "red" : "blue" },
    giangVien: { color: pathname === "/admin/user" ? "red" : "blue" },
    khoa: { color: pathname === "/admin/khoa" ? "red" : "green" },
    email: { color: pathname === "/admin/email" ? "red" : "pink" },
    nhomLop: { color: pathname === "/admin/hoc-phan-thi" ? "red" : "brown" }, // Màu nâu cho "Nhóm / Lớp"
  };

  return (
    <div className="flex flex-col gap-4 bg-white shadow-xl p-6 rounded-xl mt-3 h-[85vh] font-semibold overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">ADMIN</h2>
      
      <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg transition border-b-2">
        <DashboardOutlined style={{ fontSize: "20px", ...iconStyles.dashboard }} />
        <span>Dashboard</span>
      </Link>
      
      <Link href="/admin/pc-coi-thi" className="flex items-center gap-3 p-3 rounded-lg transition border-b-2">
        <ClockCircleOutlined style={{ fontSize: "20px", ...iconStyles.coiThi }} />
        <span>Phân công coi thi</span>
      </Link>
      
      <Link href="/admin/pc-cham-thi" className="flex items-center gap-3 p-3 rounded-lg transition border-b-2">
        <FileTextOutlined style={{ fontSize: "20px", ...iconStyles.chamThi }} />
        <span>Phân công chấm thi</span>
      </Link>
      
      <Link href="/admin/hoc-phan-thi" className="flex items-center gap-3 p-3 rounded-lg transition border-b-2">
        <BookOutlined style={{ fontSize: "20px", ...iconStyles.hocPhanThi }} />
        <span>Học phần thi</span>
      </Link>

      <Link href="/admin/nhom-lop" className="flex items-center gap-3 p-3 rounded-lg transition border-b-2">
        <BookOutlined style={{ fontSize: "20px", ...iconStyles.nhomLop }} />
        <span>Nhóm / Lớp</span>
      </Link>
      
      <Link href="/admin/phong-thi" className="flex items-center gap-3 p-3 rounded-lg transition border-b-2">
        <FormOutlined style={{ fontSize: "20px", ...iconStyles.phongThi }} />
        <span>Phòng thi</span>
      </Link>
      
      <Link href="/admin/user" className="flex items-center gap-3 p-3 rounded-lg transition border-b-2">
        <UserOutlined style={{ fontSize: "20px", ...iconStyles.giangVien }} />
        <span>Giảng viên</span>
      </Link>
      
      <Link href="/admin/khoa" className="flex items-center gap-3 p-3 rounded-lg transition border-b-2">
        <BookOutlined style={{ fontSize: "20px", ...iconStyles.khoa }} />
        <span>Khoa</span>
      </Link>

      <Link href="/admin/email" className="flex items-center gap-3 p-3 rounded-lg transition border-b-2">
        <MailFilled style={{ fontSize: "20px", ...iconStyles.email }} />
        <span>Gửi Email</span>
      </Link>

     
    </div>
  );
};

export default SideBar;
