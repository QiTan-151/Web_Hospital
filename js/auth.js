// js/auth.js

const API_BASE = 'http://localhost:8080/api';

// Hàm đăng nhập
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const messageDiv = document.getElementById("message");

  // Reset message
  messageDiv.classList.add('d-none');
  messageDiv.textContent = '';

  if (!email || !password) {
    showMessage("Vui lòng nhập đầy đủ email và mật khẩu!", "danger");
    return;
  }

  try {
    console.log('🔄 Đang đăng nhập...', { email, password });
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log('📨 Response:', data);

    if (!response.ok) {
      throw new Error(data.error || "Đăng nhập thất bại!");
    }

    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem("authToken", data.token || 'authenticated');
    localStorage.setItem("userEmail", data.user?.email || email);
    localStorage.setItem("userRole", data.user?.role || 'user');
    localStorage.setItem("userName", data.user?.name || email.split('@')[0]);

    showMessage("✅ Đăng nhập thành công! Đang chuyển hướng...", "success");
    
    // Chuyển sang trang chính sau 1 giây
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);

  } catch (error) {
    console.error('❌ Lỗi đăng nhập:', error);
    showMessage(error.message, "danger");
  }
}

// Hàm đăng ký
async function register() {
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const confirmPassword = document.getElementById("registerConfirmPassword").value.trim();
  const messageDiv = document.getElementById("message");

  messageDiv.classList.add('d-none');
  messageDiv.textContent = '';

  if (!email || !password) {
    showMessage("Vui lòng nhập đầy đủ email và mật khẩu!", "danger");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Mật khẩu xác nhận không khớp!", "danger");
    return;
  }

  try {
    console.log('🔄 Đang đăng ký...', { email, password });
    
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log('📨 Response:', data);

    if (!response.ok) {
      throw new Error(data.error || "Đăng ký thất bại!");
    }

    showMessage("✅ Đăng ký thành công! Vui lòng đăng nhập.", "success");
    
    // Chuyển về form đăng nhập
    setTimeout(() => {
      switchToLogin();
    }, 2000);

  } catch (error) {
    console.error('❌ Lỗi đăng ký:', error);
    showMessage(error.message, "danger");
  }
}

// Chuyển sang form đăng ký
function switchToRegister() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.innerHTML = `
    <div class="mb-3">
      <label class="form-label fw-semibold">📧 Email:</label>
      <input type="email" id="registerEmail" class="form-control form-control-lg" 
             placeholder="Nhập email" required>
    </div>

    <div class="mb-3">
      <label class="form-label fw-semibold">🔒 Mật khẩu:</label>
      <input type="password" id="registerPassword" class="form-control form-control-lg" 
             placeholder="Nhập mật khẩu" required>
    </div>

    <div class="mb-4">
      <label class="form-label fw-semibold">🔒 Xác nhận mật khẩu:</label>
      <input type="password" id="registerConfirmPassword" class="form-control form-control-lg" 
             placeholder="Nhập lại mật khẩu" required>
    </div>

    <button type="button" class="btn btn-success w-100 py-2 fs-5" onclick="register()">
      <i class="bi bi-person-plus"></i> Đăng ký
    </button>

    <div class="text-center mt-3">
      <p class="text-muted">Đã có tài khoản? 
        <a href="#" onclick="switchToLogin()" class="text-success fw-semibold text-decoration-none">Đăng nhập ngay</a>
      </p>
    </div>
  `;
}

// Chuyển sang form đăng nhập
function switchToLogin() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.innerHTML = `
    <div class="mb-3">
      <label class="form-label fw-semibold">📧 Email:</label>
      <input type="email" id="loginEmail" class="form-control form-control-lg" 
             placeholder="Nhập email" required>
    </div>

    <div class="mb-4">
      <label class="form-label fw-semibold">🔒 Mật khẩu:</label>
      <input type="password" id="loginPassword" class="form-control form-control-lg" 
             placeholder="Nhập mật khẩu" required>
    </div>

    <button type="button" class="btn btn-login text-white w-100 py-2 fs-5" onclick="login()">
      <i class="bi bi-box-arrow-in-right"></i> Đăng nhập
    </button>

    <div class="text-center mt-3">
      <p class="text-muted">Chưa có tài khoản? 
        <a href="#" onclick="switchToRegister()" class="text-success fw-semibold text-decoration-none">Đăng ký ngay</a>
      </p>
    </div>
  `;
}

// Hiển thị thông báo
function showMessage(msg, type = 'danger') {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = msg;
  messageDiv.className = `alert alert-${type} mt-3`;
  messageDiv.classList.remove('d-none');
}

// Event listener cho form
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      login();
    });
  }

  // Nếu người dùng đã đăng nhập → tự động chuyển đến index.html
  if (localStorage.getItem("authToken")) {
    window.location.href = "index.html";
  }
});