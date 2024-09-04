"use client";

import Loader from "@components/Loader";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Table, Select, Progress, Input } from "antd";

const { Option } = Select;

const Home = () => {
  const { data: session } = useSession();
  const user = session?.user;



  return  (
    <div className="profile-page bg-white w-[40%] rounded-md shadow-md mx-auto p-4">
      <h1 className="text-heading3-bold">HOME</h1>

      
    </div>
  );
};

export default Home;
