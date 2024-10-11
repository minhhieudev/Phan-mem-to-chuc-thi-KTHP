"use client";

import { useState, useEffect } from "react";
import { Select, Input, Table, Popconfirm, Spin, Button, Space, Pagination } from "antd";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileExcelOutlined } from '@ant-design/icons';


const { Option } = Select;

const PcChamThiTable = () => {
  const [dataList, setDataList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [namHoc, setNamHoc] = useState("2023-2024");
  const [loaiKyThi, setLoaiKyThi] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [loai, setLoai] = useState("chinh-quy");

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const router = useRouter();

  useEffect(() => {
    if (!namHoc && !loaiKyThi) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/pc-cham-thi?namHoc=${namHoc}&loaiKyThi=${loaiKyThi}&loai=${loai}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setDataList(data);
          setFilteredData(data);
        } else {
          toast.error("Không thể tải dữ liệu");
        }
        setLoading(false);
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, [namHoc, loaiKyThi, loai]);

  useEffect(() => {
    const filtered = dataList.filter((item) => {
      // Tìm kiếm theo cán bộ coi thi (cb1 hoặc cb2)
      const cb1 = item.cb1?.toLowerCase().includes(searchTerm.toLowerCase());
      const cb2 = item.cb2?.toLowerCase().includes(searchTerm.toLowerCase());

      // Tìm kiếm theo tên học phần
      let hocPhan = false;

      if (Array.isArray(item.hocPhan)) {
        // Nếu hocPhan là mảng, kiểm tra xem bất kỳ phần tử nào trong mảng có chứa searchTerm không
        hocPhan = item.hocPhan.some(
          (hp) =>
            typeof hp === 'string' &&
            hp.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
      } else if (typeof item.hocPhan === 'string') {
        // Nếu hocPhan là chuỗi, kiểm tra trực tiếp
        hocPhan = item.hocPhan
          .trim()
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase());
      }

      // Trả về true nếu có bất kỳ điều kiện nào (cb1, cb2 hoặc hocPhan) phù hợp với searchTerm
      return cb1 || cb2 || hocPhan;
    });

    setFilteredData(filtered);
  }, [searchTerm, dataList]);



  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/pc-cham-thi`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setDataList((prevData) => prevData.filter((item) => item._id !== id));
        toast.success("Xoá thành công!");
      } else {
        toast.error("Xoá thất bại!");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 10,
      render: (text, record, index) => <span style={{ fontWeight: 'bold' }}>{index + 1}</span>,
    },
    {
      title: 'Học phần',
      dataIndex: 'hocPhan',
      key: 'hocPhan',
      render: (text) => (
        <span style={{ color: 'green', fontWeight: 'bold' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Nhóm/Lớp',
      dataIndex: 'nhomLop',
      key: 'nhomLop',
      render: (text) => (
        <span style={{ color: 'red', fontWeight: 'bold' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Ngày thi',
      dataIndex: 'ngayThi',
      key: 'ngayThi',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Cán bộ 1',
      dataIndex: 'cb1',
      key: 'cb1',
      render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span>,
    },
    {
      title: 'Cán bộ 2',
      dataIndex: 'cb2',
      key: 'cb2',
      render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span>,
    },
    {
      title: 'Số bài',
      dataIndex: 'soBai',
      key: 'soBai',
      width: 20,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'HT / TG',
      dataIndex: 'hinhThucThoiGianThi',
      key: 'hinhThucThoiGianThi',
      width: 50,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={() => router.push(`/admin/pc-cham-thi/edit/${record._id}`)} type="primary">Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button size="small" type="primary" danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
      width: 20,
    },
  ];


  // Phân trang dữ liệu
  const paginatedData = filteredData.slice(
    (current - 1) * pageSize,
    current * pageSize
  );

  return (
    <div className="py-1 px-3 shadow-xl bg-white rounded-xl mt-2 h-full flex flex-col">

      <div className="flex items-center justify-between mb-0">
        <div className="flex gap-2">
          <div className="text-small-bold">LOẠI:</div>
          <Select value={loai} size="small" placeholder="Chọn loại hình đào tạo..." onChange={(value) => setLoai(value)}>
            <Option value="chinh-quy">Chính quy</Option>
            <Option value="lien-thong-vlvh">Liên thông vừa làm vừa học</Option>
          </Select>
        </div>
        <h2 className="font-bold text-heading4-bold text-center text-green-500">DANH SÁCH PHÂN CÔNG CHẤM THI</h2>
        <Button
          className="button-dang-day text-white font-bold shadow-md mb-1"
          onClick={() => router.push(`/admin/pc-cham-thi/create`)}
        >
          TẠO MỚI
        </Button>
      </div>
      <div className="flex justify-between items-center mb-2 text-small-bold">
        <div className="w-[25%] flex items-center gap-2">
          <label className="block text-sm font-semibold mb-1">Năm học:</label>
          <Select size="small"
            placeholder="Chọn năm học"
            onChange={(value) => setNamHoc(value)}
            className="w-[50%]"
            value={namHoc}
          >
            <Option value="2021-2022">2021-2022</Option>
            <Option value="2022-2023">2022-2023</Option>
            <Option value="2023-2024">2023-2024</Option>
            <Option value="2024-2025">2024-2025</Option>
          </Select>
        </div>

        <div className="w-[25%] flex items-center gap-2">
          <label className="block text-sm font-semibold mb-1">Loại kỳ thi:</label>
          <Select size="small"
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

        <div className="w-[20%]">
          <Input.Search size="small"
            placeholder="Tìm kiếm học phần, giảng viên..."
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="mx-auto text-center w-full">
          <Spin />
        </div>
      ) : (
        <div className="flex-grow overflow-auto" style={{ maxHeight: 'calc(85vh - 75px)' }}>
          <Table
            columns={columns}
            dataSource={paginatedData}
            rowKey="_id"
            pagination={false} // Tắt phân trang trên Table
          />
        </div>
      )}

      <div className="mt-2 flex justify-between">
        <Button
          className="button-lien-thong-vlvh text-white font-bold shadow-md "
        //onClick={() => exportToExcelTongHop() }
        ><FileExcelOutlined />
          Xuất file Excel
        </Button>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={filteredData.length}
          onChange={(page, size) => {
            setCurrent(page);
            setPageSize(size);
          }}
          pageSizeOptions={['10', '25', '50', '100']}
          showSizeChanger
          className="flex justify-end"
        />
      </div>
    </div>
  );
};

export default PcChamThiTable;
