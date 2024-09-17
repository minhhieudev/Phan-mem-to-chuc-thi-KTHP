'use client'
import { useState, useEffect } from "react";
import { Select, DatePicker, Button, message, Tabs, Card, Col, Row, Checkbox, Radio, Input, Table } from "antd";

import { UserOutlined, BookOutlined, HomeOutlined, CalendarOutlined, SettingOutlined } from '@ant-design/icons';
import Loader from "../../../../components/Loader";


const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const PcCoiThiTable = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedItems, setSelectedItems] = useState({
    hocPhan: [],
    lop: [],
    hinhThucThoiGian: [],
    phong: [],
  });
  const [listLichThi, setListLichThi] = useState([]);
  const [listGV, setListGV] = useState([]);
  const [listPhong, setListPhong] = useState([]);
  const [examDate, setExamDate] = useState(null);
  const [examSessions, setExamSessions] = useState([]);
  const [list, setList] = useState([]);
  const [selectedGV, setSelectedGV] = useState([]);

  const [cbo1, setCbo1] = useState(null); // Cán bộ 1
  const [cbo2, setCbo2] = useState(null); // Cán bộ 2
  const [namHoc, setNamHoc] = useState("");
  const [loaiKyThi, setLoaiKyThi] = useState("");
  const [loaiDaoTao, setLoaiDaoTao] = useState("");
  const [hocky, setHocKy] = useState("");
  const [examDateRange, setExamDateRange] = useState({});
  const [loading, setLoading] = useState(false);



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch('/api/admin/lich-thi');
  //       if (res.ok) {
  //         const data = await res.json();
  //         setListLichThi(data);
  //       }

  //       setLoading(false);
  //     } catch (error) {
  //       message.error("Failed to fetch data");
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/admin/lich-thi", {
        method: "POST",
        body: JSON.stringify(list),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Lưu thành công");
      } else {
        toast.error("Failed to save record");
      }
    } catch (err) {
      toast.error("An error occurred while saving data");
    }
  }


  const handleExamSessionChange = (e) => {
    setExamSessions(e.target.value);
  };


  const getRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 128) + 64;

    const r = randomValue().toString(16).padStart(2, '0');
    const g = randomValue().toString(16).padStart(2, '0');
    const b = randomValue().toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      render: (_, __, index) => index + 1,
    },
    { title: 'Học Phần', dataIndex: 'hocPhan', key: 'hocPhan' },
    { title: 'Lớp', dataIndex: 'lop', key: 'lop' },
    { title: 'Phòng', dataIndex: 'phong', key: 'phong' },
    { title: 'Cán Bộ 1', dataIndex: 'cbo1', key: 'cbo1' },
    { title: 'Cán Bộ 2', dataIndex: 'cbo2', key: 'cbo2' },
    { title: 'Ca', dataIndex: 'ca', key: 'ca' },
    { title: 'Ngày Thi', dataIndex: 'ngayThi', key: 'ngayThi' },
    { title: 'Hình thức/Thời gian', dataIndex: 'hinhThucThoiGian', key: 'hinhThucThoiGian' },

  ];

  return loading ? (
    <Loader />
  ) : (
    <div>
      <div className="py-4 px-6 bg-white rounded-lg shadow-lg mt-3 ">
        <div className="text-heading3-bold text-blue-600 text-center mt-1">LỊCH THI</div>
        <div className="flex justify-between gap-3 mt-2">
          <div className=" flex items-center gap-2">
            <label className="block text-sm font-semibold mb-1 ">Năm học:</label>
            <Select
              placeholder="Chọn năm học"
              onChange={(value) => setNamHoc(value)}
              className=""
            >
              <Option value="2021-2022">2021-2022</Option>
              <Option value="2022-2023">2022-2023</Option>
              <Option value="2023-2024">2023-2024</Option>
              <Option value="2024-2025">2024-2025</Option>
            </Select>
          </div>
          <div className=" flex items-center gap-2">
            <label className="block text-sm font-semibold mb-1 ">Học kỳ:</label>
            <Select
              placeholder="Chọn học kỳ"
              onChange={(value) => setHocKy(value)}
              className=""
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
            </Select>
          </div>

          <div className=" flex items-center gap-2">
            <label className="block text-sm font-semibold mb-1 ">Loại kỳ thi:</label>
            <Select
              placeholder="Chọn loại kỳ thi"
              onChange={(value) => setLoaiKyThi(value)}
              className=""
            >
              <Option value="Học kỳ 1">Học kỳ 1</Option>
              <Option value="Học kỳ 1 (đợt 2)">Học kỳ 1 (đợt 2)</Option>
              <Option value="Học kỳ 1 (đợt 3)">Học kỳ 1 (đợt 3)</Option>
              <Option value="Học kỳ 2">Học kỳ 2</Option>
              <Option value="Học kỳ 2 (đợt 2)">Học kỳ 2 (đợt 2)</Option>
              <Option value="Học kỳ 2 (đợt 3)">Học kỳ 2 (đợt 3)</Option>
              <Option value="Kỳ thi phụ (đợt 1)">Kỳ thi phụ (đợt 1)</Option>
              <Option value="Kỳ thi phụ (đợt 2)">Kỳ thi phụ (đợt 2)</Option>
              <Option value="Kỳ thi phụ (đợt 3)">Kỳ thi phụ (đợt 3)</Option>
              <Option value="Học kỳ hè">Học kỳ hè</Option>
            </Select>
          </div>

          <div className=" flex items-center gap-2">
            <label className="block text-sm font-semibold mb-1 ">Loại đào tạo:</label>
            <Select
              placeholder="Chọn loại đào tạo"
              onChange={(value) => setLoaiDaoTao(value)}
              className=""
            >
              <Option value="Chính quy">Chính quy</Option>
              <Option value="Liên thông">Liên thông</Option>
            </Select>
          </div>
        </div>

        <div className="bg-white text-center rounded-md p-3 ">
          <Button type="primary" onClick={handleSubmit}>Lưu</Button>
        </div>
        <div>
          <Table dataSource={list} columns={columns} rowKey="hocPhan" />
        </div>
      </div >


    </div>
  );
};

export default PcCoiThiTable;
