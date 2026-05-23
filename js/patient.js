let patients = [];
let lastSearchResults = [];
let lastAppointmentResults = [];

function patientCode(p) {
    return p.patient_id || p.patientId || '';
}

function medicalHistoryText(p) {
    return p.medical_history || p.medicalHistory || '';
}

document.addEventListener('DOMContentLoaded', async () => {
    showContent('patient-registration');
    bindSearchEnterKey();
    bindAppointmentEnterKey();
    await refreshPreviewPatientId();
    await loadPatients();
});

function bindSearchEnterKey() {
    ['search-name', 'search-id', 'search-cccd'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchPatient();
                }
            });
        }
    });
}

function bindAppointmentEnterKey() {
    ['appt-search-name', 'appt-search-id', 'appt-search-cccd'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchPatientForAppointment();
                }
            });
        }
    });
}

function showDetailModal(title, html) {
    const titleEl = document.getElementById('patientDetailModalTitle');
    const bodyEl = document.getElementById('patientDetailModalBody');
    if (!titleEl || !bodyEl) return;
    titleEl.textContent = title;
    bodyEl.innerHTML = html;
    const modalEl = document.getElementById('patientDetailModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showContent(sectionID) {
    document.querySelectorAll('.content-section').forEach((section) => {
        section.style.display = 'none';
        section.classList.remove('is-visible');
    });
    const target = document.getElementById(sectionID);
    if (target) {
        target.style.display = 'block';
        target.classList.add('is-visible');
    }
    document.querySelectorAll('.patient-nav-pills button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.section === sectionID);
    });
    if (sectionID === 'exam-history') renderExamHistoryList();
}

