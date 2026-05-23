// medical_examination.js — Quy trình khám, lưu chẩn đoán, in phiếu (hồ sơ khám tại đây)

let currentStep = 1;
let currentQueue = 1;
let currentPatient = null;
let waitingPatients = [];
let examinationRecords = {};
let lastCompletedRecord = null;
let selectedPatientId = null;

document.addEventListener('DOMContentLoaded', async function () {
    loadExamRecords();
    await loadWaitingPatients();
    updateQueueDisplay();
    updateWaitingList();
    bindFormPreviewListeners();
    updatePrintPreview();
});

function loadExamRecords() {
    examinationRecords = loadAllExamRecords();
}

function saveExamRecords() {
    saveAllExamRecords(examinationRecords);
}

function patientKey(patient) {
    return String(patient?.id ?? patient?.patient_id ?? patient?.cccd ?? '');
}

function bindFormPreviewListeners() {
    document.querySelectorAll('#steps [data-field]').forEach((el) => {
        el.addEventListener('input', () => {
            if (currentPatient) {
                updatePrintPreview();
            }
        });
    });
}

async function loadWaitingPatients() {
    waitingPatients = loadExamQueue();
    if (waitingPatients.length === 0) {
        const list = document.getElementById('waiting-list');
        if (list) {
            list.innerHTML =
                '<li class="waiting-empty">Chưa có lịch khám. Đăng ký tại <strong>Quản lý bệnh nhân</strong> → Đăng ký lịch khám (BN cũ).</li>';
        }
        const countEl = document.getElementById('waiting-count');
        if (countEl) countEl.innerText = '0';
        return;
    }
    updateWaitingList();
    if (waitingPatients.length > 0 && !currentPatient) {
        selectPatient(waitingPatients[0], 0);
    }
}

function updateQueueDisplay() {
    const el = document.getElementById('currentQueue');
    if (el) el.innerText = currentQueue;
}

function increaseQueue() {
    if (waitingPatients.length === 0) {
        alert('Không còn bệnh nhân nào trong danh sách chờ');
        return;
    }
    if (currentQueue < waitingPatients.length) {
        selectPatient(waitingPatients[currentQueue], currentQueue);
    } else {
        alert('Đã ở cuối danh sách chờ');
    }
}

function decreaseQueue() {
    if (currentQueue > 1) {
        selectPatient(waitingPatients[currentQueue - 2], currentQueue - 2);
    }
}

function loadNextPatient() {
    if (waitingPatients.length > 0) {
        selectPatient(waitingPatients[0], 0);
    }
}

function displayPatientInfo(patient) {
    const codeEl = document.getElementById('patient-code');
    if (codeEl) {
        codeEl.textContent = patient.patient_id || patient.patientId || '—';
    }
    document.getElementById('patient-name').textContent = patient.name || 'Chưa có thông tin';
    document.getElementById('patient-age').textContent = patient.age ?? 'Chưa có thông tin';
    document.getElementById('patient-issue').textContent =
        patient.issue || patient.reason || 'Đang chờ khám';
    document.getElementById('patient-history').textContent =
        patient.medical_history || patient.medicalHistory || 'Không có tiền sử';
}

function getFormFields() {
    const fields = {};
    document.querySelectorAll('#steps [data-field]').forEach((el) => {
        fields[el.dataset.field] = el.value.trim();
    });
    return fields;
}

function setFormFields(data) {
    document.querySelectorAll('#steps [data-field]').forEach((el) => {
        el.value = (data && data[el.dataset.field]) || '';
    });
}

function selectPatient(patient, index) {
    if (!patient) return;

    currentPatient = patient;
    selectedPatientId = patientKey(patient);
    currentQueue = index + 1;
    updateQueueDisplay();

    displayPatientInfo(patient);

    setFormFields({});

    const priorVisits = findExamVisitsForPatient(patient);
    if (priorVisits.length > 0) {
        const note = document.getElementById('exam-revisit-note');
        if (note) {
            note.textContent = `Bệnh nhân đã khám ${priorVisits.length} lần — form đã reset cho lượt khám mới.`;
            note.style.display = 'block';
        }
    } else {
        const note = document.getElementById('exam-revisit-note');
        if (note) note.style.display = 'none';
    }

    highlightWaitingPatient(selectedPatientId);
    showStep(1);
    updatePrintPreview();
}

function highlightWaitingPatient(id) {
    document.querySelectorAll('#waiting-list li').forEach((li) => {
        li.classList.toggle('waiting-active', li.dataset.patientId === id);
    });
}

function showStep(step) {
    for (let i = 1; i <= 7; i++) {
        const el = document.getElementById(`step-${i}`);
        if (el) el.classList.add('hidden');
    }
    const active = document.getElementById(`step-${step}`);
    if (active) active.classList.remove('hidden');
    currentStep = step;
    updateButtonStates();
}

