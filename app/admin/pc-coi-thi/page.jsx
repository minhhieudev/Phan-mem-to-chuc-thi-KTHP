'use client'
import { useState, useEffect, useRef } from "react";
import { Select, DatePicker, Button, message, Tabs, Card, Col, Row, Checkbox, Space, Radio, Input, Table, Modal, Spin, Upload } from "antd";

import { UserOutlined, BookOutlined, HomeOutlined, CalendarOutlined, FileAddOutlined, DeleteOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import Loader from "../../../components/Loader";
import TablePcCoiThi from "@components/CoiThi/TablePcCoiThi";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from 'xlsx';
import { CldUploadButton } from "next-cloudinary";


const CheckboxGroup = Checkbox.Group;
const { Dragger } = Upload;

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const PcCoiThi = () => {
  const [activeTab, setActiveTab] = useState("3");

  const [listHocPhan, setListHocPhan] = useState([]);
  const [listGV, setListGV] = useState([]);
  const [listPhong, setListPhong] = useState([]);

  const [listHocPhanSelect, setListHocPhanSelect] = useState([]);
  const [listGVSelect, setListGVSelect] = useState([]);
  const [listPhongSelect, setListPhongSelect] = useState([]);

  const [examSessions, setExamSessions] = useState([]);
  const [list, setList] = useState([]);

  const [namHoc, setNamHoc] = useState("2024-2025");
  const [loaiKyThi, setLoaiKyThi] = useState("");
  const [loaiDaoTao, setLoaiDaoTao] = useState("Chính quy");
  const [hocKy, setHocKy] = useState("");
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

  const [listGVKhoa, setListGVKhoa] = useState([]);


  const [GVToGetKhoa, setGVToGetKhoa] = useState('');
  const [fetchs, setFetchs] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;

  const [isDisplay, setIsDisplay] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [dataMonThi, setDataMonThi] = useState([]);
  const [dataSinhVien, setDataSinhVien] = useState([]);
  const [dataPhong, setDataPhong] = useState([]);
  const [dataGV, setDataGV] = useState([]);


  const onCheckAllChange = (e) => {
    setListHocPhanSelect(e.target.checked ? listHocPhan : []);
  };
  const onCheckAllChangePhong = (e) => {
    setListPhongSelect(e.target.checked ? listPhong : []);
  };

  const onCheckAllChangeGV = (e) => {
    setListGVSelect(e.target.checked ? listGV : []);
  };

  const onCheckAllChangeGV2 = (e) => {
    setChecked(!checked);
    if (e.target.checked) {
      setListGVSelect(prevList => [...prevList, ...filteredListGV]);
    }
    else {
      setListGVSelect(filteredListGV);
      const updatedList = listGVSelect.filter(item => !filteredListGV.includes(item));
      setListGVSelect(updatedList);
    }
  };

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

  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(false);
  }, [selectKhoa]);

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
  }, [selectKhoa, listGV, searchGV]);

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
    if (!examDateRange.startDate || !examDateRange.endDate || !examSessions.length || !namHoc || !loaiKyThi || !hocKy || !loaiDaoTao) {
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
          _id: uuidv4(),
          hocPhan: hocPhan1.tenHocPhan,
          lop: hocPhan.lop.join(", "),
          hinhThuc: hocPhan.hinhThuc,
          thoiGian: hocPhan.thoiGian,
          phong: phong.tenPhong,
          cbo1: cbo1.username,
          cbo2: cbo2.username,
          ca: 1,
          ngayThi: ngayThi,
          namHoc,
          loaiKyThi,
          hocKy,
          loaiDaoTao
        },
        {
          _id: uuidv4(),
          hocPhan: hocPhan2.tenHocPhan,
          lop: hocPhan.lop.join(", "),
          hinhThuc: hocPhan.hinhThuc,
          thoiGian: hocPhan.thoiGian,
          phong: phong.tenPhong,
          cbo1: cbo1.username,
          cbo2: cbo2.username,
          ca: 3,
          ngayThi: ngayThi,
          namHoc,
          loaiKyThi,
          hocKy,
          loaiDaoTao
        }
      ];
    };




    let hocPhanListNonT7CN = listHocPhanSelect?.filter(hp => !hp.thiT7CN);
    let hocPhanListT7CN = listHocPhanSelect?.filter(hp => hp.thiT7CN);

    let phongList = [...listPhongSelect];
    let phongMayList = phongList.filter(phong => phong.loai === "Phòng máy");
    let phongThuongList = phongList.filter(phong => phong.loai === "Phòng thường");
    let phongGDTCList = phongList.filter(phong => phong.loai === "Phòng GDTC");
    let gvList = [...listGVSelect];

    const randomSchedules = [];
    const usedDates = new Set();

    const scheduleHocPhanList = async (hocPhanList, allowSatSun) => {

      while (hocPhanList.length > 0) {
        const randomHocPhan = hocPhanList.splice(Math.floor(Math.random() * hocPhanList.length), 1)[0];

        // Lấy danh sách giảng viên theo khoa
        let gvKhoa = []
        if (randomHocPhan) {
          setGVToGetKhoa(randomHocPhan.giangVien)
          setFetchs(!fetchs)
          try {
            const res5 = await fetch(`/api/admin/get-gv-khoa?khoa=${randomHocPhan.giangVien}`);
            if (res5.ok) {
              const data = await res5.json();
              gvKhoa = data;
            }

          } catch (error) {
            console.log("Error:", error)
            message.error("Failed to fetch data");
          }
        }
        ////////////////////////


        // Random lấy phòng
        let randomPhong;

        if (randomHocPhan.hinhThuc === "GDTC") {
          randomPhong = phongGDTCList.length > 0 ? phongGDTCList.splice(Math.floor(Math.random() * phongGDTCList.length), 1)[0] : { tenPhong: "Hết phòng GDTC!!!" };
        } else if (randomHocPhan.hinhThuc === "TH") {
          randomPhong = phongMayList.length > 0 ? phongMayList.splice(Math.floor(Math.random() * phongMayList.length), 1)[0] : { tenPhong: "Thiếu phòng thực hành!!!!" };
        } else {
          randomPhong = phongThuongList.length > 0 ? phongThuongList.splice(Math.floor(Math.random() * phongThuongList.length), 1)[0] : { tenPhong: "Hết phòng !!!" };
        }
        /////////////////////


        // Random lấy cán bộ /////////////

        let randomCbo1, randomCbo2;

        if (randomHocPhan.hinhThuc == "TH") {
          // Nếu hinhThuc là 'TH', cbo1 là giảng viên của học phần đó
          randomCbo1 = { username: randomHocPhan.giangVien };

          // cbo2 được lấy từ danh sách listGVKhoa
          if (gvKhoa.length > 0) {
            randomCbo2 = gvKhoa.splice(Math.floor(Math.random() * gvKhoa.length), 1)[0];
          } else {
            randomCbo2 = { username: "Hết giảng viên khoa!" };
          }

          if (randomCbo2.username === randomCbo1.username && gvKhoa.length > 0) {
            randomCbo2 = gvKhoa.splice(Math.floor(Math.random() * gvKhoa.length), 1)[0];
          }
          gvKhoa = []

        } else {
          let gvList = [...listGVSelect]; /// KHÔNG HIỂU CHỖ NÀY 

          //console.log(JSON.stringify(gvList, null, 2));

          // Nếu hinhThuc khác 'TH', cbo1 và cbo2 không được là giảng viên giảng dạy môn đó hoặc giảng viên trong khoa
          const filterGVList = gvList.filter(gv => gv.username != randomHocPhan.giangVien && !gvKhoa.some(gvKhoa => gvKhoa.username == gv.username));


          if (filterGVList.length > 0) {
            randomCbo1 = filterGVList.splice(Math.floor(Math.random() * filterGVList.length), 1)[0];
          } else {
            randomCbo1 = { username: "Hết giảng viên!!!!" };
          }

          if (filterGVList.length > 0) {
            randomCbo2 = filterGVList.splice(Math.floor(Math.random() * filterGVList.length), 1)[0];
          } else {
            randomCbo2 = { username: "Hết giảng viên!!!!" };
          }

          if (randomCbo2.username === randomCbo1.username && gvList.length > 0) {
            randomCbo2 = gvList.splice(Math.floor(Math.random() * gvList.length), 1)[0];
          }
          gvKhoa = []
        }

        // Nếu cbo1 và cbo2 bị trùng, chọn lại cbo2


        /////////////////////////////////

        //// CA THI  
        const availableCaSessions = examSessions;
        const randomCa = availableCaSessions.length > 0 ? randomFromArray(availableCaSessions) : "Không có dữ liệu";
        ////////////

        ////// NGÀY THI 
        const randomDate = getRandomDate(examDateRange.startDate, examDateRange.endDate, usedDates, randomHocPhan, allowSatSun);
        //////////

        if (randomHocPhan.soSVDK > randomPhong.soCho) {
          const splitSchedules = handleSplitHocPhan(randomHocPhan, randomPhong, randomCbo1, randomCbo2, randomCa, randomDate);
          randomSchedules.push(...splitSchedules);
        }
        else {
          const schedule = {
            _id: uuidv4(),
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
            hocKy,
            loaiDaoTao
          };

          randomSchedules.push(schedule);
        }
        setGVToGetKhoa('')

      }
    };

    scheduleHocPhanList(hocPhanListNonT7CN, false);
    scheduleHocPhanList(hocPhanListT7CN, true);

    setList(randomSchedules);

    setActiveTab("2");

  };


  const getRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 128) + 64;

    const r = randomValue().toString(16).padStart(2, '0');
    const g = randomValue().toString(16).padStart(2, '0');
    const b = randomValue().toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  };


  // Xử lý đọc Excel

  const importMonThi = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const ListData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      ListData.shift(); // Loại bỏ dòng tiêu đề nếu cần

      if (ListData.length > 0) {
        setDataMonThi(ListData)
      } else {
        toast.error("Lỗi khi đọc file.");
      }
      console.log("Dữ liệu từ file Excel đã lọc:", ListData);
    };

    reader.onerror = () => {
      toast.error("Đã xảy ra lỗi khi đọc file Excel");
    };

    reader.readAsBinaryString(file);
  };
  const importPhong = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const ListData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      ListData.shift(); // Loại bỏ dòng tiêu đề nếu cần

      if (ListData.length > 0) {
        setDataPhong(ListData)
      } else {
        toast.error("Lỗi khi đọc file.");
      }
      console.log("Dữ liệu từ file Excel đã lọc:", ListData);
    };

    reader.onerror = () => {
      toast.error("Đã xảy ra lỗi khi đọc file Excel");
    };

    reader.readAsBinaryString(file);
  };
  const importGV = (e) => {

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const ListData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      ListData.shift();

      if (ListData.length > 0) {
        setDataGV(ListData)
      } else {
        toast.error("Lỗi khi đọc file.");
      }
      console.log("Dữ liệu từ file Excel đã lọc:", ListData);
    };

    reader.onerror = () => {
      toast.error("Đã xảy ra lỗi khi đọc file Excel");
    };

    reader.readAsBinaryString(file);
  };
  const importSinhVien = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const ListData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      ListData.shift();

      // Map dữ liệu thành cấu trúc { maSV, hoTen, lop, maMon }
      const formattedData = ListData.map((row, index) => ({
        key: index.toString(),
        maSV: row[0],
        hoTen: row[1],
        lop: row[2],
        maMon: row[3]
      }));

      // Kiểm tra nếu có dữ liệu sau khi import
      if (formattedData.length > 0) {
        setDataSinhVien(formattedData);

        // Tính toán số liệu thống kê
        const uniqueLops = new Set(formattedData.map(item => item.lop)).size;
        const uniqueSVs = new Set(formattedData.map(item => item.maSV)).size;
        const uniqueMonThi = new Set(formattedData.map(item => item.maMon));

        setSoSV(uniqueSVs);       // Tổng số sinh viên
        setSoLop(uniqueLops);                // Tổng số lớp
        setSoMonThi(uniqueMonThi.size);     
        
        console.log('hh:',[...uniqueMonThi])// Tổng số môn thi

        setListHocPhanSelect([...uniqueMonThi])
      } else {
        toast.error("Lỗi khi đọc file.");
      }
    };

    reader.onerror = () => {
      toast.error("Đã xảy ra lỗi khi đọc file Excel");
    };

    reader.readAsBinaryString(file);
  };


  const create2 = () => {

    const dataSinhVien = [
      ['211CTT004', 'Võ Minh Hiếu', 'KC21345', 'DC21CTT01'],
      ['211CTT005', 'Lê Văn Nam', 'KC21345', 'DC21CTT01'],
      ['211CTT006', 'Hồ Hà', 'KC21345', 'DC21CTT02'],
      ['211CTT007', 'Lê My', 'KC21346', 'DC21NNA01']
    ];

    // Tạo object lưu danh sách môn thi, sinh viên và lớp
    const result = {};

    // Duyệt qua từng sinh viên trong dataSinhVien
    dataSinhVien.forEach(([maSinhVien, hoTen, maMonThi, lop]) => {
      // Nếu môn thi chưa tồn tại trong result, thêm môn thi đó với cấu trúc mới
      if (!result[maMonThi]) {
        result[maMonThi] = { sinhVien: [], lop: [], tongSoThiSinh: 0 };
      }

      // Thêm thông tin sinh viên vào danh sách sinh viên của môn thi
      result[maMonThi].sinhVien.push({
        maSV: maSinhVien,
        hoTen: hoTen,
        lop: lop
      });

      // Tăng tổng số thí sinh
      result[maMonThi].tongSoThiSinh++;

      // Thêm lớp vào danh sách lớp nếu chưa có lớp đó
      if (!result[maMonThi].lop.includes(lop)) {
        result[maMonThi].lop.push(lop);
      }
    });

    console.log(result);
    return result;
  };



  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 18,
      render: (text, record, index) => <span style={{ fontWeight: 'bold' }}>{index + 1}</span>,
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'username',
      key: 'username',
      width: 60,
      render: (text) => <span style={{ fontWeight: 'bold', color: 'orange' }}>{text}</span>,
    },
    {
      title: 'Khoa',
      dataIndex: 'khoa',
      key: 'khoa',
      width: 60,
      render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span>,
    },
    {
      title: 'Xóa',
      key: 'action',
      width: 10,
      render: (_, record) => (

        //<Button onConfirm={() => handleDelete(record._id)} size="small" type="primary" danger>Xoá</Button>
        <DeleteOutlined
          className="text-red-500 cursor-pointer ml-2"
          onClick={() => handleDeleteGV(record.index)}
        />

      ),
      width: 20,
    },
  ];

  // ===========================================================================
  const [editingKey, setEditingKey] = useState('');
  const [editingRecord, setEditingRecord] = useState({});

  const [soSV, setSoSV] = useState('');
  const [soLop, setSoLop] = useState('');
  const [soMonThi, setSoMonThi] = useState('');


  // Hàm xóa sinh viên
  const deleteStudent = (key) => {
    setDataSinhVien(dataSinhVien.filter((item) => item.key !== key));
  };

  // Hàm bật chế độ chỉnh sửa
  const editStudent = (record) => {
    setEditingKey(record.key);
    setEditingRecord({ ...record });
  };

  // Hàm xử lý khi lưu thay đổi
  const saveEdit = () => {
    setDataSinhVien((prevData) =>
      prevData.map((item) => (item.key === editingKey ? editingRecord : item))
    );
    setEditingKey('');
  };

  // Hàm hủy chế độ chỉnh sửa
  const cancelEdit = () => {
    setEditingKey('');
  };

  // Hàm cập nhật dữ liệu chỉnh sửa
  const handleEditChange = (field, value) => {
    setEditingRecord((prev) => ({ ...prev, [field]: value }));
  };

  // Cấu hình cột bảng
  const columnSV = [
    {
      title: 'STT',
      dataIndex: 'index',
      render: (text, record, index) => <span style={{ fontWeight: 'bold' }}>{index + 1}</span>,
    },
    {
      title: 'Mã SV',
      dataIndex: 'maSV',
      key: 'maSV',
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            value={editingRecord.maSV}
            onChange={(e) => handleEditChange('maSV', e.target.value)}
          />
        ) : (
          record.maSV
        ),
      className: 'font-bold text-green-500'
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            value={editingRecord.hoTen}
            onChange={(e) => handleEditChange('hoTen', e.target.value)}
          />
        ) : (
          record.hoTen
        ),
      className: 'font-bold '

    },
    {
      title: 'Lớp',
      dataIndex: 'lop',
      key: 'lop',
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            value={editingRecord.lop}
            onChange={(e) => handleEditChange('lop', e.target.value)}
          />
        ) : (
          record.lop
        ),
      className: 'font-bold text-red-500'

    },
    {
      title: 'Mã môn',
      dataIndex: 'maMon',
      key: 'maMon',
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            value={editingRecord.maMon}
            onChange={(e) => handleEditChange('maMon', e.target.value)}
          />
        ) : (
          record.maMon
        ),
      className: 'font-bold text-blue-500'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const isEditing = editingKey === record.key;
        return isEditing ? (
          <Space size="middle">
            <Button onClick={saveEdit} type="primary" size="small">
              Lưu
            </Button>
            <Button onClick={cancelEdit} size="small">
              Hủy
            </Button>
          </Space>
        ) : (
          <Space size="middle">
            <Button onClick={() => editStudent(record)} type="primary" size="small">
              Sửa
            </Button>
            <Button onClick={() => deleteStudent(record.key)} type="primary" danger size="small">
              Xoá
            </Button>
          </Space>
        );
      },
    },
  ];



  return loading ? (
    <Loader />
  ) : (
    <div>
      <div className="py-1 px-3 bg-gray-100 rounded-lg shadow-lg mt-2 h-[90vh]">
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>

          <TabPane tab="Dữ liệu sinh viên" key="3">
            <div className="flex gap-3 h-[82vh] ">
              {/* Left Container */}
              <div className="flex-[60%] p-1 bg-white rounded-md flex flex-col gap-2">
                <div className=" h-[75%] p-1">
                  <Table
                    dataSource={dataSinhVien}
                    columns={columnSV}
                    scroll={{ y: 400 }} // Chỉ cuộn dọc
                    pagination={false}  // Tắt phân trang nếu cần
                  />


                </div>
                <div className="border-dashed border-2 border-blue-500 rounded-lg p-2 text-center bg-blue-50 hover:bg-blue-100 transition-all duration-300">
                  <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                  <p className="text-blue-600 mt-2"> Chọn file</p>
                  <div className="">
                    <Spin spinning={isUploading}>
                      <label htmlFor="excelUpload">
                        <Button
                          className="button-chinh-quy-khac mt-1"
                          type="primary"
                          icon={<UploadOutlined />}
                          onClick={() => fileInputRef.current.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? 'Đang tải lên...' : 'Import'}
                        </Button>
                      </label>
                    </Spin>

                    <div className="hidden">
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={importSinhVien}
                        className="hidden"
                        id="excelUpload"
                        ref={fileInputRef}
                      />
                    </div>
                  </div>
                </div>
              </div>



              {/* Right Side with 3 Boxes */}
              <div className="space-y-3 flex-grow h-full">
                <div className="p-4 bg-white shadow-md rounded-lg h-[32%] flex flex-col">
                  <h3 className="text-lg text-heading3-bold ">SỐ MÔN THI</h3>
                  <p className="text-heading1-bold text-center text-blue-600 mt-auto mb-auto">{soMonThi}</p>
                </div>

                <div className="p-4 bg-white shadow-md rounded-lg h-[32%] flex flex-col">
                  <h3 className="text-lg text-heading3-bold ">SỐ SINH VIÊN</h3>
                  <p className=" text-heading1-bold text-center text-green-600 mt-auto mb-auto">{soSV}</p>
                </div>

                <div className="p-4 bg-white shadow-md rounded-lg h-[32%] flex flex-col">
                  <h3 className="text-lg text-heading3-bold ">SỐ LỚP</h3>
                  <p className=" text-heading1-bold text-center text-red-600 mt-auto mb-auto">{soLop}</p>
                </div>
              </div>

            </div>

          </TabPane>

          <TabPane tab="Tạo lịch thi" key="1">
            <div className="text-heading3-bold text-blue-600 text-center ">THÔNG TIN KỲ THI</div>
            <div className="flex justify-between gap-3 mt-2">
              <div className=" flex items-center gap-2">
                <label className="block text-sm font-semibold mb-1 ">Loại đào tạo:</label>
                <Select
                  size="small"
                  value={loaiDaoTao}
                  placeholder="Chọn loại đào tạo"
                  onChange={(value) => setLoaiDaoTao(value)}
                  className=""
                >
                  <Option value="Chính quy">Chính quy</Option>
                  <Option value="Liên thông vừa làm vừa học">Liên thông vừa làm vừa học</Option>
                </Select>
              </div>
              <div className=" flex items-center gap-2">
                <label className="block text-sm font-semibold mb-1 ">Năm học:</label>
                <Select size="small"
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
              <div className=" flex items-center gap-2 ">
                <label className="block text-sm font-semibold mb-1 ">Học kỳ:</label>
                <Select size="small"
                  value={hocKy}
                  placeholder="Chọn học kỳ"
                  onChange={(value) => setHocKy(value)}
                  className="w-[60px]"
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="he">Hè</Option>
                </Select>

              </div>

              <div className=" flex items-center gap-2 ">
                <label className="block text-sm font-semibold mb-1 ">Loại kỳ thi:</label>
                <Select size="small"
                  value={loaiKyThi}
                  placeholder="Chọn loại kỳ thi"
                  onChange={(value) => setLoaiKyThi(value)}
                  className="w-[152px]"
                >
                  <Option value="1">Chính thức</Option>
                  <Option value="2">Đợt 2</Option>
                  <Option value="3">Đợt 3</Option>
                  <Option value="4">Đợt 4</Option>
                  <Option value="5">Đợt 5</Option>
                  <Option value="6">Đợt 6</Option>
                  <Option value="7">Đợt 7</Option>

                </Select>
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

              <div className="flex flex-col gap-3">
                <div className=" flex items-center gap-2">
                  <label className="block text-sm font-semibold mb-1">Ca:</label>
                  <Checkbox.Group
                    options={[
                      { label: "1", value: 1 },
                      { label: "3", value: 3 },
                    ]}
                    value={examSessions}
                    onChange={(checkedValues) => setExamSessions(checkedValues)}
                  />
                </div>
              </div>

            </div>
            <div className="w-full mt-2">
              <Row gutter={10}>
                <Col span={7} className="h-[60%] overflow-y-auto">
                  <div className="shadow-lg ">
                    <Card
                      title={<span><BookOutlined /> HỌC PHẦN</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: '#f0f8ff' }} // Màu nền nhẹ
                    >
                      <ul className="list-decimal pl-5 text-left max-h-[300px] overflow-auto bg-[#f0f8ff]">
                        {listHocPhanSelect?.map((hocPhan, index) => (
                          <li key={hocPhan.tenHocPhan} className="flex justify-between items-center">
                            <span>{index + 1}. {hocPhan.tenHocPhan} ({hocPhan.lop?.join(', ')})</span>
                            <DeleteOutlined
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleDeleteHocPhan(index)}
                            />
                          </li>
                        ))}
                      </ul>

                    </Card>

                  </div>

                </Col>

                <Col span={5} className="h-[60%] overflow-y-auto">
                  <div className="shadow-lg  text-center ">
                    <Card
                      title={<span><UserOutlined /> Danh sách SV</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: '#fafafa' }}
                    >
                      {dataSinhVien?.map((phong, index) => (
                        <div key={phong[1]} className="flex justify-between items-center">
                          <p className="text-base-bold">- {phong[2]}</p>
                          <DeleteOutlined
                            className="text-red-500 cursor-pointer"
                          //onClick={() => handleDeletePhong(index)}
                          />
                        </div>
                      ))}

                      <div className="flex gap-4 mt-3 flex-col items-center">
                        {/* <Button className="button-lien-thong-vlvh text-white w-[50%] flex justify-center" onClick={() => { setOpen(true); setTitle('Chọn phòng') }}>Chọn Sinh viên</Button> */}
                        <div className="">
                          <Spin spinning={isUploading}>
                            <label htmlFor="excelUpload">
                              <Button
                                className="button-chinh-quy-khac"
                                type="primary"
                                icon={<UploadOutlined />}
                                onClick={() => fileInputRef.current.click()}
                                disabled={isUploading}
                              >
                                {isUploading ? 'Đang tải lên...' : 'Import'}
                              </Button>
                            </label>
                          </Spin>

                          <div className="hidden">
                            <input
                              type="file"
                              accept=".xlsx, .xls"
                              onChange={importSinhVien}
                              className="hidden"
                              id="excelUpload"
                              ref={fileInputRef}
                            />
                          </div>
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

                      <ul className="list-decimal text-left max-h-[300px] overflow-auto bg-[#f5f5f5]">
                        {listPhongSelect.map((phong, index) => (
                          <div key={phong.tenPhong} className="flex justify-between items-center">
                            <p className="text-base-bold">- {phong.tenPhong}</p>
                            <DeleteOutlined
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleDeletePhong(index)}
                            />
                          </div>
                        ))}
                      </ul>

                      <div className="flex gap-4 mt-3 flex-col">
                        <Button className="button-lien-thong-vlvh-nd71 text-white" onClick={() => { setOpen(true); setTitle('Chọn phòng') }}>Chọn phòng thi</Button>

                      </div>

                    </Card>
                  </div>
                </Col>
                <Col span={9} className=" ">
                  <div className="shadow-lg text-center text-base-bold h-[49vh] ">
                    <Card
                      title={<span><UserOutlined /> CÁN BỘ COI THI</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: '#f0fff0' }} // Màu nền
                    >
                      <div className="h-full w-full ">
                        <Table
                          scroll={{ y: '360px' }}
                          columns={columns}
                          dataSource={listGVSelect}
                          rowKey="_id"
                          pagination={false} // Tắt phân trang trên Table
                        />
                        {/* {listGVSelect.map((gv, index) => (
                          <div
                            key={`${gv.id}-${index}`}
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
                        ))} */}
                      </div>
                    </Card>

                  </div>
                  <div className="flex gap-4 mt-3 justify-center">
                    <Button className="button-boi-duong text-white" onClick={() => { setOpen(true); setTitle('Chọn cán bộ') }}>Chọn cán bộ</Button>
                    <div className="">
                      <Spin spinning={isUploading}>
                        <label htmlFor="excelUpload">
                          <Button
                            className="button-chinh-quy-khac"
                            type="primary"
                            icon={<UploadOutlined />}
                            onClick={() => fileInputRef.current.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? 'Đang tải lên...' : 'Import'}
                          </Button>
                        </label>
                      </Spin>

                      <div className="hidden">
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={importGV}
                          className="hidden"
                          id="excelUpload"
                          ref={fileInputRef}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div >
            <div className="bg-white text-center rounded-md p-0">
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
                styles={{ height: '600px', overflowY: 'auto' }}
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

                <Checkbox onChange={onCheckAllChange} >
                  Chọn tất cả
                </Checkbox>

                <ul className="list-decimal pl-5 text-left">
                  {filteredListHocPhan.map((hocPhan) => (
                    <li key={hocPhan.tenHocPhan}>
                      <Checkbox
                        onChange={(e) => handleSelectHocPhan(e.target.checked, hocPhan)}
                        checked={listHocPhanSelect?.includes(hocPhan)}
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
                styles={{ height: '600px', overflowY: 'auto' }}
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
                <Checkbox onChange={onCheckAllChangePhong} >
                  Chọn tất cả
                </Checkbox>
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

                <Checkbox
                  onChange={onCheckAllChangeGV}
                  style={{ display: selectKhoa ? 'none' : '' }}
                >
                  Chọn tất cả
                </Checkbox>
                <Checkbox
                  checked={checked}
                  onChange={onCheckAllChangeGV2}
                  style={{ display: selectKhoa ? '' : 'none' }}
                >
                  Chọn tất cả *
                </Checkbox>

                <div className="flex mt-1 flex-wrap gap-3 max-h-[450px] overflow-auto">
                  {filteredListGV.map((gv) => (
                    <div
                      key={gv._id}
                      className="flex items-center p-1 border border-gray-300 rounded-lg h-10"
                    >
                      <Checkbox
                        onChange={(e) => handleSelectGV(e.target.checked, gv)}
                        checked={listGVSelect.includes(gv)}
                      >
                        <UserOutlined className="text-gray-500 mr-2" style={{ fontSize: '24px', color: getRandomColor() }} />
                        <span className="text-base-bold">{gv.username}</span>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </Modal>
            )}

          </TabPane>

          <TabPane tab="Kết quả" key="2">
            <TablePcCoiThi
              list={list.sort((a, b) => {
                const [dayA, monthA, yearA] = a.ngayThi.split("/").map(Number);
                const [dayB, monthB, yearB] = b.ngayThi.split("/").map(Number);

                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);

                return dateA - dateB;
              })}
              namHoc={namHoc}
              loaiKyThi={loaiKyThi}
              loaiDaoTao={loaiDaoTao}
              hocKy={hocKy}

            />
          </TabPane>'



        </Tabs>

      </div >


    </div>
  );
};

export default PcCoiThi;
