// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5Gb-3gstR14H7-9noyO18YcYC1vdHXtU",
  authDomain: "tichdiemsdt-a964e.firebaseapp.com",
  projectId: "tichdiemsdt-a964e",
  storageBucket: "tichdiemsdt-a964e.firebasestorage.app",
  messagingSenderId: "59997069598",
  appId: "1:59997069598:web:a2a9c7fc7a3e4f9554e90f",
  measurementId: "G-6LBZR8895J"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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
