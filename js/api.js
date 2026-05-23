// frontend/api.js
const API_BASE = 'http://localhost:8080/api';

class HospitalAPI {
    // TRONG FILE api.js - THÊM VÀO CLASS HospitalAPI
 static async login(email, password) {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            return { error: 'Không thể kết nối đến server' };
        }
    }

    static async register(email, password) {
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            return { error: 'Không thể kết nối đến server' };
        }
    }
static async deletePatient(patientId) {
    try {
        const response = await fetch(`${API_BASE}/patients/${patientId}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể xóa bệnh nhân' };
    }
}
    // Thêm vào class HospitalAPI trong api.js
static async searchMedicines(searchParams) {
    try {
        const queryString = new URLSearchParams(searchParams).toString();
        const response = await fetch(`${API_BASE}/medicines/search?${queryString}`);
        return await response.json();
    } catch (error) {
        return { error: 'Không thể tìm kiếm thuốc' };
    }
}

// TRONG FILE api.js - THAY THẾ HOÀN TOÀN
static async deleteMedicine(medicineId) {
    try {
        const response = await fetch(`${API_BASE}/medicines/${medicineId}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể xóa thuốc' };
    }
}

static async updateMedicine(medicineId, medicineData) {
    try {
        const response = await fetch(`${API_BASE}/medicines/${medicineId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicineData)
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể cập nhật thuốc' };
    }
}
    // Thêm vào class HospitalAPI trong api.js
static async searchEmployees(searchParams) {
    try {
        const queryString = new URLSearchParams(searchParams).toString();
        const response = await fetch(`${API_BASE}/employees/search?${queryString}`);
        return await response.json();
    } catch (error) {
        return { error: 'Không thể tìm kiếm nhân viên' };
    }
}

// Sau này khi có API delete và update
static async deleteEmployee(employeeId) {
    try {
        const response = await fetch(`${API_BASE}/employees/${employeeId}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể xóa nhân viên' };
    }
}

static async updateEmployee(employeeId, employeeData) {
    try {
        const response = await fetch(`${API_BASE}/employees/${employeeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể cập nhật nhân viên' };
    }
}
    // Authentication
    static async login(email, password) {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            return { error: 'Không thể kết nối đến server' };
        }
    }

    static async register(email, password) {
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            return { error: 'Không thể kết nối đến server' };
        }
    }

    // Patients
    static async getPatients() {
        try {
            const response = await fetch(`${API_BASE}/patients`);
            return await response.json();
        } catch (error) {
            return { error: 'Không thể tải danh sách bệnh nhân' };
        }
    }

    static async addPatient(patientData) {
        try {
            const response = await fetch(`${API_BASE}/patients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patientData)
            });
            const data = await response.json();
            if (!response.ok) {
                return { error: data.error || data.message || 'Không thể thêm bệnh nhân' };
            }
            return data;
        } catch (error) {
            return { error: 'Không thể thêm bệnh nhân: ' + error.message };
        }
    }

    static async searchPatients(searchParams) {
        try {
            const queryString = new URLSearchParams(searchParams).toString();
            const response = await fetch(`${API_BASE}/patients/search?${queryString}`);
            return await response.json();
        } catch (error) {
            return { error: 'Không thể tìm kiếm bệnh nhân' };
        }
    }

    // Employees
    static async getEmployees() {
        try {
            const response = await fetch(`${API_BASE}/employees`);
            return await response.json();
        } catch (error) {
            return { error: 'Không thể tải danh sách nhân viên' };
        }
    }

    static async addEmployee(employeeData) {
        try {
            const response = await fetch(`${API_BASE}/employees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData)
            });
            const data = await response.json();
            if (!response.ok) {
                return { error: data.error || 'Không thể thêm nhân viên' };
            }
            return data;
        } catch (error) {
            return { error: 'Không thể thêm nhân viên' };
        }
    }

    // Medicines
    static async getMedicines() {
        try {
            const response = await fetch(`${API_BASE}/medicines`);
            return await response.json();
        } catch (error) {
            return { error: 'Không thể tải danh sách thuốc' };
        }
    }

    static async addMedicine(medicineData) {
        try {
            const response = await fetch(`${API_BASE}/medicines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(medicineData)
            });
            const data = await response.json();
            if (!response.ok) {
                return { error: data.error || data.message || 'Không thể thêm thuốc' };
            }
            return data;
        } catch (error) {
            return { error: 'Không thể thêm thuốc: ' + error.message };
        }
    }
    // ==================== ROOM & BED API ====================

