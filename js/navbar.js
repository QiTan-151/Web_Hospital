// navbar.js - Đã tích hợp hệ thống đăng nhập mới

document.body.style.overflow = "auto";

// ==================== AUTHENTICATION CHECK ====================
function checkAuthentication() {
    const authToken = localStorage.getItem("authToken");
    if (!authToken && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Kiểm tra authentication khi trang load
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuthentication() && !window.location.href.includes('login.html')) {
        return;
    }
    
    // Cập nhật giao diện người dùng
    updateUserInterface();
    
    // Các code hiện tại của navbar.js...
    initNavbar();
});

// ==================== NAVBAR SCROLL EFFECT ====================
function initNavbar() {
    window.addEventListener("scroll", function(){
        var header = document.querySelector(".navbar-duoi");
        var bigMenu = document.getElementById("bigMenu");

        if (window.scrollY > 80) {
            header.classList.add("sticky");
            if (bigMenu) bigMenu.style.zIndex = "30";
        } else {
            header.classList.remove("sticky");
            if (bigMenu) bigMenu.style.zIndex = "10";
        }
    });

    // Burger menu functionality
    const burgerIcon = document.getElementById("burgerIcon");
    if (burgerIcon) {
        burgerIcon.addEventListener("click", function() {
            console.log("OK")
            const bigMenu = document.getElementById("bigMenu");
            if (bigMenu) {
                bigMenu.classList.toggle("hidden-overlay");
            }
            document.querySelectorAll(".sub-menu").forEach(el => {
                el.classList.toggle("hidden-overlay");
            });
        });
    }

    // Search functionality
    initSearch();
}

// ==================== USER INTERFACE MANAGEMENT ====================
function updateUserInterface() {
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const userInfo = document.getElementById("user-info");
    const displayEmail = document.getElementById("display-email");
    const userIcon = document.getElementById("User");

    if (userEmail && userInfo && displayEmail) {
        // Hiển thị thông tin user đã đăng nhập
        displayEmail.textContent = userName || userEmail;
        userInfo.style.display = "block";
        
        // Ẩn icon đăng nhập
        if (userIcon) {
            userIcon.style.display = "none";
        }
    } else {
        // Hiển thị icon đăng nhập nếu chưa đăng nhập
        if (userIcon) {
            userIcon.style.display = "block";
        }
        if (userInfo) {
            userInfo.style.display = "none";
        }
    }
}

// ==================== LOGIN MODAL FUNCTIONS ====================
function CongDangnhap(){
    // Chuyển đến trang login thay vì modal
    window.location.href = "login.html";
}

function DongDangnhap(){
    let cdn = document.getElementById("CongDangnhap")
    if (cdn) cdn.classList.remove("mo")
}

function switchToSignup() {
    // Chuyển đến trang login (đăng ký được xử lý trong auth.js)
    window.location.href = "login.html";
}

function switchToLogin() {
    // Chuyển đến trang login
    window.location.href = "login.html";
}

// ==================== LOGOUT FUNCTION ====================
function Logout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        
        // Hiển thị thông báo
        alert("Bạn đã đăng xuất! Hẹn gặp lại!");
        
        // Chuyển hướng về trang login
        window.location.href = "login.html";
    }
}

// ==================== SEARCH FUNCTIONALITY ====================
function initSearch() {
    const searchInputs = [
        document.querySelector(".search-bar-input"),
        document.querySelector(".search-bar-big-input-menu")
    ];

    searchInputs.forEach(input => {
        if (input) {
            input.addEventListener("keydown", function(event) {
                if (event.key === "Enter" && this.value.trim() !== "") {
                    let query = this.value.trim();
                    window.localStorage.setItem("search-value", query);
                    
                    // Có thể thêm chức năng tìm kiếm toàn hệ thống ở đây
                    console.log(`Tìm kiếm: ${query}`);
                    alert(`Tìm kiếm: ${query}`);
                    
                    // window.location.href = "../html/trangTimKiemBaiViet.html";
                }
            });
        }
    });
}

// ==================== LEGACY FUNCTIONS (giữ lại cho tương thích) ====================
// Các hàm này được giữ lại để tránh lỗi, nhưng sẽ sử dụng hệ thống mới

function TaiKhoan(user_name, nrd_name, userData) {
    // Hàm này không còn cần thiết với hệ thống mới
    console.log("TaiKhoan function called - using new auth system");
}

async function Login(){
    // Chuyển hướng đến trang login
    window.location.href = "login.html";
}

async function CreateLogin(){
    // Chuyển hướng đến trang login
    window.location.href = "login.html";
}

function failLogin(message){
    // Hiển thị thông báo lỗi (dùng cho modal cũ)
    var error = document.createElement("div")
    error.textContent = message;
    error.style.color = "red";
    error.style.display = "block";
    error.style.backgroundColor = "#ffe6e6";
    error.style.border = "1px solid red";
    error.style.zIndex = 999;
    error.style.position = "absolute";
    error.style.width = "400px";
    error.style.height = "60px";
    error.style.lineHeight = "60px";
    error.style.marginLeft = "25%";
    error.style.marginTop = "-350px";
    error.style.textAlign = "center";
    error.style.borderRadius = "5px";
    error.style.fontWeight = "bold";
    
    const loginModal = document.getElementById("CongDangnhap");
    if (loginModal) {
        loginModal.appendChild(error);
        setTimeout(() => {
            if (loginModal.contains(error)) {
                loginModal.removeChild(error);
            }
        }, 3000);
    }
}

// ==================== ADMIN MENU MANAGEMENT ====================
function checkAdminAccess() {
    const userRole = localStorage.getItem("userRole");
    const quantriElement = document.getElementById("Quantri");
    
    if (userRole === 'admin' && quantriElement) {
        quantriElement.classList.remove("dong");
    } else if (quantriElement) {
        quantriElement.classList.add("dong");
    }
}

// Kiểm tra quyền admin khi load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
});

// ==================== EXPORT FUNCTIONS FOR GLOBAL USE ====================
window.CongDangnhap = CongDangnhap;
window.DongDangnhap = DongDangnhap;
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.Login = Login;
window.CreateLogin = CreateLogin;
window.Logout = Logout;
window.TaiKhoan = TaiKhoan;