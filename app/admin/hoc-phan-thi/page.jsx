"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Space, Typography, Table, Popconfirm, InputNumber, Select, Checkbox, Row, Col, Pagination } from "antd";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";
import { SearchOutlined } from '@ant-design/icons';
import { FileExcelOutlined } from '@ant-design/icons';

const { Title } = Typography;

const formSchema = {
    maHocPhan: "",
    tenHocPhan: "",
    soTinChi: "",
    lop: "",
    hinhThuc: "",
    thoiGian: "",
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
    const [pageSize, setPageSize] = useState(10);

    const [searchName, setSearchName] = useState("");
    const [loading, setLoading] = useState(true);
    const [formVisible, setFormVisible] = useState(false); // Trạng thái ẩn hiện form
    const [filteredData, setFilteredData] = useState([]);


    const paginatedData = filteredData.slice(
        (current - 1) * pageSize,
        current * pageSize
    );

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
        setFilteredData(filteredData);
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
                setFilteredData(data);

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
        setFormVisible(true)
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
            title: 'TT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, __, index) => index + 1,
            width: 48

        },
        {
            title: 'Mã học phần',
            dataIndex: 'maHocPhan',
            key: 'maHocPhan',
            width: 100,
            render: (text) => <span style={{ fontWeight: 'bold', color: 'green' }}>{text}</span>,

        },
        {
            title: 'Tên học phần',
            dataIndex: 'tenHocPhan',
            key: 'tenHocPhan',
            render: (text) => <span style={{ fontWeight: 'bold', color: 'orange' }}>{text}</span>,
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'soTinChi',
            key: 'soTinChi',
            width: 70
        },
        {
            title: 'Số SVĐK',
            dataIndex: 'soSVDK',
            key: 'soSVDK',
            width: 70

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
            width: 70,
            render: (text) => <span style={{ fontWeight: 'bold', color: 'red' }}>{text}</span>,

        },
        {
            title: 'Thời gian',
            dataIndex: 'thoiGian',
            key: 'thoiGian',
            width: 70
        },
        {
            title: 'Thi T7,CN',
            dataIndex: 'thiT7CN',
            key: 'thiT7CN',
            render: (text) => text ? "Có" : "Không",
            width: 70

        },
        {
            title: 'Giảng viên',
            dataIndex: 'giangVien',
            key: 'giangVien',
            render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span>,
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
        <div className="flex gap-2 max-sm:flex-col mt-2 h-full">


            {/* Form Section */}
            {formVisible && (
                <div className="px-3 py-2 shadow-xl bg-white rounded-xl flex-[25%]">
                    <Title className="text-center" level={3}>QUẢN LÝ HỌC PHẦN THI</Title>
                    {/* Form toggle button */}


                    <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="space-y-5 mt-6">
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
                                    render={({ field }) => <InputNumber className="input-text" placeholder="Nhập số tín chỉ ..." {...field} />}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-bold text-xl">Số SV ĐK</span>}
                            >
                                <Controller
                                    name="soSVDK"
                                    control={control}
                                    render={({ field }) => <InputNumber className="input-text w-full" placeholder="Nhập số sinh viên đăng ký ..." {...field} />}
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                label={<span className="font-bold text-xl">Lớp</span>}
                            >
                                <Controller
                                    name="lop"
                                    control={control}
                                    render={({ field }) => <Input className="input-text" placeholder="Nhập lớp (cách nhau bằng dấu phẩy) ..." {...field} />}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-bold text-xl">Hình thức</span>}
                            >
                                <Controller
                                    name="hinhThuc"
                                    control={control}
                                    render={({ field }) => <Input className="input-text" placeholder="Nhập hình thức thi ..." {...field} />}
                                />
                            </Form.Item>

                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                label={<span className="font-bold text-xl">Thời gian</span>}
                            >
                                <Controller
                                    name="thoiGian"
                                    control={control}
                                    render={({ field }) => <InputNumber className="input-text" placeholder="Thời gian thi ..." {...field} />}
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="font-bold text-xl">Thi T7, CN?</span>}
                            >
                                <Controller
                                    name="thiT7CN"
                                    control={control}
                                    render={({ field }) => <Checkbox checked={field.value} onChange={e => field.onChange(e.target.checked)}>Có</Checkbox>}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label={<span className="font-bold text-xl">Giảng viên</span>}
                        >
                            <Controller
                                name="giangVien"
                                control={control}
                                render={({ field }) => <Input className="input-text" placeholder="Nhập giảng viên ..." {...field} />}
                            />
                        </Form.Item>



                        <Form.Item className="text-center">
                            <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-blue-500">
                                {editRecord ? "Chỉnh sửa" : "Thêm mới"}
                            </Button>
                            <Button htmlType="button" onClick={onReset} className="ml-4"  type="primary" danger>
                                Reset
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white px-2 py-3 shadow-xl rounded-xl overflow-auto flex-[75%]">
                <div className="mb-1 flex justify-between">
                    <Input
                        placeholder="Tìm kiếm học phần"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        prefix={<SearchOutlined />}
                        className="w-[10%]"
                    />
                    <div className="font-bold text-[20px] text-green-500">
                        DANH SÁCH HỌC PHẦN
                    </div>
                    <Button type="primary" onClick={() => setFormVisible(!formVisible)}>
                        {formVisible ? "Ẩn Form" : "Hiện Form"}
                    </Button>
                </div>
                {loading ? <Loader /> : (

                    <div className="flex-grow overflow-auto" style={{ maxHeight: 'calc(90vh - 110px)' }}>
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
                        pageSizeOptions={['10', '25', '50', '100', '200']}
                        showSizeChanger
                        className="flex justify-end"
                    />
                </div>
            </div>
        </div>
    );
};

export default HocPhanThiForm;
