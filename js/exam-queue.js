/** Hàng chờ khám — đăng ký từ Quản lý bệnh nhân, hiển thị tại Khám chữa bệnh */
const EXAM_QUEUE_KEY = 'hospital_exam_queue';

function loadExamQueue() {
    try {
        const raw = localStorage.getItem(EXAM_QUEUE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

function saveExamQueue(queue) {
    localStorage.setItem(EXAM_QUEUE_KEY, JSON.stringify(queue));
}

function normalizeQueuePatient(patient) {
    return {
        id: patient.id,
        patient_id: patient.patient_id || patient.patientId || '',
        name: patient.name || '',
        age: patient.age ?? null,
        cccd: patient.cccd || '',
        phone: patient.phone || '',
        gender: patient.gender || '',
        medical_history: patient.medical_history || patient.medicalHistory || '',
        queuedAt: patient.queuedAt || new Date().toISOString()
    };
}

function isPatientInExamQueue(patient) {
    if (!patient) return false;
    const queue = loadExamQueue();
    const dbId = patient.id != null ? String(patient.id) : null;
    const code = (patient.patient_id || patient.patientId || '').toLowerCase();
    return queue.some((q) => {
        if (dbId && String(q.id) === dbId) return true;
        if (code && (q.patient_id || '').toLowerCase() === code) return true;
        return false;
    });
}

function addPatientToExamQueue(patient) {
    if (!patient || patient.id == null) {
        return { ok: false, error: 'Thiếu thông tin bệnh nhân' };
    }
    const queue = loadExamQueue();
    if (isPatientInExamQueue(patient)) {
        return { ok: false, error: 'Bệnh nhân đã có trong lịch khám' };
    }
    queue.push(normalizeQueuePatient(patient));
    saveExamQueue(queue);
    return { ok: true, message: `Đã thêm ${patient.name} vào lịch khám` };
}

function removePatientFromExamQueue(patientId) {
    const queue = loadExamQueue().filter((q) => String(q.id) !== String(patientId));
    saveExamQueue(queue);
}
