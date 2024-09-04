'use client';

import { useState, useEffect } from "react";
import { Select, DatePicker, Button, message, Tabs } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const { Option } = Select;
const { TabPane } = Tabs;

const PcCoiThiTable = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [rooms, setRooms] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [examDate, setExamDate] = useState(null);
  const [examSession, setExamSession] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [randomSupervisors, setRandomSupervisors] = useState([]);

  const [listLop, setListLop] = useState([]);
  const [listHocPhan, setListHocPhan] = useState([]);
  const [listPhong, setListPhong] = useState([]);
  const [listGV, setListGV] = useState([]);

  useEffect(() => {
    // Fetch data for courses, classes, rooms, and supervisors
    const fetchData = async () => {
      try {
        const res1 = await fetch(/api/admin/hoc-phan-thi);
        if (res1.ok) {
          const data = await res1.json();
          setListHocPhan(data);
        }

        const res2 = await fetch(/api/admin/user);
        if (res2.ok) {
          const data = await res2.json();
          setListGV(data);
        }

        const res3 = await fetch(/api/admin/phong-thi);
        if (res3.ok) {
          const data = await res3.json();
          setListPhong(data);
        }

        const res4 = await fetch(/api/admin/nhom-lop);
        if (res4.ok) {
          const data = await res4.json();
          setListLop(data);
        }
      } catch (error) {
        message.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleRandomize = () => {
    if (listGV.length < 2) {
      message.error("Not enough supervisors to randomize");
      return;
    }

    const shuffleArray = (array) => {
      let currentIndex = array.length, randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    };

    const shuffledSupervisors = shuffleArray([...listGV]).slice(0, 2);
    setRandomSupervisors(shuffledSupervisors);
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !selectedClass || !examDate || !examSession || !selectedRoom) {
      message.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: selectedCourse,
          class: selectedClass,
          examDate,
          examSession,
          room: selectedRoom,
          supervisors: randomSupervisors,
        }),
      });

      if (response.ok) {
        message.success("Assignment saved successfully");
      } else {
        message.error("Failed to save assignment");
      }
    } catch (error) {
      message.error("An error occurred");
    }
  };


  const getItemBackgroundColor = (tabKey) => {
    switch (tabKey) {
      case "1":
        return "bg-blue-200"; // Màu nền cho học phần
      case "2":
        return "bg-green-200"; // Màu nền cho lớp
      case "3":
        return "bg-yellow-200"; // Màu nền cho phòng
      default:
        return "";
    }
  };

  return (
    <div className="py-4 px-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        {/* Chỗ này hiển thị tab để chọn danh sách */}
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="Chọn học phần" key="1">
            <div className="flex gap-2">
              {listHocPhan.map((hocPhan, index) => (
                <div className={item ${getItemBackgroundColor("1")} p-2 mb-2 rounded-md}>{hocPhan.tenHocPhan}</div>
              ))}
            </div>


          </TabPane>

          <TabPane tab="Chọn lớp" key="2">
            <div className="flex gap-2" >
              {listLop.map((hocPhan, index) => (
                <div className={item ${getItemBackgroundColor("1")} p-2 mb-2 rounded-md}>{hocPhan.tenLop}</div>
              ))}
            </div>

          </TabPane>

          <TabPane tab="Chọn phòng" key="3">
            <div className="flex gap-2">
              {listPhong.map((hocPhan, index) => (
                <div className={item ${getItemBackgroundColor("1")} p-2 mb-2 rounded-md}>{hocPhan.tenPhong}</div>
              ))}
            </div>

          </TabPane>
        </Tabs>

        <div className="flex gap-2 w-full justify-between mt-3">
          <div className="list1">
            Xử lý để kéo list học phần vào đây
          </div>
          <div className="list2">
            Xử lý để kéo list lớp vào đây
          </div>
          <div className="list3">
            Xử lý để kéo phòng vào đây
          </div>
          <div className="list4">
            <h3>Giám khảo đã chọn</h3>
            {randomSupervisors.map((supervisor, index) => (
              <div key={index}>
                {supervisor.name}
              </div>
            ))}
            <div className="w-1/4">
              <Button onClick={handleRandomize} className="w-full" type="primary">
                Randomize Giám khảo
              </Button>
              Hiển thị 2 giám khảo ở đây
            </div>
          </div>
          <div className="list5">
            <div>
              <label className="block text-sm font-semibold mb-1">Chọn ngày thi:</label>
              <DatePicker onChange={(date) => setExamDate(date)} className="w-full" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Chọn ca thi:</label>
              <Select
                placeholder="Chọn ca thi"
                onChange={(value) => setExamSession(value)}
                className="w-full"
              >
                <Option value="1">Ca 1</Option>
                <Option value="2">Ca 2</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Chọn phòng thi:</label>
              <Select
                placeholder="Chọn phòng thi"
                onChange={(value) => setSelectedRoom(value)}
                className="w-full"
              >
                {rooms.map((room) => (
                  <Option key={room.id} value={room.id}>
                    {room.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

        </div>
        <div className="mt-4">
          <Button type="primary" onClick={handleSubmit}>
            Lưu
          </Button>
        </div>
      </div>
    </div >
  );
};

export default PcCoiThiTable;