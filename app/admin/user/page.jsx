"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Space, Typography, Select, Table, Popconfirm, Spin, Pagination } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";
import * as XLSX from 'xlsx';
import { SearchOutlined } from '@ant-design/icons'

const { Title } = Typography;
const { Option } = Select;

const formSchema = {
    username: "",
    email: "",
    khoa: "",
    role: "",
};

const UserForm = () => {
    const [dataList, setDataList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [editRecord, setEditRecord] = useState(null);
    const { control, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: formSchema,
    });
    const [current, setCurrent] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [selectedKhoa, setSelectedKhoa] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(true);

    const [khoaOptions, setKhoaOptions] = useState([]);
    const quyenOptions = [
        { key: 'user', value: 'Giảng viên' },
        { key: 'giaoVu', value: 'Giáo vụ' },
        { key: 'admin', value: 'Admin' }
    ];


    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false); // Trạng thái upload
    const [pageSize, setPageSize] = useState(10);

    // Phân trang dữ liệu
    const paginatedData = filteredList.slice(
        (current - 1) * pageSize,
        current * pageSize
    );

    useEffect(() => {
        fetchData();
        getListKhoa()
    }, []);


    useEffect(() => {
        let filteredData = dataList;
        if (searchName) {
            filteredData = filteredData.filter(user => user.username.toLowerCase().includes(searchName.toLowerCase()));
        }
        if (selectedKhoa) {
            filteredData = filteredData.filter(user => user.khoa === selectedKhoa);
        }
        if (selectedRole) {
            filteredData = filteredData.filter(user => user.role === selectedRole);
        }
        setFilteredList(filteredData);
    }, [searchName, selectedKhoa, selectedRole, dataList]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/admin/user`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setDataList(data);
                setFilteredList(data);
                setLoading(false)
            } else {
                toast.error("Failed to fetch data");
            }
        } catch (err) {
            toast.error("An error occurred while fetching data");
        }
    };

    const getListKhoa = async () => {
        try {
            const res = await fetch(`/api/admin/khoa`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();

                // Chỉ lấy thuộc tính 'tenKhoa' từ dữ liệu
                const tenKhoaList = data.map(khoa => khoa.tenKhoa);

                setKhoaOptions(tenKhoaList);
            } else {
                toast.error("Failed to get khoa");
            }
        } catch (err) {
            toast.error("An error occurred while fetching data khoa");
        }
    };


    // Gọi lại API sau khi thêm mới hoặc chỉnh sửa thành công
    const onSubmit = async (data) => {
        try {
            const method = editRecord ? "PUT" : "POST";
            const res = await fetch("/api/admin/user", {
                method,
                body: JSON.stringify({ ...data, id: editRecord?._id }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success(editRecord ? "Chỉnh sửa thành công" : "Thêm mới thành công");
                fetchData();  // Gọi lại API để cập nhật danh sách sau khi thành công
                onReset();    // Reset form
            } else {
                toast.error("Failed to save record");
            }
        } catch (err) {
            toast.error("An error occurred while saving data");
        }
    };


    const onReset = () => {
        reset(formSchema);
        setEditRecord(null);
    };

    const handleEdit = (record) => {
        setEditRecord(record);
        // Sử dụng setValue để đổ dữ liệu vào form
        setValue("username", record.username);
        setValue("email", record.email);
        setValue("khoa", record.khoa);
        setValue("role", record.role);
    };


    const handleDelete = async (id) => {
        try {
            const res = await fetch("/api/admin/user", {
                method: "DELETE",
                body: JSON.stringify({ id }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Đã xóa user !");
                setDataList(prevData => prevData.filter(item => item._id !== id));
            } else {
                toast.error("Failed to delete record");
            }
        } catch (err) {
            toast.error("An error occurred while deleting data");
        }
    };

    const createManyUser = async (ListDataUser) => {
        setIsUploading(true);
        try {
            const method = "POST";
            const res = await fetch("/api/admin/user/create", {
                method,
                body: JSON.stringify({ users: ListDataUser }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const newData = await res.json();
                fetchData();
                toast.success("Thêm mới thành công");
                onReset();
                fileInputRef.current.value = "";
            } else {
                toast.error("Failed to save record");
            }
        } catch (err) {
            toast.error("An error occurred while saving data");
        } finally {
            setIsUploading(false); // Ẩn hiệu ứng xoay khi hoàn thành
        }
    };


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const ListDataUser = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            ListDataUser.shift(); // Loại bỏ dòng tiêu đề nếu cần

            if (ListDataUser.length > 0) {
                createManyUser(ListDataUser); // Gọi hàm gửi dữ liệu lên server
            } else {
                toast.error("No user data found in file.");
            }
        };

        reader.onerror = () => {
            toast.error("Đã xảy ra lỗi khi đọc file Excel");
        };

        reader.readAsBinaryString(file);
    };

    const columns = [
        {
            title: 'Họ tên giảng viên',
            dataIndex: 'username',
            key: 'username',
            className: 'text-blue-500 font-bold'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            className: 'text-green-500 font-bold'
        },
        {
            title: 'Khoa',
            dataIndex: 'khoa',
            key: 'khoa',
            className: 'text-orange-500 font-bold'

        },
        {
            title: 'Quyền',
            dataIndex: 'role',
            key: 'role',
            className: 'font-bold'

        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" onClick={() => handleEdit(record)} type="primary">Sửa</Button>
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
            width: 20
        },
    ];

    return loading ? (
        <Loader />
    ) : (
        <div className="flex gap-2 max-sm:flex-col mt-2 h-full">
            <div className="p-4 shadow-xl bg-white rounded-xl flex-[20%]">
                <Title className="text-center" level={3}>QUẢN LÝ NGƯỜI DÙNG</Title>

                <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="space-y-5 mt-6">
                    <Space direction="vertical" className="w-full">
                        <div className="flex justify-between">
                            <Form.Item
                                label={<span className="font-bold text-xl">Họ tên GV <span className="text-red-600">*</span></span>}
                                className="w-[40%] p-0"
                                validateStatus={errors.username ? 'error' : ''}
                                help={errors.username?.message}
                            >
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{ required: "Họ tên giảng viên là bắt buộc" }}
                                    render={({ field }) => <Input className="input-text" placeholder="Nhập tên giảng viên ..." {...field} />}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-bold text-xl">Mã GV: <span className="text-red-600">*</span></span>}
                                className="w-[40%]"
                                validateStatus={errors.maGV ? 'error' : ''}
                                help={errors.maGV?.message}
                            >
                                <Controller
                                    name="maGV"
                                    control={control}
                                    rules={{ required: "Mã GV là bắt buộc" }}
                                    render={({ field }) => <Input className="input-text" placeholder="Nhập mã GV ..." {...field} />}
                                />
                            </Form.Item>
                        </div>
                        <div className="flex justify-between">

                            <Form.Item
                                label={<span className="font-bold text-xl">Email <span className="text-red-600">*</span></span>}
                                className="w-[40%]"
                                validateStatus={errors.email ? 'error' : ''}
                                help={errors.email?.message}
                            >
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: "Email là bắt buộc" }}
                                    render={({ field }) => <Input className="input-text" placeholder="Nhập email ..." {...field} />}
                                />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between">
                            <div className="w-[40%]">
                                <Form.Item
                                    label={<span className="font-bold text-xl">Khoa <span className="text-red-600">*</span></span>}
                                    validateStatus={errors.khoa ? 'error' : ''}
                                    help={errors.khoa?.message}
                                >
                                    <Controller
                                        name="khoa"
                                        control={control}
                                        rules={{ required: "Khoa là bắt buộc" }}
                                        render={({ field }) => (
                                            <Select className="w-full" placeholder="Chọn khoa" {...field}>
                                                {khoaOptions.map(khoa => (
                                                    <Option key={khoa} value={khoa}>
                                                        {khoa}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </Form.Item>
                            </div>

                            <div className="w-[40%]">
                                <Form.Item
                                    label={<span className="font-bold text-xl">Quyền</span>}
                                    validateStatus={errors.role ? 'error' : ''}
                                >
                                    <Controller
                                        name="role"
                                        control={control}
                                        render={({ field }) => (
                                            <Select className="w-full" placeholder="Chọn quyền" {...field}>
                                                {quyenOptions.map(({ key, value }) => (
                                                    <Option key={key} value={key}>
                                                        {value}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button className="bg-blue-500 hover:bg-blue-700" loading={isSubmitting} type="primary" htmlType="submit">
                                {editRecord ? "Lưu chỉnh sửa" : "Thêm mới"}
                            </Button>
                            <Button danger className="ml-4" htmlType="button" onClick={onReset}>
                                Reset
                            </Button>
                        </div>
                        <div className="text-center">
                            <Spin spinning={isUploading}>
                                <label htmlFor="excelUpload">
                                    <Button
                                        className="mt-3 button-lien-thong-vlvh"
                                        type="primary"
                                        icon={<UploadOutlined />}
                                        onClick={() => fileInputRef.current.click()}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Đang tải lên...' : 'Import từ file Excel'}
                                    </Button>
                                </label>
                            </Spin>

                            <div className="hidden">
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="excelUpload"
                                    ref={fileInputRef}
                                />
                            </div>
                        </div>

                    </Space>
                </Form>
            </div>

            <div className="p-3 shadow-xl bg-white rounded-xl flex-[65%]">
                <div className="flex flex-col gap-2 justify-between items-center mb-2">
                    <Title level={4} className="text-center">DANH SÁCH NGƯỜI DÙNG</Title>
                    <div className="flex gap-3 justify-between w-full">
                        <div className="flex flex-1">
                            <Input
                                className="w-[30%] flex-1"
                                placeholder="Tìm kiếm theo tên giảng viên"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                prefix={<SearchOutlined />}
                            />

                        </div>
                        <div className="flex flex-1 gap-1">
                            <div className="text-base-bold">Khoa:</div>
                            <Select
                                className="w-[30%] flex-1"
                                placeholder="Lọc theo khoa"
                                allowClear
                                value={selectedKhoa}
                                onChange={value => setSelectedKhoa(value)}
                            >
                                {khoaOptions.map(khoa => (
                                    <Option key={khoa} value={khoa}>
                                        {khoa}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="flex flex-1 gap-1">
                            <div className="text-base-bold">Quyền:</div>
                            <Select
                                className="w-[30%] flex-1"
                                placeholder="Lọc theo quyền"
                                allowClear
                                value={selectedRole}
                                onChange={value => setSelectedRole(value)}
                            >
                                {quyenOptions.map(({ key, value }) => (
                                    <Option key={key} value={key}>
                                        {value}
                                    </Option>
                                ))}
                            </Select>
                        </div>


                    </div>
                </div>

                <div className="flex-grow overflow-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                    <Table
                        dataSource={paginatedData}
                        columns={columns}
                        rowKey="_id"
                        pagination={false}
                    />
                </div>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={filteredList.length}
                    onChange={(page, size) => {
                        setCurrent(page);
                        setPageSize(size);
                    }}
                    pageSizeOptions={['10', '25', '50', '100', '200']}
                    showSizeChanger
                    className="flex justify-end"
                />
            </div>
        </div>
    );
};

export default UserForm;
