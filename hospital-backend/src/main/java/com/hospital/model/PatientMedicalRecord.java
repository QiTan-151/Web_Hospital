package com.hospital.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "patient_medical_records")
public class PatientMedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonProperty("patient_id")
    @Column(name = "patient_code", nullable = false)
    private String patientCode;

    @JsonProperty("patient_name")
    @Column(name = "patient_name")
    private String patientName;

    private Integer age;

    @JsonProperty("exam_date")
    @Column(name = "exam_date")
    private LocalDate examDate;

    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @JsonProperty("lab_tests")
    @Column(name = "lab_tests", columnDefinition = "TEXT")
    private String labTests;

    @Column(columnDefinition = "TEXT")
    private String endoscopy;

    @JsonProperty("lab_result")
    @Column(name = "lab_result", columnDefinition = "TEXT")
    private String labResult;

    @JsonProperty("endoscopy_result")
    @Column(name = "endoscopy_result", columnDefinition = "TEXT")
    private String endoscopyResult;

    @Column(columnDefinition = "TEXT")
    private String conclusion;

    @Column(columnDefinition = "TEXT")
    private String indication;

    @JsonProperty("record_type")
    @Column(name = "record_type")
    private String recordType;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getPatientCode() { return patientCode; }
    public void setPatientCode(String patientCode) { this.patientCode = patientCode; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public LocalDate getExamDate() { return examDate; }
    public void setExamDate(LocalDate examDate) { this.examDate = examDate; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getLabTests() { return labTests; }
    public void setLabTests(String labTests) { this.labTests = labTests; }

    public String getEndoscopy() { return endoscopy; }
    public void setEndoscopy(String endoscopy) { this.endoscopy = endoscopy; }

    public String getLabResult() { return labResult; }
    public void setLabResult(String labResult) { this.labResult = labResult; }

    public String getEndoscopyResult() { return endoscopyResult; }
    public void setEndoscopyResult(String endoscopyResult) { this.endoscopyResult = endoscopyResult; }

    public String getConclusion() { return conclusion; }
    public void setConclusion(String conclusion) { this.conclusion = conclusion; }

    public String getIndication() { return indication; }
    public void setIndication(String indication) { this.indication = indication; }

    public String getRecordType() { return recordType; }
    public void setRecordType(String recordType) { this.recordType = recordType; }
}