function nextStep() {
    if (currentStep < 7) {
        showStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function validateStep() {
    return true;
}

async function finishCurrentPatient() {
    if (!currentPatient) {
        alert('Vui lòng chọn bệnh nhân trong danh sách chờ (bấm vào tên)');
        return;
    }

    const fields = getFormFields();
    const record = {
        fields,
        patient: {
            id: currentPatient.id,
            patient_id: currentPatient.patient_id || currentPatient.patientId,
            name: currentPatient.name,
            age: currentPatient.age,
            cccd: currentPatient.cccd,
            medical_history: currentPatient.medical_history || currentPatient.medicalHistory
        },
        completedAt: new Date().toISOString()
    };

    appendExamVisit(currentPatient, record);
    examinationRecords = loadAllExamRecords();
    lastCompletedRecord = record;

    const code = currentPatient.patient_id || currentPatient.patientId;
    if (code && typeof HospitalAPI !== 'undefined') {
        const visitDate = new Date().toISOString().slice(0, 10);
        const diagnosis = fields.final_diagnosis || fields.preliminary_diagnosis || 'Khám chữa bệnh';
        await HospitalAPI.addVisitHistory({
            patient_id: code,
            patient_name: currentPatient.name,
            visit_date: visitDate,
            diagnosis,
            treatment: fields.treatment || fields.prescription || 'Theo phiếu khám'
        });
    }

    updatePrintPreview();

    alert(`Đã hoàn tất khám và lưu chẩn đoán cho: ${currentPatient.name}. Bạn có thể bấm In để in phiếu.`);

    waitingPatients = waitingPatients.filter((p) => patientKey(p) !== selectedPatientId);
    removePatientFromExamQueue(currentPatient?.id ?? selectedPatientId);
    saveExamQueue(waitingPatients.map(normalizeQueuePatient));
    updateWaitingList();

    currentPatient = null;
    selectedPatientId = null;

    if (waitingPatients.length > 0) {
        setTimeout(() => selectPatient(waitingPatients[0], 0), 800);
    } else {
        setFormFields({});
        showStep(1);
        document.getElementById('patient-name').textContent = '—';
        document.getElementById('patient-age').textContent = '—';
        document.getElementById('patient-issue').textContent = '—';
        document.getElementById('patient-history').textContent = '—';
        const codeEl = document.getElementById('patient-code');
        if (codeEl) codeEl.textContent = '—';
    }
}

function getPrintData() {
    if (currentPatient) {
        const fields = getFormFields();
        const visits = findExamVisitsForPatient(currentPatient);
        const lastSaved = visits[0];
        const merged = lastSaved?.fields ? { ...lastSaved.fields, ...fields } : fields;
        return {
            patient: currentPatient,
            fields: merged,
            completedAt: lastSaved?.completedAt || null
        };
    }
    if (lastCompletedRecord) {
        return {
            patient: lastCompletedRecord.patient,
            fields: lastCompletedRecord.fields,
            completedAt: lastCompletedRecord.completedAt
        };
    }
    return null;
}

function escapeHtml(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

function updatePrintPreview() {
    const box = document.getElementById('print-preview');
    if (!box) return;

    const data = getPrintData();
    if (!data || !data.patient) {
        box.innerHTML =
            '<p class="print-preview-empty">Chọn bệnh nhân trong danh sách chờ, nhập chẩn đoán và bấm <strong>Hoàn tất</strong> để cập nhật nội dung in.</p>';
        return;
    }

    const f = data.fields || {};
    const p = data.patient;
    const dateStr = data.completedAt
        ? new Date(data.completedAt).toLocaleString('vi-VN')
        : new Date().toLocaleString('vi-VN');

    box.innerHTML = `
        <div class="print-preview-inner">
            <p><strong>Bệnh viện 199</strong> — Phiếu khám bệnh</p>
            <hr>
            <p><strong>Họ tên:</strong> ${escapeHtml(p.name)}</p>
            <p><strong>Tuổi:</strong> ${escapeHtml(String(p.age ?? ''))}</p>
            <p><strong>CCCD:</strong> ${escapeHtml(p.cccd || '')}</p>
            <p><strong>Thời gian:</strong> ${escapeHtml(dateStr)}</p>
            <p><strong>Triệu chứng:</strong> ${escapeHtml(f.symptoms) || '—'}</p>
            <p><strong>Chẩn đoán sơ bộ:</strong> ${escapeHtml(f.preliminary_diagnosis) || '—'}</p>
            <p><strong>Chỉ định xét nghiệm:</strong> ${escapeHtml(f.lab_order) || '—'}</p>
            <p><strong>Kết quả XN:</strong> ${escapeHtml(f.lab_result) || '—'}</p>
            <p><strong>Chẩn đoán cuối:</strong> ${escapeHtml(f.final_diagnosis) || '—'}</p>
            <p><strong>Điều trị:</strong> ${escapeHtml(f.treatment) || '—'}</p>
            <p><strong>Đơn thuốc:</strong> ${escapeHtml(f.prescription) || '—'}</p>
            <p><strong>Ghi chú xuất viện:</strong> ${escapeHtml(f.discharge_note) || '—'}</p>
        </div>
    `;
}

function printDiagnosis() {
    const data = getPrintData();
    if (!data || !data.patient) {
        alert('Chưa có dữ liệu để in. Hãy chọn bệnh nhân và nhập chẩn đoán trước.');
        return;
    }
    printExamVisit(data);
}

function generatePrintContent(data) {
    const p = data.patient;
    const f = data.fields || {};
    const dateStr = data.completedAt
        ? new Date(data.completedAt).toLocaleDateString('vi-VN')
        : new Date().toLocaleDateString('vi-VN');

    return `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <title>Kết quả khám — ${escapeHtml(p.name)}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 24px; color: #222; }
                h2, h3 { color: #007b3e; }
                .section { margin-bottom: 16px; }
                .label { font-weight: bold; }
                hr { border: none; border-top: 2px solid #007b3e; margin: 16px 0; }
                .signature { margin-top: 48px; text-align: right; }
            </style>
        </head>
        <body>
            <h2>BỆNH VIỆN 199</h2>
            <h3>PHIẾU KẾT QUẢ KHÁM BỆNH</h3>
            <hr>
            <div class="section">
                <p><span class="label">Họ tên:</span> ${escapeHtml(p.name)}</p>
                <p><span class="label">Tuổi:</span> ${escapeHtml(String(p.age ?? ''))}</p>
                <p><span class="label">CCCD:</span> ${escapeHtml(p.cccd || '')}</p>
                <p><span class="label">Ngày khám:</span> ${escapeHtml(dateStr)}</p>
            </div>
            <div class="section">
                <p><span class="label">Triệu chứng lâm sàng:</span><br>${escapeHtml(f.symptoms) || '—'}</p>
                <p><span class="label">Chẩn đoán sơ bộ:</span><br>${escapeHtml(f.preliminary_diagnosis) || '—'}</p>
            </div>
            <div class="section">
                <p><span class="label">Chỉ định xét nghiệm:</span><br>${escapeHtml(f.lab_order) || '—'}</p>
                <p><span class="label">Kết quả xét nghiệm:</span><br>${escapeHtml(f.lab_result) || '—'}</p>
                <p><span class="label">Chẩn đoán cuối cùng:</span><br>${escapeHtml(f.final_diagnosis) || '—'}</p>
            </div>
            <div class="section">
                <p><span class="label">Phương pháp điều trị:</span><br>${escapeHtml(f.treatment) || '—'}</p>
                <p><span class="label">Đơn thuốc:</span><br>${escapeHtml(f.prescription) || '—'}</p>
                <p><span class="label">Số giường / theo dõi:</span><br>${escapeHtml(f.bed_number) || '—'} — ${escapeHtml(f.daily_notes) || '—'}</p>
                <p><span class="label">Ghi chú xuất viện:</span><br>${escapeHtml(f.discharge_note) || '—'}</p>
            </div>
            <div class="signature">
                <p>Bác sĩ khám bệnh</p>
                <br><br>
                <p>_________________________</p>
            </div>
        </body>
        </html>
    `;
}

function updateButtonStates() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = currentStep === 1;
    if (nextBtn) nextBtn.disabled = currentStep === 7;
}

function updateWaitingList() {
    const listContainer = document.getElementById('waiting-list');
    const countContainer = document.getElementById('waiting-count');
    if (!listContainer) return;

    if (countContainer) countContainer.innerText = waitingPatients.length;

    listContainer.innerHTML = '';

    waitingPatients.forEach((patient, index) => {
        const listItem = document.createElement('li');
        const key = patientKey(patient);
        listItem.dataset.patientId = key;
        listItem.innerHTML = `
            <strong>${index + 1}. ${escapeHtml(patient.name)}</strong>
            <br>
            <small>Tuổi: ${escapeHtml(String(patient.age ?? ''))} | CCCD: ${escapeHtml(patient.cccd || '')}</small>
            ${patient.medical_history ? `<br><small>Tiền sử: ${escapeHtml(patient.medical_history)}</small>` : ''}
            ${hasExamVisits(patient) ? `<br><small class="exam-done-badge">Đã khám ${findExamVisitsForPatient(patient).length} lần</small>` : ''}
        `;
        listItem.addEventListener('click', () => selectPatient(patient, index));
        listContainer.appendChild(listItem);
    });

    if (waitingPatients.length === 0) {
        listContainer.innerHTML =
            '<li class="waiting-empty">Không có bệnh nhân nào đang chờ</li>';
    }

    if (selectedPatientId) {
        highlightWaitingPatient(selectedPatientId);
    }
}
