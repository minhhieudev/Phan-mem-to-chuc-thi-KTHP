import * as XLSX from 'xlsx';


export const exportLichThi = (dataList, title, hocKy, namHoc, loaiDaoTao) => {
  if (!dataList || dataList.length === 0) {
    console.error("No data available to export");
    return;
  }

  let loai = ''
  if (loaiDaoTao == 'Chính quy') {
    loai = 'CHÍNH QUY'
  }
  else {
    loai = 'LIÊN THÔNG VỪA LÀM VỪA HỌC'
  }

  const ws = XLSX.utils.aoa_to_sheet([
    ["TRƯỜNG ĐẠI HỌC PHÚ YÊN", "", "", "", "", "", "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM",],
    ["PHÒNG QUẢN LÝ CHẤT LƯỢNG", "", "", "", "", "", "", "Độc lập - Tự do - Hạnh phúc"],
    [],
    ["", "", "", `${title} ${loai}`,],
    ["", "", "", `THUỘC HỌC KỲ ${hocKy}, NĂM HỌC ${namHoc}`,],
    [],
    [
      "      TT", "Học phần", "Nhóm / Lớp", "Ngày thi", "Ca", "Phòng thi", "Cán bộ 1",
      "Cán bộ 2", "Hình thức", "Thời gian", "Ghi chú"
    ],
  ])

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // TRƯỜNG ĐẠI HỌC PHÚ YÊN
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },

  ]

  // Add data to the worksheet
  dataList.forEach((data, index) => {
    const row = [
      index + 1,
      data.hocPhan,
      data.lop,
      data.ngayThi,
      data.ca,
      data.phong,
      data.cbo1,
      data.cbo2,
      data.hinhThuc,
      data.thoiGian,
    ];
    XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
  })
  // Create a new workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Export the workbook to a file
  XLSX.writeFile(wb, "Lịch thi cuối kỳ.xlsx");
};

//   if (!dataList || dataList.length === 0) {
//     console.error("No data available to export");
//     return;
//   }

//   const ws = XLSX.utils.aoa_to_sheet([
//     ["TRƯỜNG ĐẠI HỌC PHÚ YÊN", "", "", "", "", "", "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM",],
//     ["KHOA………………………………", "", "", "", "", "", "", "Độc lập - Tự do - Hạnh phúc"],
//     [],
//     ["", "", "", `${title}`,],
//     ["", "", "", "", "", "Năm học:.........",],
//     [],
//     [
//       "      TT", "Họ và tên giảng viên", "Chuyên đề giảng dạy", "Loại hình bồi dưỡng", "Thời gian (đợt / năm)", "Số HV",
//       "         Số tiết", null,
//       "Số tiết quy chuẩn", "Ghi chú"
//     ],
//     [
//       null, null, null, null, null, null, null,
//       "      LT", "      TH",
//       null, null, null, null,
//       null, null, null, null,
//       null, null
//     ],
//   ])

//   ws["!merges"] = [
//     { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // TRƯỜNG ĐẠI HỌC PHÚ YÊN
//     { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }, // HOA………………………………

//     { s: { r: 6, c: 0 }, e: { r: 7, c: 0 } },
//     { s: { r: 6, c: 1 }, e: { r: 7, c: 1 } },

//     { s: { r: 6, c: 2 }, e: { r: 7, c: 2 } },
//     { s: { r: 6, c: 3 }, e: { r: 7, c: 3 } },
//     { s: { r: 6, c: 4 }, e: { r: 7, c: 4 } },
//     { s: { r: 6, c: 5 }, e: { r: 7, c: 5 } },
//     { s: { r: 6, c: 6 }, e: { r: 7, c: 6 } },

//   ]

//   // Add data to the worksheet
//   dataList.forEach((data, index) => {
//     const row = [
//       index + 1,
//       data.user.username,
//       data.chuyenDe,
//       data.loaiHinh,
//       data.thoiGian,
//       data.soHV,
//       data.soTietLT,
//       data.soTietTH,
//       data.soTietQuyChuan,
//       data.ghiChu,
//     ];
//     XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
//   })
//   // Create a new workbook and add the worksheet
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Bảng tổng hợp");

//   // Export the workbook to a file
//   XLSX.writeFile(wb, "Bang_Tong_Hop_Lao_Dong_Giang_Vien.xlsx");
// };