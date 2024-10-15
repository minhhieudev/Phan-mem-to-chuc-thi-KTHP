"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Space, Typography, Table, Popconfirm, InputNumber, Select } from "antd";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const formSchema = {
    tenPhong: "",
    soCho: "",
    loai: ""
};

const PhongThiForm = () => {
    const [dataList, setDataList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [editRecord, setEditRecord] = useState(null);
    const { control, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: formSchema,
    });
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(5);
    const [searchName, setSearchName] = useState(""); 
    const [roomTypeFilter, setRoomTypeFilter] = useState("");
    const [roomTypeFilter2, setRoomTypeFilter2] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let filteredData = dataList;

        // Kiểm tra tên phòng
        if (searchName) {
            filteredData = filteredData.filter(phong =>
                phong.tenPhong.toLowerCase().includes(searchName.toLowerCase())
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

        // Kiểm tra loại phòng thứ hai
        if (roomTypeFilter2) {
            filteredData = filteredData.filter(phong => phong.loai === roomTypeFilter2);
        }

        setFilteredList(filteredData);
    }, [searchName, roomTypeFilter, roomTypeFilter2, dataList]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/admin/phong-thi`, {
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

    const onSubmit = async (data) => {
        try {
            const method = editRecord ? "PUT" : "POST";
            const res = await fetch("/api/admin/phong-thi", {
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
        setValue("tenPhong", record.tenPhong);
        setValue("soCho", record.soCho);
        setValue("loai", record.loai);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch("/api/admin/phong-thi", {
                method: "DELETE",
                body: JSON.stringify({ id }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Đã xóa phòng thi!");
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
            title: 'Tên phòng',
            dataIndex: 'tenPhong',
            key: 'tenPhong',
            className: 'text-blue-500 font-bold'
        },
        {
            title: 'Số chỗ',
            dataIndex: 'soCho',
            key: 'soCho',
            className: 'text-green-500 font-bold'
        },
        {
            title: 'Loại',
            dataIndex: 'loai',
            key: 'loai',
            className: 'text-orange-500 font-bold'
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

    return (
        <div className="flex gap-2 max-sm:flex-col mt-3 h-full">
            <div className="p-4 shadow-xl bg-white rounded-xl flex-[25%]">
                <Title className="text-center" level={3}>QUẢN LÝ PHÒNG THI</Title>

                <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="space-y-5 mt-6">
                    <Form.Item
                        label={<span className="font-bold text-xl">Tên phòng <span className="text-red-600">*</span></span>}
                        validateStatus={errors.tenPhong ? 'error' : ''}
                        help={errors.tenPhong?.message}
                    >
                        <Controller
                            name="tenPhong"
                            control={control}
                            rules={{ required: "Tên phòng là bắt buộc" }}
                            render={({ field }) => <Input className="input-text" placeholder="Nhập tên phòng ..." {...field} />}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-bold text-xl">Số chỗ <span className="text-red-600">*</span></span>}
                        validateStatus={errors.soCho ? 'error' : ''}
                        help={errors.soCho?.message}
                    >
                        <Controller
                            name="soCho"
                            control={control}
                            rules={{ required: "Số chỗ là bắt buộc" }}
                            render={({ field }) => <InputNumber className="input-number" placeholder="Nhập số chỗ ..." {...field} />}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-bold text-xl">Loại phòng</span>}
                        validateStatus={errors.loai ? 'error' : ''}
                        help={errors.loai?.message}
                    >
                        <Controller
                            name="loai"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} placeholder="Chọn loại" className="w-full">
                                    <Select.Option value="Phòng thường">Phòng thường</Select.Option>
                                    <Select.Option value="Phòng máy">Phòng máy</Select.Option>
                                    <Select.Option value="Phòng GDTC">Phòng GDTC</Select.Option>
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
                    <Title level={4} className="mt-1">DANH SÁCH PHÒNG THI</Title>

                    <div className="flex gap-2 items-center mb-4">
                        <Input
                            placeholder="Tìm kiếm theo tên phòng..."
                            prefix={<SearchOutlined />}
                            onChange={(e) => setSearchName(e.target.value)}
                            style={{ width: 300 }}
                        />

                        <Select
                            placeholder="Chọn tên phòng"
                            onChange={(value) => setRoomTypeFilter(value)}
                            style={{ width: 200 }}
                        >
                            <Select.Option value="">Tất cả</Select.Option>
                            <Select.Option value="E">Phòng E</Select.Option>
                            <Select.Option value="F">Phòng F</Select.Option>
                            <Select.Option value="Khác">Khác</Select.Option>
                        </Select>

                        <Select
                            placeholder="Chọn loại phòng"
                            onChange={(value) => setRoomTypeFilter2(value)}
                            style={{ width: 200 }}
                        >
                            <Select.Option value="">Tất cả</Select.Option>
                            <Select.Option value="Phòng thường">Phòng thường</Select.Option>
                            <Select.Option value="Phòng máy">Phòng máy</Select.Option>
                            <Select.Option value="Phòng GDTC">Phòng GDTC</Select.Option>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <Loader />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredList}
                        pagination={{ current, pageSize, total: filteredList.length, onChange: page => setCurrent(page) }}
                        rowKey="_id"
                    />
                )}
            </div>
        </div>
    );
};

export default PhongThiForm;