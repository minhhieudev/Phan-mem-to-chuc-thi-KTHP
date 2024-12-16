'use client'
import { useState, useEffect, useRef } from "react";
import { Select, DatePicker, Button, message, Tabs, Card, Col, Row, Checkbox, Space, Radio, Input, Table, Modal, Spin, Upload } from "antd";

import { UserOutlined, BookOutlined, HomeOutlined, CalendarOutlined, RightOutlined, DeleteOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons';
import Loader from "../../../components/Loader";
import TablePcCoiThi from "@components/CoiThi/TablePcCoiThi";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from 'xlsx';
import toast from "react-hot-toast";

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const PcCoiThi = () => {
  const [activeTab, setActiveTab] = useState("4");

  const [listGV, setListGV] = useState([]);
  const [listPhong, setListPhong] = useState([]);

  const [listGVSelect, setListGVSelect] = useState([]);
  const [listPhongSelect, setListPhongSelect] = useState([]);

  const [examSessions, setExamSessions] = useState('DHPY'); /// ĐỊA ĐIỂM
  const [list, setList] = useState([]);

  const [namHoc, setNamHoc] = useState("2024-2025");
  const [loaiKyThi, setLoaiKyThi] = useState("1");
  const [loaiDaoTao, setLoaiDaoTao] = useState("Chính quy");
  const [hocKy, setHocKy] = useState("1");
  const [examDateRange, setExamDateRange] = useState({});   // Ngày thi
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [searchPhong, setSearchPhong] = useState("");
  const [searchGV, setSearchGV] = useState("");

  const [filteredListPhong, setFilteredListPhong] = useState([]);
  const [filteredListGV, setFilteredListGV] = useState([]);

  const [selectKhoa, setSelectKhoa] = useState("");
  const [khoaOptions, setKhoaOptions] = useState([]);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [dataSinhVien, setDataSinhVien] = useState([]);

  const [listHocPhanThi, setListHocPhanThi] = useState([]);
  const [result, setResult] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [listSVToClass, setListSVToClass] = useState([]);
  const [selectedHocPhan, setSelectedHocPhan] = useState(null);

  const [listPhongFilter, setListPhongFilter] = useState([]);


  const [resultFinals, setResultFinals] = useState([]);
  const [monThiMoiNgay, setMonThiMoiNgay] = useState([]);
  const [tableGV, setTableGV] = useState([]);
  const [ngayThiSelect, setNgayThiSelect] = useState('');



  const onCheckAllChangePhong = (e) => {
    setListPhongSelect(e.target.checked ? listPhong : []);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSelectPhong = (checked, phong) => {
    setListPhongSelect((prev) =>
      checked ? [...prev, phong] : prev.filter((item) => item !== phong)
    );
  };

  const handleSelectGV = (checked, gv) => {
    if (ngayThiSelect === '') {
      toast.error('Chưa chọn ngày coi thi cho giảng viên !');
      return;
    }
    setListGVSelect((prev) =>
      checked
        ? [...prev, { ...gv, ngayThi: ngayThiSelect }]
        : prev.filter((item) => item._id !== gv._id) // Sử dụng một thuộc tính để so sánh
    );
    if (checked) {


      setTableGV((prev) =>
        [...prev, { ...gv, ngayThi: ngayThiSelect, id: Date.now() }]
      );
    }
  };

  const handleDeleteHocPhan = (index) => {
    const updatedList = [...result];
    updatedList.splice(index, 1);
    setResult(updatedList);
  };

  const handleDeletePhong = (index) => {
    const updatedList = [...listPhongSelect];
    updatedList.splice(index, 1);
    setListPhongSelect(updatedList);
  };

  const handleDeleteGV = (index) => {
    const updatedList = [...tableGV];
    updatedList.splice(index, 1);
    setTableGV(updatedList);
  };

  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(false);
  }, [selectKhoa]);

  useEffect(() => {
    console.log('Rerender')
  }, []);

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

        const res2 = await fetch('/api/admin/phong-thi/status');
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
    let filteredData = listGV;

    if (searchGV) {
      filteredData = filteredData.filter(gv =>
        gv.username.toLowerCase().includes(searchGV.toLowerCase())
      );
    }

    if (selectKhoa) {
      filteredData = filteredData.filter(gv => gv.khoa == selectKhoa);
    }
    if (selectKhoa) {
      setFilteredListGV(filteredData);
    } else {
      setFilteredListGV([]);
    }
  }, [selectKhoa, listGV, searchGV]);

  // Xử lý đọc Excel

  const importSinhVien = (e) => {
    setDataSinhVien([]);
    setIsUploading(true);
    const file = e.target.files[0];
  
    if (!file) {
      console.warn("Không có file nào được chọn.");
      setIsUploading(false);
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
  
      let currentMaMon = ""; // Biến lưu mã học phần hiện tại
      const formattedData = [];
  
      // Đọc tất cả các sheet trong file Excel
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
        rawData.forEach((row) => {
  
          // Kiểm tra dòng chứa "Mã học phần:"
          if (row[0] && row[0].toLowerCase().includes("mã học phần:")) {
            // Dùng regex để lấy mã học phần, bao gồm trường hợp có dấu cách hoặc ký tự lạ
            const match = row[0].match(/mã học phần:\s*([a-zA-Z0-9]+)/i); // Tìm mã học phần
            if (match) {
              currentMaMon = match[1]; // Cập nhật mã học phần
            }
          }
          // Xử lý các dòng sinh viên
          else if (row.length >= 3 && row[1] && row[2]) {
            // Loại bỏ các dòng tiêu đề
            if (row[1] !== "Mã SV" && row[2] !== "Họ và tên") {
              formattedData.push([row[1], row[2], row[3], currentMaMon || ""]); // Gán mã học phần cho sinh viên
            }
          }
        });
      });

            // Map dữ liệu thành cấu trúc { maSV, hoTen, lop, maMon }
      const formattedDatas = formattedData.map((row, index) => ({
        key: index.toString(),
        maSV: row[0],
        hoTen: row[1],
        lop: row[2],
        maMon: row[3]
      }));
  
  
      // Cập nhật dữ liệu vào state
      if (formattedDatas.length > 0) {
        setDataSinhVien(formattedDatas);
      } else {
        toast.error("Không có dữ liệu hợp lệ trong file Excel.");
      }
      setIsUploading(false);
    };
  
    reader.onerror = () => {
      toast.error("Đã xảy ra lỗi khi đọc file Excel.");
      setIsUploading(false);
    };
  
    reader.readAsBinaryString(file);
  };
  
  
  

  // const importSinhVien = (e) => {
  //   setDataSinhVien([]);
  //   setIsUploading(true)
  //   const file = e.target.files[0];

  //   // Kiểm tra xem có file được chọn hay không
  //   if (!file) {
  //     console.warn("Không có file nào được chọn.");
  //     setIsUploading(false)

  //     return; // Thoát sớm nếu không có file
  //   }
  //   const reader = new FileReader();

  //   reader.onload = (event) => {
  //     const data = event.target.result;
  //     const workbook = XLSX.read(data, { type: "binary" });
  //     const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  //     const ListData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  //     ListData.shift();

  //     console.log('DATA:',ListData);

  //     // Map dữ liệu thành cấu trúc { maSV, hoTen, lop, maMon }
  //     const formattedData = ListData.map((row, index) => ({
  //       key: index.toString(),
  //       maSV: row[0],
  //       hoTen: row[1],
  //       lop: row[2],
  //       maMon: row[3]
  //     }));

  //     // Kiểm tra nếu có dữ liệu sau khi import
  //     if (formattedData.length > 0) {
  //       setDataSinhVien(formattedData);

  //       // Tính toán số liệu thống kê
  //       const uniqueLops = new Set(formattedData.map(item => item.lop)).size;
  //       const uniqueSVs = new Set(formattedData.map(item => item.maSV)).size;
  //       const uniqueMonThi = new Set(formattedData.map(item => item.maMon));

  //       setSoSV(uniqueSVs);       // Tổng số sinh viên
  //       setSoLop(uniqueLops);                // Tổng số lớp
  //       setSoMonThi([...uniqueMonThi]);

  //       //setListMaHP([...uniqueMonThi]);

  //       setIsUploading(false)

  //     } else {
  //       toast.error("Lỗi khi đọc file.");
  //     }
  //   };

  //   reader.onerror = () => {
  //     toast.error("Đã xảy ra lỗi khi đọc file Excel");
  //   };

  //   reader.readAsBinaryString(file);
  // };

  useEffect(() => {
    if (dataSinhVien.length > 0) {
      const uniqueLops = new Set(dataSinhVien.map(item => item.lop)).size;
      const uniqueSVs = new Set(dataSinhVien.map(item => item.maSV)).size;
      const uniqueMonThi = new Set(dataSinhVien.map(item => item.maMon));

      setSoSV(uniqueSVs);
      setSoLop(uniqueLops);
      setSoMonThi([...uniqueMonThi]);
    }
  }, [dataSinhVien])

  const fetchDataHP = async () => {
    if (dataSinhVien.length === 0) {
      toast.error('Chưa có danh sách sinh viên !')
      return;
    }
    setLoading2(true)
    const method = "POST";
    const resGetTTHP = await fetch("/api/admin/pc-coi-thi/get-info-hp", {
      method,
      body: JSON.stringify({ data: soMonThi }),
      headers: { "Content-Type": "application/json" },
    });
    if (resGetTTHP.ok) {
      const data = await resGetTTHP.json();
      setListHocPhanThi(data);

    }

  }
  useEffect(() => {
    if (listHocPhanThi.length != 0) {
      dataTranform(dataSinhVien)
    }
  }, [listHocPhanThi])

  const dataTranform = (dataSinhVien) => {
    if (!Array.isArray(listHocPhanThi) || listHocPhanThi.length === 0) {
      console.error('listHocPhanThi không phải là một mảng hợp lệ:', listHocPhanThi);
      return;
    }

    if (!Array.isArray(dataSinhVien)) {
      console.error('dataSinhVien không phải là một mảng hợp lệ:', dataSinhVien);
      return;
    }

    const result = [];

    // Duyệt qua từng sinh viên trong dataSinhVien
    dataSinhVien.forEach(({ maSV, hoTen, lop, maMon }) => {
      // Tìm đối tượng trong result có maMon phù hợp
      let existingItem = result.find(item => item.maMon === maMon);

      // Nếu không tìm thấy, tạo một đối tượng mới và thêm vào result
      if (!existingItem) {
        existingItem = {
          maMon: maMon,
          sinhVien: [],
          lop: [],
          tongSoThiSinh: 0,
          info: null  // info là một đối tượng duy nhất
        };
        result.push(existingItem);
      }

      // Thêm thông tin sinh viên vào danh sách sinh viên của môn thi
      existingItem.sinhVien.push({ maSV, hoTen, lop });

      // Tăng tổng số thí sinh
      existingItem.tongSoThiSinh++;

      // Thêm lớp vào danh sách nếu chưa tồn tại
      if (!existingItem.lop.includes(lop)) {
        existingItem.lop.push(lop);
      }

      // Kiểm tra và thêm thông tin từ listHocPhanThi vào existingItem.info
      listHocPhanThi.forEach(hocPhan => {
        if (hocPhan.maHocPhan === maMon && !existingItem.info) {
          existingItem.info = hocPhan;  // Lưu thông tin môn thi là một đối tượng duy nhất
        }
      });
    });

    setResult(result); // Nếu cần thiết
    setLoading2(false);
    setActiveTab('1');
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
      title: 'Ngày coi thi',
      dataIndex: 'ngayThi',
      key: 'ngayThi',
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

  const [soSV, setSoSV] = useState(0);
  const [soLop, setSoLop] = useState(0);
  const [soMonThi, setSoMonThi] = useState([]);


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
      width: 50
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
      width: 130
    },
  ];

  // Hàm đếm số lượng môn thi theo ngày
  const countByNgayThi = (array) => {
    const counts = {};

    // Đếm số lượng phần tử theo ngayThi, đồng thời đếm số lượng phòng thi và số lượng ca 1, ca 3
    array.forEach(item => {
      const ngayThi = item.ngayThi;
      const caThi = item.ca;

      // Khởi tạo nếu chưa có ngày thi trong counts
      if (!counts[ngayThi]) {
        counts[ngayThi] = {
          soLuong: 0, // Tổng số lượng môn thi
          soLuongCa1: 0, // Số lượng ca 1
          soLuongCa3: 0, // Số lượng ca 3
          soPhongCa1: 0,
          soPhongCa3: 0,
        };
      }

      // Tăng số lượng môn thi cho ngàyThi hiện tại
      counts[ngayThi].soLuong++;

      // Đếm số lượng ca 1 và ca 3
      if (caThi === '1') {
        counts[ngayThi].soLuongCa1++;
        counts[ngayThi].soPhongCa1 += item.phong.length
      } else if (caThi === '3') {
        counts[ngayThi].soLuongCa3++;
        counts[ngayThi].soPhongCa3 += item.phong.length

      }
    });

    // Chuyển đổi đối tượng counts thành mảng phần tử
    const result = Object.keys(counts).map(ngay => ({
      ngayThi: ngay,
      soLuong: counts[ngay].soLuong, // Tổng số lượng môn thi
      soLuongCa1: counts[ngay].soLuongCa1, // Số lượng ca 1
      soLuongCa3: counts[ngay].soLuongCa3, // Số lượng ca 3
      soPhongCa1: counts[ngay].soPhongCa1, // Số lượng ca 3
      soPhongCa3: counts[ngay].soPhongCa3, // Số lượng ca 3
    }));

    return result;
  };


  const phanCongCanBo = (resultFinal) => {
    if (tableGV.length < 0) {
      toast.error('Chưa chọn giảng viên !');
      return;
    }

    // Nhóm dữ liệu theo ngày thi
    const groupedByNgayThi = Object.values(
      resultFinal.reduce((acc, item) => {
        // Gán lại cbo1 và cbo2 thành chuỗi rỗng
        item.cbo1 = '';
        item.cbo2 = '';

        if (!acc[item.ngayThi]) {
          acc[item.ngayThi] = [];
        }
        acc[item.ngayThi].push(item);
        return acc;
      }, {})
    );

    // Duyệt qua từng nhóm theo ngày thi
    for (let i = 0; i < groupedByNgayThi.length; i++) {
      const item = groupedByNgayThi[i];
      const ngay = item[0].ngayThi;

      // Lọc giảng viên theo ngày thi
      let danhSachGVTheoNgayThi = tableGV.filter(gv => gv.ngayThi === ngay);
      let hasReinitializedGV = false;

      // Sắp xếp các nhóm theo ca (đảm bảo '1' trước)
      const sortedItem = item.sort((a, b) => a.ca.localeCompare(b.ca));

      // Duyệt qua từng group trong item đã sắp xếp
      sortedItem.forEach((group) => {
        const phongCount = group.phong.length; // Số phòng thi của nhóm

        if (group.ca === '1') {
          // Nếu ca là 1, phân công giảng viên và kiểm tra số lượng
          if (danhSachGVTheoNgayThi.length < phongCount * 2) {
            toast.error(`Không đủ giảng viên cho nhóm ca 1 ngày thi ${ngay}`);
            isComplete = false;
            return;
          } else {
            // Phân công giảng viên cho các phòng thi
            group.cbo1 = danhSachGVTheoNgayThi.slice(0, phongCount).map(gv => gv.username).join(' - '); // Nối giảng viên cho cbo1
            group.cbo2 = danhSachGVTheoNgayThi.slice(phongCount, phongCount * 2).map(gv => gv.username).join(' - '); // Nối giảng viên cho cbo2

            // Xóa giảng viên đã phân công khỏi danh sách giảng viên của ngày thi
            danhSachGVTheoNgayThi = danhSachGVTheoNgayThi.slice(phongCount * 2);
          }
        } else if (group.ca === '3') {
          // Nếu ca là 5, cần lấy lại danh sách giảng viên nếu thiếu và chỉ lấy lại 1 lần
          if (!hasReinitializedGV && danhSachGVTheoNgayThi.length < phongCount * 2) {
            // Lấy lại danh sách giảng viên cho ngày thi
            danhSachGVTheoNgayThi = tableGV.filter(gv => gv.ngayThi === ngay);
            hasReinitializedGV = true;  // Đánh dấu đã lấy lại danh sách giảng viên

            // Kiểm tra lại sau khi lấy lại danh sách giảng viên
            if (danhSachGVTheoNgayThi.length < phongCount * 2) {
              toast.error(`Không đủ giảng viên cho nhóm ca 3 ngày thi ${ngay}`);
              isComplete = false;
              return;
            } else {
              // Phân công giảng viên cho các phòng thi
              group.cbo1 = danhSachGVTheoNgayThi.slice(0, phongCount).map(gv => gv.username).join('-'); // Nối giảng viên cho cbo1
              group.cbo2 = danhSachGVTheoNgayThi.slice(phongCount, phongCount * 2).map(gv => gv.username).join('-'); // Nối giảng viên cho cbo2

              // Xóa giảng viên đã phân công khỏi danh sách giảng viên của ngày thi
              danhSachGVTheoNgayThi = danhSachGVTheoNgayThi.slice(phongCount * 2);
            }
          } else if (danhSachGVTheoNgayThi.length >= phongCount * 2) {
            // Nếu đủ giảng viên ban đầu
            group.cbo1 = danhSachGVTheoNgayThi.slice(0, phongCount).map(gv => gv.username).join('-');
            group.cbo2 = danhSachGVTheoNgayThi.slice(phongCount, phongCount * 2).map(gv => gv.username).join('-');

            // Xóa giảng viên đã phân công khỏi danh sách giảng viên của ngày thi
            danhSachGVTheoNgayThi = danhSachGVTheoNgayThi.slice(phongCount * 2);
          } else {
            // Nếu không đủ giảng viên sau khi lấy lại danh sách
            group.cbo1 = null;
            group.cbo2 = null;
          }
        }
      });
    }

    // Cập nhật lại kết quả sau khi phân công
    setResultFinals(groupedByNgayThi.flat());
    setActiveTab("2");
  };


  // -== HÀM TRẢ VỀ MẢNG NGÀY ĐỂ RANDOM ========
  const getValidDates = () => {
    const start = examDateRange.startDate;
    const end = examDateRange.endDate;

    let validDays = [];
    const totalDays = (end?.getTime() - start?.getTime()) / (1000 * 3600 * 24);

    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(start.getTime() + i * (1000 * 3600 * 24));
      const dayOfWeek = currentDate.getDay(); // 0 là Chủ Nhật, 6 là Thứ 7

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        validDays.push(`${day}-${month}-${year}`);
      }
    }
    return validDays;
  };

  ///===== HÀM XỬ LÝ CHÍNH ===========

  function phanBoSinhVien() {

    // Check data
    if (!examDateRange.startDate || !examDateRange.endDate || !examSessions.length || !namHoc || !loaiKyThi || !hocKy || !loaiDaoTao) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (listPhongSelect.length < 0) {
      message.error("Chưa chọn phòng");
      return;
    }

    if (listGVSelect.length < 0) {
      toast.error('Chưa chọn giảng viên !')
      return
    }


    let listNgay = getValidDates();

    // Lọc ra các môn có hinhThuc là 'TH'
    //========== XỬ LÝ MÔN THỰC HÀNH Ở ĐÂY ==========
    let resultFinalTH = [];

    const monTH = result.filter(mon => mon.info.hinhThuc === 'TH');
    const { phongHoc, phongMay } = listPhongSelect.reduce((acc, phong) => {
      if (phong.loai === "Phòng học") {
        acc.phongHoc.push(phong);
      } else if (phong.loai === "Phòng máy") {
        acc.phongMay.push(phong);
      }
      return acc;
    }, { phongHoc: [], phongMay: [] });

    monTH.forEach((mon, index) => {
      let soLuongConLai = mon.tongSoThiSinh; // Số lượng sinh viên cần phân phòng cho môn
      let phongIndex = 0; // Vị trí phòng hiện tại
      let listPhong = phongMay; // Danh sách phòng có sẵn
      let selectedPhong = []; // Mảng để lưu các phòng đã chọn
      let soLuongPhong = []; // Mảng lưu số lượng sinh viên phân cho từng phòng

      // Tạo đối tượng item ban đầu
      let item = {
        _id: Math.random().toString(36).substr(2, 9),
        maHocPhan: [mon.info.maHocPhan],
        hocPhan: [mon.info.tenHocPhan],
        lop: [mon.lop],
        soLuong: [], // Mảng số lượng sinh viên ứng với từng phòng
        ngayThi: listNgay[index + 1],
        ca: '1',
        phong: [],
        cbo1: '',
        cbo2: '',
        tc: [mon.info.soTinChi],
        hinhThuc: [mon.info.hinhThuc],
        thoiGian: [mon.info.thoiGian],
        danhSachThiSinh: [mon.sinhVien], // Danh sách sinh viên
        diaDiem: examSessions,
        namHoc,
        loaiDaoTao,
        loaiKyThi,
        hocKy,
      };


      // Tiến hành phân phòng
      while (soLuongConLai > 0) {
        if (phongIndex >= listPhong.length) {
          toast.error(`Không còn phòng để phân cho môn ${mon.info.tenHocPhan}`);
          break; // Thoát vòng lặp nếu hết phòng
        }

        const phong = listPhong[phongIndex]; // Lấy phòng hiện tại
        const soCho = phong.soCho; // Sức chứa của phòng

        selectedPhong.push(phong); // Thêm phòng vào danh sách chọn

        phongIndex++; // Di chuyển đến phòng tiếp theo
        soLuongConLai -= soCho
      }

      // Chia đều sinh viên cho các phòng đã chọn
      if (selectedPhong.length > 0) {
        // Chia đều số lượng sinh viên cho các phòng
        let soLuongMoiPhong = Math.floor(mon.tongSoThiSinh / selectedPhong.length); // Lấy số lượng sinh viên tối đa cho mỗi phòng
        let soLuongDuPhong = mon.tongSoThiSinh % selectedPhong.length; // Lấy phần dư nếu có

        selectedPhong.forEach((phong, index) => {
          let soLuong = soLuongMoiPhong;
          if (index < soLuongDuPhong) {
            soLuong += 1; // Thêm dư vào các phòng đầu tiên
          }
          soLuongPhong.push(soLuong);
        });

        // Cập nhật danh sách phòng và số lượng sinh viên vào item
        item.phong = selectedPhong; // Lấy tên phòng
        item.soLuong = soLuongPhong; // Lưu số lượng sinh viên vào từng phòng
      } else {
        console.warn(`Không đủ phòng để phân cho môn ${mon.info.tenHocPhan}`);
      }

      // Thêm item vào kết quả cuối cùng
      resultFinalTH.push(item);
    });

    // ====================================================================
    const splitMonArray = (mon, listNgay) => {
      const totalDays = listNgay.length;
      const chunkSize = Math.floor(mon.length / totalDays);
      const remainder = mon.length % totalDays;

      let result = [];
      let index = 0;

      // Tạo bản đồ lưu trữ các lớp đã phân bổ theo ngày
      let assignedClasses = new Map();

      for (let i = 0; i < totalDays; i++) {
        let additionalMon = i < remainder ? 1 : 0;
        let chunk = [];
        let addedCount = 0;

        while (addedCount < chunkSize + additionalMon && index < mon.length) {
          const currentMon = mon[index];
          const { lop } = currentMon;

          // Kiểm tra nếu lớp đã xuất hiện trong ngày
          let conflict = lop.some(l => assignedClasses.get(listNgay[i])?.has(l));

          if (!conflict) {
            chunk.push(currentMon);

            // Cập nhật danh sách lớp đã phân cho ngày hiện tại
            if (!assignedClasses.has(listNgay[i])) {
              assignedClasses.set(listNgay[i], new Set());
            }
            lop.forEach(l => assignedClasses.get(listNgay[i]).add(l));

            addedCount++;
            index++;
          } else {
            // Nếu có xung đột, chuyển môn này sang ngày sau
            index++;
            mon.push(currentMon); // Đưa lại môn vào cuối danh sách để xử lý lại sau
          }
        }

        // Kiểm tra nếu không thể phân bổ đủ môn và báo lỗi nếu cần
        if (chunk.length < chunkSize + additionalMon && i === totalDays - 1) {
          console.error(`Không thể phân bổ đủ môn cho các ngày mà không có lớp trùng lặp. Thiếu ngày thi!`);
          return [];
        }

        result.push(chunk);
      }

      return result;
    };

    // Ví dụ sử dụng
    let data = result.filter(mon => mon.info.hinhThuc !== 'TH');
    let mons = splitMonArray(data, listNgay);

    let resultFinal = [];    // Kết quả
    mons.forEach((mon, index) => {
      let soPhongConLai = phongHoc.sort((a, b) => b.soCho - a.soCho);// Có lại phòng
      let listMon = mon;
      let listMonClone = mon;


      let listSize = listMon.length
      let hocPhanDaDuyet = []

      let nhom1 = []

      // Hàm tính toán phân bổ sinh viên vào phòng
      for (let i = 0; i < listSize; i++) {

        const mon = listMon[i];

        if ((soPhongConLai.length == 1)) {
          toast.error('Không đủ phòng thi!')
          return
        }

        // BỎ QUA CÁI HP ĐÃ GHÉP NÊN KHÔNG DUYỆT TIẾP
        const isExist = hocPhanDaDuyet.includes(mon.info.tenHocPhan);
        if (isExist) {
          continue;
        }

        listMonClone = listMonClone.filter(monS => monS.info.tenHocPhan != mon.info.tenHocPhan);

        let item = {
          _id: Math.random().toString(36).substr(2, 9),
          maHocPhan: [],
          hocPhan: [],
          lop: [],
          soLuong: [],
          ngayThi: listNgay[index],
          ca: '',
          phong: [],
          cbo1: '',
          cbo2: '',
          tc: [],
          hinhThuc: [],
          thoiGian: [],
          danhSachThiSinh: [],

          diaDiem: examSessions,
          namHoc,
          loaiDaoTao,
          loaiKyThi,
          hocKy,
        }

        //// ==========  XỬ LÝ PHÒNG =============

        let phongTemp = [];
        let soChoNeed = 0;

        // Duyệt qua các phòng để phân bổ sinh viên
        for (let i = 0; i < soPhongConLai.length; i++) {

          let phong = soPhongConLai[i];

          // ============== XỬ LÝ TÁCH PHÒNG =================

          if (soChoNeed < mon.tongSoThiSinh) {

            soChoNeed += phong.soCho;
            phongTemp.push(phong);

            if ((i == soPhongConLai.length - 1 && soChoNeed < mon.tongSoThiSinh)) {
              toast.error('Không đủ phòng thi!')
              return
            }

          }
          else {
            if (phongTemp.length > 1) {

              // Nếu đã lấy đủ phòng cần cho môn đó
              item.phong = phongTemp; // Thêm phòng vào danh sách phòng của môn học
              setListPhongFilter(pre => [...pre, phongTemp]);

              const valNguyen = Math.floor(mon.tongSoThiSinh / phongTemp.length)
              let soLuong = new Array(phongTemp.length).fill(valNguyen);

              let conLai = (mon.tongSoThiSinh) - (valNguyen * phongTemp.length)

              if (conLai > 0) {
                for (let i = 0; i < phongTemp.length; i++) {
                  // Xử lý phần tử phongTemp[i] tại đây
                  if (phongTemp[i].soCho > valNguyen && soLuong[i] < phongTemp[i].soCho && conLai != 0) {
                    soLuong[i] += 1
                    conLai -= 1
                  }
                }
              }

              // SỐ LƯỢNG MỖI PHÒNG
              item.soLuong.push(soLuong);
              item.hocPhan.push(mon.info.tenHocPhan);

              // SET THÔNG TIN MÔN THI
              item.maHocPhan.push(mon.info.maHocPhan)
              item.lop.push(mon.lop)
              item.hinhThuc.push(mon.info.hinhThuc)
              item.thoiGian.push(mon.info.thoiGian)

              item.tc.push(mon.info.soTinChi)
              item.danhSachThiSinh.push(mon.sinhVien)

              // XÓA PHÒNG ==========
              soPhongConLai = soPhongConLai.filter(phong => !phongTemp.some(p => p.tenPhong == phong.tenPhong));
              listMonClone = listMonClone.filter(monG => monG.info.tenHocPhan !== mon.info.tenHocPhan);
              break;

            }
            // ====== TH KHÔNG TÁCH ===========
            else {

              let soLuongGop = mon.tongSoThiSinh  // ĐỂ XEM CÓ GỘP TIẾP KHÔNG

              item.phong = phongTemp;
              setListPhongFilter(pre => [...pre, phongTemp]);

              item.soLuong.push(mon.tongSoThiSinh);

              item.hocPhan.push(mon.info.tenHocPhan);

              item.maHocPhan.push(mon.info.maHocPhan)
              item.lop.push(mon.lop)
              item.hinhThuc.push(mon.info.hinhThuc)
              item.thoiGian.push(mon.info.thoiGian)

              item.tc.push(mon.info.soTinChi)
              item.danhSachThiSinh.push(mon.sinhVien)

              const check = mon.tongSoThiSinh / phong.soCho

              if (check < 0.95) {
                // ====== TÌM MÔN KHỚP NHẤT ======
                let closestMatch = null;
                let smallestDifference = Number.MAX_VALUE;

                listMonClone.forEach((mons) => {
                  const total = mon.tongSoThiSinh + mons.tongSoThiSinh;
                  const difference = Math.abs(phong.soCho - total);

                  if (difference < smallestDifference && total <= phong.soCho) {
                    smallestDifference = difference;
                    closestMatch = mons;
                  }
                });

                if (closestMatch != null) {
                  item.hocPhan.push(closestMatch.info.tenHocPhan);
                  item.soLuong.push(closestMatch.tongSoThiSinh);

                  item.maHocPhan.push(closestMatch.info.maHocPhan);
                  item.lop.push(closestMatch.lop);
                  item.hinhThuc.push(closestMatch.info.hinhThuc);
                  item.thoiGian.push(closestMatch.info.thoiGian);

                  item.tc.push(mon.info.soTinChi);
                  item.danhSachThiSinh.push(mon.sinhVien);

                  // Loại bỏ môn đã gộp khỏi danh sách
                  listMonClone = listMonClone.filter(monG => monG.info.tenHocPhan !== closestMatch.info.tenHocPhan);
                  hocPhanDaDuyet.push(closestMatch.info.tenHocPhan);

                  // Cập nhật số lượng gộp
                  soLuongGop += closestMatch.tongSoThiSinh;
                }

                // ====== GỘP TIẾP ======
                const check2 = soLuongGop / phong.soCho;
                if (check2 < 0.96) {
                  let closestMatch2 = null;
                  let smallestDifference = Number.MAX_VALUE;

                  listMonClone.forEach((mons) => {
                    const total = soLuongGop + mons.tongSoThiSinh; // Sử dụng tổng đã gộp
                    const difference = Math.abs(phong.soCho - total);

                    if (difference < smallestDifference && total <= phong.soCho) {
                      smallestDifference = difference;
                      closestMatch2 = mons;
                    }
                  });

                  if (closestMatch2 != null) {
                    item.soLuong.push(closestMatch2.tongSoThiSinh);
                    item.hocPhan.push(closestMatch2.info.tenHocPhan);
                    item.maHocPhan.push(closestMatch2.info.maHocPhan);
                    item.lop.push(closestMatch2.lop);
                    item.hinhThuc.push(closestMatch2.info.hinhThuc);
                    item.thoiGian.push(closestMatch2.info.thoiGian);

                    item.tc.push(closestMatch2.info.soTinChi); // Đảm bảo gán đúng thông tin từ `closestMatch2`
                    item.danhSachThiSinh.push(closestMatch2.sinhVien);

                    // Loại bỏ môn đã gộp khỏi danh sách
                    listMonClone = listMonClone.filter(monG => monG.info.tenHocPhan !== closestMatch2.info.tenHocPhan);
                    hocPhanDaDuyet.push(closestMatch2.info.tenHocPhan);

                    // Cập nhật số lượng gộp tiếp theo
                    soLuongGop += closestMatch2.tongSoThiSinh;
                  }
                }
              }


              // XÓA PHÒNG ==========
              soPhongConLai = soPhongConLai.filter(phong => !phongTemp.some(p => p.tenPhong == phong.tenPhong));
              listMonClone = listMonClone.filter(monG => monG.info.tenHocPhan !== mon.info.tenHocPhan);

              break;

            }
          }
        }
        // Thêm item vào kết quả cuối cùng
        nhom1.push(item);
      };
      resultFinal.push(nhom1)


    });
    resultFinal = [...resultFinal, ...resultFinalTH];
    // ========================================= =============


    // = =========== XỬ LÝ TIẾP  CA VỚI NGÀY ================
    if (resultFinal.length > 0) {

      for (let i = 0; i < resultFinal.length; i++) {
        const itemDai = resultFinal[i];
        const soDeChiaCa = Math.round(itemDai.length / 2);

        for (let j = 0; j < itemDai.length; j++) {
          if (j < soDeChiaCa) {
            resultFinal[i][j].ca = '1'
          }
          else {
            resultFinal[i][j].ca = '3'
          }

        }

      }

      // ========================================================
    }

    if (resultFinal.length > 0) {
      setResultFinals(resultFinal.flat())
      const data = countByNgayThi(resultFinal.flat())
      setMonThiMoiNgay(data)
      setActiveTab('5')
    }

  }

  return loading ? (
    <Loader />
  ) : (
    <div>
      <div className="py-1 px-3 bg-white rounded-lg shadow-lg mt-2 h-[90vh]">
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>

          <TabPane tab="Thông tin kỳ thi" key="4" className="bg-white rounded-lg h-[80vh]">
            <div className="text-heading4-bold text-blue-600 text-center ">THÔNG TIN KỲ THI</div>
            <div className="flex justify-between gap-2 mt-0">
              <div className=" flex items-center gap-1">
                <label className="block text-sm font-semibold mb-1 ">Loại:</label>
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
                <label className="block text-sm font-semibold mb-1 ">Kỳ thi:</label>
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

              <div className=" flex items-center gap-2 w-[22%]">
                <label className="block text-sm font-semibold mb-1 ">Ngày:</label>
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
                  <label className="block text-sm font-semibold mb-1">Địa điểm:</label>
                  <Checkbox.Group
                    options={[
                      { label: "DHPY", value: 'DHPY' },
                      { label: "Khác", value: 'KHAC' },
                    ]}
                    value={examSessions}
                    onChange={(checkedValues) => setExamSessions(checkedValues)}
                  />
                </div>
              </div>

            </div>
            <div className="flex justify-around items-center  flex-wrap  h-[80%]  mt-6">
              <Button
                className={`custom-button-1 button-chinh-quy w-full max-w-[300px]`}
              >
                <div className='text'> HỆ {loaiDaoTao.toUpperCase()}</div>
              </Button>
              <Button
                className={`custom-button-1 button-chinh-quy-khac w-full max-w-[300px]`}
              //onClick={() => handlePage('cham-thi')}
              >
                <div className='text'>{namHoc}</div>
              </Button>
              <Button
                className={`custom-button-1 button-boi-duong w-full max-w-[300px]`}
              >
                <div className='text'>HỌC KỲ {hocKy}</div>
              </Button>
              <Button
                className={`custom-button-1 button-lien-thong-chinh-quy w-full max-w-[300px]`}
              //onClick={() => handlePage('cham-thi')}
              >
                <div className='text'>{loaiKyThi.toLocaleUpperCase() == '1' ? 'CHÍNH THỨC' : `ĐỢT ${loaiKyThi.toLocaleUpperCase()}`}</div>
              </Button>
              <Button className={`custom-button-1 button-lien-thong-vlvh w-full max-w-[300px]`}>
                <div className='text'>
                  {examDateRange.startDate?.toLocaleDateString()}<br />
                  - <br />
                  {examDateRange.endDate?.toLocaleDateString()}
                </div>

              </Button>

              <Button
                className={`custom-button-1  button-lien-thong-vlvh-nd71 w-full max-w-[300px]`}
              //onClick={() => handlePage('cham-thi')}
              >
                <div className='text'>{examSessions}</div>
              </Button>
            </div>
          </TabPane>
          <TabPane tab="Dữ liệu sinh viên" key="3">
            <div className="flex gap-3 h-[82vh] ">
              {/* Left Container */}
              <div className="flex-[60%] p-1 bg-white rounded-md flex flex-col gap-2 border-2">
                <div className=" h-[75%] p-1">
                  <Table
                    dataSource={dataSinhVien}
                    columns={columnSV}
                    scroll={{ y: 400 }} // Chỉ cuộn dọc
                    pagination={false}  // Tắt phân trang nếu cần
                  />


                </div>
                <div className="border-dashed border-2 border-blue-500 rounded-lg p-1 text-center bg-blue-50 hover:bg-blue-100 transition-all duration-300">
                  <InboxOutlined style={{ fontSize: '25px', color: '#1890ff' }} />
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
                <Button
                  className="button-chinh-quy mt-1"
                  type="primary"
                  onClick={() => fetchDataHP()}
                >
                  {loading2 ? 'Đang xử lý...' : 'NEXT'}
                  {!loading2 && <RightOutlined />}
                </Button>

              </div>

              {/* Right Side with 3 Boxes */}
              <div className="space-y-3 flex-grow h-full">
                <div className="p-4 bg-white shadow-xl rounded-lg h-[32%] flex flex-col border-2">
                  <h3 className="text-lg text-heading3-bold ">SỐ MÔN THI</h3>
                  <p className="text-heading1-bold text-center text-blue-600 mt-auto mb-auto">{soMonThi.length}</p>
                </div>

                <div className="p-4 bg-white shadow-xl rounded-lg h-[32%] flex flex-col border-2">
                  <h3 className="text-lg text-heading3-bold ">SỐ SINH VIÊN</h3>
                  <p className=" text-heading1-bold text-center text-green-600 mt-auto mb-auto">{soSV}</p>
                </div>

                <div className="p-4 bg-white shadow-xl rounded-lg h-[32%] flex flex-col border-2">
                  <h3 className="text-lg text-heading3-bold ">SỐ LỚP</h3>
                  <p className=" text-heading1-bold text-center text-red-600 mt-auto mb-auto">{soLop}</p>
                </div>
              </div>

            </div>

          </TabPane>

          <TabPane tab="Học phần và phòng" key="1">

            <div className="w-full mt-2">
              <div className="text-heading4-bold text-green-500 text-center mb-1">XỬ LÝ HỌC PHẦN VÀ PHÒNG</div>

              <Row gutter={10}>
                <Col span={11} className=" overflow-y-auto">
                  <div className="shadow-lg ">
                    <Card
                      title={<span><BookOutlined /> HỌC PHẦN</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: '#f0f8ff' }} // Màu nền nhẹ
                    >
                      <p className="text-heading3-bold text-center"> {result?.length}</p>

                      <ul className="list-decimal pl-5 text-left max-h-[450px] overflow-auto bg-[#f0f8ff]">
                        {result?.map((hocPhan, index) => (
                          <li key={hocPhan?.info?.maHocPhan} className="flex justify-between items-center">
                            <span
                              className="font-bold"
                              onClick={() => {
                                setSelectedHocPhan(hocPhan);  // Lưu học phần đã chọn
                                setListSVToClass(hocPhan?.sinhVien);  // Nếu cần xử lý thêm
                              }}
                              style={{ cursor: 'pointer', color: selectedHocPhan === hocPhan ? 'blue' : 'inherit' }} // Thay đổi màu sắc khi chọn
                            >
                              {index + 1}. {hocPhan?.info?.tenHocPhan}
                            </span>

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

                <Col span={8} className="h-[60%] overflow-y-auto">
                  <div className="shadow-lg  text-center bg-white">
                    <Card
                      title={<span><UserOutlined /> Danh sách SV</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: 'white' }}
                    >
                      <div className="max-h-[470px] overflow-auto">
                        <p className="text-heading3-bold text-center"> {listSVToClass?.length}</p>
                        {listSVToClass?.map((SV, index) => (
                          <div key={SV.maSV} className="flex justify-between items-center ">
                            <p className="text-base-bold">{index + 1}. {SV.hoTen}</p>
                            {/* <DeleteOutlined
                            className="text-red-500 cursor-pointer"
                          //onClick={() => handleDeletePhong(index)}
                          /> */}
                          </div>
                        ))}
                      </div>

                    </Card>
                  </div>
                </Col>
                <Col span={5} className="h-[55%] overflow-y-auto ">
                  <div className="shadow-lg text-center bg-white">
                    <Card
                      title={<span><HomeOutlined /> PHÒNG THI</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: 'white' }} // Màu nền
                    >

                      <ul className="list-decimal text-left max-h-[400px] overflow-auto bg-white">
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
                        <Button size="small" className="button-lien-thong-vlvh-nd71 text-white" onClick={() => { setOpen(true); setTitle('Chọn phòng') }}>Chọn phòng</Button>

                      </div>

                    </Card>
                  </div>
                </Col>

              </Row>
            </div >

            <div className=" text-center rounded-md p-0 mt-2">
              <Button type="primary" className="button-chinh-quy" onClick={phanBoSinhVien}>Xử lý</Button>
            </div>

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

                  {filteredListPhong.map((phong, index) => (
                    <div >
                      <Checkbox
                        key={index}
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



          </TabPane>

          <TabPane tab="Phân công cán bộ" key="5">

            <Row>
              <Col span={6} className="bg-gray-200 rounded-lg p-2">
                <div className="text-heading4-bold text-blue text-center mb-2 mt-1">SỐ MÔN THI TRONG </div>
                <div className="  max-h-[500px] overflow-auto">
                  {monThiMoiNgay.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setNgayThiSelect(item.ngayThi)} // Gọi hàm khi phần tử được click
                      className={`cursor-pointer hover:bg-gray-300 bg-white mt-2 rounded-lg p-2 transition-all ${ngayThiSelect === item.ngayThi ? 'border-2 border-blue-500' : ''
                        }`}
                    >
                      <p className="font-bold text-red-500">Ngày thi: {item.ngayThi}</p>
                      <p className="font-bold text-green-500">Số lượng môn thi: {item.soLuong}</p>
                      <p className="font-bold text-orange-500">Số phòng ca sáng: {item.soPhongCa1}</p>
                      <p className="font-bold text-orange-500">Số phòng ca chiều: {item.soPhongCa3}</p>
                      <p className="font-bold text-blue-500">Số môn ca sáng: {item.soLuongCa1}</p>
                      <p className="font-bold text-blue-500">Số môn ca chiều: {item.soLuongCa3}</p>
                      <hr />
                    </div>
                  ))}
                </div>
              </Col>

              <Col span={1}>
              </Col>

              <Col span={17} className=" ">
                <div className="shadow-lg text-center text-base-bold h-[75vh] ">
                  <Card
                    title={<span><UserOutlined /> CÁN BỘ COI THI</span>}
                    bordered={false}
                    className="h-full text-center"
                    style={{ backgroundColor: '#f0fff0' }} // Màu nền
                  >
                    <div className="h-full w-full ">
                      <Table
                        scroll={{ y: '400px' }}
                        columns={columns}
                        dataSource={tableGV}
                        rowKey="_id"
                        pagination={false}
                      />
                    </div>
                  </Card>
                  <Button size="small" className="button-boi-duong text-white" onClick={() => { setListGVSelect([]); setOpen(true); setTitle('Chọn cán bộ') }}>Chọn cán bộ</Button>
                </div>

              </Col>
            </Row>

            {title === 'Chọn cán bộ' && (
              <Modal
                title={title}
                open={open}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                onOk={() => { setOpen(false) }}
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

                <div className="flex mt-1 flex-wrap gap-3 max-h-[450px] overflow-auto">
                  {filteredListGV.map((gv) => (
                    <div
                      key={gv._id}
                      className="flex items-center p-1 border border-gray-300 rounded-lg h-10"
                    >
                      <Checkbox
                        onChange={(e) => handleSelectGV(e.target.checked, gv)}
                        checked={listGVSelect.some((item) => item._id === gv._id)} // Sử dụng some() để kiểm tra dựa trên _id
                      >
                        <UserOutlined className="text-gray-500 mr-2" style={{ fontSize: '24px' }} />
                        <span className="text-base-bold">{gv.username}</span>
                      </Checkbox>
                    </div>
                  ))}
                </div>

              </Modal>
            )}

            <div className=" text-center rounded-md p-0 mt-2">
              <Button type="primary" className="button-chinh-quy" onClick={() => phanCongCanBo(resultFinals)}>Tạo lịch thi</Button>
            </div>
          </TabPane>

          <TabPane tab="Kết quả" key="2">
            <TablePcCoiThi
              list={resultFinals}
              namHoc={namHoc}
              loaiKyThi={loaiKyThi}
              loaiDaoTao={loaiDaoTao}
              hocKy={hocKy}
              listNgayThi={getValidDates()}
              listPhong={listPhongFilter?.flat()}
            />
          </TabPane>


        </Tabs>

      </div >


    </div>
  );
};

export default PcCoiThi;
