// ✅ script.js có hiệu ứng popup + gửi tin nhắn Zalo OA

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

        // ✅ Gửi tin nhắn Zalo OA
        const accessTokenZalo = "08VISVWRY2G4XDHw_1QDBWMCqNdXLDvINBtcKzrHncTRdiLLn6kLKdUGhLZqMV08V83U5EnPumLMelqRzZdr5L_WfIln8fahIR660-rztJzWZ-uew5o_7qwtbqlnJ916Ge-y6Fq8xJ96bFm5_bhs07gAx13zKhqaRgs73vHJsneLaDXDyctPIb-EvaloNkjoI83pPh5zya8XvFn3eNQY4Zg3e176JPOZGT6wFRu8YIWMse8qY1cU42FceJo60P885isN6umAhqGdvQ1hY3wcLHZshLx_3f5rP-UMGUG8o5P5mSPpo2Rx9Mw_fXpKNgHBM8697iTcf2Xz_eyc_oRNC0Rsp3-11k4BVf_93jfpwmnolz40rNh04o-0t0MYTVmr8hxn9R1EuNHNjz52vrZW44ESs4OtELVAgcbc_WEE8m"; // ← Thay bằng token thật
        const sdt84 = "84" + phone.replace(/^'0/, "");
        const noiDung = `🎉 Bạn vừa tích 10 điểm tại Bánh Mì Ông Kòi!\n⭐ Tổng điểm: ${data.tongdiem} điểm.`;

        guiTinNhanZalo(accessTokenZalo, sdt84, noiDung);

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

// 4. Gửi tin nhắn Zalo OA
function guiTinNhanZalo(oaAccessToken, phone, message) {
  const url = "https://openapi.zalo.me/v3.0/oa/message/cs";
  const body = {
    recipient: { user_id_by_phone: phone },
    message: {
      text: message
    }
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": oaAccessToken
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(data => {
      console.log("📨 Gửi Zalo thành công:", data);
    })
    .catch(error => {
      console.error("❌ Lỗi gửi Zalo:", error);
    });
}
