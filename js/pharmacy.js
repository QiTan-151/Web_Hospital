// Thêm vào đầu file pharmacy.js
console.log('pharmacy.js loaded');

// Thêm vào hàm showDetails để debug
function showDetails(medicineId) {
    console.log('Showing details for medicine ID:', medicineId);
    
    const medicine = medicines.find(med => med.id === medicineId);
    if (!medicine) {
        console.log('Medicine not found');
        return;
    }

    console.log('Medicine data:', medicine);
    
    document.getElementById("modal-title").textContent = medicine.name;
    document.getElementById("modal-ingredient").textContent = medicine.ingredient || "Chưa có thông tin";
    document.getElementById("modal-use").textContent = medicine.use_case || "Chưa có thông tin";
    document.getElementById("modal-dosage").textContent = medicine.dosage || "Chưa có thông tin";
    document.getElementById("modal-side-effects").textContent = medicine.side_effects || "Chưa có thông tin";
    
    document.getElementById("medicine-modal").style.display = "block";
    console.log('Modal should be visible now');
}
// Biến toàn cục
let medicines = [];

// ==================== MEDICINE MANAGEMENT WITH API ====================

// Hàm khởi tạo - tải danh sách thuốc khi trang load
document.addEventListener('DOMContentLoaded', async function() {
    await loadMedicines();
});

// Tải danh sách thuốc từ API
async function loadMedicines() {
    try {
        const result = await HospitalAPI.getMedicines();
        if (result.error) {
            alert(result.error);
            return;
        }
        medicines = result;
        displayMedicines();
    } catch (error) {
        console.error('Lỗi khi tải danh sách thuốc:', error);
        alert('Không thể tải danh sách thuốc');
    }
}

// Hiển thị danh sách thuốc
function displayMedicines() {
    let table = document.getElementById("medicine-list");
    table.innerHTML = "";

    if (medicines.length === 0) {
        table.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px;">Chưa có thuốc nào trong kho</td></tr>';
        return;
    }

    medicines.forEach(med => {
        let row = `<tr>
            <td onclick="showDetails(${med.id})" style="cursor: pointer; color: #007bff; font-weight: bold;">
                ${med.name}
            </td>
            <td>${med.quantity}</td>
            <td>
                <button class="edit-btn" onclick="editMedicine(${med.id})">Sửa</button>
                <button class="delete-btn" onclick="deleteMedicine(${med.id})">Xóa</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });
}

// Thêm thuốc mới
async function addMedicine(event) {
    event.preventDefault();
    
    const medicineData = {
        name: document.getElementById("name").value.trim(),
        quantity: parseInt(document.getElementById("quantity").value),
        ingredient: document.getElementById("ingredient").value.trim(),
        use_case: document.getElementById("use_case").value.trim(),
        dosage: document.getElementById("dosage").value.trim(),
        side_effects: document.getElementById("side_effects").value.trim()
    };

    // Validate dữ liệu
    if (!medicineData.name || isNaN(medicineData.quantity) || medicineData.quantity < 0) {
        alert("Vui lòng nhập tên thuốc và số lượng hợp lệ!");
        return;
    }

    try {
        const result = await HospitalAPI.addMedicine(medicineData);
        if (result.error) {
            alert('Lỗi: ' + result.error);
            return;
        }

        alert('Thêm thuốc thành công!');
        await loadMedicines(); // Tải lại danh sách
        document.getElementById("medicine-form").reset();
    } catch (error) {
        alert('Lỗi khi thêm thuốc: ' + error.message);
    }
}

// Tìm kiếm thuốc
async function searchMedicine() {
    const filter = document.getElementById("search").value.toLowerCase().trim();
    
    if (filter === "") {
        // Nếu ô tìm kiếm trống, hiển thị tất cả
        displayMedicines();
        return;
    }

    try {
        // Tìm kiếm ở frontend trước (nhanh hơn)
        const filtered = medicines.filter(med => 
            med.name.toLowerCase().includes(filter) ||
            (med.ingredient && med.ingredient.toLowerCase().includes(filter)) ||
            (med.use_case && med.use_case.toLowerCase().includes(filter))
        );
        
        displaySearchResults(filtered);
        
        // Nếu không tìm thấy, thử tìm kiếm với API
        if (filtered.length === 0) {
            // Có thể thêm API search sau này
            console.log('Không tìm thấy thuốc với từ khóa:', filter);
        }
    } catch (error) {
        console.error('Lỗi khi tìm kiếm thuốc:', error);
    }
}

// Hiển thị kết quả tìm kiếm
function displaySearchResults(filteredMedicines) {
    let table = document.getElementById("medicine-list");
    table.innerHTML = "";

    if (filteredMedicines.length === 0) {
        table.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px;">Không tìm thấy thuốc nào</td></tr>';
        return;
    }

    filteredMedicines.forEach(med => {
        let row = `<tr>
            <td onclick="showDetails(${med.id})" style="cursor: pointer; color: #007bff; font-weight: bold;">
                ${med.name}
            </td>
            <td>${med.quantity}</td>
            <td>
                <button class="edit-btn" onclick="editMedicine(${med.id})">Sửa</button>
                <button class="delete-btn" onclick="deleteMedicine(${med.id})">Xóa</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });
}

