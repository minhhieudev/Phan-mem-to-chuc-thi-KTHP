"use client";

import React from 'react';
import { Button, Space, Card, Typography } from 'antd';
import { useRouter } from "next/navigation";
import { CalendarOutlined, FileExcelOutlined } from '@ant-design/icons';

const { Title } = Typography;

const WorkHours = () => {
  const router = useRouter();

  const handlePage = (type) => {
    router.push(`home/${type}`);
  };

  return (
    <div className='bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl min-h-[70vh] mx-auto w-[90%] mt-6 max-md:min-h-[70vh] shadow-xl p-8'>
      <Card className="mb-6 text-center shadow-md border-0">
        <Title level={2} className="mb-2 text-blue-1">THÔNG TIN LỊCH THI</Title>
        <p className="text-gray-600">Xem lịch coi thi và chấm thi của bạn</p>
      </Card>
      
      <div className="flex items-center justify-center h-full py-8">
        <Space size="large" className='flex flex-1 justify-around items-center flex-col md:flex-row'>
          <Card 
            hoverable
            className="w-full max-w-[300px] transition-all duration-300 transform hover:scale-105 border-0 shadow-lg"
            onClick={() => handlePage('coi-thi')}
          >
            <div className="text-center mb-4">
              <CalendarOutlined className="text-6xl text-blue-600" />
            </div>
            <Button
              className={`custom-button-1 button-chinh-quy w-full max-w-[300px]`}
              onClick={() => handlePage('coi-thi')}
            >
              <div className='text'>LỊCH COI THI</div>
            </Button>
            <p className="text-gray-500 mt-4 text-center">
              Xem thông tin chi tiết lịch coi thi của bạn
            </p>
          </Card>
          
          <Card 
            hoverable
            className="w-full max-w-[300px] transition-all duration-300 transform hover:scale-105 border-0 shadow-lg"
            onClick={() => handlePage('cham-thi')}
          >
            <div className="text-center mb-4">
              <FileExcelOutlined className="text-6xl text-green-600" />
            </div>
            <Button
              className={`custom-button-1 button-chinh-quy-khac w-full max-w-[300px]`}
              onClick={() => handlePage('cham-thi')}
            >
              <div className='text'>LỊCH CHẤM THI</div>
            </Button>
            <p className="text-gray-500 mt-4 text-center">
              Xem thông tin chi tiết lịch chấm thi của bạn
            </p>
          </Card>
        </Space>
      </div>
    </div>
  );
}

export default WorkHours;


// Giải quyết chỗ lấy gv của khoa để random , hiện tại lấy trên khoa, phải sửa lại lấy trong danh sách select







// dashboard , chấm thi ko có kì và ngày chấm nên k biết thống kê