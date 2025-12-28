<div align="center">

# 🩺 HFMD EXPERT SYSTEM
### **HỆ THỐNG CHẨN ĐOÁN TAY CHÂN MIỆNG THÔNG MINH**

<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
</p>

---

**"Hệ thống chuyên gia sử dụng bộ suy diễn tiến (Forward Chaining) để hỗ trợ phân độ lâm sàng chính xác."**

</div>

## 🚀 TÍNH NĂNG NỔI BẬT
* **Chẩn đoán tự động:** Phân độ từ **Độ 1 đến Độ 4** dựa trên Mạch và SpO2.
* **Lưu trữ đa tầng:** Quản lý dữ liệu qua **4 bảng liên kết**.
* **Xóa thông minh:** Sử dụng cơ chế **`ON DELETE CASCADE`** để bảo mật dữ liệu.



# 🛠️ **HƯỚNG DẪN CÀI ĐẶT (SETUP GUIDE)**

> [!IMPORTANT]
> **Phải thực hiện cấu hình Cơ sở dữ liệu trước khi chạy ứng dụng để tránh lỗi kết nối hệ thống.**

## **1. Cấu hình Cơ sở dữ liệu (MySQL)**

* **Bước 1: Khởi động Server**
    * Mở ứng dụng **XAMPP Control Panel**.
    * Nhấn nút **Start** cho cả **Apache** và **MySQL**.
* **Bước 2: Truy cập quản trị**
    * Mở trình duyệt và truy cập: [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
* **Bước 3: Khởi tạo Database**
    * Tạo một database mới với tên chính xác: **`hfmd_system`**.
* **Bước 4: Import dữ liệu**
    * Chọn database **`hfmd_system`**, nhấn vào thẻ **Import**.
    * Chọn file **`database.sql`** từ thư mục dự án và nhấn **Go/Import**.

## **2. Cấu hình Backend (Flask API)**

* **Yêu cầu hệ thống:** Đảm bảo máy tính đã cài đặt **Python 3.12+**.
* **Cài đặt thư viện:** Mở **Terminal** và chạy lệnh sau:
    ```bash
    pip install flask flask-cors pymysql
    ```
   
* **Khởi chạy Server:**
    * Chạy lệnh: `python app.py`.
    * 📍 **Địa chỉ:** `http://127.0.0.1:5000`.


## **3. Cấu hình Frontend (React UI)**

* **Yêu cầu hệ thống:** Đảm bảo máy tính đã cài đặt **Node.js** (phiên bản LTS).
* **Cài đặt các gói phụ thuộc (Dependencies):**
    ```bash
    npm install
    ```
* **Khởi động ứng dụng web:**
    ```bash
    npm run dev
    ```
    * 📍 **Truy cập giao diện tại:** `http://localhost:8080` (Tùy cài đặt của bạn)

---
### **📌 Cấu trúc quan hệ dữ liệu (ERD)**

Dữ liệu được quản lý chặt chẽ thông qua các bảng liên kết:

* **`tb_patient_info`**: Thông tin hành chính bệnh nhi.
* **`tb_vital_signs_neuro`**: Các chỉ số sinh hiệu và thần kinh.
* **`tb_grading_result`**: Kết quả phân độ chẩn đoán.
* **`tb_treatment_plan`**: Kế hoạch và địa điểm điều trị.

---

## 📂 **CÁC FILE QUAN TRỌNG (DÀNH CHO CHỈNH SỬA)**

Nếu bạn muốn tùy chỉnh lại hệ thống, hãy chú ý đến các file cốt lõi sau đây:

### ⚙️ **1. Backend & Thuật toán (Python)**
* **`app.py`**: File chạy chính của server Flask. Đây là nơi tiếp nhận dữ liệu từ web và ra lệnh lưu vào MySQL.
* **`run_python_inference` (trong `app.py`)**: **Nơi chứa thuật toán chẩn đoán.** Bạn có thể sửa các điều kiện về Mạch, SpO2 hoặc triệu chứng tại đây để thay đổi kết quả phân độ.
* **`database_connect.py`**: Chứa thông tin cấu hình kết nối CSDL (Host, User, Password).

### 💻 **2. Frontend & Giao diện (React)**
* **`src/pages/History.tsx`**: Quản lý giao diện trang Lịch sử. Sửa file này nếu muốn thay đổi cách hiển thị danh sách hoặc nút Xóa.
* **`src/lib/inference-engine.ts`**: Chứa các hàm gọi API (Fetch) để gửi dữ liệu từ giao diện sang Python.
* **`src/components/`**: Thư mục chứa các thành phần giao diện nhỏ như Form nhập liệu, các nút bấm và Badge hiển thị Độ.

### 🗃️ **3. Dữ liệu (SQL)**
* **`database.sql`**: File chứa cấu trúc của 4 bảng liên kết. Nếu bạn thay đổi số lượng cột trong bảng, hãy cập nhật lại file này.

---
<div align="center">
  <b>Phát triển bởi Võ Minh Ngọc • © 2025</b>
</div>
