// Biến toàn cục
let employees = [];

/** Ảnh mặc định (SVG cục bộ — không gọi via.placeholder.com) */
const DEFAULT_EMPLOYEE_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='160' viewBox='0 0 120 160'%3E%3Crect fill='%23e8f5ee' width='120' height='160' rx='8'/%3E%3Ctext x='60' y='82' text-anchor='middle' fill='%23007b3e' font-family='sans-serif' font-size='13'%3ENh%C3%A2n vi%C3%AAn%3C/text%3E%3C/svg%3E";

function resolveEmployeeImageUrl(employee) {
    const raw = (employee.image_url || employee.imageUrl || '').trim();
    if (!raw || /placeholder\.com/i.test(raw)) {
        return DEFAULT_EMPLOYEE_IMG;
    }
    if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) {
        return raw;
    }
    return DEFAULT_EMPLOYEE_IMG;
}

function handleEmployeeImgError(img) {
    img.onerror = null;
    img.src = DEFAULT_EMPLOYEE_IMG;
}

// ==================== EMPLOYEE MANAGEMENT WITH API ====================

// Hàm khởi tạo - tải danh sách nhân viên khi trang load
document.addEventListener('DOMContentLoaded', async function() {
    await loadEmployees();
});

// Tải danh sách nhân viên từ API - ĐÃ SỬA: KHÔNG ALERT KHI LOAD TRANG
async function loadEmployees() {
    try {
        const result = await HospitalAPI.getEmployees();
        
        // Kiểm tra kết quả - CHỈ LOG, KHÔNG ALERT
        if (result && result.error) {
            console.error('API Error:', result.error); // ⚠️ CHỈ LOG RA CONSOLE
            employees = []; // Set mảng rỗng
            updateEmployeeList();
            return;
        }
        
        employees = result || [];
        updateEmployeeList();
        
    } catch (error) {
        console.error('Network error when loading employees:', error); // ⚠️ CHỈ LOG
        employees = []; // Set mảng rỗng
        updateEmployeeList();
        // ⚠️ KHÔNG HIỆN ALERT Ở ĐÂY
    }
}

// Hiển thị/ẩn form thêm nhân viên
function toggleForm() {
    var form = document.getElementById("employeeForm");
    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}

// Thêm nhân viên mới
async function addEmployee() {
    const employeeData = {
        name: document.getElementById("employee-name").value.trim(),
        cccd: document.getElementById("employee-cccd").value.trim(),
        position: document.getElementById("employee-position").value.trim(),
        department: document.getElementById("employee-department").value.trim(),
        image_url: document.getElementById("employee-image").value.trim() || ""
    };

    // Validate dữ liệu
    if (!employeeData.name || !employeeData.cccd || !employeeData.position || !employeeData.department) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    try {
        const result = await HospitalAPI.addEmployee(employeeData);
        if (result.error) {
            alert('Lỗi: ' + result.error); // ⚠️ CHỈ ALERT KHI NGƯỜI DÙNG THAO TÁC
            return;
        }

        alert('Thêm nhân viên thành công!');
        await loadEmployees(); // Tải lại danh sách
        clearEmployeeForm();
        toggleForm(); // Ẩn form
    } catch (error) {
        alert('Lỗi khi thêm nhân viên: ' + error.message);
    }
}

// Tìm kiếm nhân viên
async function searchEmployee() {
    const searchValue = document.querySelector(".search-box").value.toLowerCase().trim();
    
    if (searchValue === "") {
        // Nếu ô tìm kiếm trống, hiển thị tất cả
        updateEmployeeList();
        return;
    }

    try {
        const result = await HospitalAPI.searchEmployees({ query: searchValue });
        if (result.error) {
            alert(result.error);
            return;
        }
        
        // Hiển thị kết quả tìm kiếm
        displaySearchResults(result);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm nhân viên:', error);
        // Nếu API lỗi, tìm kiếm ở frontend
        searchEmployeeFrontend(searchValue);
    }
}

// Tìm kiếm nhân viên ở frontend (fallback)
function searchEmployeeFrontend(searchValue) {
    const filteredEmployees = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchValue) || 
        emp.cccd.includes(searchValue) ||
        emp.position.toLowerCase().includes(searchValue) ||
        emp.department.toLowerCase().includes(searchValue)
    );
    
    displaySearchResults(filteredEmployees);
}

// Hiển thị kết quả tìm kiếm
function displaySearchResults(results) {
    const employeeList = document.getElementById("employeeList");
    employeeList.innerHTML = "";

    if (results.length === 0) {
        employeeList.innerHTML = '<div class="no-results">Không tìm thấy nhân viên nào</div>';
        return;
    }

    results.forEach(emp => {
        const employeeDiv = createEmployeeCard(emp);
        employeeList.appendChild(employeeDiv);
    });
}