function renderExamHistoryList() {
    const tbody = document.getElementById('exam-history-list');
    const empty = document.getElementById('exam-history-empty');
    if (!tbody) return;
    tbody.innerHTML = '';

    const visits = listAllExamVisits();
    if (visits.length === 0) {
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    visits.forEach((v, i) => {
        const p = v.patient || {};
        const diag = v.fields?.final_diagnosis || v.fields?.preliminary_diagnosis || '—';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${escapeHtml(p.patient_id || p.patientId || '')}</td>
            <td>${escapeHtml(p.name || '')}</td>
            <td>${escapeHtml(formatExamDate(v.completedAt))}</td>
            <td>${escapeHtml(diag)}</td>
            <td>
                <button type="button" class="btn btn-sm btn-outline-primary btn-view-visit">Xem</button>
                <button type="button" class="btn btn-sm btn-outline-secondary btn-print-visit-row">In phiếu</button>
            </td>
        `;
        row.querySelector('.btn-print-visit-row').addEventListener('click', () => printExamVisit(v));
        row.querySelector('.btn-view-visit').addEventListener('click', () => {
            const fakePatient = { id: p.id, patient_id: p.patient_id || p.patientId, name: p.name };
            const html = buildExamResultsHtml(fakePatient, { escapeHtml, showPrint: true });
            showDetailModal(`Lần khám — ${p.name || ''}`, html);
            bindExamPrintButtons(document.getElementById('patientDetailModalBody'), fakePatient);
        });
        tbody.appendChild(row);
    });
}

async function refreshPreviewPatientId() {
    const el = document.getElementById('patient-id-preview');
    if (!el) return;
    const result = await HospitalAPI.getNextPatientId();
    if (result.error) {
        el.value = result.error;
        el.title = 'Mở Live Server hoặc chạy backend (mvn spring-boot:run)';
        return;
    }
    el.value = result.patient_id + ' (dự kiến)';
}

async function loadPatients() {
    const result = await HospitalAPI.getPatients();
    if (result.error) {
        console.error(result.error);
        return;
    }
    patients = Array.isArray(result) ? result : [];
    updatePatientList();
}

async function runPatientSearch(name, patient_id, cccd) {
    if (!name && !patient_id && !cccd) {
        return { error: 'Nhập ít nhất một tiêu chí: tên, mã BN hoặc CCCD.' };
    }
    return HospitalAPI.searchPatients({ name, patient_id, cccd });
}

async function confirmPatientRegistration() {
    const name = document.getElementById('patient-name').value.trim();
    const cccd = document.getElementById('patient-cccd').value.trim();
    if (!name || !cccd) {
        alert('Vui lòng nhập họ tên và CCCD.');
        return;
    }

    const patientData = {
        name,
        phone: document.getElementById('patient-phone').value.trim(),
        age: parseInt(document.getElementById('patient-age').value.trim(), 10) || null,
        cccd,
        gender: document.getElementById('patient-gender').value,
        medical_history: document.getElementById('patient-history').value.trim()
    };

    const result = await HospitalAPI.addPatient(patientData);
    if (result.error) {
        alert('Lỗi: ' + result.error);
        return;
    }

    const saved = result.patient || { ...patientData, id: result.id, patient_id: result.patient_id };
    if (saved.id != null) {
        saved.patient_id = result.patient_id || patientCode(saved);
        const q = addPatientToExamQueue(saved);
        if (q.ok) {
            alert(`Đăng ký thành công mã ${result.patient_id}. Đã thêm vào lịch khám tại Khám chữa bệnh.`);
        } else {
            alert(`Đăng ký thành công mã ${result.patient_id}. ${q.error || ''}`);
        }
    } else {
        alert(`Bệnh nhân ${name} đã được đăng ký với mã ${result.patient_id}`);
    }

    await loadPatients();
    showContent('patient-list');
    clearPatientForm();
    await refreshPreviewPatientId();
}

async function deletePatient(patientID) {
    if (!confirm('Bạn có chắc chắn muốn xóa bệnh nhân này? Dữ liệu sẽ bị mất vĩnh viễn!')) return;

    const result = await HospitalAPI.deletePatient(patientID);
    if (result.error) {
        alert('Lỗi: ' + result.error);
        return;
    }
    removePatientFromExamQueue(patientID);
    alert('Đã xóa bệnh nhân thành công!');
    await loadPatients();
}

function updatePatientList() {
    const tableBody = document.getElementById('patient-list-content');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    patients.forEach((p, i) => {
        const inQueue = isPatientInExamQueue(p);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${patientCode(p)}</td>
            <td>${p.name}</td>
            <td>${p.phone || ''}</td>
            <td>${p.gender || ''}</td>
            <td>${p.age || ''}</td>
            <td>${p.cccd || ''}</td>
            <td>${medicalHistoryText(p)}</td>
            <td>
                ${inQueue ? '<span class="badge bg-success">Trong lịch khám</span> ' : ''}
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="deletePatient(${p.id})">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function searchPatient() {
    const name = document.getElementById('search-name').value.trim();
    const patient_id = document.getElementById('search-id').value.trim();
    const cccd = document.getElementById('search-cccd').value.trim();

    const results = await runPatientSearch(name, patient_id, cccd);
    const tableBody = document.getElementById('search-result-content');
    const emptyMsg = document.getElementById('search-empty-msg');
    tableBody.innerHTML = '';

    if (results.error) {
        alert(results.error);
        return;
    }

    if (!Array.isArray(results) || results.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        lastSearchResults = [];
        return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';

    lastSearchResults = results;
    results.forEach((p, i) => {
        const exams = findExamRecordsForPatient(p);
        const row = document.createElement('tr');
        row.className = 'clickable-row';
        row.title = 'Bấm để xem chi tiết và kết quả khám';
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${escapeHtml(patientCode(p))}</td>
            <td>${escapeHtml(p.name)}</td>
            <td>${escapeHtml(p.phone || '')}</td>
            <td>${escapeHtml(p.gender || '')}</td>
            <td>${p.age || ''}</td>
            <td>${escapeHtml(p.cccd || '')}</td>
            <td>
                ${exams.length ? '<span class="badge bg-success">Đã khám</span> ' : ''}
                <button type="button" class="btn btn-sm btn-outline-primary btn-view-detail">Xem</button>
            </td>
        `;
        row.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            viewSearchResult(i);
        });
        row.querySelector('.btn-view-detail').addEventListener('click', (e) => {
            e.stopPropagation();
            viewSearchResult(i);
        });
        tableBody.appendChild(row);
    });
}

