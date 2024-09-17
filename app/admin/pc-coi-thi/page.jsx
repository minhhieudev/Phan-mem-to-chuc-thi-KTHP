'use client'
import { useState, useEffect } from "react";
import { Select, DatePicker, Button, message, Tabs, Card, Col, Row, Checkbox, Radio, Input, Table } from "antd";

import { UserOutlined, BookOutlined, HomeOutlined, CalendarOutlined, SettingOutlined } from '@ant-design/icons';
import Loader from "../../../components/Loader";
import { useRouter } from "next/navigation";
import TablePcCoiThi from "@components/CoiThi/TablePcCoiThi";

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const PcCoiThi = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedItems, setSelectedItems] = useState({
    hocPhan: [],
    lop: [],
    hinhThucThoiGian: [],
    phong: [],
  });
  const [listHocPhan, setListHocPhan] = useState([]);
  const [listGV, setListGV] = useState([]);
  const [listPhong, setListPhong] = useState([]);
  const [examDate, setExamDate] = useState(null);
  const [examSessions, setExamSessions] = useState([]);
  const [list, setList] = useState([]);
  const [selectedGV, setSelectedGV] = useState([]);

  const [cbo1, setCbo1] = useState(null); // Cán bộ 1
  const [cbo2, setCbo2] = useState(null); // Cán bộ 2
  const [namHoc, setNamHoc] = useState("2024-2025");
  const [loaiKyThi, setLoaiKyThi] = useState("Học kỳ 1");
  const [loaiDaoTao, setLoaiDaoTao] = useState("Chính quy");
  const [hocky, setHocKy] = useState("1");
  const [examDateRange, setExamDateRange] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch('/api/admin/hoc-phan-thi');
        if (res1.ok) {
          const data = await res1.json();
          setListHocPhan(data);
        }

        const res2 = await fetch('/api/admin/phong-thi');
        if (res2.ok) {
          const data = await res2.json();
          setListPhong(data);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  // Helper to get a random value from an array
  const randomFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const handleCreate = () => {
    // Check data
    if (!examDateRange.startDate || !examDateRange.endDate || !examSessions.length || !namHoc || !loaiKyThi || !hocky || !loaiDaoTao) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const getRandomDate = (start, end) => {
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return formatDate(date);
    };

    // Copy lists to avoid mutation
    let hocPhanList = [...listHocPhan];
    let phongList = [...listPhong];
    let gvList = [...listGV];

    const randomSchedules = [];

    // Ensure you process all hoc phan
    while (hocPhanList.length > 0) {
      const randomHocPhan = hocPhanList.length > 0 ? hocPhanList.splice(Math.floor(Math.random() * hocPhanList.length), 1)[0] : { tenHocPhan: "Không có dữ liệu", lop: ["Không có dữ liệu"], hinhThucThoiGian: "Không có dữ liệu" };
      const randomPhong = phongList.length > 0 ? phongList.splice(Math.floor(Math.random() * phongList.length), 1)[0] : { tenPhong: "Hết phòng" };

      // Ensure cán bộ 1 and cán bộ 2 are unique
      let randomCbo1 = gvList.length > 0 ? gvList.splice(Math.floor(Math.random() * gvList.length), 1)[0] : { username: "Hết giảng viên" };
      let randomCbo2 = gvList.length > 0 ? gvList.splice(Math.floor(Math.random() * gvList.length), 1)[0] : { username: "Hết giảng viên" };

      // Ensure cán bộ 2 is not the same as cán bộ 1
      if (randomCbo2.username === randomCbo1.username && gvList.length > 0) {
        randomCbo2 = gvList.splice(Math.floor(Math.random() * gvList.length), 1)[0];
      }

      // Ensure ca thi always has data
      const availableCaSessions = examSessions.split(",").filter(ca => ca.trim() !== "");
      const randomCa = availableCaSessions.length > 0 ? randomFromArray(availableCaSessions) : "Không có dữ liệu";
      const randomDate = getRandomDate(examDateRange.startDate, examDateRange.endDate);

      const schedule = {
        hocPhan: randomHocPhan.tenHocPhan,
        lop: randomHocPhan.lop.join(", "),
        hinhThucThoiGian: randomHocPhan.hinhThucThoiGian,
        phong: randomPhong.tenPhong,
        cbo1: randomCbo1.username,
        cbo2: randomCbo2.username,
        ca: randomCa,
        ngayThi: randomDate,
        namHoc,
        loaiKyThi,
        hocky,
        loaiDaoTao
      };

      randomSchedules.push(schedule);
    }

    // Handle "Hết giảng viên" cases
    randomSchedules.forEach(schedule => {
      if (!schedule.cbo1) schedule.cbo1 = "Hết giảng viên";
      if (!schedule.cbo2) schedule.cbo2 = "Hết giảng viên";
    });

    // Log the final schedules and list lengths
    console.log("Generated Schedules:", randomSchedules);
    console.log("Remaining hoc phan list:", hocPhanList);
    console.log("Remaining phong list:", phongList);
    console.log("Remaining cán bộ list:", gvList);

    setList(randomSchedules); // Store the generated schedules in state
    setActiveTab("2")
  };

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

  return loading ? (
    <Loader />
  ) : (
    <div>
      <div className="py-1 px-6 bg-white rounded-lg shadow-lg mt-3 h-[85vh]">
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Tạo lịch thi" key="1">
            <div className="text-heading3-bold text-blue-600 text-center ">THÔNG TIN KỲ THI</div>
            <div className="flex justify-between gap-3 mt-2">
              <div className=" flex items-center gap-2">
                <label className="block text-sm font-semibold mb-1 ">Năm học:</label>
                <Select
                  value={namHoc}
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
                  value={hocky}
                  placeholder="Chọn học kỳ"
                  onChange={(value) => setHocKy(value)} // Set the value when an option is selected
                  className=""
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                </Select>

              </div>

              <div className=" flex items-center gap-2">
                <label className="block text-sm font-semibold mb-1 ">Loại kỳ thi:</label>
                <Select
                  value={loaiKyThi}
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
                  value={loaiDaoTao}
                  placeholder="Chọn loại đào tạo"
                  onChange={(value) => setLoaiDaoTao(value)}
                  className=""
                >
                  <Option value="Chính quy">Chính quy</Option>
                  <Option value="Liên thông">Liên thông</Option>
                </Select>
              </div>
            </div>
            <div className="w-full mt-5">
              <Row gutter={16}>
                <Col span={7} className="h-[55%] overflow-y-auto">
                  <div className="shadow-lg">
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

                <Col span={5} className="h-[55%] overflow-y-auto">
                  <div className="shadow-lg  text-center ">
                    <Card
                      title={<span><CalendarOutlined /> THÔNG TIN</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: '#fafafa' }}
                    >
                      <div className="flex flex-col gap-3">
                        <div className=" flex items-center gap-2">
                          <label className="block text-sm font-semibold mb-1 ">Ca:</label>
                          <Input
                            placeholder="Nhập các ca thi, cách nhau bằng dấu phẩy"
                            value={examSessions}
                            onChange={handleExamSessionChange}
                          />
                        </div>

                        <div className=" flex items-center gap-2">
                          <label className="block text-sm font-semibold mb-1 ">Ngày thi:</label>
                          <RangePicker
                            placeholder={['Từ ngày', 'Đến ngày']}
                            onChange={(dates) => {
                              if (dates && dates.length === 2) {
                                const startDate = dates[0]?.toDate();
                                const endDate = dates[1]?.toDate();
                                setExamDateRange({ startDate, endDate });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </Col>
                <Col span={3} className="h-[55%] overflow-y-auto">
                  <div className="shadow-lg text-center m">
                    <Card
                      title={<span><HomeOutlined /> PHÒNG THI</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: '#f5f5f5' }} // Màu nền
                    >
                      {listPhong.map((phong) => (
                        <p key={phong.tenPhong} className="text-base-bold">- {phong.tenPhong}</p>
                      ))}
                    </Card>
                  </div>
                </Col>
                <Col span={9} className=" ">
                  <div className="shadow-lg text-center text-base-bold h-[55vh] overflow-y-auto">
                    <Card
                      title={<span><UserOutlined /> CÁN BỘ COI THI</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: '#f0fff0' }} // Màu nền
                    >
                      <div className="flex flex-wrap gap-3 h-[20%]">
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
              <Button type="primary" className="button-chinh-quy" onClick={handleCreate}>Tạo lịch thi</Button>
            </div>
          </TabPane>

          <TabPane tab="Kết quả" key="2">
            <TablePcCoiThi list={list} namHoc={namHoc} hocky={hocky} loaiKyThi={loaiKyThi} loaiDaoTao={loaiDaoTao} />
          </TabPane>

        </Tabs>

        {/* <div>
          <Table dataSource={list} columns={columns} rowKey="hocPhan" />
        </div> */}
      </div >


    </div>
  );
};

export default PcCoiThi;
