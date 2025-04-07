// script.js
document.getElementById('phoneForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngừng gửi form

    let phone = document.getElementById('phone').value;
    let message = document.getElementById('message');

    // Kiểm tra số điện thoại
    if (phone) {
        message.textContent = `Cảm ơn! Số điện thoại ${phone} đã được lưu và bạn sẽ nhận điểm.`;
        message.style.color = 'green'; // Màu xanh cho thông báo thành công
    } else {
        message.textContent = 'Vui lòng nhập số điện thoại!';
        message.style.color = 'red'; // Màu đỏ cho thông báo lỗi
    }
});
