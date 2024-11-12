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
  const [activeTab, setActiveTab] = useState("3");

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

  const getRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 128) + 64;

    const r = randomValue().toString(16).padStart(2, '0');
    const g = randomValue().toString(16).padStart(2, '0');
    const b = randomValue().toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  };

  // Xử lý đọc Excel

  const importSinhVien = (e) => {
    setDataSinhVien([]);
    setIsUploading(true)
    const file = e.target.files[0];

    // Kiểm tra xem có file được chọn hay không
    if (!file) {
      console.warn("Không có file nào được chọn.");
      setIsUploading(false)

      return; // Thoát sớm nếu không có file
    }
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
        setSoMonThi([...uniqueMonThi]);

        //setListMaHP([...uniqueMonThi]);

        setIsUploading(false)

      } else {
        toast.error("Lỗi khi đọc file.");
      }
    };

    reader.onerror = () => {
      toast.error("Đã xảy ra lỗi khi đọc file Excel");
    };

    reader.readAsBinaryString(file);
  };

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

    let danhSachGV = listGVSelect

    let listMon = result;
    let listMonClone = result;
    let resultFinal = [];
    let soPhongConLai = listPhongSelect.slice().sort((a, b) => b.soCho - a.soCho);

    let listSize = listMon.length

    let hocPhanDaDuyet = []

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
        ngayThi: '',
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

              // ============ TÌM MÔN KHỚP NHẤT 
              let closestMatch = null; // Biến để lưu trữ kết quả phù hợp nhất
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

                item.maHocPhan.push(closestMatch.info.maHocPhan)
                item.lop.push(closestMatch.lop)
                item.hinhThuc.push(closestMatch.info.hinhThuc)
                item.thoiGian.push(closestMatch.info.thoiGian)

                item.tc.push(mon.info.soTinChi)
                item.danhSachThiSinh.push(mon.sinhVien)

                listMonClone = listMonClone.filter(monG => monG.hocPhan != closestMatch.hocPhan);
                hocPhanDaDuyet.push(closestMatch.info.tenHocPhan)

                // ĐỂ XEM CÓ GỘP TIẾP KHÔNG
                soLuongGop += closestMatch.soLuong
              }

              // ====== GỘP TIẾP =======
              const check2 = soLuongGop / phong.soCho
              if (check2 < 0.96) {

                let closestMatch2 = null; // Biến để lưu trữ kết quả phù hợp nhất
                let smallestDifference = Number.MAX_VALUE; // Biến lưu khoảng cách nhỏ nhất, khởi tạo với giá trị lớn nhất

                listMonClone.forEach((mons) => {

                  const total = mon.soLuong + mons.soLuong;
                  const difference = Math.abs(phong.soCho - total);

                  if (difference < smallestDifference && total <= phong.soCho) {
                    smallestDifference = difference;
                    closestMatch2 = mons;
                  }
                });

                if (closestMatch2 != null) {
                  item.soLuong.push(closestMatch2.tongSoThiSinh);

                  item.hocPhan.push(closestMatch2.info.tenHocPhan)
                  item.maHocPhan.push(closestMatch2.info.maHocPhan)
                  item.lop.push(closestMatch2.lop)
                  item.hinhThuc.push(closestMatch2.info.hinhThuc)
                  item.thoiGian.push(closestMatch2.info.thoiGian)

                  item.tc.push(mon.info.soTinChi)
                  item.danhSachThiSinh.push(mon.sinhVien)

                  listMonClone = listMonClone.filter(monG => monG.info.tenHocPhan != closestMatch2.info.tenHocPhan);
                  hocPhanDaDuyet.push(closestMatch2.info.tenHocPhan)

                  // Sau vòng lặp, `closestMatch` sẽ chứa môn có tổng số lượng gần khớp nhất
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
      resultFinal.push(item);
    };

    // = =========== XỬ LÝ TIẾP ================
    if (resultFinal.length > 0) {


      let listNgay = getValidDates()
      const soMonChoMoiNgay = Math.floor(resultFinal.length / listNgay.length);
      const soDeChiaCa = Math.round(soMonChoMoiNgay / 2);

      let monDaPhan = []

      //======== FOR NGÀY ========
      for (let i = 0; i < listNgay.length; i++) {

        if (monDaPhan.length < resultFinal.length) {
          const ngay = listNgay[i];

          let count = 0

          let lopDaCoTrongNgay = []


          //// DUYỆT CÁC MÔN ==========
          for (let i = 0; i < resultFinal.length; i++) {
            let items = resultFinal[i];

            const listPhang = resultFinal[i].lop.flat()
            const lopDaCoTrongNgayPhang = lopDaCoTrongNgay.flat()

            if (listPhang.some(item => lopDaCoTrongNgayPhang.includes(item)) || monDaPhan.includes(resultFinal[i]._id)) {
              continue;
            }
            else {
              if (count < soMonChoMoiNgay) {
                if (count < soDeChiaCa) {
                  resultFinal[i].ca = '1';
                }
                else {
                  resultFinal[i].ca = '5';
                }
                resultFinal[i].ngayThi = ngay;
                monDaPhan.push(resultFinal[i]._id)
                lopDaCoTrongNgay.push(resultFinal[i].lop)

                count += 1;
              }
              else {
                break;
              }
            }
          }
        }

      }

      // CHECK cái chưa có ngày vì lẻ
      for (let i = 0; i < resultFinal.length; i++) {
        const ele = resultFinal[i];
        const listPhang = ele.lop.flat();

        if (ele.ngayThi === '') {
          // Vòng lặp tiếp sử dụng `for...of`
          for (const ele2 of resultFinal) {
            const listPhang2 = ele2.lop.flat();

            if (!(listPhang.some(item => listPhang2.includes(item))) && ele2.ngayThi !== '' && ele2.maHocPhan.length < (soMonChoMoiNgay + 1)) { //// LƯU Ý CHỖ NÀY LÀ 2 HAY 1
              resultFinal[i].ngayThi = ele2.ngayThi;
              break;
            }
          }

        }
      }
      // ===============================

      // ========   XỬ LÝ GIẢNG VÊN =======================
      for (let i = 0; i < resultFinal.length; i++) {
        // Nếu danh sách giảng viên đã cạn kiệt, hiển thị thông báo và dừng việc gán
        if (danhSachGV.length === 0) {
          toast.error("Không còn giảng viên để gán!");
          return;
        }

        //Lấy ngẫu nhiên một giảng viên cho `cbo1`
        const randomIndex1 = Math.floor(Math.random() * danhSachGV.length);
        resultFinal[i].cbo1 = danhSachGV[randomIndex1].username;
        // Xóa giảng viên đã được gán
        danhSachGV.splice(randomIndex1, 1);

        // Nếu danh sách giảng viên lại hết sau khi gán cho `cbo1`, hiển thị thông báo và dừng tiếp
        if (danhSachGV.length === 0) {
          toast.error("Không còn giảng viên để gán cho cbo2!");
          return;
        }

        // Lấy ngẫu nhiên một giảng viên cho `cbo2`
        const randomIndex2 = Math.floor(Math.random() * danhSachGV.length);
        resultFinal[i].cbo2 = danhSachGV[randomIndex2].username;
        // Xóa giảng viên đã được gán
        danhSachGV.splice(randomIndex2, 1);
      }
      // ========================================================
    }

    setResultFinals(resultFinal)
    setActiveTab("2");

  }

  // useEffect(() => {
  //   console.log('Re222:', resultFinals)

  // }, [resultFinals])

  return loading ? (
    <Loader />
  ) : (
    <div>
      <div className="py-1 px-3 bg-gray-100 rounded-lg shadow-lg mt-2 h-[90vh]">
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>

        <TabPane tab="Thông tin kỳ thi" key="4">

        </TabPane>
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
                <div className="p-4 bg-white shadow-md rounded-lg h-[32%] flex flex-col">
                  <h3 className="text-lg text-heading3-bold ">SỐ MÔN THI</h3>
                  <p className="text-heading1-bold text-center text-blue-600 mt-auto mb-auto">{soMonThi.length}</p>
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
                      <p className="text-heading3-bold text-center"> {result?.length}</p>

                      <ul className="list-decimal pl-5 text-left max-h-[360px] overflow-auto bg-[#f0f8ff]">
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

                <Col span={5} className="h-[60%] overflow-y-auto">
                  <div className="shadow-lg  text-center bg-white">
                    <Card
                      title={<span><UserOutlined /> Danh sách SV</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: 'white' }}
                    >
                      <div className="max-h-[395px] overflow-auto">
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
                <Col span={3} className="h-[55%] overflow-y-auto ">
                  <div className="shadow-lg text-center bg-white">
                    <Card
                      title={<span><HomeOutlined /> PHÒNG THI</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: 'white' }} // Màu nền
                    >

                      <ul className="list-decimal text-left max-h-[340px] overflow-auto bg-white">
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
                <Col span={9} className=" ">
                  <div className="shadow-lg text-center text-base-bold h-[60vh] ">
                    <Card
                      title={<span><UserOutlined /> CÁN BỘ COI THI</span>}
                      bordered={false}
                      className="h-full text-center"
                      style={{ backgroundColor: '#f0fff0' }} // Màu nền
                    >
                      <div className="h-full w-full ">
                        <Table
                          scroll={{ y: '340px' }}
                          columns={columns}
                          dataSource={listGVSelect}
                          rowKey="_id"
                          pagination={false}
                        />
                      </div>
                    </Card>
                    <Button size="small" className="button-boi-duong text-white" onClick={() => { setOpen(true); setTitle('Chọn cán bộ') }}>Chọn cán bộ</Button>
                  </div>

                </Col>
              </Row>
            </div >

            <div className=" text-center rounded-md p-0 mt-2">
              <Button type="primary" className="button-chinh-quy" onClick={phanBoSinhVien}>Tạo lịch thi</Button>
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
            <TablePcCoiThi
              list={resultFinals}
              namHoc={namHoc}
              loaiKyThi={loaiKyThi}
              loaiDaoTao={loaiDaoTao}
              hocKy={hocKy}
              listNgayThi={getValidDates()}
              listPhong={listPhongFilter?.flat()}
            />
          </TabPane>'
        </Tabs>

      </div >


    </div>
  );
};

export default PcCoiThi;







// Xử lý lưu kết quả model
