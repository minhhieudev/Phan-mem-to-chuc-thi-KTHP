"use client";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Space, Typography, Table, Popconfirm, Spin, InputNumber, Select, Checkbox, Row, Col, Pagination } from "antd";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";
import { SearchOutlined } from '@ant-design/icons';
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Title } = Typography;
const { Option } = Select;

const formSchema = {
    maHocPhan: "",
    tenHocPhan: "",
    soTinChi: "",
    hinhThuc: "TL",
    thoiGian: "90",
    // giangVien: "",
    // thiT7CN: false,

    // namHoc: '',
    // loai: '',
    // ky: ''
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
    const [isUploading, setIsUploading] = useState(false); // Trạng thái upload
    const fileInputRef = useRef(null);


    const [namHoc, setNamHoc] = useState("2023-2024");
    const [hocKy, setHocKy] = useState("1");
    const [loai, setLoai] = useState("Chính quy");

    const [namHocF, setNamHocF] = useState("2023-2024");
    const [hocKyF, setHocKyFF] = useState("1");
    const [loaiF, setLoaiF] = useState("Chính quy");


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
            console.log('E:',err)
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
        setValue("hinhThuc", record.hinhThuc);
        setValue("thoiGian", record.thoiGian);
        setValue("giangVien", record.giangVien);
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

    const handleFilterByMaMon = (maMon) => {
        if (maMon) {
            setFilteredData(
                dataList.filter((hocPhan) =>
                    hocPhan.maHocPhan.toLowerCase().startsWith(maMon.toLowerCase())
                )
            );
        } else {
            setFilteredData(dataList);
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

    const createManyHocPhan = async (ListDataUser) => {
        setIsUploading(true);
        try {
            const method = "POST";
            const res = await fetch("/api/admin/hoc-phan-thi/create", {
                method,
                body: JSON.stringify({ hocPhans: ListDataUser }),
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
            setIsUploading(false);
        }
    };


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const ListData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            ListData.shift(); // Loại bỏ dòng tiêu đề nếu cần

            if (ListData.length > 0) {
                createManyHocPhan(ListData);
            } else {
                toast.error("No hocphan data found in file.");
            }
        };

        reader.onerror = () => {
            toast.error("Đã xảy ra lỗi khi đọc file Excel");
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="flex gap-2 max-sm:flex-col mt-2 h-full">


            {/* Form Section */}
            {formVisible && (
                <div className="px-3 py-2 shadow-xl bg-white rounded-xl flex-[25%]">
                    <Title className="text-center" level={3}>QUẢN LÝ HỌC PHẦN THI</Title>

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

                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                label={<span className="font-bold text-xl">Hình thức thi</span>}
                                validateStatus={errors.hinhThuc ? 'error' : ''}
                                help={errors.hinhThuc?.message}
                            >
                                <Controller
                                    name="hinhThuc"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="small"
                                            placeholder="Chọn hình thức thi..."
                                            allowClear
                                            className="w-[50%]"
                                            {...field}
                                            onChange={(value) => {
                                                field.onChange(value);
                                            }}
                                            defaultValue="TL"
                                        >
                                            <Option value="TH">TH</Option>
                                            <Option value="TL+TN">TL+TN</Option>
                                            <Option value="TN">TN</Option>
                                            <Option value="VĐ">VĐ</Option>
                                            <Option value="BCTL">BCTL</Option>
                                            <Option value="BCTN">BCTN</Option>
                                            <Option value="TL">TL</Option>
                                        </Select>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span className="font-bold text-xl">Thời gian thi</span>}
                                validateStatus={errors.thoiGian ? 'error' : ''}
                                help={errors.thoiGian?.message}
                            >
                                <Controller
                                    name="thoiGian"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            size="small"
                                            placeholder="Chọn thời gian thi..."
                                            allowClear
                                            className="w-[50%]"
                                            {...field}
                                            onChange={(value) => {
                                                field.onChange(value); // Cập nhật giá trị trong form
                                            }}
                                            defaultValue="90"
                                        >
                                            <Option value="45">45</Option>
                                            <Option value="60">60</Option>
                                            <Option value="90">90</Option>
                                            <Option value="120">120</Option>
                                            <Option value="180">180</Option>
                                        </Select>
                                    }
                                />
                            </Form.Item>

                        </div>

                        {/* <Form.Item
                            label={<span className="font-bold text-xl">Giảng viên</span>}
                        >
                            <Controller
                                name="giangVien"
                                control={control}
                                render={({ field }) => <Input className="input-text" placeholder="Nhập giảng viên ..." {...field} />}
                            />
                        </Form.Item> */}



                        <Form.Item className=" ">
                            <div className="flex justify-between">
                                <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-blue-500">
                                    {editRecord ? "Lưu thay đổi" : "Thêm mới"}
                                </Button>
                                <div className="text-center">
                                    <Spin spinning={isUploading}>
                                        <label htmlFor="excelUpload">
                                            <Button
                                                className=" button-lien-thong-vlvh"
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
                                <Button htmlType="button" onClick={onReset} className="ml-4 " type="primary" danger>
                                    Reset
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white px-2 py-1 shadow-xl rounded-xl overflow-auto flex-[75%]">

                <div className="font-bold text-[20px] text-green-500 text-center">
                    DANH SÁCH HỌC PHẦN
                </div>

                <div className="flex justify-between gap-5 items-center mb-2 text-small-bold">
                    {/* <div className="flex gap-2">
                        <div className="text-small-bold">LOẠI:</div>
                        <Select value={loai} size="small" placeholder="Chọn loại hình đào tạo..." onChange={(value) => setLoai(value)}>
                            <Option value="Chính quy">Chính quy</Option>
                            <Option value="Liên thông vừa làm vừa học">Liên thông vừa làm vừa học</Option>
                        </Select>
                    </div>
                    <div className="w-[25%] flex items-center gap-2">
                        <label className="block text-sm font-semibold mb-1">Năm học:</label>
                        <Select size="small"
                            placeholder="Chọn năm học"
                            onChange={(value) => setNamHoc(value)}
                            className="w-[50%]"
                            value={namHoc}
                        >
                            <Option value="2021-2022">2021-2022</Option>
                            <Option value="2022-2023">2022-2023</Option>
                            <Option value="2023-2024">2023-2024</Option>
                            <Option value="2024-2025">2024-2025</Option>
                        </Select>
                    </div>

                    <div className="w-[25%] flex items-center gap-2">
                        <label className="block text-sm font-semibold mb-1">Học kỳ:</label>
                        <Select size="small" allowClear
                            placeholder="Chọn học kỳ"
                            onChange={(value) => setHocKy(value)}
                            className="w-[50%]"
                            value={hocKy}
                        >
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="he">Hè</Option>
                        </Select>
                    </div> */}

                    <div className="w-[25%] flex items-center gap-2">
                        <label className="block text-sm font-semibold mb-1">Lọc theo mã môn:</label>
                        <Select size="small" allowClear
                            placeholder="Chọn mã môn"
                            onChange={(value) => handleFilterByMaMon(value)}
                            className="w-[50%]"
                        //value={}
                        >
                            <Option value="KC">KC</Option>
                            <Option value="KT">KT</Option>
                            <Option value="LC">LC</Option>
                            <Option value="MN">MN</Option>
                            <Option value="NG">NG</Option>
                            <Option value="NN">NN</Option>
                            <Option value="NT">NT</Option>
                            <Option value="SP">SP</Option>
                            <Option value="TC">TC</Option>
                            <Option value="TN">TN</Option>
                            <Option value="XH">XH</Option>
                        </Select>
                    </div>

                    <Input
                        placeholder="Tìm kiếm học phần"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        prefix={<SearchOutlined />}
                        className="w-[15%]"
                    />

                    <Button type="primary" onClick={() => setFormVisible(!formVisible)}>
                        {formVisible ? "Ẩn Form" : "Hiện Form"}
                    </Button>
                </div>
                {loading ? <Loader /> : (

                    <div className="flex-grow overflow-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
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
