
"use client";

import { useState, useEffect } from "react";
import { Select, Input, Table, Popconfirm, Spin, Button, Space, Pagination } from "antd";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileExcelOutlined } from '@ant-design/icons';
import { useSession } from "next-auth/react";

const TablePcCoiThi = ({ list, namHoc, loaiKyThi, loaiDaoTao, hocky }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);


  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: session } = useSession();
  const user = session?.user;

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
      width: 120,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Cán bộ coi thi 1',
      dataIndex: 'cbo1',
      key: 'cbo1',
      render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span>,
    },
    {
      title: 'Cán bộ coi thi 2',
      dataIndex: 'cbo2',
      key: 'cbo2',
      render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span>,
    },
    {
      title: 'Hình thức',
      dataIndex: 'hinhThuc',
      key: 'hinhThuc',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'thoiGian',
      key: 'thoiGian',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
  ];

  // Phân trang dữ liệu
  const paginatedData = list?.slice(
    (current - 1) * pageSize,
    current * pageSize
  );
  const handleSubmit = async () => {
    console.log('Data:', list)

    //setLoading(true)
    try {
      const res = await fetch("/api/admin/lich-thi", {
        method: "POST",
        body: JSON.stringify(list),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Lưu thành công");
        setLoading(false)

      } else {
        toast.error("Failed to save record");
      }
    } catch (err) {
      toast.error("An error occurred while saving data");
    }
  }
  return (
    <div className="flex flex-col">
      {loading ? (
        <div className="mx-auto text-center w-full">
          <Spin />
        </div>
      ) : (

        <div className="flex-grow overflow-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
          <div className="text-heading3-bold text-orange-600 text-center mb-2" style={{ textTransform: "uppercase" }}>
            BẢNG THỐNG KÊ COI THI KỲ THI KẾT THÚC HỌC PHẦN - HỆ {loaiDaoTao} - THUỘC HỌC KỲ {hocky}, NĂM HỌC {namHoc}
          </div>

          <Table
            columns={columns}
            dataSource={paginatedData}
            rowKey="_id"
            pagination={false} // Tắt phân trang trên Table
          />
        </div>
      )}

      <div className="mt-2 flex justify-around">
        <div className="b text-center rounded-md  flex justify-center gap-10">

          <Button type="primary" className="button-chinh-quy" onClick={handleSubmit}>Lưu</Button>
          <Button type="primary" className="button-lien-thong-vlvh" >Xuất Excel</Button>

        </div>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={list.length}
          onChange={(page, size) => {
            setCurrent(page);
            setPageSize(size);
          }}
          pageSizeOptions={['5', '10', '25', '50', '100']}
          showSizeChanger
          className="flex justify-end"
        />
      </div>


    </div>
  );
};

export default TablePcCoiThi;
