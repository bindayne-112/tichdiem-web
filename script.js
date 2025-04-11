// Kiểm tra mã QR khi vừa mở trang
window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const maTich = params.get("tich");

  if (!maTich) return;

  fetch("https://script.google.com/macros/s/AKfycbzgrAJB266q718FuMZG6Cnu5pMFsh6XbnlGD8VTt1pQ4pIfftGcCdyBkoKlxyAvRPxUzw/exec?check=1&code=" + maTich)
    .then(res => res.json())
    .then(data => {
      if (data.status === "USED") {
        document.body.innerHTML = `
          <div style="padding: 2em; text-align: center; font-family: sans-serif;">
            <h2>⚠️ Mã tích điểm đã được sử dụng</h2>
            <p>Vui lòng không sử dụng lại mã. Liên hệ nhân viên nếu bạn cần hỗ trợ.</p>
          </div>
        `;
      }
    });
};

// Gửi dữ liệu khi nhấn "Tích điểm"
function submitData() {
  const phone = document.getElementById('phone').value.trim();
  const params = new URLSearchParams(window.location.search);
  const maTich = params.get("tich");

  if (!phone) {
    alert('Vui lòng nhập số điện thoại');
    return;
  }

  if (!maTich) {
    alert('Liên kết không hợp lệ (thiếu mã tích điểm)');
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbzgrAJB266q718FuMZG6Cnu5pMFsh6XbnlGD8VTt1pQ4pIfftGcCdyBkoKlxyAvRPxUzw/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "phone=" + encodeURIComponent(phone) + "&code=" + encodeURIComponent(maTich)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "OK") {
      document.getElementById('result').innerText = "✅ Tích điểm thành công!";
    } else {
      document.getElementById('result').innerText = "⚠️ " + data.message;
    }
  })
  .catch(() => {
    document.getElementById('result').innerText = "❌ Lỗi kết nối. Thử lại sau.";
  });
}
