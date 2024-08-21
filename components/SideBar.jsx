"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { DashboardOutlined, ClockCircleOutlined, UserOutlined, BookOutlined ,MailOutlined } from "@ant-design/icons";

const SideBar = () => {
  const pathname = usePathname();

  // Tạo class "active" nếu đường dẫn hiện tại khớp với danh sách đường dẫn menu
  const getIconStyle = (paths) => 
    paths.includes(pathname) ? { color: 'red' } : { color: 'gray' };

  return (
    <div className="flex flex-col gap-4 bg-white shadow-xl p-6 rounded-xl mt-3 h-[85vh] font-semibold">
      <h2 className="text-xl font-bold text-gray-800 mb-4">ADMIN</h2>
      <Link href="/admin/dashboard" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2`}>
        <DashboardOutlined style={{ fontSize: "20px" }} className="text-orange-500"/>
        <span style={getIconStyle(["/admin/dashboard", "/admin"])}>Dashboard</span>
      </Link>
      <Link href="/admin/work-hours" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2`}>
        <ClockCircleOutlined style={{ fontSize: "20px" }} className="text-yellow-500"/>
        <span style={getIconStyle(["/admin/work-hours"])}>Xem chi tiết</span>
      </Link>
      <Link href="/admin/user" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2`}>
        <UserOutlined style={{ fontSize: "20px" }} className="text-blue-500"/>
        <span style={getIconStyle(["/admin/user"])}>User</span>
      </Link>
      <Link href="/admin/khoa" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2`}>
        <BookOutlined style={{ fontSize: "20px" }} className="text-green-500"/>
        <span style={getIconStyle(["/admin/khoa"])}>Khoa</span>
      </Link>
      <Link href="/admin/khoa" className={`flex items-center gap-3 p-3 rounded-lg transition border-b-2`}>
        <MailOutlined  style={{ fontSize: "20px" }} className="text-green-500"/>
        <span style={getIconStyle(["/admin/khoa"])}>Email</span>
      </Link>
    </div>
  );
};

export default SideBar;
