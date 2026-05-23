/** Kết quả khám — nhiều lần khám / bệnh nhân, in phiếu */
const EXAM_STORAGE_KEY = 'hospital_examination_records';

const EXAM_FIELD_LABELS = {
    symptoms: 'Triệu chứng lâm sàng',
    preliminary_diagnosis: 'Chẩn đoán sơ bộ',
    lab_order: 'Chỉ định xét nghiệm',
    lab_result: 'Kết quả xét nghiệm',
    final_diagnosis: 'Chẩn đoán cuối',
    treatment: 'Phương pháp điều trị',
    prescription: 'Đơn thuốc',
    bed_number: 'Số giường',
    daily_notes: 'Theo dõi hàng ngày',
    discharge_note: 'Ghi chú xuất viện'
};

function loadAllExamRecords() {
    try {
        return JSON.parse(localStorage.getItem(EXAM_STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
}

function saveAllExamRecords(all) {
    localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(all));
}

function migrateEntry(raw) {
    if (!raw) return { visits: [] };
    if (Array.isArray(raw.visits)) return raw;
    if (raw.fields || raw.completedAt || raw.patient) {
        return { visits: [raw] };
    }
    return { visits: [] };
}

function patientExamKey(patient) {
    return String(patient?.id ?? patient?.patient_id ?? patient?.patientId ?? '');
}

function patientMatchesRecord(patient, storageKey, entry) {
    const dbId = String(patient.id ?? '');
    const code = (patient.patient_id || patient.patientId || '').toLowerCase();
    const cccd = (patient.cccd || '').trim();
    const rp = entry?.patient || {};
    return (
        (dbId && storageKey === dbId) ||
        (dbId && String(rp.id) === dbId) ||
        (code && (rp.patient_id || rp.patientId || '').toLowerCase() === code) ||
        (cccd && rp.cccd && rp.cccd === cccd)
    );
}

function findExamRecordsForPatient(patient) {
    return findExamVisitsForPatient(patient);
}

function findExamVisitsForPatient(patient) {
    if (!patient) return [];
    const all = loadAllExamRecords();
    const visits = [];

    Object.entries(all).forEach(([storageKey, raw]) => {
        const entry = migrateEntry(raw);
        if (!patientMatchesRecord(patient, storageKey, entry.visits[0] || {})) return;
        entry.visits.forEach((v) => {
            visits.push({
                storageKey,
                ...v,
                patient: v.patient || entry.visits[0]?.patient || patient
            });
        });
    });

    visits.sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));
    return visits;
}

function listAllExamVisits() {
    const all = loadAllExamRecords();
    const list = [];

    Object.entries(all).forEach(([storageKey, raw]) => {
        const entry = migrateEntry(raw);
        entry.visits.forEach((v, idx) => {
            list.push({
                storageKey,
                visitIndex: idx,
                ...v,
                patient: v.patient || {}
            });
        });
    });

    list.sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));
    return list;
}

function appendExamVisit(patient, visit) {
    const key = patientExamKey(patient);
    if (!key) return false;
    const all = loadAllExamRecords();
    const entry = migrateEntry(all[key]);
    entry.visits.push(visit);
    all[key] = entry;
    saveAllExamRecords(all);
    return true;
}

function hasExamVisits(patient) {
    return findExamVisitsForPatient(patient).length > 0;
}

function formatExamDate(iso) {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('vi-VN');
    } catch {
        return iso;
    }
}

function escapeHtmlExam(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

function generatePrintHtml(data) {
    const p = data.patient || {};
    const f = data.fields || {};
    const dateStr = data.completedAt
        ? new Date(data.completedAt).toLocaleDateString('vi-VN')
        : new Date().toLocaleDateString('vi-VN');

    return `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <title>Phiếu khám — ${escapeHtmlExam(p.name || '')}</title>
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
                <p><span class="label">Mã BN:</span> ${escapeHtmlExam(p.patient_id || p.patientId || '')}</p>
                <p><span class="label">Họ tên:</span> ${escapeHtmlExam(p.name || '')}</p>
                <p><span class="label">Tuổi:</span> ${escapeHtmlExam(String(p.age ?? ''))}</p>
                <p><span class="label">CCCD:</span> ${escapeHtmlExam(p.cccd || '')}</p>
                <p><span class="label">Ngày khám:</span> ${escapeHtmlExam(dateStr)}</p>
            </div>
            <div class="section">
                <p><span class="label">Triệu chứng:</span><br>${escapeHtmlExam(f.symptoms) || '—'}</p>
                <p><span class="label">Chẩn đoán sơ bộ:</span><br>${escapeHtmlExam(f.preliminary_diagnosis) || '—'}</p>
            </div>
            <div class="section">
                <p><span class="label">Chỉ định XN:</span><br>${escapeHtmlExam(f.lab_order) || '—'}</p>
                <p><span class="label">Kết quả XN:</span><br>${escapeHtmlExam(f.lab_result) || '—'}</p>
                <p><span class="label">Chẩn đoán cuối:</span><br>${escapeHtmlExam(f.final_diagnosis) || '—'}</p>
            </div>
            <div class="section">
                <p><span class="label">Điều trị:</span><br>${escapeHtmlExam(f.treatment) || '—'}</p>
                <p><span class="label">Đơn thuốc:</span><br>${escapeHtmlExam(f.prescription) || '—'}</p>
                <p><span class="label">Ghi chú xuất viện:</span><br>${escapeHtmlExam(f.discharge_note) || '—'}</p>
            </div>
            <div class="signature">
                <p>Bác sĩ khám bệnh</p><br><br>
                <p>_________________________</p>
            </div>
        </body>
        </html>
    `;
}

function printExamVisit(visit) {
    if (!visit || !visit.patient) {
        alert('Không có dữ liệu để in.');
        return;
    }
    const w = window.open('', '_blank');
    w.document.write(generatePrintHtml(visit));
    w.document.close();
    w.print();
}

function buildExamResultsHtml(patient, options = {}) {
    const visits = findExamVisitsForPatient(patient);
    const esc = options.escapeHtml || ((s) => String(s ?? ''));
    const showPrint = options.showPrint !== false;

    if (visits.length === 0) {
        return `
            <p class="exam-results-empty text-muted">
                Chưa có kết quả khám tại <strong>Khám chữa bệnh</strong>.
                <a href="medical_examination.html">Mở trang khám →</a>
            </p>
        `;
    }

    return visits
        .map((rec, i) => {
            const f = rec.fields || {};
            const rows = Object.entries(EXAM_FIELD_LABELS)
                .filter(([key]) => f[key])
                .map(([key, label]) => `<dt>${esc(label)}</dt><dd>${esc(f[key])}</dd>`)
                .join('');
            const printBtn = showPrint
                ? `<button type="button" class="btn btn-sm btn-outline-secondary btn-print-visit mt-2" data-visit-idx="${i}">In phiếu lần này</button>`
                : '';

            return `
                <div class="exam-result-card" data-visit-index="${i}">
                    <h6 class="exam-result-card__title">Lần khám ${visits.length - i} — ${esc(formatExamDate(rec.completedAt))}</h6>
                    <dl class="patient-detail-dl">${rows || '<dd>Chưa có chi tiết.</dd>'}</dl>
                    ${printBtn}
                </div>
            `;
        })
        .join('');
}

function bindExamPrintButtons(container, patient) {
    if (!container || !patient) return;
    const visits = findExamVisitsForPatient(patient);
    container.querySelectorAll('.btn-print-visit').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.visitIdx, 10);
            if (visits[idx]) printExamVisit(visits[idx]);
        });
    });
}
