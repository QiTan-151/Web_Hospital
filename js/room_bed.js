// Biến toàn cục
let currentDepartmentId = null;
let currentRoomId = null;
let currentRoomName = '';
let currentBedConfig = null;

const DEPARTMENT_CONFIGS = {
    emergency: {
        roomSectionId: 'emergency-section',
        roomListId: 'emergency-rooms',
        bedSectionId: 'bed-section',
        bedListId: 'bed-list',
        bedHeaderId: 'bed-header'
    },
    intensive: {
        roomSectionId: 'intensive-section',
        roomListId: 'intensive-rooms',
        bedSectionId: 'intensive-bed-section',
        bedListId: 'intensive-bed-list',
        bedHeaderId: 'intensive-bed-header'
    },
    trauma: {
        roomSectionId: 'trauma-section',
        roomListId: 'trauma-rooms',
        bedSectionId: 'trauma-bed-section',
        bedListId: 'trauma-bed-list',
        bedHeaderId: 'trauma-bed-header'
    },
    neurology: {
        roomSectionId: 'neurology-section',
        roomListId: 'neurology-rooms',
        bedSectionId: 'neurology-bed-section',
        bedListId: 'neurology-bed-list',
        bedHeaderId: 'neurology-bed-header'
    },
    neurosurgery: {
        roomSectionId: 'neurosurgery-section',
        roomListId: 'neurosurgery-rooms',
        bedSectionId: 'neurosurgery-bed-section',
        bedListId: 'neurosurgery-bed-list',
        bedHeaderId: 'neurosurgery-bed-header'
    },
    respiratory: {
        roomSectionId: 'respiratory-section',
        roomListId: 'respiratory-rooms',
        bedSectionId: 'respiratory-bed-section',
        bedListId: 'respiratory-bed-list',
        bedHeaderId: 'respiratory-bed-header'
    }
};

function resolveDepartmentConfig(deptName) {
    const name = deptName.toLowerCase();
    if (name.includes('cấp cứu')) return DEPARTMENT_CONFIGS.emergency;
    if (name.includes('hồi sức')) return DEPARTMENT_CONFIGS.intensive;
    if (name.includes('chấn thương')) return DEPARTMENT_CONFIGS.trauma;
    if (name.includes('nội thần kinh')) return DEPARTMENT_CONFIGS.neurology;
    if (name.includes('ngoại thần kinh')) return DEPARTMENT_CONFIGS.neurosurgery;
    if (name.includes('hô hấp')) return DEPARTMENT_CONFIGS.respiratory;
    return DEPARTMENT_CONFIGS.emergency;
}

// ==================== ROOM & BED MANAGEMENT WITH API ====================

// Hàm khởi tạo - tải danh sách khoa khi trang load
document.addEventListener('DOMContentLoaded', async function() {
    initRoomBedLayout();
    await loadDepartments();
});

function initRoomBedLayout() {
    const departments = document.getElementById('departments');
    if (departments) {
        departments.classList.add('dept-grid');
    }

    document.querySelectorAll('[id$="-section"]:not(#departments)').forEach(section => {
        section.classList.add('room-bed-panel');
        if (section.querySelector('.room-bed-toolbar')) return;

        const back = section.querySelector('.back-button');
        const header = section.querySelector('.header');
        const info = section.querySelector('.info');
        if (!back) return;

        const toolbar = document.createElement('div');
        toolbar.className = 'room-bed-toolbar';
        section.insertBefore(toolbar, section.firstChild);

        const onclick = back.getAttribute('onclick');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'back-button';
        if (onclick) btn.setAttribute('onclick', onclick);
        btn.innerHTML = '<i class="bi bi-arrow-left"></i> Quay lại';

        toolbar.appendChild(btn);
        if (header) toolbar.appendChild(header);
        if (info) toolbar.appendChild(info);
        back.remove();
    });
}

// Tải danh sách khoa từ API
async function loadDepartments() {
    const departmentsContainer = document.getElementById("departments");
    try {
        const result = await HospitalAPI.getDepartments();
        if (result.error) {
            console.error('Lỗi khi tải khoa:', result.error);
            departmentsContainer.innerHTML = '<div class="box">Không thể tải danh sách khoa. Hãy khởi động backend.</div>';
            return;
        }
        if (!Array.isArray(result) || result.length === 0) {
            departmentsContainer.innerHTML = '<div class="box">Chưa có khoa nào trong hệ thống</div>';
            return;
        }
        displayDepartments(result);
    } catch (error) {
        console.error('Lỗi khi tải khoa:', error);
        departmentsContainer.innerHTML = '<div class="box">Lỗi kết nối server</div>';
    }
}