// Cập nhật danh sách nhân viên đầy đủ
function updateEmployeeList() {
    const employeeList = document.getElementById("employeeList");
    employeeList.innerHTML = "";

    if (employees.length === 0) {
        employeeList.innerHTML = '<div class="no-results">Chưa có nhân viên nào</div>';
        return;
    }

    employees.forEach(emp => {
        const employeeDiv = createEmployeeCard(emp);
        employeeList.appendChild(employeeDiv);
    });
}

// Tạo thẻ nhân viên
function createEmployeeCard(employee) {
    const employeeDiv = document.createElement("div");
    employeeDiv.classList.add("employee", "employee-card");
    employeeDiv.setAttribute("data-name", employee.name.toLowerCase());
    employeeDiv.setAttribute("data-cccd", employee.cccd);

    const photo = resolveEmployeeImageUrl(employee);
    employeeDiv.innerHTML = `
        <img src="${photo}" alt="Ảnh nhân viên" onerror="handleEmployeeImgError(this)">
        <div class="employee-name">${employee.name}</div>
        <div class="employee-position">${employee.position}</div>
        <div class="employee-position">CCCD: ${employee.cccd}</div>
        <div class="employee-position">Khoa: ${employee.department}</div>
        <div class="employee-actions">
            <button class="edit-btn" onclick="editEmployee(${employee.id})">Sửa</button>
            <button class="delete-btn" onclick="deleteEmployee(${employee.id})">Xóa</button>
        </div>
    `;

    return employeeDiv;
}

// Sửa nhân viên (chức năng cơ bản)
function editEmployee(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    // Điền thông tin vào form
    document.getElementById("employee-name").value = employee.name;
    document.getElementById("employee-cccd").value = employee.cccd;
    document.getElementById("employee-position").value = employee.position;
    document.getElementById("employee-department").value = employee.department;
    document.getElementById("employee-image").value = employee.image_url || employee.imageUrl || "";

    // Hiển thị form
    toggleForm();

    // Thay đổi nút thành "Cập nhật"
    const formButton = document.querySelector('.employee-form button');
    formButton.textContent = 'Cập nhật nhân viên';
    formButton.onclick = function() { updateEmployee(employeeId); };

    alert(`Đang chỉnh sửa thông tin: ${employee.name}`);
}

// Xóa nhân viên VĨNH VIỄN
async function deleteEmployee(employeeId) {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân viên này không? Dữ liệu sẽ bị mất vĩnh viễn!")) {
        return;
    }

    try {
        const result = await HospitalAPI.deleteEmployee(employeeId);
        if (result.error) {
            alert('Lỗi: ' + result.error);
            return;
        }

        alert('Đã xóa nhân viên thành công!');
        await loadEmployees(); // Tải lại danh sách từ server
        
    } catch (error) {
        alert('Lỗi khi xóa nhân viên: ' + error.message);
    }
}

// Cập nhật nhân viên VĨNH VIỄN
async function updateEmployee(employeeId) {
    const employeeData = {
        name: document.getElementById("employee-name").value.trim(),
        cccd: document.getElementById("employee-cccd").value.trim(),
        position: document.getElementById("employee-position").value.trim(),
        department: document.getElementById("employee-department").value.trim(),
        image_url: document.getElementById("employee-image").value.trim() || ""
    };

    try {
        const result = await HospitalAPI.updateEmployee(employeeId, employeeData);
        if (result.error) {
            alert('Lỗi: ' + result.error);
            return;
        }

        alert('Cập nhật nhân viên thành công!');
        await loadEmployees(); // Tải lại danh sách từ server
        clearEmployeeForm();
        toggleForm();

        // Reset nút về "Thêm nhân viên"
        const formButton = document.querySelector('.employee-form button');
        formButton.textContent = 'Lưu nhân sự';
        formButton.onclick = addEmployee;
        
    } catch (error) {
        alert('Lỗi khi cập nhật nhân viên: ' + error.message);
    }
}

// Xóa form nhân viên
function clearEmployeeForm() {
    document.getElementById("employee-name").value = "";
    document.getElementById("employee-cccd").value = "";
    document.getElementById("employee-position").value = "";
    document.getElementById("employee-department").value = "";
    document.getElementById("employee-image").value = "";
}

// ==================== EVENT LISTENERS ====================

// Tìm kiếm khi nhập
document.querySelector(".search-box").addEventListener("input", searchEmployee);

// Enter để tìm kiếm
document.querySelector(".search-box").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchEmployee();
    }
});

// ==================== THÊM CSS CHO ACTIONS ====================

// Thêm CSS động cho các nút action
const style = document.createElement('style');
style.textContent = `
    .employee-actions {
        margin-top: 10px;
        display: flex;
        gap: 5px;
        justify-content: center;
    }
    
    .edit-btn, .delete-btn {
        padding: 5px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
    }
    
    .edit-btn {
        background: linear-gradient(135deg, #f0ad4e, #ec971f);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 6px 12px;
    }
    
    .delete-btn {
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 6px 12px;
    }
    
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 20px;
        color: #666;
        font-style: italic;
    }
`;
document.head.appendChild(style);