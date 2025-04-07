function doPost(e) {
  try {
    // Ghi log toàn bộ dữ liệu nhận được từ trang web
    Logger.log('Dữ liệu nhận được: ' + JSON.stringify(e));  // Kiểm tra xem e nhận dữ liệu gì

    var phone = e.parameter.phone;
    var points = e.parameter.points;
    var date = e.parameter.date;  // Lấy ngày giờ từ dữ liệu gửi đến

    // Kiểm tra nếu dữ liệu thiếu
    if (!phone || !points || !date) {
      return ContentService.createTextOutput("Thiếu dữ liệu.");
    }

    // Mở Google Sheets và chọn sheet đầu tiên
    var sheet = SpreadsheetApp.openById('1AiLvPzkv7mEXft0kHeS0wfsGrKW5EQIZTinmcA9qvZQ').getActiveSheet();

    // Thêm dữ liệu vào Google Sheets (bao gồm số điện thoại, điểm và ngày giờ)
    sheet.appendRow([phone, points, new Date(date)]);  // Chuyển chuỗi ngày giờ về đối tượng Date

    // Trả về phản hồi cho người gửi
    return ContentService.createTextOutput("Dữ liệu đã được lưu thành công!");
  } catch (error) {
    // Xử lý lỗi nếu có
    Logger.log("Lỗi: " + error.message);
    return ContentService.createTextOutput("Lỗi: " + error.message);
  }
}
