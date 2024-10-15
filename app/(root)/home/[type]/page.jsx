"use client";

import { useState, useEffect } from "react";
import { Row, Col, Button, Input, Tabs, Spin, Select, Card } from "antd";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import Loader from "@components/Loader";
import moment from "moment";

const Pages = () => {
  const { type } = useParams();
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { data: session } = useSession();

  const user = session?.user;

  const [selectNamHoc, setSelectNamHoc] = useState("2024-2025");
  const [selectKy, setSelectKy] = useState("1");
  const [listData, setListData] = useState([]);
  const [listData2, setListData2] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `/api/users/get-lich?namHoc=${selectNamHoc}&ky=${selectKy}&user=${user.username}`,
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
  const fetchData2 = async () => {
    try {
      const res = await fetch(
        `/api/users/get-lich/cham-thi?namHoc=${selectNamHoc}&ky=${selectKy}&user=${user.username}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setListData2(data);
        console.log("Error:", data);

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
      fetchData2();
    }
  }, [selectNamHoc, selectKy, user]);

  const getCardColor = (ngayThi) => {
    const today = moment();
    const examDate = moment(ngayThi, "DD/MM/YYYY");

    if (examDate.isBefore(today, "day")) {
      return "#d0d0d0";
    } else if (examDate.isSame(today, "day")) {
      return "#4a90e2";
    } else {
      return "#c9e7a0";
    }
  };

  // Nhóm dữ liệu theo màu
  const groupByColor = () => {
    const groups = {
      past: [],
      today: [],
      upcoming: [],
    };

    listData.forEach((item) => {
      const examDate = moment(item.ngayThi, "DD/MM/YYYY");
      if (examDate.isBefore(moment(), "day")) {
        groups.past.push(item);
      } else if (examDate.isSame(moment(), "day")) {
        groups.today.push(item);
      } else {
        groups.upcoming.push(item);
      }
    });

    return groups;
  };
  // Nhóm dữ liệu theo màu
  const groupByColor2 = () => {
    const groups = {
      past: [],
      today: [],
      upcoming: [],
    };

    listData2.forEach((item) => {
      const examDate = moment(item.ngayThi, "DD/MM/YYYY");
      if (examDate.isBefore(moment(), "day")) {
        groups.past.push(item);
      } else if (examDate.isSame(moment(), "day")) {
        groups.today.push(item);
      } else {
        groups.upcoming.push(item);
      }
    });

    return groups;
  };

  const groupedData = groupByColor();
  const groupedData2 = groupByColor2();

  const sortedGroupedData = {
    past: groupedData.past.sort((a, b) =>
      moment(a.ngayThi, "DD/MM/YYYY").diff(moment(b.ngayThi, "DD/MM/YYYY"))
    ),
    today: groupedData.today.sort((a, b) =>
      moment(a.ngayThi, "DD/MM/YYYY").diff(moment(b.ngayThi, "DD/MM/YYYY"))
    ),
    upcoming: groupedData.upcoming.sort((a, b) =>
      moment(a.ngayThi, "DD/MM/YYYY").diff(moment(b.ngayThi, "DD/MM/YYYY"))
    ),
  };
  const sortedGroupedData2 = {
    past: groupedData2.past.sort((a, b) =>
      moment(a.ngayThi, "DD/MM/YYYY").diff(moment(b.ngayThi, "DD/MM/YYYY"))
    ),
    today: groupedData2.today.sort((a, b) =>
      moment(a.ngayThi, "DD/MM/YYYY").diff(moment(b.ngayThi, "DD/MM/YYYY"))
    ),
    upcoming: groupedData2.upcoming.sort((a, b) =>
      moment(a.ngayThi, "DD/MM/YYYY").diff(moment(b.ngayThi, "DD/MM/YYYY"))
    ),
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="bg-white w-[95%] rounded-md shadow-md mx-auto p-4 mt-5 h-fit">
      <Button
        className="button-kiem-nhiem text-white font-bold shadow-md"
        onClick={() => router.push(`/home`)}
        size="small"
      >
        <div className="hover:color-blue "><ArrowLeftOutlined
          style={{
            color: 'white',
            fontSize: '18px',
          }}
        /> QUAY LẠI</div>
      </Button>
      {type == 'coi-thi' && (
        <div className="px-4">
          <div className="flex justify-center items-center mb-3">
            <h1 className="text-heading3-bold text-center text-3xl font-bold">
              LỊCH COI THI
            </h1>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
            <div className="font-bold flex flex-col">
              <label htmlFor="namHoc" className="block text-sm text-gray-700 mb-1">
                Năm học
              </label>
              <Select
                id="namHoc"
                value={selectNamHoc}
                onChange={(value) => setSelectNamHoc(value)}
                className="w-full md:w-48"
                placeholder="Chọn năm học"
              >
                <Option value="2024-2025">2024-2025</Option>
                <Option value="2023-2024">2023-2024</Option>
                <Option value="2022-2023">2022-2023</Option>
              </Select>
            </div>

            <div className="font-bold flex flex-col">
              <label htmlFor="ky" className="block text-sm text-gray-700 mb-1">
                Kỳ
              </label>
              <Select allowClear
                id="ky"
                value={selectKy}
                onChange={(value) => setSelectKy(value)}
                className="w-full md:w-32"
                placeholder="Chọn kỳ"
              >
                <Option value="1">1</Option>
                <Option value="2">2</Option>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            {sortedGroupedData.today.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-1">HÔM NAY</h3>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  {sortedGroupedData.today.map((exam, index) => (
                    <Card
                      key={index}
                      title={exam.hocPhan.toUpperCase()}
                      className="rounded-lg shadow-lg overflow-hidden w-full md:w-60"
                      style={{
                        backgroundColor: getCardColor(exam.ngayThi),
                        borderRadius: "12px",
                        transition: "transform 0.3s ease",
                      }}
                      hoverable
                      onClick={() => alert(`Bạn đã chọn môn: ${exam.hocPhan}`)}
                    >
                      <div className="p-4">
                        <p className="text-black mb-1 text-lg font-bold">
                          <CalendarOutlined /> Ngày thi: {exam.ngayThi}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ 1: {exam.cbo1}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ 2: {exam.cbo2}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <ClockCircleOutlined /> Ca thi: {exam.ca}
                        </p>
                        <p className="text-black text-lg font-bold">
                          <HomeOutlined /> Phòng thi: {exam.phong}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {sortedGroupedData.upcoming.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-1">SẮP DIỄN RA</h3>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  {sortedGroupedData.upcoming.map((exam, index) => (
                    <Card
                      key={index}
                      title={exam.hocPhan.toUpperCase()}
                      className="rounded-lg shadow-lg overflow-hidden w-full md:w-60"
                      style={{
                        backgroundColor: getCardColor(exam.ngayThi),
                        borderRadius: "12px",
                        transition: "transform 0.3s ease",
                      }}
                      hoverable
                      onClick={() => alert(`Bạn đã chọn môn: ${exam.hocPhan}`)}
                    >
                      <div className="p-4">
                        <p className="text-black mb-1 text-lg font-bold">
                          <CalendarOutlined /> Ngày thi: {exam.ngayThi}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ 1: {exam.cbo1}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ 2: {exam.cbo2}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <ClockCircleOutlined /> Ca thi: {exam.ca}
                        </p>
                        <p className="text-black text-lg font-bold">
                          <HomeOutlined /> Phòng thi: {exam.phong}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {sortedGroupedData.past.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-1">ĐÃ QUA</h3>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  {sortedGroupedData.past.map((exam, index) => (
                    <Card
                      key={index}
                      title={exam.hocPhan.toUpperCase()}
                      className="rounded-lg shadow-lg overflow-hidden w-full md:w-60"
                      style={{
                        backgroundColor: getCardColor(exam.ngayThi),
                        borderRadius: "12px",
                        transition: "transform 0.3s ease",
                      }}
                      hoverable
                      onClick={() => alert(`Bạn đã chọn môn: ${exam.hocPhan}`)}
                    >
                      <div className="p-4">
                        <p className="text-black mb-1 text-lg font-bold">
                          <CalendarOutlined /> Ngày thi: {exam.ngayThi}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ coi thi 1: {exam.cbo1}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ coi thi 2: {exam.cbo2}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <ClockCircleOutlined /> Ca thi: {exam.ca}
                        </p>
                        <p className="text-black text-lg font-bold">
                          <HomeOutlined /> Phòng thi: {exam.phong}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
          {listData == 0 && (
            <h2 className="font-bold text-center">Chưa có lịch </h2>

          )}
        </div>
      )}

      {type === 'cham-thi' && (
        <div>
          <div className="flex justify-center items-center mb-3">
            <h1 className="text-heading3-bold text-center text-3xl font-bold">LỊCH CHẤM THI</h1>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
            <div className="font-bold flex flex-col">
              <label htmlFor="namHoc" className="block text-sm text-gray-700 mb-1">
                Năm học
              </label>
              <Select
                id="namHoc"
                value={selectNamHoc}
                onChange={(value) => setSelectNamHoc(value)}
                className="w-full md:w-48"
                placeholder="Chọn năm học"
              >
                <Option value="2024-2025">2024-2025</Option>
                <Option value="2023-2024">2023-2024</Option>
                <Option value="2022-2023">2022-2023</Option>
              </Select>
            </div>

            <div className="font-bold flex flex-col">
              <label htmlFor="ky" className="block text-sm text-gray-700 mb-1">
                Kỳ
              </label>
              <Select allowClear
                id="ky"
                value={selectKy}
                onChange={(value) => setSelectKy(value)}
                className="w-full md:w-32"
                placeholder="Chọn kỳ"
              >
                <Option value="1">1</Option>
                <Option value="2">2</Option>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            {sortedGroupedData2.today.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-1">HÔM NAY</h3>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  {sortedGroupedData2.today.map((exam, index) => (
                    <Card
                      key={index}
                      title={exam.hocPhan.join(', ').toUpperCase()}
                      className="rounded-lg shadow-lg overflow-hidden"
                      style={{
                        backgroundColor: getCardColor(exam.ngayThi),
                        borderRadius: "12px",
                        transition: "transform 0.3s ease",
                      }}
                      hoverable
                    >
                      <div className="p-4">
                        <p className="text-black mb-1 text-lg font-bold">
                          <CalendarOutlined /> Ngày thi: {exam.ngayThi}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ 1: {exam.cb1}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ 2: {exam.cb2}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <ClockCircleOutlined /> Số bài: {exam.soBai}
                        </p>
                        <p className="text-black text-lg font-bold">
                          <HomeOutlined /> Loại kỳ thi: {exam.loaiKyThi}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {sortedGroupedData2.upcoming.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-1">SẮP DIỄN RA</h3>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  {sortedGroupedData2.upcoming.map((exam, index) => (
                    <Card
                      key={index}
                      title={exam.hocPhan.join(', ').toUpperCase()}
                      className="rounded-lg shadow-lg overflow-hidden"
                      style={{
                        backgroundColor: getCardColor(exam.ngayThi),
                        borderRadius: "12px",
                        transition: "transform 0.3s ease",
                      }}
                      hoverable
                      onClick={() => alert(`Bạn đã chọn môn: ${exam.hocPhan.join(', ')}`)}
                    >
                      <div className="p-4">
                        <p className="text-black mb-1 text-lg font-bold">
                          <CalendarOutlined /> Ngày thi: {exam.ngayThi}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ 1: {exam.cb1}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ 2: {exam.cb2}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <ClockCircleOutlined /> Số bài: {exam.soBai}
                        </p>
                        <p className="text-black text-lg font-bold">
                          <HomeOutlined /> Loại kỳ thi: {exam.loaiKyThi}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {sortedGroupedData2.past.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-1">ĐÃ QUA</h3>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  {sortedGroupedData2.past.map((exam, index) => (
                    <Card
                      key={index}
                      title={exam.hocPhan.join(', ').toUpperCase()}
                      className="rounded-lg shadow-lg overflow-hidden"
                      style={{
                        backgroundColor: getCardColor(exam.ngayThi),
                        borderRadius: "12px",
                        transition: "transform 0.3s ease",
                      }}
                      hoverable
                      onClick={() => alert(`Bạn đã chọn môn: ${exam.hocPhan.join(', ')}`)}
                    >
                      <div className="p-4">
                        <p className="text-black mb-1 text-lg font-bold">
                          <CalendarOutlined /> Ngày thi: {exam.ngayThi}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ 1: {exam.cb1}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <TeamOutlined /> Cán bộ 2: {exam.cb2}
                        </p>
                        <p className="text-black mb-1 text-lg font-bold">
                          <ClockCircleOutlined /> Số bài: {exam.soBai}
                        </p>
                        <p className="text-black text-lg font-bold">
                          <HomeOutlined /> Loại kỳ thi: {exam.loaiKyThi}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {listData2 == 0 && (
            <h2 className="font-bold text-center">Chưa có lịch </h2>

          )}
        </div>
      )}

    </div>
  );
};

export default Pages;
