"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Space, Typography, Radio, InputNumber, Table, Popconfirm, Tabs, Spin, Select } from "antd";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Loader from "../Loader";
import TablePcGiangDay from "./TablePcGiangDay";

const { TabPane } = Tabs;

const { Title } = Typography;

const formSchema = {
  hocPhan: "",
  soTinChi: 0,
  lopHocPhan: "",
  soSV: 0,
  soTietLT: 0,
  soTietTH: 0,
  soTietQCLT: 0,
  soTietQCTH: 0,
  tongCong: 0,
  ghiChu: "",
};

const TeachingForm = ({ onUpdateCongTacGiangDay, namHoc, ky }) => {
  const [dataList, setDataList] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const { control, handleSubmit, setValue, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: formSchema,
  });
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(5);

  const [loading, setLoading] = useState(true);

  const handleTableChange = (pagination) => {
    setCurrent(pagination.current);
  };

  const soTietQCLT = watch("soTietQCLT");
  const soTietQCTH = watch("soTietQCTH");

  const { data: session } = useSession();
  const currentUser = session?.user;

  const { type } = useParams();

  const [selectedTab, setSelectedTab] = useState('Kết quả giảng dạy');
  const [loadings, setLoadings] = useState(true);


  useEffect(() => {
    const tongCong = (soTietQCLT || 0) + (soTietQCTH || 0);
    setValue("tongCong", tongCong);
  }, [soTietQCLT, soTietQCTH, setValue]);

  useEffect(() => {
    if (editRecord) {
      reset(editRecord);
    } else {
      reset(formSchema);
    }
  }, [editRecord, reset]);

  // const fetchDataForm = async () => {
  //   try {
  //     const res = await fetch(`/api/work-hours/CongTacGiangDay/?user=${encodeURIComponent(currentUser._id)}&type=${encodeURIComponent(type)}&namHoc=${encodeURIComponent(namHoc)}&ky=${encodeURIComponent(ky)}`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       setDataList(data);
  //       setLoading(false)
  //       setLoadings(false)
  //     } else {
  //       toast.error("Failed to fetch data");
  //     }
  //   } catch (err) {
  //     toast.error("An error occurred while fetching data");
  //   }
  // };

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/work-hours/CongTacGiangDay/?user=${encodeURIComponent(currentUser._id)}&type=${encodeURIComponent(type)}&namHoc=${encodeURIComponent(namHoc)}&ky=${encodeURIComponent(ky)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setDataList(data);
          setLoading(false)
          setLoadings(false)
        } else {
          toast.error("Failed to fetch data");
        }
      } catch (err) {
        toast.error("An error occurred while fetching data");
      }
    };

    fetchData();
  }, [currentUser, namHoc, ky]);

  const calculateTotals = () => {
    const totals = dataList.reduce((acc, item) => {
      acc.soTietLT += item.soTietLT || 0;
      acc.soTietTH += item.soTietTH || 0;
      acc.soTietQCLT += item.soTietQCLT || 0;
      acc.soTietQCTH += item.soTietQCTH || 0;
      acc.tong += item.tongCong || 0;
      return acc;
    }, { soTietLT: 0, soTietTH: 0, soTietQCLT: 0, soTietQCTH: 0, tong: 0 });

    onUpdateCongTacGiangDay(totals);
  };

  useEffect(() => {
    calculateTotals();
  }, [dataList]);

  const onSubmit = async (data) => {
    if (namHoc == '') {
      toast.error('Vui lòng nhập năm học!')
      return
    }
    try {
      const method = editRecord ? "PUT" : "POST";
      const res = await fetch("/api/work-hours/CongTacGiangDay", {
        method,
        body: JSON.stringify({ ...data, type: type, user: currentUser?._id, id: editRecord?._id, namHoc, ky }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const newData = await res.json();
        if (editRecord && newData) {
          setDataList(prevData => prevData.map(item => (item._id === newData._id ? newData : item)));
        } else {
          setDataList(prevData => [...prevData, newData]);
        }
        toast.success("Thêm mới thành công");
        onReset(); // Reset form after success
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
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/work-hours/CongTacGiangDay", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setDataList(prevData => prevData.filter(item => item._id !== id));
        toast.success("Xóa thành công");
      } else {
        toast.error("Failed to delete record");
      }
    } catch (err) {
      toast.error("An error occurred while deleting data");
    }
  };

  const handleTabChange = (key) => {
    setLoadings(true);
    setSelectedTab(key);
    setTimeout(() => {
      setLoadings(false);
    }, 500);
  };


  const columns = [
    {
      title: 'Học phần',
      dataIndex: 'hocPhan',
      key: 'hocPhan',
      className: 'text-blue-500 font-bold'
    },
    {
      title: 'Học kỳ',
      dataIndex: 'ky',
      key: 'ky'
    },
    {
      title: 'Số TC',
      dataIndex: 'soTinChi',
      key: 'soTinChi'
    },
    {
      title: 'Lớp học phần',
      dataIndex: 'lopHocPhan',
      key: 'lopHocPhan',
      className: 'text-green-500 font-bold'
    },
    {
      title: 'Số SV',
      dataIndex: 'soSV',
      key: 'soSV'
    },
    {
      title: 'Số tiết',
      children: [
        {
          title: 'LT',
          dataIndex: 'soTietLT',
          key: 'soTietLT',
        },
        {
          title: 'TH',
          dataIndex: 'soTietTH',
          key: 'soTietTH',
        },
      ],
    },
    {
      title: 'Số tiết QC',
      children: [
        {
          title: 'LT',
          dataIndex: 'soTietQCLT',
          key: 'soTietQCLT'
        },
        {
          title: 'TH',
          dataIndex: 'soTietQCTH',
          key: 'soTietQCTH'
        },
      ],
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'tongCong',
      key: 'tongCong',
      className: 'text-red-500 font-bold text-center'
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu'
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
    },
  ];

  const totalHours = useMemo(() => {
    return dataList.reduce((total, item) => total + (item.tongCong || 0), 0);
  }, [dataList]);

  return loading ? (
    <Loader />
  ) : (
    <div className="flex gap-3 max-sm:flex-col">
      <div className="p-4 shadow-xl bg-white rounded-xl flex-[30%]">
        <Title className="text-center" level={3}>CÔNG TÁC GIẢNG DẠY</Title>

        <Form onFinish={handleSubmit(onSubmit)} layout="Inline" className="">
          <Space direction="vertical" >
            <Form.Item
              label={
                <span className="font-bold text-xl">
                  Học phần giảng dạy <span className="text-red-600">*</span>
                </span>
              }
              className="w-[40%] p-0"
              validateStatus={errors.hocPhan ? 'error' : ''}
              help={errors.hocPhan?.message}
            >
              <Controller
                name="hocPhan"
                control={control}
                rules={{ required: "Học phần là bắt buộc" }}
                render={({ field }) => (
                  <Select
                    showSearch
                    allowClear
                    placeholder="Nhập hoặc chọn tên học phần..."
                    {...field}
                    options={[
                      { value: 'hocPhan1', label: 'Học phần 1' },
                      { value: 'hocPhan2', label: 'Học phần 2' },
                      // Add more options here
                    ]}
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  />
                )}
              />
            </Form.Item>

            <div className="flex justify-between">
              <Form.Item
                label={<span className="font-bold text-xl">Lớp học phần <span className="text-red-600">*</span></span>}
                validateStatus={errors.lopHocPhan ? 'error' : ''}
                help={errors.lopHocPhan?.message}
              >
                <Controller
                  name="lopHocPhan"
                  control={control}
                  rules={{ required: "Lớp học phần là bắt buộc" }}
                  render={({ field }) => <Input className="input-text w-[90%]" placeholder="Nhập lớp ..." {...field} />}
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold text-xl">Số TC <span className="text-red-600">*</span></span>}
                validateStatus={errors.soTinChi ? 'error' : ''}
                help={errors.soTinChi?.message}
              >
                <Controller
                  name="soTinChi"
                  control={control}
                  rules={{ required: "Số TC là bắt buộc", min: { value: 1, message: "Số TC phải lớn hơn 0" } }}
                  render={({ field }) => <InputNumber className="input-number w-14" {...field} />}
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold text-xl">Số SV <span className="text-red-600">*</span></span>}
                validateStatus={errors.soSV ? 'error' : ''}
                help={errors.soSV?.message}
              >
                <Controller
                  name="soSV"
                  control={control}
                  rules={{ required: "Số SV là bắt buộc", min: { value: 1, message: "Số SV phải lớn hơn 0" } }}
                  render={({ field }) => <InputNumber {...field} className="input-number w-14" />}
                />
              </Form.Item>
            </div>

            <div className="flex justify-between max-sm:flex-col">
              <Form.Item label={<span className="font-bold text-xl">Số tiết</span>} className="w-[40%]">
                <Space direction="vertical" size="middle" className="w-full">
                  <div className="flex justify-between">
                    <Form.Item
                      label={<span className="font-semibold text-base">Lý thuyết <span className="text-red-600">*</span></span>}
                      validateStatus={errors.soTietLT ? 'error' : ''}
                      help={errors.soTietLT?.message}
                    >
                      <Controller
                        name="soTietLT"
                        control={control}
                        rules={{ required: "Số tiết LT là bắt buộc", min: { value: 1, message: "Số tiết phải lớn hơn 0" } }}
                        render={({ field }) => <InputNumber className="input-number w-14" {...field} />}
                      />
                    </Form.Item>

                    <Form.Item
                      className="max-sm:ml-20"
                      label={<span className="font-semibold text-base">Thực hành <span className="text-red-600">*</span></span>}
                      validateStatus={errors.soTietTH ? 'error' : ''}
                      help={errors.soTietTH?.message}
                    >
                      <Controller
                        name="soTietTH"
                        control={control}
                        rules={{ required: "Số tiết TH là bắt buộc", min: { value: 1, message: "Số tiết phải lớn hơn 0" } }}
                        render={({ field }) => <InputNumber className="input-number w-14" {...field} />}
                      />
                    </Form.Item>
                  </div>
                </Space>
              </Form.Item>
              <div className="border-r-4 max-sm:hidden"></div>
              <Form.Item label={<span className="font-bold text-xl">Số tiết quy chuẩn</span>} className="w-[40%]">
                <Space direction="vertical" size="middle" className="w-full">
                  <div className="flex justify-between">
                    <Form.Item
                      label={<span className="font-semibold text-base">Lý thuyết <span className="text-red-600">*</span></span>}
                      validateStatus={errors.soTietQCLT ? 'error' : ''}
                      help={errors.soTietQCLT?.message}
                    >
                      <Controller
                        name="soTietQCLT"
                        control={control}
                        rules={{ required: "Số tiết quy chuẩn LT là bắt buộc", min: { value: 1, message: "Số tiết phải lớn hơn 0" } }}
                        render={({ field }) => <InputNumber className="input-number w-14" {...field} />}
                      />
                    </Form.Item>

                    <Form.Item
                      className="max-sm:ml-20"
                      label={<span className="font-semibold text-base">Thực hành <span className="text-red-600">*</span></span>}
                      validateStatus={errors.soTietQCTH ? 'error' : ''}
                      help={errors.soTietQCTH?.message}
                    >
                      <Controller
                        name="soTietQCTH"
                        control={control}
                        rules={{ required: "Số tiết quy chuẩn TH là bắt buộc", min: { value: 1, message: "Số tiết phải lớn hơn 0" } }}
                        render={({ field }) => <InputNumber className="input-number w-14" {...field} />}
                      />
                    </Form.Item>
                  </div>
                </Space>
              </Form.Item>
            </div>

            <div className="flex justify-between">
              <Form.Item label={<span className="font-bold text-xl">Tổng cộng</span>}>
                <Controller
                  name="tongCong"
                  control={control}
                  render={({ field }) => <InputNumber size="large" className="text-red-700 font-bold" {...field} readOnly />}
                />
              </Form.Item>

              <Form.Item label={<span className="font-bold text-xl">Ghi chú</span>}>
                <Controller
                  name="ghiChu"
                  control={control}
                  render={({ field }) => <Input className="input-text" {...field} />}
                />
              </Form.Item>
            </div>
          </Space>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {isSubmitting ? <Spin size="small" /> : "Lưu"}
              </Button>
              <Button type="default" danger onClick={onReset} disabled={isSubmitting}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <div className="p-2 shadow-xl bg-white rounded-xl flex-[70%] text-center">

        <Tabs activeKey={selectedTab} onChange={handleTabChange}>
          <TabPane tab="KẾT QUẢ GIẢNG DẠY" key="Kết quả giảng dạy">
            {loadings ? <Spin size="large" /> :
              <Table
                columns={columns}
                dataSource={dataList}
                rowKey="_id"
                pagination={{ current, pageSize, total: dataList.length, onChange: handleTableChange }}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={7} className="font-bold text-lg text-right">
                      Tổng số giờ:
                    </Table.Summary.Cell>
                    <Table.Summary.Cell className="font-bold text-lg text-red-600">
                      {totalHours}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            }
          </TabPane>
          <TabPane tab="PHÂN CÔNG GIẢNG DẠY" key="Phân công giảng dạy" className="text-center">
            {loadings ? <Spin size="large" /> : <TablePcGiangDay namHoc={namHoc || ''} ky={ky || ''} />}
          </TabPane>
        </Tabs>

      </div>
    </div>
  );
};

export default TeachingForm;
