function submitData() {
  const phone = document.getElementById('phone').value;
  if (!phone.trim()) {
    alert('Vui lòng nhập số điện thoại');
    return;
  }
  fetch("https://script.google.com/macros/s/AKfycbzgrAJB266q718FuMZG6Cnu5pMFsh6XbnlGD8VTt1pQ4pIfftGcCdyBkoKlxyAvRPxUzw/exec", {
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
