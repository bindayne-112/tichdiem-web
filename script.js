function submitData() {
  const phone = document.getElementById('phone').value;
  if (!phone.trim()) {
    alert('Vui lòng nhập số điện thoại');
    return;
  }
  fetch("https://script.google.com/macros/s/AKfycbzVi0cF3B9fVWRCnsImD_clPLBZF0Yky-BlgSoSXTus7P2sBwupl-iQGqZlqFxAySKnww/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "phone=" + encodeURIComponent(phone)
  })
  .then(() => {
    document.getElementById('result').innerText = "✅ Tích điểm thành công!";
  })
  .catch(() => {
    document.getElementById('result').innerText = "❌ Không thể kết nối. Thử lại sau.";
  });
}