// Hiển thị danh sách khoa
function displayDepartments(departments) {
    const departmentsContainer = document.getElementById("departments");
    departmentsContainer.classList.add("dept-grid");
    departmentsContainer.innerHTML = "";

    departments.forEach(dept => {
        const deptDiv = document.createElement("div");
        deptDiv.classList.add("box", "dept-card");
        deptDiv.innerHTML = `
            <strong>${dept.name}</strong><br>
            <small>Bác sĩ: ${dept.doctor_count} | Y tá: ${dept.nurse_count}</small>
        `;
        
        const config = resolveDepartmentConfig(dept.name);
        deptDiv.onclick = () => showDepartmentRooms(dept.id, dept.name, config);
        
        departmentsContainer.appendChild(deptDiv);
    });
}

/* ============= Chức năng dùng chung ============= */

// Hàm chuyển đổi trạng thái của giường
async function cycleStatusGeneric(bedId, currentStatus) {
    const statuses = ["available", "occupied", "maintenance"];
    const statusTexts = ["Trống", "Đang sử dụng", "Cần vệ sinh"];
    
    let currentIndex = statuses.indexOf(currentStatus);
    let nextIndex = (currentIndex + 1) % statuses.length;
    let newStatus = statuses[nextIndex];
    
    let patientId = null;
    if (newStatus === 'occupied') {
        patientId = prompt('Nhập mã bệnh nhân:');
        if (!patientId) return; // Hủy nếu không nhập mã bệnh nhân
    }

    try {
        const result = await HospitalAPI.updateBedStatus(bedId, newStatus, patientId);
        if (result.error) {
            alert('Lỗi: ' + result.error);
            return;
        }
        alert('Cập nhật trạng thái thành công!');
        // Tải lại danh sách giường
        if (currentRoomId && currentBedConfig) {
            await showRoomBeds(currentRoomId, currentRoomName, currentBedConfig);
        }
    } catch (error) {
        alert('Lỗi khi cập nhật trạng thái: ' + error.message);
    }
}

// Hàm quay lại danh sách khoa
function goBack() {
    document.getElementById('departments').classList.remove('hidden');
    // Ẩn tất cả các section khoa
    document.getElementById('emergency-section').classList.add('hidden');
    document.getElementById('intensive-section').classList.add('hidden');
    document.getElementById('trauma-section').classList.add('hidden');
    document.getElementById('neurology-section').classList.add('hidden');
    document.getElementById('neurosurgery-section').classList.add('hidden');
    document.getElementById('respiratory-section').classList.add('hidden');
    // Ẩn các phần giường
    document.getElementById('bed-section').classList.add('hidden');
    document.getElementById('intensive-bed-section').classList.add('hidden');
    document.getElementById('trauma-bed-section').classList.add('hidden');
    document.getElementById('neurology-bed-section').classList.add('hidden');
    document.getElementById('neurosurgery-bed-section').classList.add('hidden');
    document.getElementById('respiratory-bed-section').classList.add('hidden');
    
    currentDepartmentId = null;
    currentRoomId = null;
    currentRoomName = '';
}

// Hiển thị giường của phòng (dùng chung)
async function showRoomBeds(roomId, roomName, bedConfig) {
    const bedSectionId = bedConfig.bedSectionId;
    const bedListId = bedConfig.bedListId;
    const bedHeaderId = bedConfig.bedHeaderId;
    try {
        const result = await HospitalAPI.getRoomBeds(roomId);
        if (result.error) {
            alert('Lỗi: ' + result.error);
            return;
        }

        currentRoomId = roomId;
        currentRoomName = roomName;
        currentBedConfig = bedConfig;
        
        // Ẩn section phòng và hiển thị section giường
        document.querySelectorAll('[id$="-section"]').forEach(section => {
            if (section.id !== 'departments') section.classList.add('hidden');
        });
        document.getElementById(bedSectionId).classList.remove('hidden');
        
        // Cập nhật header
        document.getElementById(bedHeaderId).textContent = roomName;
        
        // Hiển thị danh sách giường
        const bedsContainer = document.getElementById(bedListId);
        bedsContainer.innerHTML = "";

        if (result.length === 0) {
            bedsContainer.innerHTML = '<div class="no-beds">Chưa có giường nào</div>';
            return;
        }

        result.forEach(bed => {
            const bedDiv = document.createElement("div");
            bedDiv.classList.add("box", "bed-card", `bed-status-${bed.status}`);
            bedDiv.innerHTML = `
                <strong>${bed.bed_number}</strong><br>
                <small>Trạng thái: ${getStatusText(bed.status)}</small>
                ${bed.patient_id ? `<br><small>BN: ${bed.patient_id}</small>` : ''}
                <div class="bed-actions">
                    <button class="status-btn" onclick="cycleStatusGeneric(${bed.id}, '${bed.status}')">Đổi trạng thái</button>
                    <button class="delete-btn" onclick="deleteBed(${bed.id})">Xóa</button>
                </div>
            `;
            bedsContainer.appendChild(bedDiv);
        });
        
    } catch (error) {
        console.error('Lỗi khi tải giường:', error);
        alert('Lỗi khi tải danh sách giường');
    }
}

