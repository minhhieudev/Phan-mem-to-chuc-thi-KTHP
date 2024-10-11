"use client";

import { useState, useEffect } from "react";
import { Select, Input, Table, Popconfirm, Spin, Button, Space, Pagination } from "antd";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileExcelOutlined } from '@ant-design/icons';


const { Option } = Select;

const PcCoiThiTable = () => {
  const [dataList, setDataList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [namHoc, setNamHoc] = useState("2024-2025");
  const [hocKy, setHocKy] = useState("");
  const [loaiKyThi, setLoaiKyThi] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [loai, setLoai] = useState("Chính quy");

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const router = useRouter();

  useEffect(() => {
    //if (!namHoc && !loaiKyThi) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/pc-coi-thi?namHoc=${namHoc}&loaiKyThi=${loaiKyThi}&loai=${loai}&hocKy=${hocKy}`, {
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
  }, [namHoc, loaiKyThi, loai,hocKy]);

  useEffect(() => {
    const filtered = dataList.filter((item) =>
      item?.cbo1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.cbo2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.hocPhan?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, dataList]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/pc-coi-thi`, {
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
          {Array.isArray(text) ? text.join(', ') : text}
        </span>
      ),
    },
    {
      title: 'Nhóm/Lớp',
      dataIndex: 'lop',
      key: 'lop',
      render: (text) => (
        <span style={{ color: 'red', fontWeight: 'bold' }}>
          {Array.isArray(text) ? text.join(', ') : text}
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
      title: 'Ca',
      dataIndex: 'ca',
      key: 'ca',
      width: '1%',
      render: (text) => <span style={{ fontWeight: 'bold', color: 'orange' }}>{text}</span>,
    },
    {
      title: 'Phòng thi',
      dataIndex: 'phong',
      key: 'phong',
      width: 90,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Cán bộ 1',
      dataIndex: 'cbo1',
      key: 'cbo1',
      render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span>,
    },
    {
      title: 'Cán bộ 2',
      dataIndex: 'cbo2',
      key: 'cbo2',
      render: (text) => <span style={{ fontWeight: 'bold',color: 'blue' }}>{text}</span>,
    },
    {
      title: 'HT',
      dataIndex: 'hinhThuc',
      key: 'hinhThuc',
      width: 20,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'TG',
      dataIndex: 'thoiGian',
      key: 'thoiGian',
      width: 20,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    // {
    //   title: 'Ghi chú',
    //   dataIndex: 'ghiChu',
    //   key: 'ghiChu',
    //   render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    // },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={() => router.push(`/admin/thong-ke-coi-thi/edit/${record._id}`)} type="primary">Sửa</Button>
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

      <div className="flex items-center justify-between mb-1">
        <div className="flex gap-2">
          <div className="font-bold text-small-bold">LOẠI:</div>
          <Select size="small" value={loai} placeholder="Chọn loại hình đào tạo..." onChange={(value) => setLoai(value)}>
            <Option value="Chính quy">Chính quy</Option>
            <Option value="Liên thông vừa làm vừa học">Liên thông vừa làm vừa học</Option>
          </Select>
        </div>
        <h2 className="font-bold text-heading4-bold text-center text-green-500">DANH SÁCH PHÂN CÔNG COI THI</h2>
        <Button
          className="button-dang-day text-white font-bold shadow-md mb-1"
          onClick={() => router.push(`/admin/thong-ke-coi-thi/create`)}
        >
          TẠO MỚI
        </Button>
      </div>
      <div className="flex justify-between items-center mb-1 text-small-bold">
        <div className="w-[25%] flex items-center gap-2 h-[10px]">
          <label className="block text-sm font-semibold mb-1">Năm học:</label>
          <Select value={namHoc} size="small" allowClear
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

        <div className="w-[25%] flex items-center gap-2 h-[10px]">
          <label className="block text-sm font-semibold mb-1">Kỳ:</label>
          <Select value={hocKy} size="small" allowClear
            placeholder="Chọn học kỳ"
            onChange={(value) => setHocKy(value)}
            className="w-[50%]"
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
           
          </Select>
        </div>

        <div className="w-[25%] flex items-center gap-2">
          <label className="block text-sm font-semibold mb-1">Loại kỳ thi:</label>
          <Select size="small" allowClear
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
          pageSizeOptions={[ '10', '25', '50', '100', '200']}
          showSizeChanger
          className="flex justify-end"
        />
      </div>
    </div>
  );
};

export default PcCoiThiTable;
