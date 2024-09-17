'use client'
import { useState, useEffect } from "react";
import { Select, DatePicker, Button, message, Tabs, Card, Col, Row, Checkbox, Radio, Input, Table } from "antd";

import { UserOutlined, BookOutlined, HomeOutlined, CalendarOutlined, SettingOutlined } from '@ant-design/icons';
import Loader from "../../../components/Loader";


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
  const [listHocPhan, setListHocPhan] = useState([]);
  const [listGV, setListGV] = useState([]);
  const [list, setList] = useState([]);
  const [selectedGV, setSelectedGV] = useState([]);

  const [cbo1, setCbo1] = useState(null); // Cán bộ 1
  const [cbo2, setCbo2] = useState(null); // Cán bộ 2
  const [namHoc, setNamHoc] = useState("");
  const [loaiKyThi, setLoaiKyThi] = useState("");
  const [loaiDaoTao, setLoaiDaoTao] = useState("");
  const [hocky, setHocKy] = useState("");
  const [loading, setLoading] = useState(true);
  const [listPcCoiThi, setListPcCoiThi] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Api lấy danh sách thi từ phân công coi thi
        // const res2 = await fetch('/api/admin/pc-coi-thi');
        // if (res2.ok) {
        //   const data = await res1.json();
        //   setListPcCoiThi(data);
        // }

        const res1 = await fetch('/api/admin/hoc-phan-thi');
        if (res1.ok) {
          const data = await res1.json();
          setListHocPhan(data);
        }

        const res = await fetch('/api/admin/user/get-gv', {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setListGV(data);
        }

        setLoading(false);
      } catch (error) {
        message.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);


  // Helper to get a random value from an array
  const randomFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const handleCreate = () => {

    let gvList = [...listGV];
    // XỬ LÝ RANDOM 2 GIẢNG VIÊN

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
    { title: 'Cán Bộ 1', dataIndex: 'cbo1', key: 'cbo1' },
    { title: 'Cán Bộ 2', dataIndex: 'cbo2', key: 'cbo2' },
    { title: 'Ngày Thi', dataIndex: 'ngayThi', key: 'ngayThi' },
    { title: 'Hình thức/Thời gian', dataIndex: 'hinhThucThoiGian', key: 'hinhThucThoiGian' },

  ];

  return loading ? (
    <Loader />
  ) : (
    <div>
      <div className="py-4 px-6 bg-white rounded-lg shadow-lg mt-3 ">
        <div className="text-heading3-bold text-blue-600 text-center mt-1">PHÂN CÔNG CHẤM THI</div>
        <div className="flex justify-between gap-3 mt-2">
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


        </div>
        <div className="w-full mt-5">
          <Row gutter={16}>
            <Col span={10}>
              <div className="shadow-lg h-full ">
                <Card
                  title={<span><BookOutlined /> HỌC PHẦN</span>}
                  bordered={false}
                  className="h-full text-center"
                  style={{ backgroundColor: '#f0f8ff' }} // Màu nền nhẹ
                >
                  <ul className="list-decimal pl-5 text-left">
                    {listHocPhan.map((hocPhan) => (
                      <li key={hocPhan.tenHocPhan}>
                        {hocPhan.tenHocPhan} ({hocPhan.lop?.join(', ')})
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </Col>

            <Col span={14}>
              <div className="shadow-lg text-center text-base-bold h-full ">
                <Card
                  title={<span><UserOutlined /> CÁN BỘ CHẤM THI</span>}
                  bordered={false}
                  className="h-full text-center"
                  style={{ backgroundColor: '#f0fff0' }} // Màu nền
                >
                  <div className="flex flex-wrap gap-3">
                    {listGV.map((gv) => (
                      <div
                        key={gv._id}
                        className="flex items-center p-2 border border-gray-300 rounded-lg"
                        style={{ backgroundColor: getRandomColor() }} // Áp dụng màu ngẫu nhiên
                      >
                        <UserOutlined className="text-gray-500 mr-2" style={{ fontSize: '24px' }} />
                        <span className="text-base-bold text-white">{gv.username}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div >

        <div className="bg-white text-center rounded-md p-3">
          <Button type="primary" onClick={handleCreate}>Tạo lịch chấm thi</Button>
        </div>
        <div>
          <Table dataSource={list} columns={columns} rowKey="hocPhan" />
        </div>
      </div >


    </div>
  );
};

export default PcCoiThiTable;
