'use client';

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Select, InputNumber, Row, Col, Spin } from "antd";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import * as XLSX from 'xlsx';

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

const TeachingAssignmentForm = () => {
  const [editRecord, setEditRecord] = useState(null);
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: formSchema,
  });

  const { data: session } = useSession();
  const currentUser = session?.user;
  const router = useRouter();

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = async (data) => {
    try {
      const method = editRecord ? "PUT" : "POST";
      const res = await fetch(`/api/giaovu/pc-giang-day`, {
        method,
        body: JSON.stringify({ ...data, user: currentUser?._id, id: editRecord?._id }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Thành công!");
        resetForm();
        fileInputRef.current.value = "";
      } else {
        toast.error("Thất bại!");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const resetForm = () => {
    reset(formSchema);
    setEditRecord(null);
  };

  const createMany = async (ListData) => {
    setIsUploading(true); // Bắt đầu hiển thị hiệu ứng xoay
    try {
      const method = "POST";
      const res = await fetch("/api/giaovu/pc-giang-day/create", {
        method,
        body: JSON.stringify({ data: ListData }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Thêm mới thành công");
      } else {
        toast.error("Failed to save record");
      }
    } catch (err) {
      toast.error("An error occurred while saving data:", err);
      console.log('Lỗi:', err);
    } finally {
      fileInputRef.current.value = ""; // Luôn luôn reset input file
      setIsUploading(false); // Ẩn hiệu ứng xoay khi hoàn thành
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      console.log('Raw Data:', rawData);

      const structuredData = [];
      let currentEntry = null;
      let loaiHocKy = '';
      let namHoc = '';

      rawData.forEach((row) => {


        if (row.length === 1 && typeof row[0] === 'string') {
          console.log('Input:', row);
        
          const inputString = row[0].trim();
          let loaiHocKy = '';
          let namHoc = '';
        
          // Tìm phần chứa năm học với các định dạng khác nhau
          const yearMatch = inputString.match(/(?:Năm học\s*|\s*[-|,]?\s*)?(\d{4}\s*[-\s]\s*\d{4})$/);
        
          if (yearMatch) {
            namHoc = yearMatch[1].trim().replace(/\s+/g, '-'); // Lấy năm học từ kết quả match
            
            // Loại bỏ các dấu gạch ngang dư thừa
            namHoc = namHoc.replace(/-{2,}/g, '-');
        
            // Cắt chuỗi để lấy phần loại học kỳ
            loaiHocKy = inputString.split(namHoc)[0].trim();
        
            // Loại bỏ phần không cần thiết từ loaiHocKy nếu nó chứa từ khóa 'Năm học'
            loaiHocKy = loaiHocKy.replace(/[-|,]?\s*Năm học.*$/, '').trim().replace(/^\d+\.\s*/, '');
            loaiHocKy = loaiHocKy.split(/,\s*| - /)[0].trim();
          } else {
            // Nếu không tìm thấy năm học, toàn bộ chuỗi là loại học kỳ
            loaiHocKy = inputString;
          }
        
          // Loại bỏ phần không cần thiết (năm học) từ loaiHocKy nếu nó còn sót lại
          if (loaiHocKy.includes('Năm học') || loaiHocKy.includes('năm học')) {
            loaiHocKy = loaiHocKy.split(/[-|,]?\s*Năm học/)[0].trim();
          }
        
          console.log('loaiHocKy:', loaiHocKy);
          console.log('namHoc:', namHoc);
        }
        
        
         else if (row.length > 1) {
          if (typeof row[0] === 'number') {
            // Dòng chứa thông tin chi tiết về kỳ thi
            if (currentEntry) {
              structuredData.push(currentEntry);
            }
            currentEntry = {
              loaiHocKy,
              namHoc,
              hocPhan: [row[1]],
              nhomLop: [row[2]],
              ngayThi: XLSX.SSF.format('m/d/yyyy', row[3]), // Chuyển đổi ngày thi
              ca: row[4],
              phongThi: row[5],
              cb1: row[6],
              cb2: row[7],
              time: [row[8]],
              diaDiem: row[9],
              ghiChu: row[10] || '',
            };
          } else if (typeof row[0] === 'undefined') {
            // Dòng chứa học phần bổ sung cho cùng một entry
            if (currentEntry) {
              currentEntry.hocPhan.push(row[1]);
              currentEntry.nhomLop.push(row[2]);
              currentEntry.time.push(row[8]);
            }
          }
        }
      });

      if (currentEntry) {
        structuredData.push(currentEntry);
      }

      console.log('Structured Data:', structuredData);
      createMany(structuredData); // Gửi dữ liệu đã xử lý đến API
    };

    reader.onerror = () => {
      toast.error("Đã xảy ra lỗi khi đọc file Excel");
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg mt-3 w-[70%] mx-auto">
      <div className="flex items-center justify-center mb-3">
        <Button
          className="button-kiem-nhiem text-white font-bold shadow-md mb-2"
          onClick={() => router.push(`/giaovu/pc-giang-day`)}
        >
          <ArrowLeftOutlined style={{ color: 'white', fontSize: '18px' }} /> QUAY LẠI
        </Button>
        <h2 className="font-bold text-heading3-bold flex-grow text-center text-green-500">PHÂN CÔNG GIẢNG DẠY</h2>
      </div>

      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="space-y-2 font-bold">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Năm học" validateStatus={errors.namHoc ? 'error' : ''} help={errors.namHoc?.message}>
              <Controller
                name="namHoc"
                control={control}
                rules={{ required: "Năm học là bắt buộc" }}
                render={({ field }) => (
                  <Select placeholder="Chọn năm học" {...field}>
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
                rules={{ required: "Loại kỳ thi là bắt buộc" }}
                render={({ field }) => (
                  <Select placeholder="Chọn loại kỳ thi" {...field}>
                    <Option value="1">Kỳ thi 1</Option>
                    <Option value="2">Kỳ thi 2</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Học phần" validateStatus={errors.hocPhan ? 'error' : ''} help={errors.hocPhan?.message}>
              <Controller
                name="hocPhan"
                control={control}
                rules={{ required: "Học phần là bắt buộc" }}
                render={({ field }) => <Input placeholder="Nhập học phần..." {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nhóm lớp" validateStatus={errors.nhomLop ? 'error' : ''} help={errors.nhomLop?.message}>
              <Controller
                name="nhomLop"
                control={control}
                rules={{ required: "Nhóm lớp là bắt buộc" }}
                render={({ field }) => <Input placeholder="Nhập nhóm lớp..." {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Ngày thi" validateStatus={errors.ngayThi ? 'error' : ''} help={errors.ngayThi?.message}>
              <Controller
                name="ngayThi"
                control={control}
                rules={{ required: "Ngày thi là bắt buộc" }}
                render={({ field }) => <Input placeholder="Nhập ngày thi..." {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Ca" validateStatus={errors.ca ? 'error' : ''} help={errors.ca?.message}>
              <Controller
                name="ca"
                control={control}
                rules={{ required: "Ca là bắt buộc" }}
                render={({ field }) => <InputNumber min={1} max={3} placeholder="Nhập ca..." style={{ width: "100%" }} {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Giảng viên giảng dạy" validateStatus={errors.gvGiangDay ? 'error' : ''} help={errors.gvGiangDay?.message}>
              <Controller
                name="gvGiangDay"
                control={control}
                rules={{ required: "Giảng viên giảng dạy là bắt buộc" }}
                render={({ field }) => <Input placeholder="Nhập giảng viên giảng dạy..." {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Địa điểm" validateStatus={errors.diaDiem ? 'error' : ''} help={errors.diaDiem?.message}>
              <Controller
                name="diaDiem"
                control={control}
                rules={{ required: "Địa điểm là bắt buộc" }}
                render={({ field }) => <InputNumber min={1} placeholder="Nhập địa điểm..." style={{ width: "100%" }} {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="CB1">
          <Controller
            name="cb1"
            control={control}
            render={({ field }) => <Input placeholder="Nhập CB1..." {...field} />}
          />
        </Form.Item>
        <Form.Item label="CB2">
          <Controller
            name="cb2"
            control={control}
            render={({ field }) => <Input placeholder="Nhập CB2..." {...field} />}
          />
        </Form.Item>
        <Form.Item label="Thời gian">
          <Controller
            name="time"
            control={control}
            render={({ field }) => <Input placeholder="Nhập thời gian..." {...field} />}
          />
        </Form.Item>
        <Form.Item label="Ghi chú">
          <Controller
            name="ghiChu"
            control={control}
            render={({ field }) => <Input placeholder="Nhập ghi chú..." {...field} />}
          />
        </Form.Item>
        <div className="flex justify-between items-center">
          <Button type="default" onClick={resetForm}>
            Reset
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
          >
            {editRecord ? "Cập nhật" : "Tạo mới"}
          </Button>
          <Button
            type="default"
            icon={<UploadOutlined />}
            onClick={() => fileInputRef.current.click()}
            loading={isUploading}
          >
            Upload File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx, .xls"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </div>
      </Form>
    </div>
  );
};

export default TeachingAssignmentForm;