// Thêm giường mới (dùng chung)
async function addBed() {
    if (!currentRoomId) {
        alert('Vui lòng chọn phòng trước');
        return;
    }

    try {
        const result = await HospitalAPI.addBed(currentRoomId);
        if (result.error) {
            alert('Lỗi: ' + result.error);
            return;
        }

        alert('Thêm giường thành công!');
        if (currentBedConfig) {
            await showRoomBeds(currentRoomId, currentRoomName, currentBedConfig);
        }
        
    } catch (error) {
        alert('Lỗi khi thêm giường: ' + error.message);
    }
}

// Xóa giường (dùng chung)
async function deleteBed(bedId) {
    if (!confirm("Bạn có chắc chắn muốn xóa giường này không?")) {
        return;
    }

    try {
        const result = await HospitalAPI.deleteBed(bedId);
        if (result.error) {
            alert('Lỗi: ' + result.error);
            return;
        }

        alert('Xóa giường thành công!');
        if (currentBedConfig) {
            await showRoomBeds(currentRoomId, currentRoomName, currentBedConfig);
        }
        
    } catch (error) {
        alert('Lỗi khi xóa giường: ' + error.message);
    }
}

// Hiển thị phòng của khoa (dùng chung)
async function showDepartmentRooms(departmentId, departmentName, config) {
    try {
        const result = await HospitalAPI.getDepartmentRooms(departmentId);
        if (result.error) {
            alert('Lỗi: ' + result.error);
            return;
        }

        currentDepartmentId = departmentId;
        currentBedConfig = config;
        
        document.getElementById('departments').classList.add('hidden');
        document.getElementById(config.roomSectionId).classList.remove('hidden');
        
        const header = document.querySelector(`#${config.roomSectionId} .header`);
        const info = document.querySelector(`#${config.roomSectionId} .info`);
        
        header.textContent = departmentName;
        info.innerHTML = `Số phòng: ${result.length}`;
        
        const roomsContainer = document.getElementById(config.roomListId);
        roomsContainer.innerHTML = "";

        result.forEach(room => {
            const roomDiv = document.createElement("div");
            roomDiv.classList.add("box", "room-card");
            roomDiv.textContent = room.name;
            roomDiv.onclick = () => showRoomBeds(room.id, room.name, config);
            roomsContainer.appendChild(roomDiv);
        });
        
    } catch (error) {
        console.error('Lỗi khi tải phòng:', error);
        alert('Lỗi khi tải danh sách phòng');
    }
}

/* ============= Khoa cấp cứu ============= */
function showEmergencyRooms(departmentId) {
    showDepartmentRooms(departmentId, 'Khoa cấp cứu', DEPARTMENT_CONFIGS.emergency);
}

function showBeds(room) {
    // Hàm này giữ lại cho tương thích, nhưng sẽ không dùng nữa
    alert('Hàm này đã được thay thế. Vui lòng sử dụng hệ thống mới.');
}

function goBackToRooms() {
    document.getElementById('bed-section').classList.add('hidden');
    document.getElementById('emergency-section').classList.remove('hidden');
}

function removeLastBed() {
    alert('Chức năng này đã được thay thế bằng nút xóa trên từng giường');
}

/* ============= Khoa hồi sức ============= */
function showIntensiveCareRooms(departmentId) {
    showDepartmentRooms(departmentId, 'Khoa hồi sức', DEPARTMENT_CONFIGS.intensive);
}

