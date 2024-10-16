"use client";

import React, { useEffect, useState } from "react";
import { Table, Popconfirm, Button, Input, Space, Pagination, Spin } from "antd";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { exportLichThi } from '../fileExport'

const TablePcCoiThi = ({ list, namHoc, loaiKyThi, loaiDaoTao, hocKy }) => {
  const [data, setData] = useState(list); // Dữ liệu danh sách
  const [editingKey, setEditingKey] = useState(""); // Khóa của hàng đang chỉnh sửa
  const [editingRow, setEditingRow] = useState({}); // Dữ liệu của hàng đang chỉnh sửa
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(""); // Thêm biến trạng thái cho tìm kiếm

  const { data: session } = useSession();
  const user = session?.user;

  // Kiểm tra xem hàng có đang được chỉnh sửa không
  const isEditing = (record) => record._id === editingKey;

  // Bắt đầu sửa hàng
  const edit = (record) => {
    setEditingKey(record._id);
    setEditingRow({ ...record });
  };

  // Lưu hàng đã chỉnh sửa
  const save = () => {
    const updatedData = data.map((item) => (item._id === editingKey ? editingRow : item));
    setData(updatedData);
    setEditingKey("");
    toast.success("Thay đổi thành công!");
  };

  // Hủy chỉnh sửa
  const cancel = () => {
    setEditingKey("");
  };

  // Xử lý khi xóa hàng
  const handleDelete = (recordId) => {
    const newData = data.filter((item) => item._id !== recordId);
    setData(newData);
    toast.success("Đã xoá thành công!");
  };

  /// Xử lý tìm kiếm
  const onSearch = (value) => {
    setSearchText(value);
    const filteredData = list.filter((item) =>
      item.hocPhan.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
  };

  // Cập nhật data khi thay đổi searchText
  useEffect(() => {
    if (searchText) {
      const filteredData = list.filter((item) =>
        item.hocPhan.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData);
    } else {
      setData(list);
    }
  }, [searchText, list]); // Chạy lại khi searchText hoặc list thay đổi


  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (text, record, index) => <span style={{ fontWeight: "bold" }}>{index + 1}</span>,
    },
    {
      title: "Học phần",
      dataIndex: "hocPhan",
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.hocPhan}
            onChange={(e) => setEditingRow({ ...editingRow, hocPhan: e.target.value })}
          />
        ) : (
          <span style={{ color: "green", fontWeight: "bold" }}>{text}</span>
        ),
    },
    {
      title: "Nhóm/Lớp",
      dataIndex: "lop",
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.lop}
            onChange={(e) => setEditingRow({ ...editingRow, lop: e.target.value })}
          />
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>{text}</span>
        ),
    },
    {
      title: "Ngày thi",
      dataIndex: "ngayThi",
      sorter: (a, b) => new Date(a.ngayThi) - new Date(b.ngayThi),
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.ngayThi}
            onChange={(e) => setEditingRow({ ...editingRow, ngayThi: e.target.value })}
          />
        ) : (
          <span style={{ fontWeight: "bold" }}>{text}</span>
        ),
    },
    {
      title: "Ca",
      dataIndex: "ca",
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.ca}
            onChange={(e) => setEditingRow({ ...editingRow, ca: e.target.value })}
          />
        ) : (
          <span style={{ fontWeight: "bold", color: "orange" }}>{text}</span>
        ),
      width: 65,
    },
    {
      title: "Phòng thi",
      dataIndex: "phong",
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.phong}
            onChange={(e) => setEditingRow({ ...editingRow, phong: e.target.value })}
          />
        ) : (
          <span style={{ fontWeight: "bold" }}>{text}</span>
        ),
    },
    {
      title: "Cán bộ 1",
      dataIndex: "cbo1",
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.cbo1}
            onChange={(e) => setEditingRow({ ...editingRow, cbo1: e.target.value })}
          />
        ) : (
          <span style={{ fontWeight: "bold", color: "blue" }}>{text}</span>
        ),
    },
    {
      title: "Cán bộ 2",
      dataIndex: "cbo2",
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.cbo2}
            onChange={(e) => setEditingRow({ ...editingRow, cbo2: e.target.value })}
          />
        ) : (
          <span style={{ fontWeight: "bold", color: "blue" }}>{text}</span>
        ),
    },
    {
      title: 'Hình thức',
      dataIndex: 'hinhThuc',
      key: 'hinhThuc',
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.hinhThuc}
            onChange={(e) => setEditingRow({ ...editingRow, hinhThuc: e.target.value })}
          />
        ) : (
          <span style={{ fontWeight: 'bold' }}>{text}</span>
        ),
        width: 70,
    },
    {
      title: 'Thời gian',
      dataIndex: 'thoiGian',
      key: 'thoiGian',
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.thoiGian}
            onChange={(e) => setEditingRow({ ...editingRow, thoiGian: e.target.value })}
          />
        ) : (
          <span style={{ fontWeight: 'bold' }}>{text}</span>
        ),
        width: 75,
    },

    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="small">
            <Button size="small" type="primary" onClick={save}>
              Lưu
            </Button>
            <Button size="small" onClick={cancel}>
              Hủy
            </Button>
          </Space>
        ) : (
          <Space size="middle">
            <Button size="small" type="primary" onClick={() => edit(record)}>
              Sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xoá?"
              onConfirm={() => handleDelete(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button size="small" type="primary" danger>
                Xoá
              </Button>
            </Popconfirm>
          </Space>
        );
      },
      width: 20,
    },
  ];

  // Phân trang dữ liệu
  const paginatedData = data?.slice(
    (current - 1) * pageSize,
    current * pageSize
  );
  const handleSubmit = async () => {
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
          <div className="text-base-bold text-orange-600 text-center mb-1" style={{ textTransform: "uppercase" }}>
            KẾT QUẢ PHÂN CÔNG COI THI KỲ THI KẾT THÚC HỌC PHẦN - HỆ {loaiDaoTao} <br /> THUỘC HỌC KỲ {hocKy}, NĂM HỌC {namHoc}
          </div>
          <div className="mb-2   flex justify-end">
            <Input.Search
              className="w-[30%]"
              placeholder="Tìm kiếm học phần"
              onSearch={onSearch}
              enterButton
              allowClear
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="_id"
            pagination={false}
          />
        </div>
      )}
      <div className="mt-2 flex justify-around">
        <div className="b text-center rounded-md  flex justify-center gap-10">
          <Button type="primary" className="button-chinh-quy" onClick={handleSubmit}>Lưu</Button>
          <Button  onClick={() => exportLichThi(data, `LỊCH COI THI KẾT THÚC HỌC PHẦN - HỆ`, hocKy, namHoc, loaiDaoTao)} type="primary" className="button-lien-thong-vlvh" >Xuất Excel</Button>
          
        </div>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={data.length}
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
