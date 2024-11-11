"use client";

import React, { useEffect, useState } from "react";
import { Table, Popconfirm, Button, Input, Space, Pagination, Spin, Modal, Select } from "antd";

import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { exportLichThi } from '../fileExport'

const TablePcCoiThi = ({ list, namHoc, loaiKyThi, loaiDaoTao, hocKy, listPhong, listNgayThi }) => {
  const [data, setData] = useState(list);
  const [editingKey, setEditingKey] = useState("");
  const [editingRow, setEditingRow] = useState({});
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentList, setCurrentList] = useState([]);

  const [ngayThiFilter, setNgayThiFilter] = useState(null); // Lọc theo ngày thi
  const [caThiFilter, setCaThiFilter] = useState(null); // Lọc theo buổi thi (1: Sáng, 5: Chiều)
  const [phongThiFilter, setPhongThiFilter] = useState(null); // Lọc theo phòng thi
  const [giangVienFilter, setGiangVienFilter] = useState(""); // Lọc theo tên giảng viên (Cán bộ 1 và Cán bộ 2)

  const { Option } = Select;
  const { data: session } = useSession();
  const user = session?.user;

  const isEditing = (record) => record._id === editingKey;

  // Bắt đầu sửa hàng
  const edit = (record) => {
    setEditingKey(record._id);
    setEditingRow({ ...record });
  };

  const showModal = (danhSachThiSinh) => {
    const flattenedDanhSach = danhSachThiSinh.flat();

    const sortedDanhSach = flattenedDanhSach
      .filter(item => item.hoTen)
      .sort((a, b) => {
        // Tách tên theo khoảng trắng và lấy phần cuối cùng của tên
        const lastNameA = typeof a.hoTen === 'string' ? a.hoTen.trim().split(' ').pop().toLowerCase() : '';
        const lastNameB = typeof b.hoTen === 'string' ? b.hoTen.trim().split(' ').pop().toLowerCase() : '';
        return lastNameA.localeCompare(lastNameB);
      });

    // Sau đó gọi Modal để hiển thị danh sách đã sắp xếp
    setCurrentList(sortedDanhSach);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };



  const cancel = () => {
    setEditingKey("");
  };

  const handleDelete = (recordId) => {
    const newData = data.filter((item) => item._id !== recordId);
    setData(newData);
    toast.success("Đã xoá thành công!");
  };

  const onSearch = () => {
    let filteredData = list;

    if (searchText) {
      filteredData = filteredData.filter((item) =>
        item.hocPhan.some(subArray => subArray.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Lọc theo ngày thi
    if (ngayThiFilter) {
      filteredData = filteredData.filter(item => item.ngayThi === ngayThiFilter);
    }

    // Lọc theo buổi thi (Sáng/Chiều)
    if (caThiFilter) {
      filteredData = filteredData.filter(item => item.ca === caThiFilter);
    }

    // Lọc theo phòng thi
    if (phongThiFilter) {
      filteredData = filteredData.filter(item => item.phong.some(p => p.tenPhong === phongThiFilter));
    }

    // Lọc theo tên giảng viên (Cán bộ 1 hoặc Cán bộ 2)
    if (giangVienFilter) {
      filteredData = filteredData.filter(item =>
        item.cbo1.toLowerCase().includes(giangVienFilter.toLowerCase()) ||
        item.cbo2.toLowerCase().includes(giangVienFilter.toLowerCase())
      );
    }

    setData(filteredData);
  };

  useEffect(() => {
    onSearch(); // gọi lại hàm lọc khi bất kỳ bộ lọc nào thay đổi
  }, [searchText, ngayThiFilter, caThiFilter, phongThiFilter, giangVienFilter]);
  


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
            value={editingRow.hocPhan.join(' - ')} 
            onChange={(e) => setEditingRow({
              ...editingRow,
              hocPhan: e.target.value.split(' - ') 
            })}
          />
        ) : (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {text.join(' - ')}  
          </span>
        ),
    },
    {
      title: "Nhóm/Lớp",
      dataIndex: "lop",
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.lop.map(arr => arr.join(' - ')).join(', ')} 
            onChange={(e) => setEditingRow({
              ...editingRow,
              lop: e.target.value.split(',').map(group => group.split(' - '))  
            })}
          />
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {text.map(arr => arr.join(' - ')).join(', ')} 
          </span>
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
      width: 110,

    },
    {
      title: "Buổi thi",
      dataIndex: "ca",
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.ca}
            onChange={(e) => setEditingRow({ ...editingRow, ca: e.target.value })}
          />
        ) : (
          <span style={{ fontWeight: "bold", color: "orange" }}>{text == '1' ? 'Sáng' : 'Chiều'}</span>
        ),
      width: 60,
    },
    {
      title: "Phòng thi",
      dataIndex: "phong",
      render: (text, record) =>
        isEditing(record) ? (
          <Input
            value={editingRow.phong && editingRow.phong.map(p => p.tenPhong).join(" - ")}  
            onChange={(e) => setEditingRow({
              ...editingRow,
              phong: e.target.value.split(" - ").map(tenPhong => ({ tenPhong })) 
            })}
          />
        ) : (
          <span style={{ fontWeight: "bold" }}>
            {text.map(p => p.tenPhong).join(" - ")} 
          </span>
        ),
      width: 40,

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
          // Hiển thị các giá trị của mảng trong một Input
          <Input
            value={editingRow.hinhThuc.join(', ')}  // Chuyển mảng thành chuỗi để hiển thị
            onChange={(e) =>
              // Cập nhật mảng khi người dùng thay đổi giá trị
              setEditingRow({ 
                ...editingRow, 
                hinhThuc: e.target.value.split(',').map(item => item.trim())  // Chuyển lại thành mảng sau khi người dùng nhập
              })
            }
          />
        ) : (
          // Hiển thị các giá trị của mảng khi không chỉnh sửa
          <span style={{ fontWeight: 'bold' }}>{text.join(', ')}</span>
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
            value={editingRow.thoiGian.join(', ')}  // Chuyển mảng thành chuỗi khi hiển thị
            onChange={(e) =>
              setEditingRow({ ...editingRow, thoiGian: e.target.value.split(',').map(item => item.trim()) }) // Chuyển lại thành mảng khi người dùng chỉnh sửa
            }
          />
        ) : (
          <span style={{ fontWeight: 'bold' }}>{text.join(', ')}</span> // Hiển thị mảng dưới dạng chuỗi khi không chỉnh sửa
        ),
      width: 75,
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
      render: (text, record) =>
        isEditing(record) ? (
          // Hiển thị các giá trị của mảng 'soLuong' dưới dạng chuỗi trong Input
          <Input
            value={editingRow.soLuong.join(', ')}  // Chuyển mảng thành chuỗi để hiển thị
            onChange={(e) =>
              // Cập nhật mảng 'soLuong' khi người dùng thay đổi giá trị
              setEditingRow({ 
                ...editingRow, 
                soLuong: e.target.value.split(',').map(item => item.trim())  // Chuyển lại thành mảng
              })
            }
          />
        ) : (
          // Hiển thị các giá trị của mảng 'soLuong' khi không chỉnh sửa
          <span style={{ fontWeight: 'bold' }}>{text.join(', ')}</span>
        ),
      width: 75,
    },
    {
      title: 'DS SV',
      dataIndex: 'danhSachThiSinh',
      key: 'danhSachThiSinh',
      render: (text, record) => (
        <Button size="small"  type="dashed" danger onClick={() => showModal(text)}>
          Xem
        </Button>
        
      ),
      width: 15,

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
          <div className="mb-2 flex justify-between">
            <Input.Search
              size="small"
              className="w-[15%]"
              placeholder="Tìm kiếm học phần"
              onSearch={onSearch}
              enterButton
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />

            <Select
              allowClear
              size="small"
              className="w-[15%]"
              placeholder="Chọn ngày thi"
              onChange={value => setNgayThiFilter(value)}
              value={ngayThiFilter}
            >
              {listNgayThi?.map((ngayThi, index) => (
                <Option key={index} value={ngayThi}>{ngayThi}</Option>
              ))}
            </Select>

            <Select
              allowClear
              size="small"
              className="w-[15%]"
              placeholder="Chọn buổi thi"
              onChange={value => setCaThiFilter(value)}
              value={caThiFilter}
            >
              <Option value="1">Sáng</Option>
              <Option value="5">Chiều</Option>
            </Select>

            <Select
              allowClear
              size="small"
              className="w-[15%]"
              placeholder="Chọn phòng thi"
              onChange={value => setPhongThiFilter(value)}
              value={phongThiFilter}
            >
              {listPhong?.map((phong, index) => (
                <Option key={index} value={phong.tenPhong}>{phong.tenPhong}</Option>
              ))}
            </Select>

            <Input.Search
              size="small"
              className="w-[15%]"
              allowClear
              placeholder="Tìm giảng viên"
              onChange={(e) => setGiangVienFilter(e.target.value)}
              value={giangVienFilter}
              enterButton
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

      <Modal
        title="Danh sách sinh viên"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Table
          bordered
          dataSource={currentList}
          columns={[
            {
              title: 'Họ và Tên',
              dataIndex: 'hoTen',
              key: 'hoTen',
              className: 'font-bold text-red-600'
            },
            {
              title: 'Mã Sinh Viên',
              dataIndex: 'maSV',
              key: 'maSV',
              className: 'font-bold text-blue-600'

            },
            {
              title: 'Lớp',
              dataIndex: 'lop',
              key: 'lop',
              className: 'font-bold text-green-600'

            },
          ]}
          pagination={false}
          rowKey={(record) => record.index}  // Sử dụng index làm khóa
          scroll={{ y: 400 }} // Set the vertical scroll height to 400px
        />
      </Modal>

      <div className="mt-2 flex justify-around">
        <div className="b text-center rounded-md  flex justify-center gap-10">
          <Button type="primary" className="button-chinh-quy" onClick={handleSubmit}>Lưu</Button>
          <Button onClick={() => exportLichThi(data, `LỊCH COI THI KẾT THÚC HỌC PHẦN - HỆ`, hocKy, namHoc, loaiDaoTao)} type="primary" className="button-lien-thong-vlvh" >Xuất Excel</Button>

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
