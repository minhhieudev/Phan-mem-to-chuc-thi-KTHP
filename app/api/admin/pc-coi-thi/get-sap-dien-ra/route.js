import { connectToDB } from '@mongodb';
import PcCoiThi from '@models/PcCoiThi';
export const dynamic = 'force-dynamic';

// Hàm chuyển đổi chuỗi ngày theo định dạng "dd-mm-yyyy" sang đối tượng Date
const parseDateString = (dateString) => {
  const [day, month, year] = dateString.split('-').map(Number); // Chuyển đổi phân tách "-" thay vì "/"
  return new Date(year, month - 1, day); // month - 1 vì tháng trong Date bắt đầu từ 0
};

export const GET = async (req) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const namHoc = searchParams.get('namHoc');
    const hocKy = searchParams.get('hocKy');
    const time = searchParams.get('time');

    console.log('Thời gian:', time);

    let filter = [];

    if (namHoc) {
      filter.push({ $match: { namHoc: namHoc } });
    }

    if (hocKy && hocKy !== 'null' && hocKy !== 'undefined') {
      filter.push({ $match: { ky: hocKy } });
    }

    const currentDate = new Date(); // Lấy thời gian hiện tại
    let startDate, endDate;

    if (time === 'month') {
      // Tính toán ngày bắt đầu và kết thúc của tháng hiện tại
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else if (time === 'week') {
      // Tính toán ngày bắt đầu và kết thúc của tuần hiện tại
      const dayOfWeek = currentDate.getDay(); // Ngày trong tuần (0-6)
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - dayOfWeek); // Ngày đầu tuần
      endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + (6 - dayOfWeek)); // Ngày cuối tuần
    }

    // Chuyển đổi startDate và endDate thành định dạng ngày theo định dạng "dd-mm-yyyy"
    const startDateString = `${startDate.getDate().toString().padStart(2, '0')}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getFullYear()}`;
    const endDateString = `${endDate.getDate().toString().padStart(2, '0')}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getFullYear()}`;

    // Thêm bước chuyển đổi chuỗi ngày từ cơ sở dữ liệu sang đối tượng Date
    filter.push({
      $addFields: {
        ngayThiDate: {
          $dateFromString: {
            dateString: "$ngayThi",
            format: "%d-%m-%Y" // Cập nhật định dạng từ "-" thay vì "/"
          }
        }
      }
    });

    // Thêm bước lọc theo ngày
    filter.push({
      $match: {
        ngayThiDate: {
          $gte: parseDateString(startDateString), // Ngày bắt đầu
          $lte: parseDateString(endDateString)    // Ngày kết thúc
        }
      }
    });

    // Tìm các record trong cơ sở dữ liệu với filter đã thiết lập
    const assignments = await PcCoiThi.aggregate(filter);

    // Chuyển đổi lại ngày từ định dạng Date sang chuỗi "dd-mm-yyyy" nếu cần
    const results = assignments.map(assignment => ({
      ...assignment,
      ngayThi: assignment.ngayThiDate.toLocaleDateString('vi-VN') // Định dạng lại nếu cần
    }));

    console.log('Filter:', filter);
    console.log('Kết quả:', results); // In kết quả ra console

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách lịch thi mới nhất:", err);
    return new Response(JSON.stringify({ message: `Lỗi: ${err.message}` }), { status: 500 });
  }
};
