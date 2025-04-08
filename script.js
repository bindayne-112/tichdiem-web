document.getElementById('phoneForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngừng gửi form

    let phone = document.getElementById('phone').value;  // Lấy số điện thoại
    let message = document.getElementById('message');  // Đoạn thông báo

    // Kiểm tra nếu số điện thoại có giá trị
    if (phone) {
        let points = parseInt(localStorage.getItem('points') || '0');  // Lấy điểm hiện tại

        if (isNaN(points)) {
            points = 0;  // Nếu điểm không phải là số hợp lệ, gán lại là 0
        }

        points += 1;  // Tăng điểm lên 1
        localStorage.setItem('points', points);  // Lưu lại điểm mới

        // Hiển thị thông báo thành công
        message.textContent = `Cảm ơn! Số điện thoại ${phone} đã được lưu và bạn sẽ nhận ${points} điểm.`;
        message.style.color = 'green';

        // Lấy ngày giờ hiện tại và chuyển thành chuỗi ISO
        let currentDate = new Date().toISOString();

        // Tạo FormData và gửi dưới dạng POST
        let formData = new FormData();
        formData.append('phone', phone);  // Gửi số điện thoại
        formData.append('points', points);  // Gửi điểm tích lũy
        formData.append('date', currentDate);  // Gửi ngày giờ

        // Gửi dữ liệu lên Google Sheets qua Web App
        fetch('https://script.google.com/macros/s/AKfycbywEXAaHiI3m52iJe2N-vvuWOkJ18vc69S9Hn009-4MKirKq0YQAOpke-uS0Tw_zoHztQ/exec', {
            method: 'POST',
            body: formData  // Gửi dữ liệu dưới dạng FormData
        })
        .then(response => response.text())  // Đảm bảo bạn xử lý phản hồi đúng
        .then(data => {
            console.log('Dữ liệu đã được gửi thành công:', data);
            // Bạn có thể hiển thị thông báo phản hồi hoặc xử lý sau khi gửi thành công.
        })
        .catch(error => {
            console.error('Lỗi khi gửi dữ liệu:', error);
            message.textContent = 'Đã có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại!';
            message.style.color = 'red';
        });
    } else {
        message.textContent = 'Vui lòng nhập số điện thoại!';  // Thông báo lỗi nếu không có số điện thoại
        message.style.color = 'red';
    }
});
