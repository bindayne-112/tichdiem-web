// ✅ script.js có hiệu ứng popup + gửi tin nhắn Zalo OA (tự động lấy token)

// --- ZALO CONFIG ---
const appId = "542633655828023051";
const appSecret = "8KVhSsLkVs557v0AX6Gd";
const refreshToken = "23WISSUeeb0CEnHwmwMdMWqp4NdUp-C9Ub4gIxE-s3eDJWnIjQUx8WamL0YnqPik0aLyIR20ppKAQpqVeOVEGsvZ0mNrZDXOLsnZC-ASgrHSQrahyhkNVNjCMXM_hPvW1aOeEhNGs6mkHsCOWAodNZ1QV3QkYv19DMb-DgptZWavP4fNbPI05Z45Q4Ekvzid90m1Nvx7s2XIBZLnciQ053zMO7URij8V84GIT9Qos5SWHZKmjeJXKteL4X7gylvpUXedKBw8bJGxUc5ba96I9ry1NrFEruKLHqWoSTEfqrTZG01epe2tBqbVG7N3ol4kT1mwMi7zxprP2Yvs_PpCArSNFMhErCaL1p4wR9BLuIHT7GPnz_d_C6uCBNsYvPex3tf0SwEszGSEH18WEVscWnB1iAHN";
let cachedToken = null;

async function getAccessToken() {
  if (cachedToken) return cachedToken;
  const response = await fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      app_id: appId,
      app_secret: appSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });
  const data = await response.json();
  if (data.access_token) {
    cachedToken = data.access_token;
    return cachedToken;
  } else {
    console.error("Lỗi lấy access token:", data);
    throw new Error("Không thể lấy access token");
  }
}

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
  const phone = document.getElementById('phone').value.trim();
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
    .then(async data => {
      if (data.status === "OK") {
        showPopup(`
          ✅ Tích điểm thành công!<br>
          <small>SĐT: ${phone}</small><br>
          ⭐ Tổng điểm: <b>${data.tongdiem}</b> điểm
        `);

        const sdt84 = "84" + phone.replace(/^0/, "");
        const noiDung = `🎉 Bạn vừa tích 10 điểm tại Bánh Mì Ông Kòi!\n⭐ Tổng điểm: ${data.tongdiem} điểm.`;
        try {
          const token = await getAccessToken();
          guiTinNhanZalo(token, sdt84, noiDung);
        } catch (err) {
          console.error("Không gửi được Zalo vì lỗi token:", err);
        }

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