function viewSearchResult(index) {
    const p = lastSearchResults[index];
    if (!p) return;

    const html = `
        <h6 class="detail-section-title">Thông tin bệnh nhân</h6>
        <dl class="patient-detail-dl">
            <dt>Mã bệnh nhân</dt><dd>${escapeHtml(patientCode(p))}</dd>
            <dt>Họ và tên</dt><dd>${escapeHtml(p.name)}</dd>
            <dt>Số điện thoại</dt><dd>${escapeHtml(p.phone || '—')}</dd>
            <dt>Giới tính</dt><dd>${escapeHtml(p.gender || '—')}</dd>
            <dt>Tuổi</dt><dd>${p.age ?? '—'}</dd>
            <dt>CCCD</dt><dd>${escapeHtml(p.cccd || '—')}</dd>
            <dt>Tiền sử bệnh</dt><dd>${escapeHtml(medicalHistoryText(p) || '—')}</dd>
        </dl>
        <h6 class="detail-section-title mt-4">Kết quả khám (Khám chữa bệnh)</h6>
        ${buildExamResultsHtml(p, { escapeHtml })}
    `;
    showDetailModal(`Chi tiết — ${p.name}`, html);
    bindExamPrintButtons(document.getElementById('patientDetailModalBody'), p);
}

function cancelsearchPatient() {
    document.getElementById('search-name').value = '';
    document.getElementById('search-id').value = '';
    document.getElementById('search-cccd').value = '';
    document.getElementById('search-result-content').innerHTML = '';
    const emptyMsg = document.getElementById('search-empty-msg');
    if (emptyMsg) emptyMsg.style.display = 'none';
    lastSearchResults = [];
}

async function searchPatientForAppointment() {
    const name = document.getElementById('appt-search-name').value.trim();
    const patient_id = document.getElementById('appt-search-id').value.trim();
    const cccd = document.getElementById('appt-search-cccd').value.trim();

    const results = await runPatientSearch(name, patient_id, cccd);
    const tableBody = document.getElementById('appt-result-content');
    const emptyMsg = document.getElementById('appt-empty-msg');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (results.error) {
        alert(results.error);
        return;
    }

    if (!Array.isArray(results) || results.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        lastAppointmentResults = [];
        return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';

    lastAppointmentResults = results;
    results.forEach((p, i) => {
        const inQueue = isPatientInExamQueue(p);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${escapeHtml(patientCode(p))}</td>
            <td>${escapeHtml(p.name)}</td>
            <td>${escapeHtml(p.phone || '')}</td>
            <td>${escapeHtml(p.cccd || '')}</td>
            <td>${inQueue
                ? '<span class="badge bg-success">Đã trong lịch khám</span>'
                : '<span class="badge bg-secondary">Chưa đăng ký</span>'}</td>
            <td>
                <button type="button" class="btn btn-sm btn-outline-primary btn-view-detail">Xem</button>
                <button type="button" class="btn btn-sm btn-success btn-register-appt" ${inQueue ? 'disabled' : ''}>
                    Đăng ký lịch khám
                </button>
            </td>
        `;
        row.querySelector('.btn-view-detail').addEventListener('click', () => {
            lastSearchResults = [p];
            viewSearchResult(0);
        });
        const regBtn = row.querySelector('.btn-register-appt');
        if (regBtn && !inQueue) {
            regBtn.addEventListener('click', () => registerAppointment(i));
        }
        tableBody.appendChild(row);
    });
}

function registerAppointment(index) {
    const p = lastAppointmentResults[index];
    if (!p) return;

    const result = addPatientToExamQueue(p);
    if (!result.ok) {
        alert(result.error || 'Không thể đăng ký lịch khám');
        return;
    }

    alert(`${result.message}\nMở trang Khám chữa bệnh để tiếp nhận.`);
    searchPatientForAppointment();
}

function cancelAppointmentSearch() {
    ['appt-search-name', 'appt-search-id', 'appt-search-cccd'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const tbody = document.getElementById('appt-result-content');
    if (tbody) tbody.innerHTML = '';
    const emptyMsg = document.getElementById('appt-empty-msg');
    if (emptyMsg) emptyMsg.style.display = 'none';
    lastAppointmentResults = [];
}

function clearPatientForm() {
    ['patient-name', 'patient-phone', 'patient-age', 'patient-cccd', 'patient-history'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

function cancelPatientRegistration() {
    if (confirm('Bạn có chắc chắn muốn hủy đăng ký không?')) {
        clearPatientForm();
        showContent('patient-registration');
    }
}
