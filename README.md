# 🏥 Web Quản Lý Bệnh Viện — Hospital Management System

<div align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?style=for-the-badge&logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![Maven](https://img.shields.io/badge/Maven-3.9-red?style=for-the-badge&logo=apachemaven)
![HTML5](https://img.shields.io/badge/HTML5-CSS3-E34F26?style=for-the-badge&logo=html5)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript)

Hệ thống quản lý bệnh viện toàn diện được xây dựng bằng **Java Spring Boot MVC**, kết hợp với **MySQL** và giao diện **HTML/CSS/JavaScript**. Dự án được phát triển phục vụ môn học **Lập Trình Hướng Đối Tượng (OOP)**.

</div>

---

## 📌 Mục Lục

- [Giới thiệu](#-giới-thiệu)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [OOP trong dự án](#-oop-trong-dự-án)
- [Cài đặt và chạy](#-cài-đặt-và-chạy)
- [API Endpoints](#-api-endpoints)
- [Cơ sở dữ liệu](#-cơ-sở-dữ-liệu)
- [Nhóm phát triển](#-nhóm-phát-triển)

---

## 🎯 Giới Thiệu

**Hospital Management System** là ứng dụng web quản lý bệnh viện được xây dựng theo mô hình **MVC (Model - View - Controller)**. Hệ thống cho phép quản lý toàn diện các hoạt động của bệnh viện bao gồm bệnh nhân, nhân viên, thuốc, phòng/giường bệnh, dịch vụ y tế và quy trình khám bệnh.

Dự án áp dụng đầy đủ 4 tính chất của **Lập Trình Hướng Đối Tượng**: Encapsulation, Abstraction, Inheritance và Polymorphism thông qua Spring Boot và JPA.

---

## 🏗 Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│          HTML / CSS / JavaScript (Port 5500)            │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP Request (REST API)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   SPRING BOOT BACKEND                   │
│                     (Port 8080)                         │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  Controller │→ │   Service   │→ │   Repository    │  │
│  │  (API Layer)│  │(Logic Layer)│  │  (Data Layer)   │  │
│  └─────────────┘  └─────────────┘  └────────┬────────┘  │
│                                             │           │
│  ┌──────────────────────────────────────────┘           │
│  │              Spring Data JPA                         │
└──┼──────────────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────────────────┐
│                    MySQL Database                       │
│                   hospital_db (Port 3306)               │
│                                                         │
│  users │ patients │ employees │ medicines │ departments │
│  rooms │ beds │ medical_records │ services │examinations│
└─────────────────────────────────────────────────────────┘
```

### Luồng dữ liệu

1. **Frontend** gửi HTTP request đến Spring Boot API
2. **Controller** tiếp nhận request, validate dữ liệu
3. **Repository** thực hiện truy vấn thông qua Spring Data JPA
4. **MySQL** lưu trữ và trả về kết quả
5. **Controller** trả về JSON response về Frontend
6. **JavaScript** cập nhật giao diện theo kết quả nhận được

---

## ✨ Tính Năng

| Chức năng | Mô tả | Trạng thái |
|---|---|---|
| 🔐 Xác thực | Đăng nhập, đăng xuất, đăng kí  | ✅ |
| 👤 Quản lý bệnh nhân | Thêm, sửa, xóa, tìm kiếm bệnh nhân | ✅ |
| 👨‍⚕️ Quản lý nhân viên | CRUD nhân viên, tìm kiếm theo khoa | ✅ |
| 💊 Quản lý thuốc | CRUD thuốc, kiểm tra tồn kho | ✅ |
| 🏠 Quản lý phòng/giường | Quản lý phòng, giường, trạng thái giường | ✅ |
| 🩺 Khám bệnh | Quy trình khám 7 bước, lưu hồ sơ | ✅ |
| 🏷️ Dịch vụ y tế | Quản lý danh mục dịch vụ, giá tiền | ✅ |
| 📋 Hồ sơ bệnh án | Lưu trữ và tra cứu hồ sơ khám bệnh | ✅ |

---

## 🛠 Công Nghệ Sử Dụng

### Backend
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| Java | 17 | Ngôn ngữ lập trình chính |
| Spring Boot | 3.2.0 | Framework web backend |
| Spring Data JPA | 3.2.0 | ORM, kết nối database |
| Spring Security | 3.2.0 | Xác thực và phân quyền |
| Maven | 3.9 | Quản lý thư viện và build |

### Frontend
| Công nghệ | Vai trò |
|---|---|
| HTML5 | Cấu trúc giao diện |
| CSS3 | Thiết kế giao diện |
| JavaScript (ES6) | Logic tương tác và gọi API |

### Database & Khác
| Công nghệ | Vai trò |
|---|---|
| MySQL 8.0 | Hệ quản trị cơ sở dữ liệu |
| Node.js (init-db) | Script khởi tạo database |
| VSCode | Môi trường phát triển |

---

## 📁 Cấu Trúc Dự Án

```
Web_Hospital/                                 # Thư mục gốc
│
├── hospital-backend/                         # ⚙️ Spring Boot Backend (Java)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/hospital/
│   │       │   ├── config/
│   │       │   │   ├── SecurityConfig.java   # Cấu hình bảo mật & phân quyền
│   │       │   │   ├── WebConfig.java        # Cấu hình CORS
│   │       │   │   └── DataSeeder.java       # Khởi tạo dữ liệu mẫu
│   │       │   │
│   │       │   ├── controller/               # Tiếp nhận HTTP request
│   │       │   │   ├── AuthController.java
│   │       │   │   ├── PatientController.java
│   │       │   │   ├── EmployeeController.java
│   │       │   │   ├── MedicineController.java
│   │       │   │   ├── DepartmentController.java
│   │       │   │   ├── BedController.java
│   │       │   │   ├── MedicalServiceController.java
│   │       │   │   ├── PatientMedicalRecordController.java
│   │       │   │   └── PatientVisitHistoryController.java
│   │       │   │
│   │       │   ├── model/                    # Entity - Class OOP
│   │       │   │   ├── User.java
│   │       │   │   ├── Patient.java
│   │       │   │   ├── Employee.java
│   │       │   │   ├── Medicine.java
│   │       │   │   ├── MedicalService.java
│   │       │   │   ├── PatientMedicalRecord.java
│   │       │   │   ├── PatientVisitHistory.java
│   │       │   │   ├── Department.java
│   │       │   │   ├── Room.java
│   │       │   │   └── Bed.java
│   │       │   │
│   │       │   ├── repository/               # Tầng truy vấn dữ liệu
│   │       │   │   ├── UserRepository.java
│   │       │   │   ├── PatientRepository.java
│   │       │   │   ├── EmployeeRepository.java
│   │       │   │   ├── MedicineRepository.java
│   │       │   │   ├── MedicalServiceRepository.java
│   │       │   │   ├── PatientMedicalRecordRepository.java
│   │       │   │   ├── PatientVisitHistoryRepository.java
│   │       │   │   ├── DepartmentRepository.java
│   │       │   │   ├── RoomRepository.java
│   │       │   │   └── BedRepository.java
│   │       │   │
│   │       │   └── HospitalApplication.java  # Điểm khởi chạy server
│   │       │
│   │       └── resources/
│   │           └── application.properties    # Cấu hình database
│   │
│   └── pom.xml                               # Maven dependencies
│
├── html/                                     # 🌐 Giao diện HTML
│   ├── index.html                            # Trang chủ
│   ├── login.html                            # Đăng nhập
│   ├── introduce.html                        # Giới thiệu bệnh viện
│   ├── patient_management.html               # Quản lý bệnh nhân
│   ├── hr.html                               # Quản lý nhân viên
│   ├── pharmacy.html                         # Quản lý thuốc
│   ├── room_bed.html                         # Quản lý phòng/giường
│   ├── medical_examination.html              # Khám bệnh
│   └── services.html                         # Dịch vụ y tế
│
├── css/                                      # 🎨 Stylesheet
│   ├── styles.css                            # CSS dùng chung
│   ├── app-layout.css                        # Layout tổng thể
│   ├── navbar.css                            # Thanh điều hướng
│   ├── patient.css                           # Trang bệnh nhân
│   ├── hr.css                                # Trang nhân viên
│   ├── pharmacy.css                          # Trang thuốc
│   ├── room_bed.css                          # Trang phòng/giường
│   ├── medical_examination.css               # Trang khám bệnh
│   └── services.css                          # Trang dịch vụ
│
├── js/                                       # ⚡ JavaScript
│   ├── api.js                                # Kết nối API chung
│   ├── auth.js                               # Xác thực người dùng
│   ├── patient.js                            # Logic bệnh nhân
│   ├── hr.js                                 # Logic nhân viên
│   ├── pharmacy.js                           # Logic thuốc
│   ├── room_bed.js                           # Logic phòng/giường
│   ├── services.js                           # Logic dịch vụ y tế
│   ├── medical_examination.js                # Logic khám bệnh
│   ├── exam-queue.js                         # Hàng chờ khám
│   ├── exam-records.js                       # Hồ sơ kết quả khám
│   └── navbar.js                             # Điều hướng navbar
│
├── images/                                   # 🖼️ Hình ảnh & tài nguyên
│
├── start-backend.bat                         # Script khởi chạy backend
├── start-frontend.bat                        # Script khởi chạy frontend
├── reorganize.bat                            # Script tổ chức file
├── .gitattributes                            # Cấu hình Git
└── README.md                                 # Tài liệu dự án
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký tài khoản |

### Bệnh nhân
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/patients` | Lấy danh sách bệnh nhân |
| POST | `/api/patients` | Thêm bệnh nhân mới |
| DELETE | `/api/patients/{id}` | Xóa bệnh nhân |
| GET | `/api/patients/search?name=` | Tìm kiếm bệnh nhân |

### Nhân viên
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/employees` | Lấy danh sách nhân viên |
| POST | `/api/employees` | Thêm nhân viên mới |
| PUT | `/api/employees/{id}` | Cập nhật nhân viên |
| DELETE | `/api/employees/{id}` | Xóa nhân viên |
| GET | `/api/employees/search?query=` | Tìm kiếm nhân viên |

### Thuốc
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/medicines` | Lấy danh sách thuốc |
| POST | `/api/medicines` | Thêm thuốc mới |
| PUT | `/api/medicines/{id}` | Cập nhật thuốc |
| DELETE | `/api/medicines/{id}` | Xóa thuốc |

### Phòng/Giường & Dịch vụ
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/departments` | Lấy danh sách khoa |
| GET | `/api/departments/{id}/rooms` | Lấy phòng theo khoa |
| GET | `/api/rooms/{id}/beds` | Lấy giường theo phòng |
| PUT | `/api/beds/{id}/status` | Cập nhật trạng thái giường |
| GET | `/api/services` | Lấy danh sách dịch vụ |

---

## 🗃 Cơ Sở Dữ Liệu

### Sơ đồ quan hệ

```
users
 └── (xác thực người dùng)

patients ──────────────┐
 └── patient_id (PK)   │
                       ▼
               medical_records
               examinations

departments
 └── id (PK)
       │
       ▼
     rooms
      └── department_id (FK)
            │
            ▼
           beds
            └── room_id (FK)
            └── patient_id (FK) → patients

medicines
services
employees
```

### Bảng dữ liệu chính

| Bảng | Mô tả | Các trường chính |
|---|---|---|
| `users` | Tài khoản hệ thống | id, email, password, role |
| `patients` | Thông tin bệnh nhân | patient_id, name, cccd, gender, age |
| `employees` | Nhân viên/bác sĩ | name, cccd, position, department |
| `medicines` | Danh mục thuốc | name, quantity, ingredient, dosage |
| `medical_records` | Hồ sơ bệnh án | patient_id, diagnosis, treatment |
| `departments` | Khoa trong bệnh viện | name, description |
| `rooms` | Phòng bệnh | name, department_id |
| `beds` | Giường bệnh | bed_number, status, patient_id |
| `services` | Dịch vụ y tế | name, description, price |
| `examinations` | Kết quả khám | patient_id, step_1 → step_7 |

---

<div align="center">
Made with ❤️ 
</div>
