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
        fetch('https://script.google.com/macros/s/AKfycbydydvlWwa5sM_N8_ufWNk7kfAZ7UclZkJJ-SbbKXtj5z2VXb9YtjNGXPd0HfOBflBDtQ/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone: phone, points: points, date: currentDate })  // Gửi ngày giờ dưới dạng chuỗi
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
