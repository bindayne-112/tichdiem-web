// ✅ script.js có hiệu ứng popup đẹp khi tích điểm thành công

// 1. Khi trang vừa mở, kiểm tra mã QR (nếu có trong URL)
window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const maTich = params.get("tich") || params.get("code");

  if (!maTich) return;

  fetch(`https://script.google.com/macros/s/AKfycbzgrAJB266q718FuMZG6Cnu5pMFsh6XbnlGD8VTt1pQ4pIfftGcCdyBkoKlxyAvRPxUzw/exec?check=1&code=${maTich}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "USED") {
        document.body.innerHTML = `
          <div style="padding: 2em; text-align: center; font-family: sans-serif;">
            <h2>⚠️ Mã tích điểm đã được sử dụng</h2>
            <p>Mỗi mã chỉ được dùng một lần. Liên hệ nhân viên nếu cần hỗ trợ.</p>
          </div>
        `;
      } else if (data.status === "INVALID") {
        document.body.innerHTML = `
          <div style="padding: 2em; text-align: center; font-family: sans-serif;">
            <h2>❌ Mã QR không hợp lệ</h2>
            <p>Vui lòng quét lại mã đúng hoặc liên hệ nhân viên.</p>
          </div>
        `;
      }
    })
    .catch(() => {
      document.getElementById('result').innerText = "⚠️ Không kiểm tra được mã QR. Vui lòng thử lại.";
    });
};

// 2. Gửi dữ liệu khi nhấn nút "Tích điểm"
function submitData() {
  const phone = "'" + document.getElementById('phone').value.trim();
  const params = new URLSearchParams(window.location.search);
  const maTich = params.get("tich") || params.get("code");

  if (!phone) {
    alert("Vui lòng nhập số điện thoại.");
    return;
  }
  if (!maTich) {
    alert("Không có mã tích điểm trong đường dẫn.");
    return;
  }

  const url = `https://script.google.com/macros/s/AKfycbzgrAJB266q718FuMZG6Cnu5pMFsh6XbnlGD8VTt1pQ4pIfftGcCdyBkoKlxyAvRPxUzw/exec?ghi=1&phone=${encodeURIComponent(phone)}&code=${encodeURIComponent(maTich)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status === "OK") {
        showPopup(`
          ✅ Tích điểm thành công!<br>
          <small>SĐT: ${phone.replace("'", "")}</small><br>
          ⭐ Tổng điểm: <b>${data.tongdiem}</b> điểm
        `);
        document.getElementById("result").innerText = "";
      } else {
        document.getElementById("result").innerText = "⚠️ " + data.message;
      }
    })
    .catch(() => {
      document.getElementById("result").innerText = "❌ Lỗi kết nối. Thử lại sau.";
    });
}

// 3. Hiển thị popup ở giữa màn hình
function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `<div class="popup-content">${message}</div>`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("hide");
    setTimeout(() => popup.remove(), 500);
  }, 3000);
}
