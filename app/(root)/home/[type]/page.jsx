"use client";

import { useState, useEffect } from "react";
import { Row, Col, Button, Input, Tabs, Spin, Select, Card, Tag, Divider, Empty, Badge } from "antd";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  BookOutlined
} from "@ant-design/icons";
import Loader from "@components/Loader";
import moment from "moment";

const { TabPane } = Tabs;
const { Option } = Select;

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
  const [activeTab, setActiveTab] = useState("upcoming");

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
    const examDate = moment(ngayThi, "DD-MM-YYYY");

    if (examDate.isBefore(today, "day")) {
      return "#f5f5f5"; // Lighter gray for past events
    } else if (examDate.isSame(today, "day")) {
      return "#e6f7ff"; // Light blue for today's events
    } else {
      return "white"; // White for upcoming events
    }
  };

  const getBorderColor = (ngayThi) => {
    const today = moment();
    const examDate = moment(ngayThi, "DD-MM-YYYY");

    if (examDate.isBefore(today, "day")) {
      return "#d9d9d9"; // Gray border for past events
    } else if (examDate.isSame(today, "day")) {
      return "#1890ff"; // Blue border for today's events
    } else {
      return "#52c41a"; // Green border for upcoming events
    }
  };

  // Nhóm dữ liệu theo thời gian
  const groupByTime = (data) => {
    const groups = {
      past: [],
      today: [],
      upcoming: [],
    };

    data.forEach((item) => {
      const examDate = moment(item.ngayThi, "DD-MM-YYYY");
      const today = moment();
      
      if (examDate.isBefore(today, "day")) {
        groups.past.push(item);
      } else if (examDate.isSame(today, "day")) {
        groups.today.push(item);
      } else {
        groups.upcoming.push(item);
      }
    });

    // Sort each group by date
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => 
        moment(a.ngayThi, "DD-MM-YYYY").diff(moment(b.ngayThi, "DD-MM-YYYY"))
      );
    });

    return groups;
  };

  const groupedData = groupByTime(listData);
  const groupedData2 = groupByTime(listData2);

  const formatCaExam = (ca) => {
    return ca === "1" ? "Sáng" : ca === "3" ? "Chiều" : ca;
  };

  // Render a single card for lịch coi thi
  const renderCoiThiCard = (exam, index) => {
    let filteredCbo1 = null;
    let filteredCbo2 = null;
    let roomIndex = null;

    // Find the user in cbo1 or cbo2 arrays
    for (let i = 0; i < exam.cbo1.length; i++) {
      if (exam.cbo1[i] === user.username) {
        filteredCbo1 = user.username;
        filteredCbo2 = exam.cbo2[i];
        roomIndex = i;
        break;
      }

      if (exam.cbo2[i] === user.username) {
        filteredCbo1 = exam.cbo1[i];
        filteredCbo2 = user.username;
        roomIndex = i;
        break;
      }
    }

    if (roomIndex === null) return null;

    // Format the date display
    const formattedDate = moment(exam.ngayThi, "DD-MM-YYYY").format("DD/MM/YYYY");
    const isToday = moment(exam.ngayThi, "DD-MM-YYYY").isSame(moment(), "day");
    const isPast = moment(exam.ngayThi, "DD-MM-YYYY").isBefore(moment(), "day");
    
    return (
      <Card
        key={index}
        className="rounded-lg overflow-hidden w-full mb-4 hover:shadow-xl transition-shadow"
        style={{
          backgroundColor: getCardColor(exam.ngayThi),
          borderLeft: `5px solid ${getBorderColor(exam.ngayThi)}`,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
        hoverable
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left column with date and status */}
          <div className="md:w-1/5 flex flex-col items-center justify-center p-2 border-r border-gray-200">
            <div className="text-4xl font-bold text-gray-900">
              {formattedDate.split('/')[0]}
            </div>
            <div className="text-sm text-gray-500">
              {moment(exam.ngayThi, "DD-MM-YYYY").format("MM/YYYY")}
            </div>
            <Badge 
              status={isToday ? "processing" : isPast ? "default" : "success"} 
              text={isToday ? "Hôm nay" : isPast ? "Đã qua" : "Sắp tới"} 
              className="mt-2"
            />
            <Tag color={exam.ca === "1" ? "blue" : "orange"} className="mt-2">
              {formatCaExam(exam.ca)}
            </Tag>
          </div>
          
          {/* Right column with exam details */}
          <div className="md:w-4/5 p-2">
            <h3 className="text-lg font-bold text-blue-700 mb-3">
              <BookOutlined className="mr-2" />
              {exam.hocPhan.join(' - ').toUpperCase()}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <p className="flex items-center text-gray-800">
                  <EnvironmentOutlined className="mr-2 text-red-500" />
                  <span className="font-medium">Phòng thi:</span>
                  <span className="ml-1 font-bold">{exam.phong[roomIndex]}</span>
                </p>
                
                <p className="flex items-center text-gray-800">
                  <TeamOutlined className="mr-2 text-green-500" />
                  <span className="font-medium">Cán bộ 1:</span>
                  <span className={`ml-1 ${filteredCbo1 === user.username ? 'text-blue-600 font-bold' : 'font-normal'}`}>{filteredCbo1}</span>
                </p>
                
                <p className="flex items-center text-gray-800">
                  <TeamOutlined className="mr-2 text-green-500" />
                  <span className="font-medium">Cán bộ 2:</span>
                  <span className={`ml-1 ${filteredCbo2 === user.username ? 'text-blue-600 font-bold' : 'font-normal'}`}>{filteredCbo2}</span>
                </p>
              </div>
              
              <div>
                <p className="flex items-center text-gray-800">
                  <InfoCircleOutlined className="mr-2 text-purple-500" />
                  <span className="font-medium">Hình thức:</span>
                  <span className="ml-1">{exam.hinhThuc ? exam.hinhThuc.join(', ') : 'N/A'}</span>
                </p>
                
                <p className="flex items-center text-gray-800">
                  <ClockCircleOutlined className="mr-2 text-orange-500" />
                  <span className="font-medium">Thời gian:</span>
                  <span className="ml-1">{exam.thoiGian ? exam.thoiGian.join(', ') : 'N/A'}</span>
                </p>
                
                <p className="flex items-center text-gray-800">
                  <HomeOutlined className="mr-2 text-blue-500" />
                  <span className="font-medium">Địa điểm:</span>
                  <span className="ml-1">{exam.diaDiem || 'N/A'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Render a single card for lịch chấm thi
  const renderChamThiCard = (exam, index) => {
    const formattedDate = moment(exam.ngayThi, "DD-MM-YYYY").format("DD/MM/YYYY");
    const isToday = moment(exam.ngayThi, "DD-MM-YYYY").isSame(moment(), "day");
    const isPast = moment(exam.ngayThi, "DD-MM-YYYY").isBefore(moment(), "day");
    
    return (
      <Card
        key={index}
        className="rounded-lg overflow-hidden w-full mb-4 hover:shadow-xl transition-shadow"
        style={{
          backgroundColor: getCardColor(exam.ngayThi),
          borderLeft: `5px solid ${getBorderColor(exam.ngayThi)}`,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
        hoverable
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left column with date and status */}
          <div className="md:w-1/5 flex flex-col items-center justify-center p-2 border-r border-gray-200">
            <div className="text-4xl font-bold text-gray-900">
              {formattedDate.split('/')[0]}
            </div>
            <div className="text-sm text-gray-500">
              {moment(exam.ngayThi, "DD-MM-YYYY").format("MM/YYYY")}
            </div>
            <Badge 
              status={isToday ? "processing" : isPast ? "default" : "success"} 
              text={isToday ? "Hôm nay" : isPast ? "Đã qua" : "Sắp tới"} 
              className="mt-2"
            />
          </div>
          
          {/* Right column with exam details */}
          <div className="md:w-4/5 p-2">
            <h3 className="text-lg font-bold text-blue-700 mb-3">
              <BookOutlined className="mr-2" />
              {exam.hocPhan.join(' - ').toUpperCase()}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <p className="flex items-center text-gray-800">
                  <TeamOutlined className="mr-2 text-green-500" />
                  <span className="font-medium">Cán bộ 1:</span>
                  <span className={`ml-1 ${exam.cb1 === user.username ? 'text-blue-600 font-bold' : 'font-normal'}`}>{exam.cb1}</span>
                </p>
                
                <p className="flex items-center text-gray-800">
                  <TeamOutlined className="mr-2 text-green-500" />
                  <span className="font-medium">Cán bộ 2:</span>
                  <span className={`ml-1 ${exam.cb2 === user.username ? 'text-blue-600 font-bold' : 'font-normal'}`}>{exam.cb2}</span>
                </p>
              </div>
              
              <div>
                <p className="flex items-center text-gray-800">
                  <InfoCircleOutlined className="mr-2 text-purple-500" />
                  <span className="font-medium">Số bài:</span>
                  <span className="ml-1 font-bold">{exam.soBai}</span>
                </p>
                
                <p className="flex items-center text-gray-800">
                  <InfoCircleOutlined className="mr-2 text-orange-500" />
                  <span className="font-medium">Loại kỳ thi:</span>
                  <span className="ml-1">{exam.loaiKyThi}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="bg-white w-[95%] rounded-md shadow-md mx-auto p-4 mt-5">

      <div className="flex justify-between items-center mb-4 ">
        <Button
          className="flex items-center text-white font-bold shadow-md"
          onClick={() => router.push(`/home`)}
          type="primary"
          size="middle"
        >
          <ArrowLeftOutlined /> QUAY LẠI
        </Button>
        
        <h1 className="text-xl md:text-2xl font-bold text-center text-blue-800 ml-2 w-[200px]">
          {type === 'coi-thi' ? 'LỊCH COI THI' : 'LỊCH CHẤM THI'}
        </h1>
        
        <div className="w-[70px]"></div> {/* Spacer for flex alignment */}
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row items-end justify-center gap-4">
          <div className="font-bold flex flex-col w-full md:w-auto">
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

          <div className="font-bold flex flex-col w-full md:w-auto">
            <label htmlFor="ky" className="block text-sm text-gray-700 mb-1">
              Học kỳ
            </label>
            <Select
              id="ky"
              value={selectKy}
              onChange={(value) => setSelectKy(value)}
              className="w-full md:w-32"
              placeholder="Chọn kỳ"
              allowClear
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="he">Hè</Option>
            </Select>
          </div>
        </div>
      </div>

      {type === 'coi-thi' && (
        <div className="mt-4">
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            centered
            className="custom-tabs"
          >
            <TabPane 
              tab={
                <span>
                  <ClockCircleOutlined /> Sắp tới 
                  {groupedData.upcoming.length > 0 && <Badge count={groupedData.upcoming.length} style={{ marginLeft: 8 }} />}
                </span>
              }
              key="upcoming"
            >
              <div className="p-2">
                {groupedData.upcoming.length > 0 ? (
                  groupedData.upcoming.map((exam, index) => renderCoiThiCard(exam, index))
                ) : (
                  <Empty description="Không có lịch coi thi sắp tới" />
                )}
              </div>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <CalendarOutlined /> Hôm nay
                  {groupedData.today.length > 0 && <Badge count={groupedData.today.length} style={{ marginLeft: 8 }} color="#108ee9" />}
                </span>
              }
              key="today"
            >
              <div className="p-2">
                {groupedData.today.length > 0 ? (
                  groupedData.today.map((exam, index) => renderCoiThiCard(exam, index))
                ) : (
                  <Empty description="Không có lịch coi thi hôm nay" />
                )}
              </div>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <EnvironmentOutlined /> Đã qua
                  {groupedData.past.length > 0 && <Badge count={groupedData.past.length} style={{ marginLeft: 8 }} color="#aaa" />}
                </span>
              }
              key="past"
            >
              <div className="p-2">
                {groupedData.past.length > 0 ? (
                  groupedData.past.map((exam, index) => renderCoiThiCard(exam, index))
                ) : (
                  <Empty description="Không có lịch coi thi đã qua" />
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      )}

      {type === 'cham-thi' && (
        <div className="mt-4">
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            centered
            className="custom-tabs"
          >
            <TabPane 
              tab={
                <span>
                  <ClockCircleOutlined /> Sắp tới 
                  {groupedData2.upcoming.length > 0 && <Badge count={groupedData2.upcoming.length} style={{ marginLeft: 8 }} />}
                </span>
              }
              key="upcoming"
            >
              <div className="p-2">
                {groupedData2.upcoming.length > 0 ? (
                  groupedData2.upcoming.map((exam, index) => renderChamThiCard(exam, index))
                ) : (
                  <Empty description="Không có lịch chấm thi sắp tới" />
                )}
              </div>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <CalendarOutlined /> Hôm nay
                  {groupedData2.today.length > 0 && <Badge count={groupedData2.today.length} style={{ marginLeft: 8 }} color="#108ee9" />}
                </span>
              }
              key="today"
            >
              <div className="p-2">
                {groupedData2.today.length > 0 ? (
                  groupedData2.today.map((exam, index) => renderChamThiCard(exam, index))
                ) : (
                  <Empty description="Không có lịch chấm thi hôm nay" />
                )}
              </div>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <EnvironmentOutlined /> Đã qua
                  {groupedData2.past.length > 0 && <Badge count={groupedData2.past.length} style={{ marginLeft: 8 }} color="#aaa" />}
                </span>
              }
              key="past"
            >
              <div className="p-2">
                {groupedData2.past.length > 0 ? (
                  groupedData2.past.map((exam, index) => renderChamThiCard(exam, index))
                ) : (
                  <Empty description="Không có lịch chấm thi đã qua" />
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      )}
      
      {/* Custom CSS for tabs */}
      <style jsx global>{`
        .custom-tabs .ant-tabs-tab {
          padding: 10px 20px;
          margin-right: 5px;
          border-radius: 8px 8px 0 0;
          transition: all 0.3s;
        }
        
        .custom-tabs .ant-tabs-tab-active {
          background-color: #f0f5ff;
          font-weight: bold;
        }
        
        .custom-tabs .ant-tabs-nav {
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

export default Pages;
