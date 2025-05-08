import * as XLSX from 'xlsx-js-style';

export const exportLichThiExcel = (dataList, title, hocKy, namHoc, loaiDaoTao) => {
  if (!dataList || dataList.length === 0) {
    console.error("No data available to export");
    return;
  }

  let loai = '';
  if (loaiDaoTao == 'Chính quy') {
    loai = 'CHÍNH QUY';
  } else {
    loai = 'LIÊN THÔNG VỪA LÀM VỪA HỌC';
  }

  // Define header styles
  const headerStyle = {
    font: { bold: true, sz: 14, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Define title styles
  const titleStyle = {
    font: { bold: true, sz: 16, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  // Define subtitle styles
  const subtitleStyle = {
    font: { bold: true, sz: 14, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  // Define column header styles
  const columnHeaderStyle = {
    font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
    fill: { patternType: "solid", fgColor: { rgb: "4472C4" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Define data cell styles
  const dataCellStyle = {
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    },
    alignment: { vertical: "center", wrapText: true }
  };

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([
    ["TRƯỜNG ĐẠI HỌC PHÚ YÊN", "", "", "", "", "", "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM"],
    ["PHÒNG QUẢN LÝ CHẤT LƯỢNG", "", "", "", "", "", "Độc lập - Tự do - Hạnh phúc"],
    [],
    ["", "", "", `${title} ${loai}`],
    ["", "", "", `THUỘC HỌC KỲ ${hocKy}, NĂM HỌC ${namHoc}`],
    [],
    [
      "STT", 'Mã học phần', "Tên Học phần", 'Hình thức thi', 'TC', "Lớp đại diện", 
      "Ngày thi", "Buổi thi", "Phòng thi", "Thời gian", "Số lượng"
    ],
  ]);

  // Set merged cells
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // TRƯỜNG ĐẠI HỌC PHÚ YÊN
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }, // PHÒNG QUẢN LÝ CHẤT LƯỢNG
    { s: { r: 0, c: 6 }, e: { r: 0, c: 10 } }, // CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
    { s: { r: 1, c: 6 }, e: { r: 1, c: 10 } }, // Độc lập - Tự do - Hạnh phúc
    { s: { r: 3, c: 3 }, e: { r: 3, c: 7 } }, // Title
    { s: { r: 4, c: 3 }, e: { r: 4, c: 7 } }, // Subtitle
  ];

  // Apply styles to headers
  ws["A1"] = { v: "TRƯỜNG ĐẠI HỌC PHÚ YÊN", s: headerStyle };
  ws["G1"] = { v: "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM", s: headerStyle };
  ws["A2"] = { v: "PHÒNG QUẢN LÝ CHẤT LƯỢNG", s: headerStyle };
  ws["G2"] = { v: "Độc lập - Tự do - Hạnh phúc", s: { ...headerStyle, font: { italic: true, sz: 12 } } };
  
  // Apply styles to title and subtitle
  ws["D4"] = { v: `${title} ${loai}`, s: titleStyle };
  ws["D5"] = { v: `THUỘC HỌC KỲ ${hocKy}, NĂM HỌC ${namHoc}`, s: subtitleStyle };

  // Apply styles to column headers (row 7)
  "ABCDEFGHIJK".split('').forEach((col, idx) => {
    if (ws[col + "7"]) {
      ws[col + "7"].s = columnHeaderStyle;
    }
  });

  // Add data to the worksheet with styles
  dataList.forEach((data, index) => {
    const rowIndex = index + 8; // Starting from row 8 (after headers)
    const row = [
      index + 1,
      data.maHocPhan.join(', '),
      data.hocPhan.join(', '),
      data.hinhThuc.join(', '),
      data.tc.join(', '),
      data.lop.map(arr => arr.join(' - ')).join(', '),
      data.ngayThi,
      data.ca == '1' ? 'Sáng' : 'Chiều',
      data.phong.map(p => p.tenPhong || p).join(", "),
      data.thoiGian.join(', '),
      data.soLuong.join(', '),
    ];

    // Add row data
    XLSX.utils.sheet_add_aoa(ws, [row], { origin: { r: rowIndex - 1, c: 0 } });
    
    // Apply styles to data cells
    for (let i = 0; i < row.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: rowIndex - 1, c: i });
      
      if (!ws[cellRef]) {
        ws[cellRef] = { v: row[i] };
      }
      
      // Apply base data cell style
      ws[cellRef].s = { ...dataCellStyle };
      
      // Apply custom styling for specific columns
      switch (i) {
        case 0: // STT column
          ws[cellRef].s.alignment = { horizontal: "center", vertical: "center" };
          break;
        case 1: // Mã học phần
          ws[cellRef].s.font = { color: { rgb: "0000FF" } };
          break;
        case 2: // Tên học phần
          ws[cellRef].s.font = { bold: true, color: { rgb: "008000" } };
          break;
        case 5: // Lớp đại diện
          ws[cellRef].s.font = { color: { rgb: "FF0000" } };
          break;
        case 7: // Buổi thi
          ws[cellRef].s.font = { bold: true };
          ws[cellRef].s.alignment = { horizontal: "center", vertical: "center" };
          break;
      }
    }
  });

  // Set column widths
  ws['!cols'] = [
    { width: 6 },  // STT
    { width: 15 }, // Mã học phần
    { width: 30 }, // Tên học phần
    { width: 15 }, // Hình thức thi
    { width: 6 },  // TC
    { width: 25 }, // Lớp đại diện
    { width: 12 }, // Ngày thi
    { width: 10 }, // Buổi thi
    { width: 15 }, // Phòng thi
    { width: 12 }, // Thời gian
    { width: 10 }, // Số lượng
  ];

  // Create a new workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Lịch thi");

  // Export the workbook to a file
  XLSX.writeFile(wb, "Lịch thi cuối kỳ.xlsx");
};

export const exportLichThi = (dataList, title, hocKy, namHoc, loaiDaoTao) => {
  if (!dataList || dataList.length === 0) {
    console.error("No data available to export");
    return null;
  }

  let loai = '';
  if (loaiDaoTao === 'Chính quy') {
    loai = 'CHÍNH QUY';
  } else {
    loai = 'LIÊN THÔNG VỪA LÀM VỪA HỌC';
  }

  // Define header styles
  const headerStyle = {
    font: { bold: true, sz: 14, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Define title styles
  const titleStyle = {
    font: { bold: true, sz: 16, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  // Define subtitle styles
  const subtitleStyle = {
    font: { bold: true, sz: 14, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  // Define column header styles
  const columnHeaderStyle = {
    font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
    fill: { patternType: "solid", fgColor: { rgb: "4472C4" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Define data cell styles
  const dataCellStyle = {
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    },
    alignment: { vertical: "center", wrapText: true }
  };

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([
    ["TRƯỜNG ĐẠI HỌC PHÚ YÊN", "", "", "", "", "", "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM"],
    ["PHÒNG QUẢN LÝ CHẤT LƯỢNG", "", "", "", "", "", "Độc lập - Tự do - Hạnh phúc"],
    [],
    ["", "", "", `${title} ${loai}`],
    ["", "", "", `THUỘC HỌC KỲ ${hocKy}, NĂM HỌC ${namHoc}`],
    [],
    [
      "STT", 'Mã học phần', "Tên Học phần", 'Hình thức thi', 'TC', "Lớp đại diện", 
      "Ngày thi", "Buổi thi", "Phòng thi", "Thời gian", "Số lượng"
    ],
  ]);

  // Set merged cells
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // TRƯỜNG ĐẠI HỌC PHÚ YÊN
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }, // PHÒNG QUẢN LÝ CHẤT LƯỢNG
    { s: { r: 0, c: 6 }, e: { r: 0, c: 10 } }, // CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
    { s: { r: 1, c: 6 }, e: { r: 1, c: 10 } }, // Độc lập - Tự do - Hạnh phúc
    { s: { r: 3, c: 3 }, e: { r: 3, c: 7 } }, // Title
    { s: { r: 4, c: 3 }, e: { r: 4, c: 7 } }, // Subtitle
  ];

  // Apply styles to headers
  ws["A1"] = { v: "TRƯỜNG ĐẠI HỌC PHÚ YÊN", s: headerStyle };
  ws["G1"] = { v: "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM", s: headerStyle };
  ws["A2"] = { v: "PHÒNG QUẢN LÝ CHẤT LƯỢNG", s: headerStyle };
  ws["G2"] = { v: "Độc lập - Tự do - Hạnh phúc", s: { ...headerStyle, font: { italic: true, sz: 12 } } };
  
  // Apply styles to title and subtitle
  ws["D4"] = { v: `${title} ${loai}`, s: titleStyle };
  ws["D5"] = { v: `THUỘC HỌC KỲ ${hocKy}, NĂM HỌC ${namHoc}`, s: subtitleStyle };

  // Apply styles to column headers (row 7)
  "ABCDEFGHIJK".split('').forEach((col, idx) => {
    if (ws[col + "7"]) {
      ws[col + "7"].s = columnHeaderStyle;
    }
  });

  // Add data to the worksheet with styles
  dataList.forEach((data, index) => {
    const rowIndex = index + 8; // Starting from row 8 (after headers)
    const row = [
      index + 1,
      data.maHocPhan.join(', '),
      data.hocPhan.join(', '),
      data.hinhThuc.join(', '),
      data.tc.join(', '),
      data.lop.map(arr => arr.join(' - ')).join(', '),
      data.ngayThi,
      data.ca === '1' ? 'Sáng' : 'Chiều',
      data.phong.map(p => p.tenPhong).join(", "),
      data.thoiGian.join(', '),
      data.soLuong.join(', '),
    ];

    // Add row data
    XLSX.utils.sheet_add_aoa(ws, [row], { origin: { r: rowIndex - 1, c: 0 } });
    
    // Apply styles to data cells
    for (let i = 0; i < row.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: rowIndex - 1, c: i });
      
      if (!ws[cellRef]) {
        ws[cellRef] = { v: row[i] };
      }
      
      // Apply base data cell style
      ws[cellRef].s = { ...dataCellStyle };
      
      // Apply custom styling for specific columns
      switch (i) {
        case 0: // STT column
          ws[cellRef].s.alignment = { horizontal: "center", vertical: "center" };
          break;
        case 1: // Mã học phần
          ws[cellRef].s.font = { color: { rgb: "0000FF" } };
          break;
        case 2: // Tên học phần
          ws[cellRef].s.font = { bold: true, color: { rgb: "008000" } };
          break;
        case 5: // Lớp đại diện
          ws[cellRef].s.font = { color: { rgb: "FF0000" } };
          break;
        case 7: // Buổi thi
          ws[cellRef].s.font = { bold: true };
          ws[cellRef].s.alignment = { horizontal: "center", vertical: "center" };
          break;
      }
    }
  });

  // Set column widths
  ws['!cols'] = [
    { width: 6 },  // STT
    { width: 15 }, // Mã học phần
    { width: 30 }, // Tên học phần
    { width: 15 }, // Hình thức thi
    { width: 6 },  // TC
    { width: 25 }, // Lớp đại diện
    { width: 12 }, // Ngày thi
    { width: 10 }, // Buổi thi
    { width: 15 }, // Phòng thi
    { width: 12 }, // Thời gian
    { width: 10 }, // Số lượng
  ];

  // Create a new workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Lịch thi");

  // Tạo mảng byte từ workbook
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // Tạo blob từ mảng byte
  const blob = new Blob([wbout], { type: 'application/octet-stream' });

  return blob; // Trả về blob
};

export const exportDSSV = (dataList, hocKy, namHoc, phong) => {
  if (!dataList || dataList.length === 0) {
    console.error("No data available to export");
    return;
  }

  // Define header styles with double border for emphasis
  const headerStyle = {
    font: { bold: true, sz: 14, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Define title styles with double bottom border for emphasis
  const titleStyle = {
    font: { bold: true, sz: 16, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      bottom: { style: "double", color: { rgb: "000000" } },
    }
  };

  // Define subtitle styles
  const subtitleStyle = {
    font: { bold: true, sz: 14, color: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  // Define column header styles with gradient-like effect
  const columnHeaderStyle = {
    font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
    fill: { patternType: "solid", fgColor: { rgb: "4472C4" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Define data cell styles with different border styles
  const dataCellStyle = {
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    },
    alignment: { vertical: "center" }
  };

  // Define footer style
  const footerStyle = {
    font: { italic: true, sz: 10, color: { rgb: "404040" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  // Get current date for the document
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet([
    ["TRƯỜNG ĐẠI HỌC PHÚ YÊN", "", "", "", "", "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM"],
    ["PHÒNG QUẢN LÝ CHẤT LƯỢNG", "", "", "", "", "Độc lập - Tự do - Hạnh phúc"],
    [],
    ["", "", `DANH SÁCH THÍ SINH DỰ THI - PHÒNG ${phong}`],
    ["", "", `THUỘC HỌC KỲ ${hocKy}, NĂM HỌC ${namHoc}`],
    ["", "", `Ngày in: ${formattedDate}`],
    [],
    [
      "STT", 'Họ và tên', "Mã sinh viên", 'Lớp', 'Môn thi'
    ],
  ]);

  // Set merged cells
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // TRƯỜNG ĐẠI HỌC PHÚ YÊN
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }, // PHÒNG QUẢN LÝ CHẤT LƯỢNG
    { s: { r: 0, c: 5 }, e: { r: 0, c: 7 } }, // CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
    { s: { r: 1, c: 5 }, e: { r: 1, c: 7 } }, // Độc lập - Tự do - Hạnh phúc
    { s: { r: 3, c: 2 }, e: { r: 3, c: 5 } }, // Title
    { s: { r: 4, c: 2 }, e: { r: 4, c: 5 } }, // Subtitle
    { s: { r: 5, c: 2 }, e: { r: 5, c: 5 } }, // Date
  ];

  // Apply styles to headers
  ws["A1"] = { v: "TRƯỜNG ĐẠI HỌC PHÚ YÊN", s: headerStyle };
  ws["F1"] = { v: "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM", s: headerStyle };
  ws["A2"] = { v: "PHÒNG QUẢN LÝ CHẤT LƯỢNG", s: headerStyle };
  ws["F2"] = { v: "Độc lập - Tự do - Hạnh phúc", s: { ...headerStyle, font: { italic: true, sz: 12 } } };
  
  // Apply styles to title and subtitle with enhanced styling
  ws["C4"] = { v: `DANH SÁCH THÍ SINH DỰ THI - PHÒNG ${phong}`, s: titleStyle };
  ws["C5"] = { v: `THUỘC HỌC KỲ ${hocKy}, NĂM HỌC ${namHoc}`, s: subtitleStyle };
  ws["C6"] = { v: `Ngày in: ${formattedDate}`, s: { ...subtitleStyle, font: { italic: true, sz: 11 } } };

  // Apply styles to column headers (row 8)
  "ABCDE".split('').forEach((col, idx) => {
    if (ws[col + "8"]) {
      ws[col + "8"].s = columnHeaderStyle;
    }
  });

  // Add data to the worksheet with alternating row colors
  dataList.forEach((data, index) => {
    const rowIndex = index + 9; // Starting from row 9 (after headers)
    const row = [
      index + 1,
      data.hoTen,
      data.maSV,
      data.lop,
      data.hocPhan,
    ];

    // Add row data
    XLSX.utils.sheet_add_aoa(ws, [row], { origin: { r: rowIndex - 1, c: 0 } });
    
    // Apply styles to data cells with alternating row colors
    for (let i = 0; i < row.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: rowIndex - 1, c: i });
      
      if (!ws[cellRef]) {
        ws[cellRef] = { v: row[i] };
      }
      
      // Apply base data cell style
      ws[cellRef].s = { ...dataCellStyle };
      
      // Add alternating row colors
      if (index % 2 === 1) {
        ws[cellRef].s.fill = { 
          patternType: "solid", 
          fgColor: { rgb: "F2F2F2" } 
        };
      }
      
      // Apply custom styling for specific columns
      switch (i) {
        case 0: // STT column
          ws[cellRef].s.alignment = { horizontal: "center", vertical: "center" };
          break;
        case 1: // Họ và tên
          ws[cellRef].s.font = { bold: true };
          break;
        case 2: // Mã sinh viên
          ws[cellRef].s.font = { color: { rgb: "0000FF" } };
          ws[cellRef].s.alignment = { horizontal: "center", vertical: "center" };
          break;
        case 3: // Lớp
          ws[cellRef].s.font = { color: { rgb: "FF0000" } };
          ws[cellRef].s.alignment = { horizontal: "center", vertical: "center" };
          break;
      }
    }
  });

  // Add footer with signature
  const footerRowIndex = dataList.length + 10;
  const signatureDate = `Phú Yên, ngày ${currentDate.getDate()} tháng ${currentDate.getMonth() + 1} năm ${currentDate.getFullYear()}`;
  
  // Add signature area
  XLSX.utils.sheet_add_aoa(ws, [
    ["", "", signatureDate, "", ""],
    ["", "", "NGƯỜI LẬP DANH SÁCH", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "________________", "", ""]
  ], { origin: { r: footerRowIndex, c: 0 } });
  
  // Style the signature area
  ws[XLSX.utils.encode_cell({ r: footerRowIndex, c: 2 })] = { 
    v: signatureDate, 
    s: { alignment: { horizontal: "center" }, font: { italic: true } } 
  };
  
  ws[XLSX.utils.encode_cell({ r: footerRowIndex + 1, c: 2 })] = { 
    v: "NGƯỜI LẬP DANH SÁCH", 
    s: { alignment: { horizontal: "center" }, font: { bold: true } } 
  };
  
  ws[XLSX.utils.encode_cell({ r: footerRowIndex + 5, c: 2 })] = { 
    v: "________________", 
    s: { alignment: { horizontal: "center" } } 
  };

  // Set column widths
  ws['!cols'] = [
    { width: 6 },  // STT
    { width: 30 }, // Họ và tên
    { width: 15 }, // Mã sinh viên
    { width: 15 }, // Lớp
    { width: 30 }, // Môn thi
  ];

  // Set print settings
  ws['!margins'] = {
    left: 0.7,
    right: 0.7,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3
  };

  // Create a new workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách thi");

  // Set print properties
  wb.Workbook = {
    Views: [
      { RTL: false } // Left-to-right printing
    ],
    PrintOptions: {
      CenterHorizontally: true,
      CenterVertically: false
    }
  };

  // Export the workbook to a file
  XLSX.writeFile(wb, `danh-sach-sinh-vien-phong-${phong}.xlsx`);
  
  return wb; // Return workbook for potential further usage
};