// utils/cors.js

export const getHeaders = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Lấy URL từ biến môi trường
    return {
      'Access-Control-Allow-Origin': apiUrl,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
  };
  