"use client";

import React from 'react';
import { Button, Space } from 'antd';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';


const WorkHours = () => {
  const router = useRouter();
  const [isChinhQuyKhac, setIsChinhQuyKhac] = useState(false)

  const handlePage = (type) => {
    router.push(`work-hours/${type}`);
  };

  return (
    <div className=' bg-white rounded-xl h-[70vh] mx-auto  mt-6 max-sm:h-[70vh] shadow-xl'>
      {isChinhQuyKhac&& (
        <Button
        className="button-kiem-nhiem text-white font-bold shadow-md left-0"
        onClick={() => setIsChinhQuyKhac(!isChinhQuyKhac)}
      >
        <ArrowLeftOutlined
          style={{
            color: 'white',
            fontSize: '18px',
          }}
        /> QUAY LẠI
      </Button>
      )}
      <div className="flex items-center h-full">
        {!isChinhQuyKhac && (
          <Space size="middle" className='flex flex-1 justify-around items-center max-md:flex-col'>
            <Button
              className={`custom-button-1 button-chinh-quy`}
              onClick={() => handlePage('chinh-quy')}
            >
              <div className='text'>HỆ CHÍNH QUY</div>
            </Button>
            <Button
              className={`custom-button-1 button-chinh-quy-khac`}
              onClick={() => setIsChinhQuyKhac(true)}
            >
              <div className='text'>HỆ CHÍNH QUY KHÁC</div>
            </Button>
            <Button
              className={`custom-button-1 button-boi-duong`}
              onClick={() => handlePage('boi-duong')}
            >
              <div className='text'>BỒI DƯỠNG</div>
            </Button>
          </Space>)}

        {isChinhQuyKhac && (
          <Space size="middle" className='flex flex-1 justify-around items-center max-md:flex-col'>
            <Button
              className={`custom-button-1 button-lien-thong-chinh-quy`}
              onClick={() => handlePage('lien-thong-chinh-quy')}
            >
              <div className='text'>HỆ LIÊN THÔNG <br /> CHÍNH QUY</div>
            </Button>
            <Button
              className={`custom-button-1 button-lien-thong-vlvh`}
              onClick={() => handlePage('lien-thong-vlvh')}
            >
              <div className='text'>HỆ LIÊN THÔNG <br /> VỪA LÀM VỪA HỌC </div>
            </Button>
            <Button
              className={`custom-button-1 button-lien-thong-vlvh-nd71`}
              onClick={() => handlePage('lien-thong-vlvh-nd71')}
            >
              <div className='text'>HỆ LIÊN THÔNG <br /> VỪA LÀM VỪA HỌC <br /> NĐ-71</div>
            </Button>
          </Space>
        )}
      </div>
    </div>
  );
}

export default WorkHours;
