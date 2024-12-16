'use client';
import React, { useState, useEffect, useMemo } from "react";
import { Table, Select, Progress, Input, Pagination, Spin, Radio } from "antd";
import {
    CheckCircleOutlined,
    CalendarOutlined,
    FileOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";

const { Option } = Select;
const { Search } = Input;

const Dashboard = () => {

    const columns = [
        {
            title: "Họ tên giảng viên",
            dataIndex: "username",
            key: "username",
            render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span>
        },
        {
            title: "Số buổi coi thi",
            dataIndex: "soBuoiCoiThi",
            key: "soBuoiCoiThi",
            render: (text) => <span style={{ fontWeight: 'bold', color: 'green' }}>{text}</span>,
            width: 110
        },
        {
            title: "Số bài chấm",
            dataIndex: "soBuoiChamThi",
            key: "soBuoiChamThi",
            render: (text) => <span style={{ fontWeight: 'bold', color: 'red' }}>{text}</span>,
            width: 110
        }
    ];
    const columns2 = [
        {
            title: "Học phần",
            dataIndex: "hocPhan",
            key: "hocPhan",
            render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{Array.isArray(text) ? text.join(' - ') : text}</span>
        },
        {
            title: "Ngày thi",
            dataIndex: "ngayThi",
            key: "ngayThi",
            render: (text) => <span style={{ fontWeight: 'bold', color: 'green' }}>{text}</span>
        },
        {
            title: "Cán bộ 1",
            dataIndex: "cbo1",
            key: "cbo1",
            render: (text) => <span style={{ fontWeight: 'bold', color: 'red' }}>{Array.isArray(text) ? text.join(' - ') : text}</span>
        },
        {
            title: "Cán bộ 2",
            dataIndex: "cbo2",
            key: "cbo2",
            render: (text) => <span style={{ fontWeight: 'bold', color: 'red' }}>{Array.isArray(text) ? text.join(' - ') : text}</span>
        }
    ];

    const [selectedKhoa, setSelectedKhoa] = useState('Kỹ thuật - Công nghệ');
    const [khoaList, setKhoaList] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [current2, setCurrent2] = useState(1);
    const [pageSize2, setPageSize2] = useState(10);
    const [namHoc, setNamHoc] = useState('2024-2025');
    const [hocKy, setHocKy] = useState(null);

    const [listCount, setListCount] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTerm2, setSearchTerm2] = useState('');

    const [thongKeCoiThi, setThongKeCoiThi] = useState({});
    const [thongKeChamThi, setThongKeChamThi] = useState({});
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [listLichMoi, setListLichMoi] = useState([]);
    const [timeType, setTimeType] = useState('month');

    const [selectedKhoaCode, setSelectedKhoaCode] = useState(''); // Lưu mã khoa (2 ký tự)

    const handleSelectKhoaCode = (code) => {
        setSelectedKhoaCode(code);
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
    const fetchLichSapDienRa = async () => {
        try {
            setLoading2(true);

            const res = await fetch(`/api/admin/pc-coi-thi/get-sap-dien-ra?time=${timeType}&namHoc=${namHoc}&hocKy=${hocKy}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                const sortedData = data.sort((a, b) => {
                    const dateA = new Date(a.ngayThi.split('/').reverse().join('-'));
                    const dateB = new Date(b.ngayThi.split('/').reverse().join('-'));
                    return dateA - dateB;
                });
                setListLichMoi(sortedData.reverse());
                setLoading2(false);

            } else {
                toast.error("Failed to fetch lich sap dien ra");
            }
        } catch (err) {
            toast.error("An error occurred while ffetch lich sap dien ra");
        }
    };

    const fetchDataThongKe = async () => {
        try {
            const res = await fetch(`/api/admin/dashboard/get-chamthi?namHoc=${namHoc}&hocKy=${hocKy}&khoa=${selectedKhoa}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setThongKeChamThi(data)
            } else {
                toast.error("Failed to fetch thống kê chấm thi");
            }

            const res1 = await fetch(`/api/admin/dashboard/get-hocphan?namHoc=${namHoc}&hocKy=${hocKy}&khoa=${selectedKhoa}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (res1.ok) {
                const data = await res1.json();
                setThongKeCoiThi(data)
                // Xử lý dữ liệu nếu cần
            } else {
                toast.error("Failed to fetch thống kê coi thi !");
            }

            const res3 = await fetch(`/api/admin/dashboard/get-chamthi?namHoc=${namHoc}&hocKy=${hocKy}&khoa=${selectedKhoa}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (res3.ok) {
                const data = await res3.json();
                setThongKeChamThi(data)
                // Xử lý dữ liệu nếu cần
            } else {
                toast.error("Failed to fetch thống kê coi thi !");
            }

        } catch (err) {
            toast.error("An error occurred while fetching dữ liệu thống kê");
        }
    };
    const fetchDataThongKe2 = async () => {
        try {
            setLoading(true);
            const res2 = await fetch(`/api/admin/dashboard/get-count?namHoc=${namHoc}&hocKy=${hocKy}&khoa=${selectedKhoa}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (res2.ok) {
                const data = await res2.json();
                // Thêm thuộc tính key nếu chưa có
                const dataWithKey = data.map((item, index) => ({ ...item, key: item.id || index }));
                setListCount(dataWithKey);
                setLoading(false);

            } else {
                toast.error("Failed to fetch thống kê số buổi");
            }

        } catch (err) {
            toast.error("An error occurred while fetching dữ liệu thống kê");
        }
    };

    useEffect(() => {
        fetchKhoaData();
    }, []);

    useEffect(() => {
        fetchDataThongKe();

    }, [namHoc, hocKy]);
    useEffect(() => {
        fetchLichSapDienRa();

    }, [timeType]);

    useEffect(() => {
        if (!selectedKhoa) return
        fetchDataThongKe2();
    }, [namHoc, hocKy, selectedKhoa]);

    const handleSelectKhoa = (khoa) => {
        setSelectedKhoa(khoa);
    };

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
        setCurrent(1);
    };
    const handleSearch2 = (value) => {
        setSearchTerm2(value.toLowerCase());
        //setCurrent(1);
    };

    // Tạo danh sách đã lọc dựa trên searchTerm
    const filteredList = useMemo(() => {
        if (!searchTerm) return listCount;
        return listCount.filter(item =>
            item.username.toLowerCase().includes(searchTerm)
        );
    }, [listCount, searchTerm]);

    const filteredList2 = useMemo(() => {
        return listLichMoi.filter(item => {
            // Kiểm tra xem có mã môn học nào bắt đầu bằng selectedKhoaCode không (không phân biệt chữ hoa/thường)
            const matchesKhoaCode = !selectedKhoaCode ||
                (item.maHocPhan && item.maHocPhan.some(code => code.toLowerCase().startsWith(selectedKhoaCode.toLowerCase())));
    
            // Kiểm tra điều kiện tìm kiếm với searchTerm2, không phân biệt chữ hoa/thường
            const lowerSearchTerm = searchTerm2?.toLowerCase() || '';
            const matchesSearchTerm = !searchTerm2 ||
                (item?.hocPhan && Array.isArray(item.hocPhan) && item.hocPhan.some(hocPhan => hocPhan.toLowerCase().includes(lowerSearchTerm))) ||
                (item?.cbo1 && Array.isArray(item.cbo1) && item.cbo1.some(cbo => cbo.toLowerCase().includes(lowerSearchTerm))) ||
                (item?.cbo2 && Array.isArray(item.cbo2) && item.cbo2.some(cbo => cbo.toLowerCase().includes(lowerSearchTerm)));
    
            // Chỉ trả về những item thỏa mãn cả hai điều kiện
            return matchesKhoaCode && matchesSearchTerm;
        });
    }, [listLichMoi, selectedKhoaCode, searchTerm2]);


    // Phân trang dữ liệu đã lọc
    const paginatedData = useMemo(() => {
        return filteredList.slice(
            (current - 1) * pageSize,
            current * pageSize
        );
    }, [filteredList, current, pageSize]);
    // Phân trang dữ liệu đã lọc
    const paginatedData2 = useMemo(() => {
        return filteredList2.slice(
            (current2 - 1) * pageSize2,
            current2 * pageSize2
        );
    }, [filteredList2, current2, pageSize2]);


    return (
        <div className="py-2 px-0 h-[90vh]">
            <div className="grid grid-cols-3 gap-4 mb-3 ">
                <div className="bg-white p-4 rounded-lg shadow-xl flex items-center">
                    <CalendarOutlined style={{ fontSize: "90px" }} className="mr-4 text-blue-500" />
                    <div className="text-base-bold space-y-3">
                        <div className="flex gap-3 ">
                            <p>Năm học: </p>
                            <h2 className="text-xl font-bold mb-0 flex-grow">
                                <Select onChange={(value) => setNamHoc(value)} defaultValue={"2024-2025"} style={{ width: 120 }} allowClear>
                                    {["2021-2022", "2022-2023", "2023-2024", "2024-2025"].map((nam, index) => (
                                        <Option key={index} value={nam}>
                                            {nam}
                                        </Option>
                                    ))}
                                </Select>
                            </h2>
                        </div>
                        <div className="flex gap-3">
                            <p>Học kỳ: </p>
                            <h2 className="text-xl font-bold mb-0">
                                <Select onChange={(value) => setHocKy(value)} className="font-bold" value={hocKy} style={{ width: 120 }} allowClear>
                                    {["1", "2"].map((nam, index) => (
                                        <Option key={index} value={nam}>
                                            {nam}
                                        </Option>
                                    ))}
                                </Select>
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-xl flex items-center justify-between">
                    <div className="flex items-center">
                        <CheckCircleOutlined style={{ fontSize: "90px" }} className="mr-4 text-green-500" />
                        <div>
                            <h2 className="text-xl font-bold mb-2">{thongKeCoiThi.completedCount} học phần</h2>
                            <p>Đã hoàn thành</p>
                        </div>
                    </div>
                    <Progress
                        type="dashboard"
                        steps={8}
                        percent={thongKeCoiThi.completionPercentage}
                        trailColor="rgba(0, 0, 0, 0.06)"
                        strokeWidth={20}
                    />
                </div>

                <div className="bg-white p-4 rounded-lg shadow-xl flex items-center justify-between">
                    <div className="flex items-center">
                        <FileOutlined style={{ fontSize: "90px" }} className="mr-4 text-purple-500" /> {/* Đổi icon */}
                        <div>
                            <h2 className="text-xl font-bold mb-2">CÓ {thongKeChamThi.totalSoBai} </h2>
                            <p>BÀI THI</p>
                        </div>
                    </div>
                    {/* <Progress
                        type="dashboard"
                        steps={10}
                        percent={thongKeChamThi.completionPercentage}
                        trailColor="rgba(0, 0, 0, 0.06)"
                        strokeWidth={20}
                    /> */}
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2 h-[67vh]">
                <div className="col-span-3 bg-white px-2 py-3 rounded-lg shadow-md">
                    <div className="flex justify-between font-bold">
                        <h2 className="text-xl font-bold mb-2">Sắp diễn ra</h2>
                        <div className="w-[25%] flex items-center gap-1">
                            <label className="block text-sm font-semibold mb-1">Khoa:</label>
                            <Select
                                allowClear
                                size="small"
                                placeholder="Chọn mã môn"
                                onChange={(value) => handleSelectKhoaCode(value)} // Đảm bảo gọi hàm này khi chọn
                                className="w-[90%]"
                            >
                                <Option value="KC">Kỹ thuật - Công nghệ</Option>
                                <Option value="KT">Kinh tế</Option>
                                <Option value="LC">Lý luận chính trị</Option>
                                <Option value="MN">Mầm non</Option>
                                <Option value="NG">Ngoại ngữ</Option>
                                <Option value="NN">Nông nghiệp</Option>
                                <Option value="NT">Nghệ thuật</Option>
                                <Option value="SP">Sư phạm</Option>
                                <Option value="TC">Giáo dục thể chất</Option>
                                <Option value="TN">Tự nhiên</Option>
                                <Option value="XH">Xã hội nhân văn</Option>
                            </Select>

                        </div>
                        <Radio.Group onChange={(e) => setTimeType(e.target.value)} defaultValue="month">
                            <Radio value="month">Tháng</Radio>
                            <Radio value="week">Tuần</Radio>
                        </Radio.Group>
                        <Search
                            placeholder="Tìm kiếm học phần, giảng viên..."
                            //enterButton

                            allowClear
                            enterButton="Search"
                            size="small"
                            style={{ width: 200 }}
                            //onSearch={handleSearch}
                            onChange={(e) => handleSearch2(e.target.value)}
                        />

                    </div>
                    {listLichMoi == [] ? (
                        <h2 className="font-bold text-center text-red-500">Chưa có lịch thi</h2>
                    ) : (
                        <div>
                            {loading2 ? (
                                <div className="mx-auto text-center w-full">
                                    <Spin />
                                </div>
                            ) : (
                                <div style={{ height: '380px' }}>
                                    <Table
                                        columns={columns2}
                                        dataSource={paginatedData2}
                                        pagination={false}
                                        rowKey="key"
                                        scroll={{ y: 370 }}
                                    />
                                    <Pagination
                                        current={current2}
                                        pageSize={pageSize2}
                                        total={listLichMoi.length}
                                        onChange={(page, size) => {
                                            setCurrent2(page);
                                            setPageSize2(size);
                                        }}
                                        pageSizeOptions={['10', '25', '50', '100', '200']}
                                        showSizeChanger
                                        className="flex justify-end"
                                    />
                                </div>
                            )}
                        </div>

                    )}
                </div>

                <div className="col-span-2 bg-white p-4 rounded-lg shadow-md ">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-bold">Danh sách</h2>
                        <div className="flex space-x-4 w-[70%]">
                            <Select size="small"
                                placeholder="Chọn khoa"
                                style={{ width: 200 }}
                                value={selectedKhoa}
                                onChange={handleSelectKhoa}
                                allowClear
                            >
                                {khoaList.map((khoa, index) => (
                                    <Option key={index} value={khoa.tenKhoa}>
                                        {khoa.tenKhoa}
                                    </Option>
                                ))}
                            </Select>
                            <Search
                                placeholder="Tìm kiếm"
                                allowClear
                                enterButton="Search"
                                size="small"
                                style={{ width: 250 }}
                                //onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        {loading ? (
                            <div className="mx-auto text-center w-full">
                                <Spin />
                            </div>
                        ) : (
                            <div style={{ height: '375px' }}>
                                <Table scroll={{ y: 340 }} columns={columns} dataSource={paginatedData} pagination={false} rowKey="key" />
                            </div>
                        )}

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
            </div>
        </div>
    );
};

export default Dashboard;
