"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Space, Typography, Table, Popconfirm, InputNumber, Select, Checkbox, Row, Col } from "antd";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const formSchema = {
    maHocPhan: "",
    tenHocPhan: "",
    soTinChi: "",
    lop: "",
    hinhThuc: "", // (TL, TN, TH)
    thoiGian: "", // (120, 90, 60)
    giangVien: "",
    soSVDK: 0,
    thiT7CN: false,
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

    const onSubmit = async (data) => {
        try {
            const updatedData = {
                ...data,
                lop: data.lop.split(',').map(item => item.trim()),
                id: editRecord ? editRecord._id : undefined
            };
            const method = editRecord ? "PUT" : "POST";
            const res = await fetch("/api/admin/hoc-phan-thi", {
                method,
                body: JSON.stringify(updatedData),
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
        setValue("lop", record.lop.join(', '));
        setValue("hinhThuc", record.hinhThuc);
        setValue("thoiGian", record.thoiGian);
        setValue("giangVien", record.giangVien);
        setValue("soSVDK", record.soSVDK);
        setValue("thiT7CN", record.thiT7CN);
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
            title: 'Số SVĐK',
            dataIndex: 'soSVDK',
            key: 'soSVDK',
        },
        {
            title: 'Lớp',
            dataIndex: 'lop',
            key: 'lop',
            render: (text) => text.join(', '),
        },
        {
            title: 'Hình thức',
            dataIndex: 'hinhThuc',
            key: 'hinhThuc',
        },
        {
            title: 'Thời gian',
            dataIndex: 'thoiGian',
            key: 'thoiGian',
        },
        {
            title: 'Thi T7,CN',
            dataIndex: 'thiT7CN',
            key: 'thiT7CN',
            render: (text) => text ? "Có" : "Không"
        },
        {
            title: 'Giảng viên',
            dataIndex: 'giangVien',
            key: 'giangVien',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
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
            width: 140
        },
    ];

    return (
        <div className="flex gap-5 max-sm:flex-col mt-4 h-[83vh]">
            <div className="p-4 shadow-xl bg-white rounded-xl flex-[25%]">
                <Title className="text-center" level={3}>QUẢN LÝ HỌC PHẦN THI</Title>

                <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="space-y-5 mt-6">
                    {/* Trường Mã học phần và Tên học phần (2 trường ngắn cùng hàng) */}
                    <Row gutter={16}>
                        <Col span={12}>
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
                        </Col>
                        <Col span={12}>
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
                        </Col>
                    </Row>

                    {/* Trường Số tín chỉ (trường ngắn, riêng hàng) */}
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label={<span className="font-bold text-xl">Số tín chỉ <span className="text-red-600">*</span></span>}
                            validateStatus={errors.soTinChi ? 'error' : ''}
                            help={errors.soTinChi?.message}
                        >
                            <Controller
                                name="soTinChi"
                                control={control}
                                rules={{ required: "Số tín chỉ là bắt buộc" }}
                                render={({ field }) => <InputNumber className="input-text w-full" min={0} placeholder="Nhập số tín chỉ ..." {...field} />}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-bold text-xl">Số SVĐK</span>}
                            validateStatus={errors.soSVDK ? 'error' : ''}
                            help={errors.soSVDK?.message}
                        >
                            <Controller
                                name="soSVDK"
                                control={control}
                                rules={{ required: "Số SV ĐK là bắt buộc" }}
                                render={({ field }) => <InputNumber className="input-text w-full" min={0} placeholder="Nhập số sinh viên ..." {...field} />}
                            />
                        </Form.Item>
                    </div>

                    {/* Trường Lớp và Hình thức (2 trường ngắn cùng hàng) */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-bold text-xl">Lớp</span>}
                                validateStatus={errors.lop ? 'error' : ''}
                                help={errors.lop?.message}
                            >
                                <Controller
                                    name="lop"
                                    control={control}
                                    rules={{ required: "Lớp là bắt buộc" }}
                                    render={({ field }) => <Input className="input-text" placeholder="Nhập lớp, cách nhau bởi dấu phẩy ..." {...field} />}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="font-bold text-xl">Hình thức</span>}
                                validateStatus={errors.hinhThuc ? 'error' : ''}
                                help={errors.hinhThuc?.message}
                            >
                                <Controller
                                    name="hinhThuc"
                                    control={control}
                                    rules={{ required: "Hình thức thi là bắt buộc" }}
                                    render={({ field }) => (
                                        <Select {...field} placeholder="Chọn hình thức" className="w-full">
                                            <Select.Option value="TL">TL</Select.Option>
                                            <Select.Option value="TN">TN</Select.Option>
                                            <Select.Option value="TH">TH</Select.Option>
                                            <Select.Option value="BC">BC</Select.Option>
                                            <Select.Option value="GDTC">GDTC</Select.Option>
                                        </Select>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Trường Thời gian (trường dài, riêng hàng) */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={<span className="font-bold text-xl">Thời gian</span>}
                                validateStatus={errors.thoiGian ? 'error' : ''}
                                help={errors.thoiGian?.message}
                            >
                                <Controller
                                    name="thoiGian"
                                    control={control}
                                    rules={{ required: "Thời gian là bắt buộc" }}
                                    render={({ field }) => (
                                        <Select {...field} placeholder="Chọn thời gian" className="w-full">
                                            <Select.Option value="120">120</Select.Option>
                                            <Select.Option value="90">90</Select.Option>
                                            <Select.Option value="60">60</Select.Option>
                                        </Select>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Trường Giảng viên và Số SVĐK (2 trường ngắn cùng hàng) */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={<span className="font-bold text-xl">Giảng viên</span>}
                                validateStatus={errors.giangVien ? 'error' : ''}
                                help={errors.giangVien?.message}
                            >
                                <Controller
                                    name="giangVien"
                                    control={control}
                                    rules={{ required: "Giảng viên là bắt buộc" }}
                                    render={({ field }) => <Input className="input-text" placeholder="Nhập giảng viên ..." {...field} />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Trường Thi thứ 7, Chủ nhật (trường ngắn, riêng hàng) */}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label={<span className="font-bold text-xl">Thi thứ 7, Chủ nhật</span>}
                                validateStatus={errors.thiT7CN ? 'error' : ''}
                                help={errors.thiT7CN?.message}
                            >
                                <Controller
                                    name="thiT7CN"
                                    control={control}
                                    render={({ field }) => <Checkbox {...field} checked={field.value}>Có</Checkbox>}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Buttons */}
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>Lưu</Button>
                            <Button htmlType="button" onClick={onReset}>Reset</Button>
                        </Space>
                    </Form.Item>
                </Form>


            </div>

            <div className="p-4 shadow-xl bg-white rounded-xl flex-[75%]">
                <Title className="text-center" level={3}>DANH SÁCH HỌC PHẦN THI</Title>

                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm theo tên học phần hoặc mã học phần"
                    className="search-box mt-3"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />

                {loading ? (
                    <Loader />
                ) : (
                    <Table
                        className="mt-6"
                        columns={columns}
                        dataSource={filteredList}
                        rowKey={(record) => record._id}
                        pagination={{
                            current,
                            pageSize,
                            total: filteredList.length,
                            onChange: (page) => setCurrent(page),
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default HocPhanThiForm;



// Tiếp tục xử lý random lịch , ckeck học phần là thực hành hay không để chia nhóm và phân vào phòng thực hành 
// Check nhóm giáo dục thể chất , thêm loại phòng giáo dục thể chất
// Làm Phân công chấm thi 



// Xử lý môn để coi thi không trùng người dạy và trong khoa ( hiện tại môn thi có người dạy)
// Xử lý xuất excel

// Làm dashboard 