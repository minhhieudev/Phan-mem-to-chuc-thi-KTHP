"use client";

import React, { useEffect, useState } from "react";
import { Card, Select, message } from "antd";
import { useSession } from "next-auth/react";
import {
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Home = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const gv = "Nguyễn Quốc Dũng";

  const [selectNamHoc, setSelectNamHoc] = useState("2024-2025");
  const [selectKy, setSelectKy] = useState("1");

  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `/api/users/get-lich?namHoc=${selectNamHoc}&ky=${selectKy}&user=${gv}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setListData(data);
      } else {
        message.error("Failed to fetch data");
      }
      setLoading(false);
    } catch (error) {
      console.log("Error:", error);
      message.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [selectNamHoc, selectKy, user]);

  // Danh sách màu cố định
  const colorList = [
    "#3498db", // Xanh dương
    "#e74c3c", // Đỏ
    "#2ecc71", // Xanh lá
    "#f1c40f", // Vàng
    "#9b59b6", // Tím
    "#e67e22", // Cam
  ];

  return (
    <div className="bg-white w-[80%] rounded-md shadow-md mx-auto p-4 mt-5 h-[75vh]">
      <h1 className="text-heading3-bold mb-4 text-center text-2xl font-bold">
        DANH SÁCH MÔN THI
      </h1>

      {/* Select cho năm học và kỳ */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="font-bold flex gap-3">
          <label htmlFor="namHoc" className="block text-sm text-gray-700 mb-1">
            Năm học
          </label>
          <Select
            id="namHoc"
            value={selectNamHoc}
            onChange={(value) => setSelectNamHoc(value)}
            className="w-48"
            placeholder="Chọn năm học"
          >
            <Option value="2024-2025">2024-2025</Option>
            <Option value="2023-2024">2023-2024</Option>
            <Option value="2022-2023">2022-2023</Option>
          </Select>
        </div>

        <div className="font-bold flex gap-3">
          <label htmlFor="ky" className="block text-sm text-gray-700 mb-1">
            Kỳ
          </label>
          <Select
            id="ky"
            value={selectKy}
            onChange={(value) => setSelectKy(value)}
            className="w-32"
            placeholder="Chọn kỳ"
          >
            <Option value="1">Kỳ 1</Option>
            <Option value="2">Kỳ 2</Option>
          </Select>
        </div>
      </div>

      {/* Hiển thị danh sách các môn thi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listData.map((exam, index) => (
          <Card
            key={index}
            title={exam.hocPhan.toUpperCase()} 
            className="rounded-lg shadow-lg overflow-hidden"
            style={{
              backgroundColor: colorList[index % colorList.length], // Áp dụng màu từ danh sách màu
              borderRadius: "12px",
              transition: "transform 0.3s ease",
            }}
            hoverable
            onClick={() => alert(`Bạn đã chọn môn: ${exam.hocPhan}`)}
          >
            <div className="p-4">
              <p className="text-white mb-1 text-lg font-bold">
                <CalendarOutlined /> Ngày thi: {exam.ngayThi}
              </p>
              <p className="text-white mb-1 text-lg font-bold">
                <TeamOutlined /> Cán bộ coi thi 1: {exam.cbo1}
              </p>
              <p className="text-white mb-1 text-lg font-bold">
                <TeamOutlined /> Cán bộ coi thi 2: {exam.cbo2}
              </p>
              <p className="text-white mb-1 text-lg font-bold">
                <ClockCircleOutlined /> Ca thi: {exam.ca}
              </p>
              <p className="text-white text-lg font-bold">
                <HomeOutlined /> Phòng thi: {exam.phong}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
