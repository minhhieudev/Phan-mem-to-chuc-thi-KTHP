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
            width:110
        },
        {
            title: "Số buổi chấm thi",
            dataIndex: "soBuoiChamThi",
            key: "soBuoiChamThi",
            render: (text) => <span style={{ fontWeight: 'bold', color: 'red' }}>{text}</span>,
            width:110
        }
    ];
    const columns2 = [
        {
            title: "Học phần",
            dataIndex: "hocPhan",
            key: "hocPhan",
            render: (text) => <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span>
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
            render: (text) => <span style={{ fontWeight: 'bold', color: 'red' }}>{text}</span>
        },
        {
            title: "Cán bộ 2",
            dataIndex: "cbo2",
            key: "cbo2",
            render: (text) => <span style={{ fontWeight: 'bold', color: 'red' }}>{text}</span>
        }
    ];

    const [selectedKhoa, setSelectedKhoa] = useState(null);
    const [khoaList, setKhoaList] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [current2, setCurrent2] = useState(1);
    const [pageSize2, setPageSize2] = useState(5);
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
                console.log('Res hocphan:', data)
                setThongKeCoiThi(data)
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
    // Tạo danh sách đã lọc dựa trên searchTerm
    const filteredList2 = useMemo(() => {
        if (!searchTerm2) return listLichMoi;
        return listLichMoi.filter(item =>
            item.hocPhan.toLowerCase().includes(searchTerm2) ||
            item.cbo1.toLowerCase().includes(searchTerm2) ||
            item.cbo2.toLowerCase().includes(searchTerm2)
        );
    }, [listLichMoi, searchTerm2]);

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
                            <h2 className="text-xl font-bold mb-2">{thongKeChamThi.completedCount} bài thi</h2>
                            <p>Đã chấm</p>
                        </div>
                    </div>
                    <Progress
                        type="dashboard"
                        steps={10}
                        percent={thongKeChamThi.completionPercentage}
                        trailColor="rgba(0, 0, 0, 0.06)"
                        strokeWidth={20}
                    />
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2 h-[67vh]">
                <div className="col-span-3 bg-white px-2 py-3 rounded-lg shadow-md">
                    <div className="flex justify-between font-bold">
                        <h2 className="text-xl font-bold mb-2">Lịch thi sắp diễn ra</h2>
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
