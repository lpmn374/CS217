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
* **Cảnh báo biến chứng:** Cảnh báo các biến chứng về thần kinh, tim mạch và hô hấp.
* **Kiểm tra phân biệt:** Phân biệt với một số bệnh như Ap-tơ, Thủy đậu, Sốt phát ban, Dị ứng da, Sốt xuất huyết, Nhiễm khuẩn máu, Viêm da mủ bằng một số dấu hiệu đặc trưng về dạng ban, tiền sử tái phát, vị trí ban,...
* **Phân loại ca TCM:** Phân loại Ca nghi ngờ/ Ca lâm sàng (Thể điển hình - cấp tính, Thể không điển hình - Chỉ loét miệng/Thể không điển - Thể kín, Thể tối cấp)/ Ca xác định(Có thể có hoặc không thuộc Tối cấp).
* **Chẩn đoán tự động:** Phân độ từ **Độ 1 đến Độ 4** dựa trên các triệu chứng về da, miệng, thần kinh, tim mạch, hô hấp, tiêu hóa,...
* **Lưu trữ đa tầng:** Quản lý dữ liệu qua **7 bảng liên kết**.
* **Xóa thông minh:** Sử dụng cơ chế **`ON DELETE CASCADE`** để bảo mật dữ liệu.

## 📸 GIAO DIỆN ỨNG DỤNG (PREVIEW)

<div align="center">
  
  <img width="100%" alt="Giao diện nhập liệu chi tiết" src="https://github.com/user-attachments/assets/0b55ce4a-b4b1-426d-8e96-0d0a6cac83a4" />

  <p><i>Giao diện chẩn đoán thông minh - Trực quan & Dễ sử dụng</i></p>
  
  <br><br>

  <img width="100%" alt="Kết quả phân độ" src="https://github.com/user-attachments/assets/f1fe8639-7876-41de-a309-d85f6809b1a9" />

  <p><i>Kết quả phân độ và hướng dẫn xử trí tự động</i></p>
</div>

> [!TIP]
> Hệ thống hỗ trợ nhập liệu nhanh các chỉ số sinh hiệu và tự động đối soát với bộ luật y khoa để đưa ra kết quả tức thì.

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

* **`Patient`**: Thông tin hành chính bệnh nhi.
* **`ClinicalAssessment`**: Triệu chứng lâm sàng.
* **`VitalSignsNeuro`**: Dấu hiệu sinh tồn & Thần kinh.
* **`LabTests`**: Xét nghiệm.
* **`HFMDGrading`**: Phân độ và biến chứng.
* **`TreatmentPlan`**: Kế hoạch điều trị.
* **`DiagnosticOutput`**: Kết quả tổng hợp.

Và 1 bảng luật:
* **`rule_base`**
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
* **`database.sql`**: File chứa cấu trúc của 7 bảng thông tin và 1 bảng luật. Nếu bạn thay đổi số lượng cột trong bảng, hãy cập nhật lại file này.

---
<div align="center">
  <b>Phát triển bởi Võ Minh Ngọc • © 2025</b>
</div>
<div align="center">
    <b>Cập nhật, chỉnh sửa bởi Lê Phạm Mỹ Ngọc và Nguyễn Phan Phương Ngân • © 2025</b>
</div>
