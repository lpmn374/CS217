import pymysql

# --- THÔNG TIN KẾT NỐI CSDL XAMPP ---
# Lưu ý: Nếu bạn dùng XAMPP, người dùng mặc định là 'root' và mật khẩu thường là để trống.
DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = ''  # Mật khẩu mặc định của XAMPP thường là trống
DB_NAME = 'HFMD_System' # Tên Database bạn đã tạo

def connect_db():
    """Thiết lập kết nối với MariaDB (MySQL)"""
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            charset='utf8mb4', # Hỗ trợ tiếng Việt
            cursorclass=pymysql.cursors.DictCursor # Trả về kết quả dưới dạng dictionary (dễ xử lý hơn)
        )
        print("✅ Kết nối CSDL thành công!")
        return conn
    except Exception as e:
        print(f"❌ Lỗi kết nối CSDL: {e}")
        return None

def test_connection():
    """Kiểm tra kết nối và đóng ngay lập tức"""
    connection = connect_db()
    if connection:
        connection.close()
        print("Kết nối đã đóng. Sẵn sàng cho bước tiếp theo.")

# --- Thực thi kiểm tra ---
if __name__ == "__main__":
    test_connection()