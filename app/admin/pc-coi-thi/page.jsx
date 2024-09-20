'use client'
import { useState, useEffect } from "react";
import { Select, DatePicker, Button, message, Tabs, Card, Col, Row, Checkbox, Radio, Input, Table, Modal } from "antd";

import { UserOutlined, BookOutlined, HomeOutlined, CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import Loader from "../../../components/Loader";
import TablePcCoiThi from "@components/CoiThi/TablePcCoiThi";

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const PcCoiThi = () => {
  const [activeTab, setActiveTab] = useState("1");

  const [listHocPhan, setListHocPhan] = useState([]);
  const [listGV, setListGV] = useState([]);
  const [listPhong, setListPhong] = useState([]);

  const [listHocPhanSelect, setListHocPhanSelect] = useState([]);
  const [listGVSelect, setListGVSelect] = useState([]);
  const [listPhongSelect, setListPhongSelect] = useState([]);

  const [examSessions, setExamSessions] = useState([]);
  const [list, setList] = useState([]);

  const [namHoc, setNamHoc] = useState("2024-2025");
  const [loaiKyThi, setLoaiKyThi] = useState("Học kỳ 1");
  const [loaiDaoTao, setLoaiDaoTao] = useState("Chính quy");
  const [hocky, setHocKy] = useState("1");
  const [examDateRange, setExamDateRange] = useState({});
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [searchHocPhan, setSearchHocPhan] = useState("");
  const [searchPhong, setSearchPhong] = useState("");
  const [searchGV, setSearchGV] = useState("");

  const [filteredListPhong, setFilteredListPhong] = useState([]);
  const [filteredListHocPhan, setFilteredListHocPhan] = useState([]);
  const [filteredListGV, setFilteredListGV] = useState([]);

  const [selectKhoa, setSelectKhoa] = useState("");
  const [khoaOptions, setKhoaOptions] = useState([]);


  const handleCancel = () => {
    setOpen(false);
  };

  /// Các hàm cập nhật danh sách
  const handleSelectHocPhan = (checked, hocPhan) => {
    setListHocPhanSelect((prev) =>
      checked ? [...prev, hocPhan] : prev.filter((item) => item !== hocPhan)
    );
  };

  const handleSelectPhong = (checked, phong) => {
    setListPhongSelect((prev) =>
      checked ? [...prev, phong] : prev.filter((item) => item !== phong)
    );
  };

  const handleSelectGV = (checked, gv) => {
    setListGVSelect((prev) =>
      checked ? [...prev, gv] : prev.filter((item) => item !== gv)
    );
  };

  const handleDeleteHocPhan = (index) => {
    const updatedList = [...listHocPhanSelect];
    updatedList.splice(index, 1);
    setListHocPhanSelect(updatedList);
  };

  const handleDeletePhong = (index) => {
    const updatedList = [...listPhongSelect];
    updatedList.splice(index, 1);
    setListPhongSelect(updatedList);
  };

  const handleDeleteGV = (index) => {
    const updatedList = [...listGVSelect];
    updatedList.splice(index, 1);
    setListGVSelect(updatedList);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res4 = await fetch(`/api/admin/khoa`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res4.ok) {
          const data = await res4.json();
          const tenKhoaList = data.map(khoa => khoa.tenKhoa);

          setKhoaOptions(tenKhoaList);
        }

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
        console.log("Error:", error)
        message.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = listPhong;

    // Kiểm tra tên phòng
    if (searchPhong) {
      filteredData = filteredData.filter(phong =>
        phong.tenPhong.toLowerCase().includes(searchPhong.toLowerCase())
      );
    }

    // Kiểm tra loại phòng theo lựa chọn
    if (roomTypeFilter) {
      if (roomTypeFilter === "E") {
        filteredData = filteredData.filter(phong => phong.tenPhong.startsWith("E"));
      } else if (roomTypeFilter === "F") {
        filteredData = filteredData.filter(phong => phong.tenPhong.startsWith("F"));
      } else if (roomTypeFilter === "Khác") {
        filteredData = filteredData.filter(phong => !phong.tenPhong.startsWith("E") && !phong.tenPhong.startsWith("F"));
      }
    }

    setFilteredListPhong(filteredData);
  }, [searchPhong,
    roomTypeFilter, listPhong]);

  useEffect(() => {
    let filteredData = listHocPhan;


    if (searchHocPhan) {
      filteredData = filteredData.filter(phong =>
        phong.tenHocPhan.toLowerCase().includes(searchHocPhan.toLowerCase())
      );
    }

    setFilteredListHocPhan(filteredData);
  }, [searchHocPhan, listHocPhan]);

  useEffect(() => {
    let filteredData = listGV;

    if (searchGV) {
      filteredData = filteredData.filter(gv =>
        gv.username.toLowerCase().includes(searchGV.toLowerCase())
      );
    }

    if (selectKhoa) {
      filteredData = filteredData.filter(gv => gv.khoa == selectKhoa);
    }
    setFilteredListGV(filteredData);
  }, [selectKhoa, listGV]);

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

    const getRandomDate = (start, end, excludeDates, hocPhan, allowSatSun) => {
      let date;
      let attempt = 0;

      const isThiT7CN = allowSatSun;
      const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      let validDays = [];

      // Lặp qua các ngày trong khoảng start đến end
      for (let i = 0; i <= totalDays; i++) {
        const checkDate = new Date(start.getTime() + i * (1000 * 3600 * 24));
        const checkDay = checkDate.getDay();
        const formattedDate = formatDate(checkDate);

        // Thêm các ngày phù hợp vào validDays, có thể trùng ngày
        if ((isThiT7CN && (checkDay === 0 || checkDay === 6)) || (!isThiT7CN && (checkDay !== 0 && checkDay !== 6))) {
          validDays.push(formattedDate);
        }
      }

      // Kiểm tra nếu không còn ngày hợp lệ
      if (validDays.length === 0) {
        if (allowSatSun) {
          return "Hết ngày thi t7, cn!!!";
        } else {
          return "Hết ngày thi thường !!!";
        }
      }

      // Chọn ngày ngẫu nhiên từ danh sách validDays
      date = validDays[Math.floor(Math.random() * validDays.length)];

      return date;
    };



    const handleSplitHocPhan = (hocPhan, phong, cbo1, cbo2, ca, ngayThi) => {
      const halfSV = Math.ceil(hocPhan.soSVDK / 2);
      const hocPhan1 = {
        ...hocPhan,
        tenHocPhan: `${hocPhan.tenHocPhan} (1)`,
        soSVDK: halfSV
      };
      const hocPhan2 = {
        ...hocPhan,
        tenHocPhan: `${hocPhan.tenHocPhan} (2)`,
        soSVDK: hocPhan.soSVDK - halfSV
      };

      let randomPhong;
      let phongListAvailable = hocPhan.hinhThuc === "GDTC" ? phongGDTCList : (hocPhan.hinhThuc === "TH" ? phongMayList : phongThuongList);
      randomPhong = phongListAvailable.length > 0 ? phongListAvailable.splice(Math.floor(Math.random() * phongListAvailable.length), 1)[0] : { tenPhong: "Hết phòng !!!" };

      let randomCbo1 = gvList.length > 0 ? gvList.splice(Math.floor(Math.random() * gvList.length), 1)[0] : { username: "Hết giảng viên !!!!" };
      let randomCbo2 = gvList.length > 0 ? gvList.splice(Math.floor(Math.random() * gvList.length), 1)[0] : { username: "Hết giảng viên !!!!" };

      if (randomCbo2.username === randomCbo1.username && gvList.length > 0) {
        randomCbo2 = gvList.splice(Math.floor(Math.random() * gvList.length), 1)[0];
      }

      return [
        {
          hocPhan: hocPhan1.tenHocPhan,
          lop: hocPhan.lop.join(", "),
          hinhThuc: hocPhan.hinhThuc,
          thoiGian: hocPhan.thoiGian,
          phong: phong.tenPhong,
          cbo1: cbo1.username,
          cbo2: cbo2.username,
          ca: ca,
          ngayThi: ngayThi,
          namHoc,
          loaiKyThi,
          hocky,
          loaiDaoTao
        },
        {
          hocPhan: hocPhan2.tenHocPhan,
          lop: hocPhan.lop.join(", "),
          hinhThuc: hocPhan.hinhThuc,
          thoiGian: hocPhan.thoiGian,
          phong: randomPhong.tenPhong,
          cbo1: randomCbo1.username,
          cbo2: randomCbo2.username,
          ca: ca,
          ngayThi: ngayThi,
          namHoc,
          loaiKyThi,
          hocky,
          loaiDaoTao
        }
      ];
    };

    let hocPhanListNonT7CN = listHocPhanSelect.filter(hp => !hp.thiT7CN);
    let hocPhanListT7CN = listHocPhanSelect.filter(hp => hp.thiT7CN);

    let phongList = [...listPhongSelect];
    let phongMayList = phongList.filter(phong => phong.loai === "Phòng máy");
    let phongThuongList = phongList.filter(phong => phong.loai === "Phòng thường");
    let phongGDTCList = phongList.filter(phong => phong.loai === "Phòng GDTC");
    let gvList = [...listGVSelect];

    const randomSchedules = [];
    const usedDates = new Set();

    const scheduleHocPhanList = (hocPhanList, allowSatSun) => {
      while (hocPhanList.length > 0) {
        const randomHocPhan = hocPhanList.splice(Math.floor(Math.random() * hocPhanList.length), 1)[0];
        let randomPhong;

        if (randomHocPhan.hinhThuc === "GDTC") {
          randomPhong = phongGDTCList.length > 0 ? phongGDTCList.splice(Math.floor(Math.random() * phongGDTCList.length), 1)[0] : { tenPhong: "Hết phòng GDTC!!!" };
        } else if (randomHocPhan.hinhThuc === "TH") {
          randomPhong = phongMayList.length > 0 ? phongMayList.splice(Math.floor(Math.random() * phongMayList.length), 1)[0] : { tenPhong: "Thiếu phòng thực hành!!!!" };
        } else {
          randomPhong = phongThuongList.length > 0 ? phongThuongList.splice(Math.floor(Math.random() * phongThuongList.length), 1)[0] : { tenPhong: "Hết phòng !!!" };
        }

        let randomCbo1 = gvList.length > 0 ? gvList.splice(Math.floor(Math.random() * gvList.length), 1)[0] : { username: "Hết giảng viên !!!!" };
        let randomCbo2 = gvList.length > 0 ? gvList.splice(Math.floor(Math.random() * gvList.length), 1)[0] : { username: "Hết giảng viên !!!!" };

        if (randomCbo2.username === randomCbo1.username && gvList.length > 0) {
          randomCbo2 = gvList.splice(Math.floor(Math.random() * gvList.length), 1)[0];
        }

        const availableCaSessions = examSessions.split(",").filter(ca => ca.trim() !== "");
        const randomCa = availableCaSessions.length > 0 ? randomFromArray(availableCaSessions) : "Không có dữ liệu";

        const randomDate = getRandomDate(examDateRange.startDate, examDateRange.endDate, usedDates, randomHocPhan, allowSatSun);

        if (randomHocPhan.soSVDK > randomPhong.soCho) {
          const splitSchedules = handleSplitHocPhan(randomHocPhan, randomPhong, randomCbo1, randomCbo2, randomCa, randomDate);
          randomSchedules.push(...splitSchedules);
        } else {
          const schedule = {
            hocPhan: randomHocPhan.tenHocPhan,
            lop: randomHocPhan.lop.join(", "),
            hinhThuc: randomHocPhan.hinhThuc,
            thoiGian: randomHocPhan.thoiGian,
            phong: randomPhong.tenPhong,
            cbo1: randomCbo1.username,
            cbo2: randomCbo2.username,
            ca: randomCa,
            ngayThi: randomDate instanceof Date ? randomDate.toLocaleDateString() : randomDate,
            namHoc,
            loaiKyThi,
            hocky,
            loaiDaoTao
          };

          randomSchedules.push(schedule);
        }
      }
    };

    scheduleHocPhanList(hocPhanListNonT7CN, false);
    scheduleHocPhanList(hocPhanListT7CN, true);

    setList(randomSchedules);
    setActiveTab("2");
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
                        {listHocPhanSelect.map((hocPhan, index) => (
                          <li key={hocPhan.tenHocPhan} className="flex justify-between items-center">
                            <span>{index + 1}. {hocPhan.tenHocPhan} ({hocPhan.lop?.join(', ')})</span>
                            <DeleteOutlined
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleDeleteHocPhan(index)}
                            />
                          </li>
                        ))}
                      </ul>


                      <div className="flex justify-around mt-3">
                        <Button className="button-lien-thong-chinh-quy text-white" onClick={() => { setOpen(true); setTitle('Chọn học phần') }}>Chọn học phần</Button>
                        <Button className="button-lien-thong-vlvh text-white">Import</Button>
                      </div>
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

                      {listPhongSelect.map((phong, index) => (
                        <div key={phong.tenPhong} className="flex justify-between items-center">
                          <p className="text-base-bold">- {phong.tenPhong}</p>
                          <DeleteOutlined
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleDeletePhong(index)}
                          />
                        </div>
                      ))}

                      <div className="flex gap-4 mt-3 flex-col">
                        <Button className="button-lien-thong-vlvh-nd71 text-white" onClick={() => { setOpen(true); setTitle('Chọn phòng') }}>Chọn phòng thi</Button>
                        <Button className="button-lien-thong-vlvh text-white">Import</Button>
                      </div>

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
                        {listGVSelect.map((gv, index) => (
                          <div
                            key={gv._id}
                            className="flex justify-between items-center p-2 border border-gray-300 rounded-lg"
                            style={{ backgroundColor: getRandomColor() }} // Áp dụng màu ngẫu nhiên
                          >
                            <div className="flex items-center">
                              <UserOutlined className="text-gray-500 mr-2" style={{ fontSize: '24px' }} />
                              <span className="text-base-bold text-white">{gv.username}</span>
                            </div>
                            <DeleteOutlined
                              className="text-red-500 cursor-pointer ml-2"
                              onClick={() => handleDeleteGV(index)}
                            />
                          </div>
                        ))}
                      </div>
                    </Card>

                  </div>
                  <div className="flex gap-4 mt-3 justify-center">
                    <Button className="button-boi-duong text-white" onClick={() => { setOpen(true); setTitle('Chọn cán bộ') }}>Chọn cán bộ</Button>
                    <Button className="button-lien-thong-vlvh text-white">Import</Button>
                  </div>
                </Col>
              </Row>
            </div >
            <div className="bg-white text-center rounded-md p-3">
              <Button type="primary" className="button-chinh-quy" onClick={handleCreate}>Tạo lịch thi</Button>
            </div>

            {title === 'Chọn học phần' && (
              <Modal
                title={title}
                open={open}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                onOk={() => setOpen(false)}
                width={1500}
                centered
                bodyStyle={{ height: '600px', overflowY: 'auto' }}
              >
                <div className="text-center">
                  <Input.Search
                    className="w-[30%] text-center"
                    placeholder="Tìm kiếm học phần ..."
                    onSearch={(value) => setListHocPhan(filteredListHocPhan.filter((phong) =>
                      phong.tenHocPhan.toLowerCase().includes(value.toLowerCase())
                    ))}
                    onChange={(e) => setSearchHocPhan(e.target.value)}
                    style={{ marginBottom: '16px' }}
                  />
                </div>

                <ul className="list-decimal pl-5 text-left">
                  {filteredListHocPhan.map((hocPhan) => (
                    <li key={hocPhan.tenHocPhan}>
                      <Checkbox
                        onChange={(e) => handleSelectHocPhan(e.target.checked, hocPhan)}
                        checked={listHocPhanSelect.includes(hocPhan)}
                      >
                        {hocPhan.tenHocPhan} ({hocPhan.lop?.join(', ')})
                      </Checkbox>
                    </li>
                  ))}
                </ul>
              </Modal>
            )}

            {title === 'Chọn phòng' && (
              <Modal
                title={title}
                open={open}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                onOk={() => setOpen(false)}
                width={1000}
                centered
                bodyStyle={{ height: '600px', overflowY: 'auto' }}
              >
                <div className="flex justify-between mt-2">
                  {/* Thêm Select ở đây */}
                  <Select
                    placeholder="Lọc theo loại phòng"
                    className="w-48"
                    value={roomTypeFilter}
                    onChange={setRoomTypeFilter}
                    style={{ marginBottom: '16px' }} // Thêm style để tạo khoảng cách với các thành phần khác
                  >
                    <Select.Option value="">Tất cả phòng</Select.Option>
                    <Select.Option value="E">Phòng E</Select.Option>
                    <Select.Option value="F">Phòng F</Select.Option>
                    <Select.Option value="Khác">Phòng khác</Select.Option>
                  </Select>

                  <Input.Search
                    className="w-[30%]"
                    placeholder="Tìm kiếm phòng"
                    onSearch={(value) => setListPhong(filteredListPhong.filter((phong) =>
                      phong.tenPhong.toLowerCase().includes(value.toLowerCase())
                    ))}
                    onChange={(e) => setSearchPhong(e.target.value)}
                    style={{ marginBottom: '16px' }}
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
                  {filteredListPhong.map((phong) => (
                    <div >
                      <Checkbox
                        key={phong.tenPhong}
                        onChange={(e) => handleSelectPhong(e.target.checked, phong)}
                        checked={listPhongSelect.includes(phong)}
                      >
                        {phong.tenPhong}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </Modal>
            )}



            {title === 'Chọn cán bộ' && (
              <Modal
                title={title}
                open={open}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                onOk={() => setOpen(false)}
                width={1500}
                centered
                bodyStyle={{ height: '600px', overflowY: 'auto' }}
              >
                <div className="flex justify-between">
                  <Input.Search
                    className="w-[30%] text-center"
                    placeholder="Tìm kiếm giảng viên ..."
                    onSearch={(value) => setListGV(filteredListGV.filter((phong) =>
                      phong.username.toLowerCase().includes(value.toLowerCase())
                    ))}
                    onChange={(e) => setSearchGV(e.target.value)}
                    style={{ marginBottom: '16px' }}
                  />

                  <div className="flex gap-3">
                    <div className="text-base-bold">Khoa:</div>
                    <Select
                      placeholder="Lọc theo khoa ..."
                      className="w-48"
                      value={selectKhoa}
                      allowClear
                      onChange={setSelectKhoa}
                      style={{ marginBottom: '16px' }} // Thêm style để tạo khoảng cách với các thành phần khác
                    >
                      {khoaOptions.map(khoa => (
                        <Select.Option key={khoa} value={khoa}>
                          {khoa}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="flex  flex-wrap gap-3 h-[20%]">
                  {filteredListGV.map((gv) => (
                    <div
                      key={gv._id}
                      className="flex items-center p-1 border border-gray-300 rounded-lg h-10"
                    // style={{ backgroundColor: getRandomColor() }}
                    >
                      <Checkbox
                        onChange={(e) => handleSelectGV(e.target.checked, gv)}
                        checked={listGVSelect.includes(gv)}
                      >
                        <UserOutlined className="text-gray-500 mr-2" style={{ fontSize: '24px' }} />
                        <span className="text-base-bold">{gv.username}</span>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </Modal>
            )}

          </TabPane>

          <TabPane tab="Kết quả" key="2">
            <TablePcCoiThi list={list} namHoc={namHoc} hocky={hocky} loaiKyThi={loaiKyThi} loaiDaoTao={loaiDaoTao} />
          </TabPane>

        </Tabs>

      </div >


    </div>
  );
};

export default PcCoiThi;
