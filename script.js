document.getElementById('phoneForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngừng gửi form

    let phone = document.getElementById('phone').value;
    let message = document.getElementById('message');

    if (phone) {
        let points = parseInt(localStorage.getItem('points') || '0');
        points += 1;
        localStorage.setItem('points', points);

        message.textContent = `Cảm ơn! Số điện thoại ${phone} đã được lưu và bạn sẽ nhận ${points} điểm.`;
        message.style.color = 'green';

        // Lấy ngày giờ hiện tại và chuyển thành chuỗi ISO
        let currentDate = new Date().toISOString();

        // Gửi dữ liệu lên Google Sheets qua Web App
        fetch('https://script.google.com/macros/s/AKfycbywEXAaHiI3m52iJe2N-vvuWOkJ18vc69S9Hn009-4MKirKq0YQAOpke-uS0Tw_zoHztQ/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone: phone, points: points, date: currentDate })  // Gửi dữ liệu dưới dạng JSON
        })
        .then(response => response.json())
        .then(data => {
            console.log('Dữ liệu đã được gửi thành công:', data);
        })
        .catch(error => {
            console.error('Lỗi khi gửi dữ liệu:', error);
        });
    } else {
        message.textContent = 'Vui lòng nhập số điện thoại!';
        message.style.color = 'red';
    }
});
