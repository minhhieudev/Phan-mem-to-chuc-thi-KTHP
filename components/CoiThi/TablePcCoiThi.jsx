"use client";

import React, { useEffect, useState } from "react";
import { Table, Popconfirm, Button, Input, Space, Pagination, Spin, Modal, Select } from "antd";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { exportDSSV, exportLichThi, exportLichThiExcel } from '../fileExport'

const TablePcCoiThi = ({ list, namHoc, loaiKyThi, loaiDaoTao, hocKy, listPhong, listNgayThi }) => {
  const [data2, setData2] = useState(list);
  const [dataUser, setDataUser] = useState([]);


  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [editingRow, setEditingRow] = useState({});
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [phong, setPhong] = useState("");

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

  useEffect(() => {
    if (list && list.length > 0) {
      setData2(list);
    }
  }, [list]);

  const save = () => {
    // Cập nhật dữ liệu
    const updatedData = data2.map((item) => (item._id === editingKey ? editingRow : item));
    
    // Sắp xếp dữ liệu theo ngày thi tăng dần
    const sortedData = [...updatedData].sort((a, b) => {
      // Chuyển đổi chuỗi ngày thành đối tượng Date để so sánh
      const dateA = convertStringToDate(a.ngayThi);
      const dateB = convertStringToDate(b.ngayThi);
      return dateA - dateB;
    });
    
    // Cập nhật cả data và data2
    setData(sortedData);
    setData2(sortedData);
    
    setEditingKey("");
    toast.success("Thay đổi thành công!");
  }

  // Hàm hỗ trợ chuyển đổi chuỗi ngày sang đối tượng Date
  const convertStringToDate = (dateString) => {
    // Giả định rằng chuỗi ngày có định dạng "DD-MM-YYYY"
    if (!dateString) return new Date(0); // Trả về ngày epoch nếu không có giá trị
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return new Date(0);
    
    // Tạo đối tượng Date (lưu ý: tháng trong JS bắt đầu từ 0)
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  const showModal = (danhSachThiSinh, phong, index, listSoLuong) => {
    setCurrentList([])
    setPhong(phong.tenPhong);

    const flattenedDanhSach = danhSachThiSinh.flat();
    const sortedDanhSach = flattenedDanhSach
      .filter(item => item.hoTen)
      .sort((a, b) => {
        // Tách tên theo khoảng trắng và lấy phần cuối cùng của tên
        const lastNameA = typeof a.hoTen === 'string' ? a.hoTen.trim().split(' ').pop().toLowerCase() : '';
        const lastNameB = typeof b.hoTen === 'string' ? b.hoTen.trim().split(' ').pop().toLowerCase() : '';
        return lastNameA.localeCompare(lastNameB);
      });


    const list = listSoLuong[0];
    const currentSoLuong = list[index] || 0;

    if (list.length > 1) {

      const startIndex = index > 0 ? list.slice(0, index).reduce((a, b) => a + b, 0) - 1 : 0; // Tính chỉ số bắt đầu
      const danhSachSinhVien = sortedDanhSach.slice(startIndex, startIndex + currentSoLuong); // Cắt danh sách sinh viên

      setCurrentList(danhSachSinhVien);
      setIsModalVisible(true);

      return;
    }

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
    console.log('Dataaaaaaaaaaaaa:', list)

    const newData = data2.filter((item) => item._id !== recordId);
    setData2(newData);
    setData(newData);
    toast.success("Đã xoá thành công!");
  };

  const onSearch = () => {
    setData([]);
    let filteredData = data2;

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

    setData2((prevData2) => {
      // Sử dụng bản sao của `prevData2` để cập nhật
      const updatedData2 = [...prevData2];

      // Duyệt qua từng phần tử trong `filteredData`
      data.forEach((item) => {
        const index = updatedData2.findIndex((oldItem) => oldItem._id === item._id);
        if (index !== -1) {
          // Nếu phần tử đã có trong `data2`, cập nhật phần tử đó
          updatedData2[index] = item;
        } else {
          // Nếu phần tử chưa có trong `data2`, thêm vào `data2`
          updatedData2.push(item);
        }
      });

      return updatedData2;
    });

  }, [data]);

  useEffect(() => {
    onSearch(); // gọi lại hàm lọc khi bất kỳ bộ lọc nào thay đổi
  }, [searchText, ngayThiFilter, caThiFilter, phongThiFilter, giangVienFilter]);

  //const uniqueNgayThi = listNgayThi?.map(item => item.ngayThi).filter((value, index, self) => self.indexOf(value) === index);

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
      render: (text, record) => {
        // Kiểm tra số lượng phòng thi
        const soPhong = record.phong.length; // Số lượng phòng thi
        return (
          <div className="flex flex-col gap-2">
            {Array.from({ length: soPhong }).map((_, index) => (
              <Button
                key={index}
                size="small"
                type="dashed"
                danger
                onClick={() => showModal(text, record.phong[index], index, record.soLuong)} // Hiển thị modal cho từng phòng
              >
                Xem
              </Button>
            ))}
          </div>
        );
      },
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

  // Thêm hàm để tính toán dữ liệu đã phân trang
  const getPaginatedData = () => {
    const currentData = data.length > 0 ? data : data2;
    return currentData.slice((current - 1) * pageSize, current * pageSize);
  };


  const handleSubmit = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const res = await fetch("/api/admin/lich-thi", {
        method: "POST",
        body: JSON.stringify(list),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Lưu thành công");
      } else {
        toast.error("Failed to save record");
      }
    } catch (err) {
      toast.error("An error occurred while saving data");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };
  const uniqueNgayThi = [...new Set(data2?.map(item => item.ngayThi))];

  // Nội dung email
  const contentEmail = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #2c3e50;">Kính gửi Quý Thầy / Cô,</h2>
      
      <p>Trường Đại học Phú Yên xin gửi tới Quý Thầy / Cô thông báo về lịch coi thi cho học kỳ <strong>${hocKy}</strong> năm học <strong>${namHoc}</strong> với loại đào tạo <strong>${loaiDaoTao}</strong>.</p>
      
      <p>Trong lịch thi này, Quý Thầy / Cô sẽ thấy các thông tin chi tiết về thời gian, địa điểm và môn thi. Xin vui lòng kiểm tra kỹ lưỡng và phản hồi nếu có bất kỳ thắc mắc hay điều chỉnh nào cần thiết.</p>
      
      <p>Quý Thầy / Cô có thể tải xuống lịch thi từ tệp đính kèm trong email này.</p>
      
      <p>Nếu có bất kỳ câu hỏi hay cần thêm thông tin, xin vui lòng liên hệ với Phòng Hành chính - Nhân sự qua email hoặc số điện thoại dưới đây.</p>
      
      <p>Trân trọng,<br />
      Nguyễn Văn B<br />
      Phòng Đào Tạo<br />
      Trường Đại học Phú Yên<br />
      <a href="mailto:email@example.com">email@example.com</a><br />
      0123 456 789</p>
  </div>
`;
  const handleSendEmail = async () => {

    // Hiển thị modal xác nhận
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn gửi lịch thi đến tất cả giảng viên được phân công coi thi?',
      onOk: async () => {
        setLoading(true); // Bắt đầu loading
        // Xuất file và nhận blob
        const fileBlob = exportLichThi(data2, `LỊCH COI THI KẾT THÚC HỌC PHẦN - HỆ`, hocKy, namHoc, loaiDaoTao);

        if (!(fileBlob instanceof Blob)) {
          console.error("fileBlob is not a valid Blob");
          return; // Dừng lại nếu fileBlob không phải là Blob
        }

        try {
          // Tự động upload file
          const result = await uploadFile(fileBlob); // Gọi hàm uploadFile

          const url = result?.secure_url;
          const filename = result?.original_filename;

          const publicId = result?.public_id;
          const fileExtension = publicId?.split('.').pop();

          const contentType = fileExtension === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : fileExtension?.startsWith('jpg') || fileExtension?.startsWith('png') || fileExtension?.startsWith('jpeg')
              ? `image/${fileExtension}`
              : 'application/octet-stream';

          const fileObject = [{
            filename: `${filename}.${fileExtension}`,
            path: url,
            contentType
          }];


          if (fileObject) {
            const res = await fetch(`/api/admin/user`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
              const dataUs = await res.json();

              if (dataUs) {
                const filteredEmails = dataUs
                  .filter(user => data.some(item => item.cbo1 === user.username || item.cbo2 === user.username))
                  .map(user => user.email);

                // Gọi API gửi email với fileObject
                const res = await fetch("/api/admin", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    subject: "Lịch coi thi",
                    html: contentEmail,
                    attachments: fileObject,
                    email: filteredEmails
                  })

                });

                if (res.ok) {
                  toast.success("Đã gửi email đến tất cả giảng viên!");
                } else {
                  toast.error("Có lỗi xảy ra khi gửi email!");
                }

              }
            } else {
              toast.error("Failed to fetch data email user");
            }
          }

        } catch (error) {
          console.error("Error sending email:", error);
          toast.error("Có lỗi xảy ra khi gửi email!");
        } finally {
          setLoading(false); // Kết thúc loading
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });


  };

  // Hàm upload file
  const uploadFile = async (fileBlob) => {
    const formData = new FormData();
    formData.append('file', fileBlob, 'data-sv.xlsx'); // Đặt tên file
    formData.append('upload_preset', 'e0rggou2'); // Đảm bảo bạn đã cấu hình upload preset trong Cloudinary
    formData.append('source', 'uw'); // Thêm trường source
    formData.append('api_key', 'YOUR_API_KEY'); // Thêm API Key của bạn vào đây

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dpxcvonet/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
        throw new Error(`Failed to upload file: ${errorData.error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  };



  return (
    <div className="flex flex-col">
      {loading ? (
        <div className="mx-auto text-center w-full">
          <Spin />
        </div>
      ) : (
        <div className="flex-grow overflow-auto" style={{ maxHeight: 'calc(85vh - 60px)' }}>
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
              {uniqueNgayThi?.map((ngayThi, index) => (
                <Option key={index} value={ngayThi}>
                  {ngayThi}
                </Option>
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
              <Option value="3">Chiều</Option>
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
            dataSource={getPaginatedData()}
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
              title: 'STT',
              dataIndex: 'index',
              render: (text, record, index) => <span style={{ fontWeight: 'bold' }}>{index + 1}</span>,
            },
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
            {
              title: 'Môn thi',
              dataIndex: 'hocPhan',
              key: 'hocPhan',
              className: 'font-bold '

            },
          ]}
          pagination={false}
          rowKey={(record) => record.index}  // Sử dụng index làm khóa
          scroll={{ y: 400 }} // Set the vertical scroll height to 400px
        />
        <div className="w-full text-center flex justify-center">
          <Button onClick={() => exportDSSV(currentList, hocKy, namHoc, phong)} type="primary" className="text-center mt-4 button-lien-thong-vlvh" >Xuất Excel</Button>

        </div>
      </Modal>

      <div className="mt-1 flex justify-around">
        <div className="b text-center rounded-md  flex justify-center gap-10">
          <Button type="primary" className="button-chinh-quy" onClick={handleSubmit} loading={loading}>
            Lưu
          </Button>
          <Button onClick={() => exportLichThiExcel(data2, `LỊCH COI THI KẾT THÚC HỌC PHẦN - HỆ`, hocKy, namHoc, loaiDaoTao)} type="primary" className="button-lien-thong-vlvh" >Xuất Excel</Button>
          <Button onClick={handleSendEmail} type="primary" className="button-kiem-nhiem">Gửi email</Button>

        </div>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={data.length > 0 ? data.length : data2.length}
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
