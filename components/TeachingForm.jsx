"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Space, Typography, Radio, Spin, InputNumber, Table, Popconfirm } from "antd";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Loader from "./Loader";

const { Title } = Typography;

const formSchema = {
  hocPhan: "",
  ky: "",
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

const TeachingForm = ({ onUpdateCongTacGiangDay,namHoc }) => {
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

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/work-hours/CongTacGiangDay/?user=${encodeURIComponent(currentUser._id)}&type=${encodeURIComponent(type)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setDataList(data);
          setLoading(false)
        } else {
          toast.error("Failed to fetch data");
        }
      } catch (err) {
        toast.error("An error occurred while fetching data");
      }
    };

    fetchData();
  }, [currentUser]);

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
    if (namHoc == ''){
      toast.error('Vui lòng nhập năm học!')
      return
    }
    try {
      const method = editRecord ? "PUT" : "POST";
      const res = await fetch("/api/work-hours/CongTacGiangDay", {
        method,
        body: JSON.stringify({ ...data, type: type, user: currentUser?._id, id: editRecord?._id ,namHoc}),
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
        toast.success("Record deleted successfully!");
      } else {
        toast.error("Failed to delete record");
      }
    } catch (err) {
      toast.error("An error occurred while deleting data");
    }
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
    },
  ];

  const totalHours = useMemo(() => {
    return dataList.reduce((total, item) => total + (item.tongCong || 0), 0);
  }, [dataList]);

  return loading ? (
    <Loader />
  ) : (
    <div className="flex gap-5 max-sm:flex-col">
      <div className="p-5 shadow-xl bg-white rounded-xl flex-[40%]">
        <Title className="text-center" level={3}>CÔNG TÁC GIẢNG DẠY</Title>

        <Form onFinish={handleSubmit(onSubmit)} layout="Inline" className="space-y-1 mt-10">
          <Space direction="vertical" className="w-full">
            <div className="flex justify-between">
              <Form.Item
                label={<span className="font-bold text-xl">Học phần giảng dạy <span className="text-red-600">*</span></span>}
                className="w-[40%]"
                validateStatus={errors.hocPhan ? 'error' : ''}
                help={errors.hocPhan?.message}
              >
                <Controller
                  name="hocPhan"
                  control={control}
                  rules={{ required: "Học phần là bắt buộc" }}
                  render={({ field }) => <Input className="input-text" placeholder="Nhập tên học phần ..." {...field} />}
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold text-xl">Học kỳ <span className="text-red-600">*</span></span>}
                className="w-[40%]"
                validateStatus={errors.ky ? 'error' : ''}
                help={errors.ky?.message}
              >
                <Controller
                  name="ky"
                  control={control}
                  rules={{ required: "Học kỳ là bắt buộc" }}
                  render={({ field }) => (
                    <Radio.Group {...field} className="font-semibold">
                      <Radio value="1">Kỳ 1</Radio>
                      <Radio value="2">Kỳ 2</Radio>
                    </Radio.Group>
                  )}
                />
              </Form.Item>
            </div>

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
                  render={({ field }) => <InputNumber className="input-number" {...field} />}
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
                  render={({ field }) => <InputNumber {...field} className="input-number" />}
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
                        render={({ field }) => <InputNumber className="input-number" {...field} />}
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
                        render={({ field }) => <InputNumber className="input-number" {...field} />}
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
                        render={({ field }) => <InputNumber className="input-number" {...field} />}
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
                        render={({ field }) => <InputNumber className="input-number" {...field} />}
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
      <div className="p-5 shadow-xl bg-white rounded-xl flex-[60%]">
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
      </div>
    </div>
  );
};

export default TeachingForm;
