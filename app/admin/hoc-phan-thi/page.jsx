"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Space, Typography, Table, Popconfirm, InputNumber } from "antd";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const formSchema = {
    maHocPhan: "",
    tenHocPhan: "",
    soTinChi: "",
};

const HocPhanThiForm = () => {
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

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let filteredData = dataList;

        // Kiểm tra mã học phần và tên học phần
        if (searchName) {
            filteredData = filteredData.filter(hocPhan =>
                hocPhan.tenHocPhan.toLowerCase().includes(searchName.toLowerCase()) ||
                hocPhan.maHocPhan.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        setFilteredList(filteredData);
    }, [searchName, dataList]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/admin/hoc-phan-thi`, {
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

    const onSearch = (value) => {
        setSearchName(value);
    };

    const onSubmit = async (data) => {
        try {
            const method = editRecord ? "PUT" : "POST";
            const res = await fetch("/api/admin/hoc-phan-thi", {
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
        setValue("maHocPhan", record.maHocPhan);
        setValue("tenHocPhan", record.tenHocPhan);
        setValue("soTinChi", record.soTinChi);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch("/api/admin/hoc-phan-thi", {
                method: "DELETE",
                body: JSON.stringify({ id }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Đã xóa học phần!");
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
            title: 'Mã học phần',
            dataIndex: 'maHocPhan',
            key: 'maHocPhan',
        },
        {
            title: 'Tên học phần',
            dataIndex: 'tenHocPhan',
            key: 'tenHocPhan',
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'soTinChi',
            key: 'soTinChi',
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
    // return loading ? (
    //     <Loader />
    // ) : (
        <div className="flex gap-5 max-sm:flex-col mt-4 h-[83vh]">
            <div className="p-4 shadow-xl bg-white rounded-xl flex-[25%]">
                <Title className="text-center" level={3}>QUẢN LÝ HỌC PHẦN THI</Title>

                <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="space-y-5 mt-6">
                    <Form.Item
                        label={<span className="font-bold text-xl">Mã học phần <span className="text-red-600">*</span></span>}
                        validateStatus={errors.maHocPhan ? 'error' : ''}
                        help={errors.maHocPhan?.message}
                    >
                        <Controller
                            name="maHocPhan"
                            control={control}
                            rules={{ required: "Mã học phần là bắt buộc" }}
                            render={({ field }) => <Input className="input-text" placeholder="Nhập mã học phần ..." {...field} />}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-bold text-xl">Tên học phần <span className="text-red-600">*</span></span>}
                        validateStatus={errors.tenHocPhan ? 'error' : ''}
                        help={errors.tenHocPhan?.message}
                    >
                        <Controller
                            name="tenHocPhan"
                            control={control}
                            rules={{ required: "Tên học phần là bắt buộc" }}
                            render={({ field }) => <Input className="input-text" placeholder="Nhập tên học phần ..." {...field} />}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-bold text-xl">Số tín chỉ <span className="text-red-600">*</span></span>}
                        validateStatus={errors.soTinChi ? 'error' : ''}
                        help={errors.soTinChi?.message}
                    >
                        <Controller
                            name="soTinChi"
                            control={control}
                            rules={{ required: "Số tín chỉ là bắt buộc" }}
                            render={({ field }) => <InputNumber className="input-number" placeholder="Nhập số tín chỉ ..." {...field} />}
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
                    <Title level={3} className="text-center">DANH SÁCH HỌC PHẦN</Title>
                    <Input
                        placeholder="Tìm kiếm theo mã hoặc tên học phần"
                        allowClear
                        size="small"
                        style={{
                            width: 250,
                        }}
                        onChange={(e) => setSearchName(e.target.value)} 
                        prefix={<SearchOutlined />}
                    />
                </div>

                <Table
                    dataSource={filteredList}
                    columns={columns}
                    rowKey="_id"
                    pagination={{
                        current,
                        pageSize,
                        total: filteredList.length,
                        onChange: (page) => setCurrent(page),
                    }}
                />
            </div>
        </div>
    );
};

export default HocPhanThiForm;
