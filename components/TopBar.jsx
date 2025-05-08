"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Logout } from "@mui/icons-material";


const TopBar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    signOut({ callbackUrl: window.location.origin }); // Trở lại trang chủ
  };

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="topbar">
      <div className="flex items-center gap-2">
        <Link href="/home">
          <img src="https://upload.wikimedia.org/wikipedia/vi/2/2e/Dai_hoc_phu_yen_logo.png" alt="logo" className="logo" />
        </Link>
        <div className="max-sm:hidden">
          <div className="font-bold">TRƯỜNG ĐẠI HỌC PHÚ YÊN</div>
          <p className="text-[12px] ml-1">PHẦN MỀM HỖ TRỢ TỔ CHỨC THI KTHP</p>
        </div>
      </div>

      <div className="menu">
        {/* {user?.role == 'admin' &&
          <Link
            href="/admin"
            className={`${pathname === "/admin" ? "text-red-1" : ""
              } text-heading4-bold`}
          >
            Admin
          </Link>} */}
        <div className="text-heading4-bold  text-green-600 max-sm:text-base-bold ">
          {user?.username}
        </div>

        <Link href="/profile">
          <img
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile"
            className="profilePhoto"
          />
        </Link>

        <Logout
          sx={{ color: "#737373", cursor: "pointer" }}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default TopBar;