static async getDepartments() {
    try {
        const response = await fetch(`${API_BASE}/departments`);
        return await response.json();
    } catch (error) {
        return { error: 'Không thể lấy danh sách khoa' };
    }
}

static async getDepartmentRooms(departmentId) {
    try {
        const response = await fetch(`${API_BASE}/departments/${departmentId}/rooms`);
        return await response.json();
    } catch (error) {
        return { error: 'Không thể lấy danh sách phòng' };
    }
}

static async getRoomBeds(roomId) {
    try {
        const response = await fetch(`${API_BASE}/rooms/${roomId}/beds`);
        return await response.json();
    } catch (error) {
        return { error: 'Không thể lấy danh sách giường' };
    }
}

static async addBed(roomId) {
    try {
        const response = await fetch(`${API_BASE}/rooms/${roomId}/beds`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể thêm giường' };
    }
}

static async deleteBed(bedId) {
    try {
        const response = await fetch(`${API_BASE}/beds/${bedId}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể xóa giường' };
    }
}

static async updateBedStatus(bedId, status, patientId = null) {
    try {
        const response = await fetch(`${API_BASE}/beds/${bedId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, patient_id: patientId })
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể cập nhật trạng thái giường' };
    }
}

// ==================== SERVICES (Dịch vụ khám) ====================
static async getServices() {
    try {
        const response = await fetch(`${API_BASE}/services`);
        return await response.json();
    } catch (error) {
        return { error: 'Không thể tải danh sách dịch vụ' };
    }
}

static async addService(serviceData) {
    try {
        const response = await fetch(`${API_BASE}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        });
        const data = await response.json();
        if (!response.ok) {
            return { error: data.error || data.message || 'Không thể thêm dịch vụ' };
        }
        return data;
    } catch (error) {
        return { error: 'Không thể thêm dịch vụ: ' + error.message };
    }
}

static async updateService(serviceId, serviceData) {
    try {
        const response = await fetch(`${API_BASE}/services/${serviceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể cập nhật dịch vụ' };
    }
}

static async deleteService(serviceId) {
    try {
        const response = await fetch(`${API_BASE}/services/${serviceId}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể xóa dịch vụ' };
    }
}

static async searchServices(searchParams) {
    try {
        const queryString = new URLSearchParams(searchParams).toString();
        const response = await fetch(`${API_BASE}/services/search?${queryString}`);
        return await response.json();
    } catch (error) {
        return { error: 'Không thể tìm kiếm dịch vụ' };
    }
}

// ==================== PATIENT IDS ====================
static async getNextPatientId() {
    try {
        const response = await fetch(`${API_BASE}/patients/next-id`);
        return await response.json();
    } catch (error) {
        return { error: 'Không thể lấy mã bệnh nhân tiếp theo' };
    }
}

// ==================== VISIT HISTORY ====================
static async addVisitHistory(visitData) {
    try {
        const response = await fetch(`${API_BASE}/visit-history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitData)
        });
        const data = await response.json();
        if (!response.ok) {
            return { error: data.error || data.message || 'Không thể lưu lịch sử khám' };
        }
        return data;
    } catch (error) {
        return { error: 'Không thể lưu lịch sử khám: ' + error.message };
    }
}

static async getVisitHistory(patientId) {
    try {
        const queryString = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
        const response = await fetch(`${API_BASE}/visit-history${queryString}`);
        return await response.json();
    } catch (error) {
        return { error: 'Không thể tải lịch sử khám' };
    }
}

static async deleteVisit(visitId) {
    try {
        const response = await fetch(`${API_BASE}/visit-history/${visitId}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        return { error: 'Không thể xóa lịch sử khám' };
    }
}
}