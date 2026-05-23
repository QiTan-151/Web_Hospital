// services.js - Quản lý dịch vụ khám bệnh (Spring Boot API)

let services = [];
let currentEditingId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    setupEventListeners();
});

async function loadServices() {
    try {
        const result = await HospitalAPI.getServices();
        if (result && result.error) {
            showAlert(result.error, 'danger');
            services = [];
        } else {
            services = Array.isArray(result) ? result : [];
        }
        updateServiceList();
    } catch (error) {
        showAlert('Không thể tải danh sách dịch vụ', 'danger');
        services = [];
        updateServiceList();
    }
}

async function addService() {
    const serviceData = getServiceFormData();
    if (!validateServiceData(serviceData)) return;

    const result = await HospitalAPI.addService(serviceData);
    if (result.error) {
        showAlert(result.error, 'danger');
        return;
    }
    showAlert('Thêm dịch vụ thành công!', 'success');
    clearServiceForm();
    await loadServices();
}

async function updateService() {
    if (!currentEditingId) {
        showAlert('Không có dịch vụ nào đang được chỉnh sửa!', 'warning');
        return;
    }
    const serviceData = getServiceFormData();
    if (!validateServiceData(serviceData)) return;

    const result = await HospitalAPI.updateService(currentEditingId, serviceData);
    if (result.error) {
        showAlert(result.error, 'danger');
        return;
    }
    showAlert('Cập nhật dịch vụ thành công!', 'success');
    clearServiceForm();
    await loadServices();
}

function editService(serviceId) {
    const service = services.find(s => s.id == serviceId);
    if (!service) {
        showAlert('Không tìm thấy dịch vụ!', 'warning');
        return;
    }
    document.getElementById('serviceName').value = service.name || '';
    document.getElementById('serviceDesc').value = service.description || '';
    document.getElementById('servicePrice').value = service.price || '';
    currentEditingId = serviceId;
    const formButton = document.querySelector('.service-management-box .btn-app-primary, .service-management-box .btn-success');
    if (formButton) {
        formButton.textContent = 'Cập nhật';
        formButton.onclick = updateService;
    }
    document.getElementById('serviceName').scrollIntoView({ behavior: 'smooth' });
}

async function deleteService(serviceId) {
    if (!confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) return;
    const result = await HospitalAPI.deleteService(serviceId);
    if (result.error) {
        showAlert(result.error, 'danger');
        return;
    }
    showAlert('Đã xóa dịch vụ thành công!', 'success');
    await loadServices();
}

function searchServices() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    const searchValue = searchInput.value.toLowerCase().trim();
    if (searchValue === '') {
        updateServiceList();
        return;
    }
    const filtered = services.filter(s =>
        (s.name || '').toLowerCase().includes(searchValue) ||
        (s.description || '').toLowerCase().includes(searchValue) ||
        String(s.price || '').includes(searchValue)
    );
    displaySearchResults(filtered);
}

function getServiceFormData() {
    return {
        name: document.getElementById('serviceName').value.trim(),
        description: document.getElementById('serviceDesc').value.trim(),
        price: parseInt(document.getElementById('servicePrice').value.trim(), 10)
    };
}

function validateServiceData(data) {
    if (!data.name) {
        showAlert('Vui lòng nhập tên dịch vụ!', 'warning');
        return false;
    }
    if (!data.description) {
        showAlert('Vui lòng nhập mô tả dịch vụ!', 'warning');
        return false;
    }
    if (!data.price || data.price <= 0) {
        showAlert('Vui lòng nhập giá tiền hợp lệ!', 'warning');
        return false;
    }
    return true;
}

function displaySearchResults(results) {
    const serviceList = document.getElementById('serviceList');
    if (!serviceList) return;
    serviceList.innerHTML = '';
    if (results.length === 0) {
        serviceList.innerHTML = emptyRow('Không tìm thấy dịch vụ nào phù hợp');
        return;
    }
    results.forEach(s => serviceList.appendChild(createServiceRow(s)));
}

function updateServiceList() {
    const serviceList = document.getElementById('serviceList');
    if (!serviceList) return;
    serviceList.innerHTML = '';
    if (services.length === 0) {
        serviceList.innerHTML = emptyRow('Chưa có dịch vụ nào');
        return;
    }
    services.forEach(s => serviceList.appendChild(createServiceRow(s)));
}

function emptyRow(msg) {
    return `<tr><td colspan="4" class="text-center py-4 text-muted">${msg}</td></tr>`;
}

function createServiceRow(service) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="fw-semibold">${escapeHtml(service.name)}</td>
        <td>${escapeHtml(service.description)}</td>
        <td class="text-success fw-bold">${formatCurrency(service.price)}</td>
        <td>
            <button class="btn btn-app-warning btn-sm me-1" onclick="editService(${service.id})">
                <i class="bi bi-pencil"></i> Sửa
            </button>
            <button class="btn btn-app-danger btn-sm" onclick="deleteService(${service.id})">
                <i class="bi bi-trash"></i> Xóa
            </button>
        </td>`;
    return row;
}

function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text || '';
    return d.innerHTML;
}

function resetFormButton() {
    currentEditingId = null;
    const btn = document.querySelector('.service-management-box .btn-app-primary, .service-management-box .btn-success');
    if (btn) {
        btn.textContent = 'Thêm';
        btn.onclick = addService;
    }
}

function clearServiceForm() {
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceDesc').value = '';
    document.getElementById('servicePrice').value = '';
    resetFormButton();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

function showAlert(message, type) {
    document.querySelectorAll('.custom-service-alert').forEach(a => a.remove());
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-service-alert alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top:150px;right:20px;z-index:9999;min-width:300px;';
    alertDiv.innerHTML = `<span>${message}</span><button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 4000);
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', searchServices);
}

window.addService = addService;
window.editService = editService;
window.deleteService = deleteService;
window.updateService = updateService;
