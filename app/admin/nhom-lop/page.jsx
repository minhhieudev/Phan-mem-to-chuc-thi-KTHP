"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Space, Typography, Table, Popconfirm, InputNumber, Select } from "antd";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const formSchema = {
    tenLop: "",
    soSV: "",
    khoa: "",
};

const LopForm = () => {
    const [dataList, setDataList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [editRecord, setEditRecord] = useState(null);
    const { control, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: formSchema,
    });
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(5);
    const [searchName, setSearchName] = useState("");
    const [loading, setLoading] = useState(true);
    const [khoaList, setKhoaList] = useState(['KTCN','GDMN']); // Thêm state để lưu danh sách khoa

    useEffect(() => {
        fetchData();
        fetchKhoaData(); // Lấy danh sách khoa
    }, []);

    useEffect(() => {
        let filteredData = dataList;

        // Kiểm tra tên lớp
        if (searchName) {
            filteredData = filteredData.filter(lop =>
                lop.tenLop.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        setFilteredList(filteredData);
    }, [searchName, dataList]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/admin/nhom-lop`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setDataList(data);
                setFilteredList(data);
                setLoading(false);
            } else {
                toast.error("Failed to fetch data");
            }
        } catch (err) {
            toast.error("An error occurred while fetching data");
        }
    };

    const fetchKhoaData = async () => {
        try {
            const res = await fetch(`/api/admin/khoa`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setKhoaList(data);
            } else {
                toast.error("Failed to fetch khoa data");
            }
        } catch (err) {
            toast.error("An error occurred while fetching khoa data");
        }
    };

    const onSubmit = async (data) => {
        try {
            const method = editRecord ? "PUT" : "POST";
            const res = await fetch("/api/admin/nhom-lop", {
                method,
                body: JSON.stringify({ ...data, id: editRecord?._id }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success(editRecord ? "Chỉnh sửa thành công" : "Thêm mới thành công");
                fetchData();
                onReset();
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
        setValue("tenLop", record.tenLop);
        setValue("soSV", record.soSV);
        setValue("khoa", record.khoa);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch("/api/admin/nhom-lop", {
                method: "DELETE",
                body: JSON.stringify({ id }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Đã xóa lớp!");
                setDataList(prevData => prevData.filter(item => item._id !== id));
            } else {
                toast.error("Failed to delete record");
            }
        } catch (err) {
            toast.error("An error occurred while deleting data");
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên lớp',
            dataIndex: 'tenLop',
            key: 'tenLop',
        },
        {
            title: 'Số sinh viên',
            dataIndex: 'soSV',
            key: 'soSV',
        },
        {
            title: 'Khoa',
            dataIndex: 'khoa',
            key: 'khoa',
            render: (khoa) => khoa?.tenKhoa || 'Chưa có dữ liệu', 
          },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record)} type="primary">Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xoá?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger>Xoá</Button>
                    </Popconfirm>
                </Space>
            ),
            width: 140
        },
    ];

    return  (
        <div className="flex gap-5 max-sm:flex-col mt-4 h-[83vh]">
            <div className="p-4 shadow-xl bg-white rounded-xl flex-[25%]">
                <Title className="text-center" level={3}>QUẢN LÝ LỚP</Title>

                <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="space-y-5 mt-6">
                    <Form.Item
                        label={<span className="font-bold text-xl">Tên lớp <span className="text-red-600">*</span></span>}
                        validateStatus={errors.tenLop ? 'error' : ''}
                        help={errors.tenLop?.message}
                    >
                        <Controller
                            name="tenLop"
                            control={control}
                            rules={{ required: "Tên lớp là bắt buộc" }}
                            render={({ field }) => <Input className="input-text" placeholder="Nhập tên lớp ..." {...field} />}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-bold text-xl">Số sinh viên <span className="text-red-600">*</span></span>}
                        validateStatus={errors.soSV ? 'error' : ''}
                        help={errors.soSV?.message}
                    >
                        <Controller
                            name="soSV"
                            control={control}
                            rules={{ required: "Số sinh viên là bắt buộc" }}
                            render={({ field }) => <InputNumber className="input-number" placeholder="Nhập số sinh viên ..." {...field} />}
                        />
                    </Form.Item>

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
                                <Select className="input-select" placeholder="Chọn khoa ..." {...field}>
                                    {khoaList.map(khoa => (
                                        <Select.Option key={khoa._id} value={khoa._id}>
                                            {khoa.tenKhoa}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        />
                    </Form.Item>

                    <Space size="middle">
                        <Button className="bg-blue-500 hover:bg-blue-700" loading={isSubmitting} type="primary" htmlType="submit">
                            {editRecord ? "Lưu chỉnh sửa" : "Thêm mới"}
                        </Button>
                        <Button className="ml-4" htmlType="button" danger onClick={onReset}>
                            Reset
                        </Button>
                    </Space>
                </Form>
            </div>

            <div className="p-3 shadow-xl bg-white rounded-xl flex-[75%]">
                <div className="flex flex-col gap-2 justify-between items-center mb-4">
                    <Title level={4} className="mt-1">DANH SÁCH LỚP</Title>

                    <div className="flex gap-2 items-center">
                        <Input
                            placeholder="Tìm kiếm lớp"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </div>
                </div>

                {loading ? (
                    <Loader />
                ) : (
                    <Table
                        bordered
                        dataSource={filteredList.map((item, index) => ({ ...item, key: item._id, stt: index + 1 }))}
                        columns={columns}
                        pagination={{
                            current,
                            pageSize,
                            total: filteredList.length,
                            onChange: (page) => setCurrent(page),
                            showSizeChanger: false,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default LopForm;
