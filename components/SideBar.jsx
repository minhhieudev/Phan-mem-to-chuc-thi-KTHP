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

  const iconStyles = {
    dashboard: { color: pathname === "/admin/dashboard" ? "red" : "orange" },
    coiThi: { color: pathname === "/admin/pc-coi-thi" ? "red" : "purple" },
    chamThi: { color: pathname === "/admin/pc-cham-thi" ? "red" : "teal" },
    hocPhanThi: { color: pathname === "/admin/hoc-phan-thi" ? "red" : "green" },
    phongThi: { color: pathname === "/admin/phong-thi" ? "red" : "blue" },
    giangVien: { color: pathname === "/admin/user" ? "red" : "blue" },
    khoa: { color: pathname === "/admin/khoa" ? "red" : "green" },
    email: { color: pathname === "/admin/email" ? "red" : "pink" },
    nhomLop: { color: pathname === "/admin/nhom-lop" ? "red" : "brown" }, 
  };

  const textColor = (path) => (pathname === path ? "text-red-500" : "text-gray-800");

  return (
    <div className="flex flex-col gap-4 bg-white shadow-xl p-6 rounded-xl mt-3 h-[85vh] font-semibold overflow-y-auto">
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
        <span>Phân công chấm thi</span>
      </Link>

      <Link href="/admin/thong-ke-coi-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/thong-ke-coi-thi")}`}>
        <FileTextOutlined style={{ fontSize: "20px", ...iconStyles.chamThi }} />
        <span>Thống kê coi thi</span>
      </Link>

      <Link href="/admin/thong-ke-cham-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/thong-ke-cham-thi")}`}>
        <FileTextOutlined style={{ fontSize: "20px", ...iconStyles.chamThi }} />
        <span>Thống kê chấm thi</span>
      </Link>
      
      <Link href="/admin/hoc-phan-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/hoc-phan-thi")}`}>
        <BookOutlined style={{ fontSize: "20px", ...iconStyles.hocPhanThi }} />
        <span>Học phần thi</span>
      </Link>

      {/* <Link href="/admin/nhom-lop" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/nhom-lop")}`}>
        <BookOutlined style={{ fontSize: "20px", ...iconStyles.nhomLop }} />
        <span>Nhóm / Lớp</span>
      </Link> */}
      
      <Link href="/admin/phong-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/phong-thi")}`}>
        <FormOutlined style={{ fontSize: "20px", ...iconStyles.phongThi }} />
        <span>Phòng thi</span>
      </Link>
      
      <Link href="/admin/giang-vien-coi-thi" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/user")}`}>
        <UserOutlined style={{ fontSize: "20px", ...iconStyles.giangVien }} />
        <span>Giảng viên </span>
      </Link>

      <Link href="/admin/user" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/user")}`}>
        <UserOutlined style={{ fontSize: "20px", ...iconStyles.giangVien }} />
        <span>User</span>
      </Link>
      
      <Link href="/admin/khoa" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/khoa")}`}>
        <BookOutlined style={{ fontSize: "20px", ...iconStyles.khoa }} />
        <span>Khoa</span>
      </Link>

      <Link href="/admin/email" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2 ${textColor("/admin/email")}`}>
        <MailFilled style={{ fontSize: "20px", ...iconStyles.email }} />
        <span>Gửi Email</span>
      </Link>
    </div>
  );
};

export default SideBar;
