'use client'
import { useState, useEffect } from "react";
import { Select, DatePicker, Button, message, Tabs, Card, Col, Row, Checkbox, Radio } from "antd";
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const PcCoiThiTable = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedItems, setSelectedItems] = useState({
    hocPhan: [],
    lop: [],
    phong: [],
  });
  const [listLop, setListLop] = useState([]);
  const [listHocPhan, setListHocPhan] = useState([]);
  const [listGV, setListGV] = useState([]);
  const [listPhong, setListPhong] = useState([]);
  const [examDate, setExamDate] = useState(null);
  const [examSession, setExamSession] = useState("");
  const [selectedGV, setSelectedGV] = useState([]);

  const [cbo1, setCbo1] = useState(null); // Cán bộ 1
  const [cbo2, setCbo2] = useState(null); // Cán bộ 2
  const [namHoc, setNamHoc] = useState("");
  const [loaiKyThi, setLoaiKyThi] = useState("");
  const [hocky, setHocKy] = useState("");

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

        const res3 = await fetch('/api/admin/nhom-lop');
        if (res3.ok) {
          const data = await res3.json();
          setListLop(data);
        }

        const res = await fetch('/api/admin/user/get-gv', {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setListGV(data);
        }
      } catch (error) {
        message.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (tabKey, checkedValues) => {
    setSelectedItems(prevState => ({
      ...prevState,
      [tabKey]: checkedValues
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Định dạng ngày theo ngôn ngữ và vùng của trình duyệt
  };

  const handleSubmit = async () => {
    const formattedDate = examDate ? formatDate(examDate.toISOString()) : null;

    const body = JSON.stringify({
      courses: selectedItems.hocPhan.map(id => listHocPhan.find(hp => hp._id === id)?.tenHocPhan),
      classes: selectedItems.lop.map(id => listLop.find(lp => lp._id === id)?.tenLop),
      room: selectedItems.phong ? listPhong.find(ph => ph._id === selectedItems.phong)?.tenPhong : null,
      cb1: cbo1?.username,
      cb2: cbo2?.username,
      examDate: formattedDate,
      examSession,
      loaiKyThi,
      namHoc,
      ky: hocky
    });


    console.log("Body", body);

    // if (!selectedItems.hocPhan.length || !selectedItems.lop.length || !examDate || !examSession || !selectedItems.phong.length) {
    //   message.error("Please fill in all fields");
    //   return;
    // }

    // try {
    //   const response = await fetch("/api/admin/lich-thi", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       courses: selectedItems.hocPhan,
    //       classes: selectedItems.lop,
    //       examDate,
    //       examSession,
    //       rooms: selectedItems.phong,
    //       cb1:cbo1,
    //       cb2:cbo2
    //     }),
    //   });

    //   if (response.ok) {
    //     message.success("Assignment saved successfully");
    //   } else {
    //     message.error("Failed to save assignment");
    //   }
    // } catch (error) {
    //   message.error("An error occurred");
    // }
  };

  const handleRandom = () => {
    if (listGV.length < 2) {
      message.warning("Not enough cán bộ to random");
      return;
    }

    // Copy the list and shuffle it
    let gvList = [...listGV];
    for (let i = gvList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gvList[i], gvList[j]] = [gvList[j], gvList[i]];
    }

    // Select 2 random cán bộ
    const [selectedCbo1, selectedCbo2] = gvList.slice(0, 2);

    // Update state
    setCbo1(selectedCbo1);
    setCbo2(selectedCbo2);
    setSelectedGV([selectedCbo1, selectedCbo2]);

    // Remove selected cán bộ from the original list
    const newListGV = gvList.slice(2);
    setListGV(newListGV);
  };

  // const getRandomColor = () => {
  //   const letters = '0123456789ABCDEF';
  //   let color = '#';
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // };
  const getRandomColor = () => {
    // Tạo giá trị R, G, B với một mức độ ngẫu nhiên nhưng không quá tối hoặc quá sáng
    const randomValue = () => Math.floor(Math.random() * 128) + 64; // Từ 64 đến 191

    // Tạo màu sắc với các giá trị R, G, và B trong khoảng trung bình
    const r = randomValue().toString(16).padStart(2, '0');
    const g = randomValue().toString(16).padStart(2, '0');
    const b = randomValue().toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  };


  return (
    <div className="py-4 px-6 bg-white rounded-lg shadow-lg mt-3 h-[85vh]">
      <div className="mb-4">
        <div className="flex justify-between h-[50vh] bg-gray-100 p-3">
          <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
            <TabPane tab="Chọn học phần" key="1">
              <Checkbox.Group
                options={listHocPhan.map(hocPhan => ({ label: hocPhan.tenHocPhan, value: hocPhan._id }))}
                value={selectedItems.hocPhan}
                onChange={(checkedValues) => handleSelectChange("hocPhan", checkedValues)}
              />
            </TabPane>

            <TabPane tab="Chọn lớp" key="2">
              <Checkbox.Group
                options={listLop.map(lop => ({ label: lop.tenLop, value: lop._id }))}
                value={selectedItems.lop}
                onChange={(checkedValues) => handleSelectChange("lop", checkedValues)}
              />
            </TabPane>

            <TabPane tab="Chọn phòng" key="3">
              <Radio.Group
                value={selectedItems.phong[0]} // Chọn giá trị đầu tiên của mảng phong
                onChange={(e) => {
                  const newSelection = [e.target.value]; // Cập nhật thành mảng với một giá trị
                  setSelectedItems(prevState => ({
                    ...prevState,
                    phong: newSelection
                  }));
                }}
              >
                {listPhong.map(phong => (
                  <Radio key={phong._id} value={phong._id}>
                    {phong.tenPhong}
                  </Radio>
                ))}
              </Radio.Group>

            </TabPane>

            <TabPane tab="Cán bộ coi thi" key="4">
              <div className="max-h-96 overflow-y-auto p-4">
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
              </div>
            </TabPane>

          </Tabs>
          <Button>TABLE</Button>
        </div>

        <div className="w-full mt-5">
          <Row gutter={16}>
            <Col span={6}>
              <div className="shadow-lg h-full">
                <Card title="HỌC PHẦN" bordered={false} className="h-full text-center">
                  <ul className="list-decimal pl-5 text-left">
                    {selectedItems.hocPhan.map(id => {
                      const hocPhan = listHocPhan.find(hp => hp._id === id);
                      return hocPhan ? <li key={id}>{hocPhan.tenHocPhan}</li> : null;
                    })}
                  </ul>
                </Card>
              </div>
            </Col>
            <Col span={3}>
              <div className="shadow-lg h-full text-center">
                <Card title="LỚP" bordered={false} className="h-full shadow-lg">
                  <ul className="list-decimal pl-5 text-left">
                    {selectedItems.lop.map(id => {
                      const lop = listLop.find(lp => lp._id === id);
                      return lop ? <li key={id}>{lop.tenLop}</li> : null;
                    })}
                  </ul>
                </Card>
              </div>
            </Col>
            <Col span={4}>
              <div className="shadow-lg h-full text-center">
                <Card title="PHÒNG THI" bordered={false} className="h-full shadow-lg">
                  <div className="flex flex-col gap-3">
                    <div>
                      {selectedItems.phong.map(id => {
                        const phong = listPhong.find(ph => ph._id === id);
                        return phong ? <p className="text-base-bold" key={id}>Phòng: {phong.tenPhong}</p> : null;
                      })}
                    </div>
                    <DatePicker
                      placeholder="Ngày thi"
                      onChange={(date) => setExamDate(date)}
                    />
                    <Select
                      placeholder="Ca thi"
                      onChange={(value) => setExamSession(value)}
                    >
                      <Option value="ca1">Ca 1</Option>
                      <Option value="ca2">Ca 2</Option>
                    </Select>

                  </div>
                </Card>

              </div>
            </Col>
            <Col span={6}>
              <div className="shadow-lg text-center text-base-bold h-full">
                <Card title="CÁN BỘ COI THI" bordered={false} className="h-full shadow-lg ">
                  {cbo1 && (
                    <div className="flex justify-around items-center">
                      <div className="text-base-bold ">Cán bộ 1:</div>
                      <div key={cbo1._id} className="flex items-center w-[68%] p-2 border border-gray-300 rounded mb-2">
                        <UserOutlined className="text-gray-500 mr-2" style={{ fontSize: '24px' }} />
                        <span className="text-base">{cbo1.username}</span>
                      </div>
                    </div>
                  )}
                  {cbo2 && (
                    <div className="flex justify-around items-center">
                      <div className="text-base-bold">Cán bộ 2:</div>
                      <div key={cbo2._id} className="flex items-center w-[68%] p-2 border border-gray-300 rounded mb-2">
                        <UserOutlined className="text-gray-500 mr-2" style={{ fontSize: '24px' }} />
                        <span className="text-base">{cbo2.username}</span>
                      </div>
                    </div>
                  )}
                  <Button type="primary" onClick={handleRandom}>Random</Button>
                </Card>
              </div>
            </Col>

            <Col span={5}>
              <div className="shadow-lg h-full text-center">
                <Card title="THÔNG TIN KHÁC" bordered={false} className="h-full shadow-lg">
                  <div className="flex justify-between flex-col gap-3">

                    <div className=" flex items-center gap-2">
                      <label className="block text-sm font-semibold mb-1 w-[30%]">Năm học:</label>
                      <Select
                        placeholder="Chọn năm học"
                        onChange={(value) => setNamHoc(value)}
                        className="w-[50%]"
                      >
                        <Option value="2021-2022">2021-2022</Option>
                        <Option value="2022-2023">2022-2023</Option>
                        <Option value="2023-2024">2023-2024</Option>
                        <Option value="2024-2025">2024-2025</Option>
                      </Select>
                    </div>
                    <div className=" flex items-center gap-2">
                      <label className="block text-sm font-semibold mb-1 w-[30%]">Học kỳ:</label>
                      <Select
                        placeholder="Chọn học kỳ"
                        onChange={(value) => setHocKy(value)}
                        className="w-[50%]"
                      >
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                      </Select>
                    </div>

                    <div className=" flex items-center gap-2">
                      <label className="block text-sm font-semibold mb-1 w-[30%]">Loại kỳ thi:</label>
                      <Select
                        placeholder="Chọn loại kỳ thi"
                        onChange={(value) => setLoaiKyThi(value)}
                        className="w-[50%]"
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
                </Card>
              </div>
            </Col>
          </Row>
        </div >

        <div className="flex mt-4 gap-4">
          <Button type="primary" onClick={handleSubmit}>Lưu</Button>
        </div>
      </div >
    </div >
  );
};

export default PcCoiThiTable;
