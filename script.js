// Kiểm tra mã QR khi vừa mở trang
window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("tich"); // vẫn lấy từ URL ?tich=

  if (!code) return;

  fetch(`https://script.google.com/macros/s/AKfycbysKdONReVQTU3P7Y0jLuKckYqbXItdj53O6ETolZ6B0qoLO0OWmV7FQ0pO7s14AtQ4/exec?check=1&code=${code}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "USED") {
        document.body.innerHTML = `
          <div style="padding: 2em; text-align: center; font-family: sans-serif;">
            <h2>⚠️ Mã tích điểm đã được sử dụng</h2>
            <p>Mỗi mã chỉ được dùng một lần. Liên hệ nhân viên nếu bạn cần hỗ trợ.</p>
          </div>
        `;
      } else if (data.status === "INVALID") {
        document.body.innerHTML = `
          <div style="padding: 2em; text-align: center; font-family: sans-serif;">
            <h2>🚫 Mã không hợp lệ</h2>
            <p>Vui lòng thử lại với mã QR đúng từ nhân viên.</p>
          </div>
        `;
      }
    })
    .catch(() => {
      document.getElementById('result').innerText = "⚠️ Không kiểm tra được mã QR. Vui lòng thử lại.";
    });
};

// Gửi dữ liệu khi nhấn "Tích điểm"
function submitData() {
  const phone = document.getElementById('phone').value.trim();
  const params = new URLSearchParams(window.location.search);
  const code = params.get("tich"); // vẫn lấy từ URL

  if (!phone || !code) {
    alert("Vui lòng nhập số điện thoại hoặc mã không hợp lệ.");
    return;
  }

  const url = `https://script.google.com/macros/s/AKfycbysKdONReVQTU3P7Y0jLuKckYqbXItdj53O6ETolZ6B0qoLO0OWmV7FQ0pO7s14AtQ4/exec?ghi=1&phone=${encodeURIComponent(phone)}&code=${encodeURIComponent(code)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status === "OK") {
        document.getElementById("result").innerText = "✅ Tích điểm thành công!";
      } else {
        document.getElementById("result").innerText = "⚠️ " + data.message;
      }
    })
    .catch(() => {
      document.getElementById("result").innerText = "❌ Lỗi kết nối. Thử lại sau.";
    });
}
