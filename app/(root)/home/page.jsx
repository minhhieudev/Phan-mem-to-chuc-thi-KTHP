"use client";

import React from 'react';
import { Button, Space } from 'antd';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';


const WorkHours = () => {
  const router = useRouter();

  const handlePage = (type) => {
    router.push(`home/${type}`);
  };

  return (
    <div className=' bg-white rounded-xl h-[70vh] mx-auto w-[70%]  mt-6 max-sm:h-[70vh] shadow-xl'>
      <div className="flex items-center h-full">
          <Space size="middle" className='flex flex-1 justify-around items-center max-md:flex-col'>
            <Button
              className={`custom-button-1 button-chinh-quy`}
              onClick={() => handlePage('coi-thi')}
            >
              <div className='text'>LỊCH COI THI</div>
            </Button>
            <Button
              className={`custom-button-1 button-chinh-quy-khac`}
              onClick={() => handlePage('cham-thi')}
            >
              <div className='text'>LỊCH CHẤM THI</div>
            </Button>
          </Space>
      </div>
    </div>
  );
}

export default WorkHours;


// Giải quyết chỗ lấy gv của khoa để random , hiện tại lấy trên khoa, phải sửa lại lấy trong danh sách select







// dashboard , chấm thi ko có kì và ngày chấm nên k biết thống kê