function goBackFromIntensive() {
    goBack();
}

function showIntensiveBeds(room) {
    // Hàm này giữ lại cho tương thích
    alert('Hàm này đã được thay thế. Vui lòng sử dụng hệ thống mới.');
}

function goBackToIntensiveRooms() {
    document.getElementById('intensive-bed-section').classList.add('hidden');
    document.getElementById('intensive-section').classList.remove('hidden');
}

function addBedIntensive() {
    addBed();
}

function removeLastBedIntensive() {
    alert('Chức năng này đã được thay thế bằng nút xóa trên từng giường');
}

/* ============= Khoa chấn thương chỉnh hình ============= */
function showTraumaRooms(departmentId) {
    showDepartmentRooms(departmentId, 'Khoa chấn thương chỉnh hình', DEPARTMENT_CONFIGS.trauma);
}

function goBackFromTrauma() {
    goBack();
}

function showTraumaBeds(room) {
    // Hàm này giữ lại cho tương thích
    alert('Hàm này đã được thay thế. Vui lòng sử dụng hệ thống mới.');
}

function goBackToTraumaRooms() {
    document.getElementById('trauma-bed-section').classList.add('hidden');
    document.getElementById('trauma-section').classList.remove('hidden');
}

function addBedTrauma() {
    addBed();
}

function removeLastBedTrauma() {
    alert('Chức năng này đã được thay thế bằng nút xóa trên từng giường');
}

/* ============= Khoa nội thần kinh ============= */
function showNeurologyRooms(departmentId) {
    showDepartmentRooms(departmentId, 'Khoa nội thần kinh', DEPARTMENT_CONFIGS.neurology);
}

function goBackFromNeurology() {
    goBack();
}

function showNeurologyBeds(room) {
    // Hàm này giữ lại cho tương thích
    alert('Hàm này đã được thay thế. Vui lòng sử dụng hệ thống mới.');
}

function goBackToNeurologyRooms() {
    document.getElementById('neurology-bed-section').classList.add('hidden');
    document.getElementById('neurology-section').classList.remove('hidden');
}

function addBedNeurology() {
    addBed();
}

function removeLastBedNeurology() {
    alert('Chức năng này đã được thay thế bằng nút xóa trên từng giường');
}

/* ============= Khoa ngoại thần kinh ============= */
function showNeurosurgeryRooms(departmentId) {
    showDepartmentRooms(departmentId, 'Khoa ngoại thần kinh', DEPARTMENT_CONFIGS.neurosurgery);
}

function goBackFromNeurosurgery() {
    goBack();
}

function showNeurosurgeryBeds(room) {
    // Hàm này giữ lại cho tương thích
    alert('Hàm này đã được thay thế. Vui lòng sử dụng hệ thống mới.');
}

function goBackToNeurosurgeryRooms() {
    document.getElementById('neurosurgery-bed-section').classList.add('hidden');
    document.getElementById('neurosurgery-section').classList.remove('hidden');
}

function addBedNeurosurgery() {
    addBed();
}

function removeLastBedNeurosurgery() {
    alert('Chức năng này đã được thay thế bằng nút xóa trên từng giường');
}

/* ============= Khoa hô hấp ============= */
function showRespiratoryRooms(departmentId) {
    showDepartmentRooms(departmentId, 'Khoa hô hấp', DEPARTMENT_CONFIGS.respiratory);
}

function goBackFromRespiratory() {
    goBack();
}

function showRespiratoryBeds(room) {
    // Hàm này giữ lại cho tương thích
    alert('Hàm này đã được thay thế. Vui lòng sử dụng hệ thống mới.');
}

function goBackToRespiratoryRooms() {
    document.getElementById('respiratory-bed-section').classList.add('hidden');
    document.getElementById('respiratory-section').classList.remove('hidden');
}

function addBedRespiratory() {
    addBed();
}

function removeLastBedRespiratory() {
    alert('Chức năng này đã được thay thế bằng nút xóa trên từng giường');
}

// ==================== UTILITY FUNCTIONS ====================

// Chuyển đổi trạng thái sang tiếng Việt
function getStatusText(status) {
    const statusMap = {
        'available': 'Trống',
        'occupied': 'Đang sử dụng',
        'maintenance': 'Cần vệ sinh'
    };
    return statusMap[status] || status;
}

/** Styles in room_bed.css */