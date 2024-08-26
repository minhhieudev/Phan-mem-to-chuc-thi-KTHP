"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Select, InputNumber, Row, Col } from "antd";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";

const { Option } = Select;

const formSchema = {
  hocPhan: "",
  nhomLop: "",
  ngayThi: '',
  ca: 0,
  gvGiangDay: '',
  cb1: '',
  cb2: "",
  time: '',
  diaDiem: 0,
  ghiChu: "",
  namHoc: "",
  loaiKyThi: ""
};

const PcCoiThiForm = () => {
  const [editRecord, setEditRecord] = useState(null);
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: formSchema,
  });

  const { data: session } = useSession();
  const currentUser = session?.user;
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchRecord = async () => {
        try {
          const res = await fetch(`/api/giaovu/pc-coi-thi/edit?id=${id}`);
          if (res.ok) {
            const data = await res.json();
            setEditRecord(data);
            reset(data);
          } else {
            toast.error("Không thể tải dữ liệu!");
          }
        } catch (error) {
          toast.error("Có lỗi xảy ra khi tải dữ liệu!");
        }
      };

      fetchRecord();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const url = `/api/giaovu/pc-coi-thi`;

      const res = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({ ...data, id: id }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Cập nhật thành công!");
        router.push("/giaovu/pc-coi-thi");
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const resetForm = () => {
    reset(formSchema);
    setEditRecord(null);
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg mt-3 w-[70%] mx-auto">
      <div className="flex items-center justify-center mb-3">
        <Button
          className="button-kiem-nhiem text-white font-bold shadow-md mb-2"
          onClick={() => router.push(`/giaovu/pc-coi-thi`)}
        >
          <ArrowLeftOutlined style={{ color: 'white', fontSize: '18px' }} /> QUAY LẠI
        </Button>
        <h2 className="font-bold text-heading3-bold flex-grow text-center text-green-500">CHỈNH SỬA PHÂN CÔNG COI THI</h2>
      </div>

      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="space-y-2 font-bold">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Mã học phần" validateStatus={errors.hocPhan ? 'error' : ''} help={errors.hocPhan?.message}>
              <Controller
                name="hocPhan"
                control={control}
                rules={{ required: "Vui lòng nhập mã học phần" }}
                render={({ field }) => <Input placeholder="Nhập mã học phần..." {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nhóm lớp" validateStatus={errors.nhomLop ? 'error' : ''} help={errors.nhomLop?.message}>
              <Controller
                name="nhomLop"
                control={control}
                rules={{ required: "Vui lòng nhập nhóm lớp" }}
                render={({ field }) => <Input placeholder="Nhập nhóm lớp..." {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Ngày thi" validateStatus={errors.ngayThi ? 'error' : ''} help={errors.ngayThi?.message}>
              <Controller
                name="ngayThi"
                control={control}
                rules={{ required: "Vui lòng chọn ngày thi" }}
                render={({ field }) => <Input placeholder="Chọn ngày thi..." {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ca thi" validateStatus={errors.ca ? 'error' : ''} help={errors.ca?.message}>
              <Controller
                name="ca"
                control={control}
                rules={{ required: "Vui lòng nhập ca thi" }}
                render={({ field }) => <InputNumber min={1} placeholder="Nhập ca thi..." style={{ width: '100%' }} {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Giảng viên giảng dạy" validateStatus={errors.gvGiangDay ? 'error' : ''} help={errors.gvGiangDay?.message}>
              <Controller
                name="gvGiangDay"
                control={control}
                rules={{ required: "Vui lòng nhập giảng viên" }}
                render={({ field }) => <Input placeholder="Nhập giảng viên..." {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Cán bộ coi thi 1" validateStatus={errors.cb1 ? 'error' : ''} help={errors.cb1?.message}>
              <Controller
                name="cb1"
                control={control}
                rules={{ required: "Vui lòng nhập cán bộ coi thi 1" }}
                render={({ field }) => <Input placeholder="Nhập cán bộ coi thi 1..." {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Cán bộ coi thi 2" validateStatus={errors.cb2 ? 'error' : ''} help={errors.cb2?.message}>
              <Controller
                name="cb2"
                control={control}
                rules={{ required: "Vui lòng nhập cán bộ coi thi 2" }}
                render={({ field }) => <Input placeholder="Nhập cán bộ coi thi 2..." {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Thời gian thi" validateStatus={errors.time ? 'error' : ''} help={errors.time?.message}>
              <Controller
                name="time"
                control={control}
                rules={{ required: "Vui lòng nhập thời gian thi" }}
                render={({ field }) => <Input placeholder="Nhập thời gian thi..." {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Địa điểm thi" validateStatus={errors.diaDiem ? 'error' : ''} help={errors.diaDiem?.message}>
              <Controller
                name="diaDiem"
                control={control}
                rules={{ required: "Vui lòng nhập địa điểm thi" }}
                render={({ field }) => <InputNumber min={1} placeholder="Nhập địa điểm thi..." style={{ width: '100%' }} {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ghi chú" validateStatus={errors.ghiChu ? 'error' : ''} help={errors.ghiChu?.message}>
              <Controller
                name="ghiChu"
                control={control}
                render={({ field }) => <Input.TextArea placeholder="Nhập ghi chú..." {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Năm học" validateStatus={errors.namHoc ? 'error' : ''} help={errors.namHoc?.message}>
              <Controller
                name="namHoc"
                control={control}
                rules={{ required: "Vui lòng chọn năm học" }}
                render={({ field }) => (
                  <Select placeholder="Chọn năm học" {...field}>
                    <Option value="2021-2022">2021-2022</Option>
                    <Option value="2022-2023">2022-2023</Option>
                    <Option value="2023-2024">2023-2024</Option>
                    <Option value="2024-2025">2024-2025</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Loại kỳ thi" validateStatus={errors.loaiKyThi ? 'error' : ''} help={errors.loaiKyThi?.message}>
              <Controller
                name="loaiKyThi"
                control={control}
                rules={{ required: "Vui lòng chọn loại kỳ thi" }}
                render={({ field }) => (
                  <Select placeholder="Chọn loại kỳ thi" {...field}>
                    <Option value="Chính thức">Chính thức</Option>
                    <Option value="Phụ">Phụ</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="text-center">
          <Button
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold shadow-md"
          >
            CẬP NHẬT
          </Button>
          <Button
            className="ml-2 text-white font-bold shadow-md bg-gray-500 hover:bg-gray-400"
            onClick={resetForm}
          >
            XÓA TRẮNG
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PcCoiThiForm;