// Hiển thị chi tiết thuốc
function showDetails(medicineId) {
    const medicine = medicines.find(med => med.id === medicineId);
    if (!medicine) return;

    document.getElementById("modal-title").textContent = medicine.name;
    document.getElementById("modal-ingredient").textContent = medicine.ingredient || "Chưa có thông tin";
    document.getElementById("modal-use").textContent = medicine.use_case || "Chưa có thông tin";
    document.getElementById("modal-dosage").textContent = medicine.dosage || "Chưa có thông tin";
    document.getElementById("modal-side-effects").textContent = medicine.side_effects || "Chưa có thông tin";
    
    document.getElementById("medicine-modal").style.display = "block";
}

// Đóng modal
function closeModal() {
    document.getElementById("medicine-modal").style.display = "none";
}

// Xóa thuốc VĨNH VIỄN
async function deleteMedicine(medicineId) {
    if (!confirm("Bạn có chắc chắn muốn xóa thuốc này không? Dữ liệu sẽ bị mất vĩnh viễn!")) {
        return;
    }

    try {
        const result = await HospitalAPI.deleteMedicine(medicineId);
        if (result.error) {
            alert('Lỗi: ' + result.error);
            return;
        }

        alert('Đã xóa thuốc thành công!');
        await loadMedicines(); // Tải lại danh sách từ server
        
    } catch (error) {
        alert('Lỗi khi xóa thuốc: ' + error.message);
    }
}

// Cập nhật thuốc VĨNH VIỄN
async function updateMedicine(event, medicineId) {
    event.preventDefault();
    
    const medicineData = {
        name: document.getElementById("name").value.trim(),
        quantity: parseInt(document.getElementById("quantity").value),
        ingredient: document.getElementById("ingredient").value.trim(),
        use_case: document.getElementById("use_case").value.trim(),
        dosage: document.getElementById("dosage").value.trim(),
        side_effects: document.getElementById("side_effects").value.trim()
    };

    try {
        const result = await HospitalAPI.updateMedicine(medicineId, medicineData);
        if (result.error) {
            alert('Lỗi: ' + result.error);
            return;
        }

        alert('Cập nhật thuốc thành công!');
        await loadMedicines(); // Tải lại danh sách từ server
        document.getElementById("medicine-form").reset();

        // Reset nút về "Thêm thuốc"
        const formButton = document.querySelector('#medicine-form button');
        formButton.textContent = 'Thêm thuốc';
        formButton.onclick = addMedicine;
        
    } catch (error) {
        alert('Lỗi khi cập nhật thuốc: ' + error.message);
    }
}

// Sửa thông tin thuốc
function editMedicine(medicineId) {
    const medicine = medicines.find(med => med.id === medicineId);
    if (!medicine) return;

    // Điền thông tin vào form
    document.getElementById("name").value = medicine.name;
    document.getElementById("quantity").value = medicine.quantity;
    document.getElementById("ingredient").value = medicine.ingredient || "";
    document.getElementById("use_case").value = medicine.use_case || "";
    document.getElementById("dosage").value = medicine.dosage || "";
    document.getElementById("side_effects").value = medicine.side_effects || "";

    // Thay đổi nút thành "Cập nhật"
    const formButton = document.querySelector('#medicine-form button');
    formButton.textContent = 'Cập nhật thuốc';
    formButton.onclick = function(event) { updateMedicine(event, medicineId); };

    // Cuộn đến form
    document.getElementById("medicine-form").scrollIntoView({ behavior: 'smooth' });
    
    alert(`Đang chỉnh sửa thông tin: ${medicine.name}`);
}

// Cập nhật thuốc


// ==================== EVENT LISTENERS ====================

// Tìm kiếm khi nhập
document.getElementById("search").addEventListener("input", searchMedicine);

// Enter để tìm kiếm
document.getElementById("search").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchMedicine();
    }
});

// Đóng modal khi click outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById("medicine-modal");
    if (event.target === modal) {
        closeModal();
    }
});

// ==================== THÊM CSS CHO ACTIONS ====================

// Thêm CSS động cho các nút action
const style = document.createElement('style');
style.textContent = `
    .edit-btn, .delete-btn {
        padding: 5px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        margin: 2px;
    }
    
    .edit-btn {
        background-color: #007bff;
        color: white;
    }
    
    .edit-btn:hover {
        background-color: #0056b3;
    }
    
    .delete-btn {
        background-color: #dc3545;
        color: white;
    }
    
    .delete-btn:hover {
        background-color: #c82333;
    }
    
    .medicine-row:hover {
        background-color: #f8f9fa;
    }
    
    #medicine-modal {
        background: rgba(0,0,0,0.5);
    }
    
    .form-container {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 20px;
    }
    
    #medicine-form input {
        margin-bottom: 10px;
    }
`;
document.head.appendChild(style);