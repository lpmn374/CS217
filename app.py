# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from database_connect import connect_db  # Nhập hàm từ file bạn vừa gửi
# import pymysql

# app = Flask(__name__)
# CORS(app)

# # --- Cấu hình CSDL ---
# DB_CONFIG = {
#     'host': 'localhost',
#     'user': 'root',
#     'password': '',
#     'database': 'HFMD_System',
#     'charset': 'utf8mb4',
#     'cursorclass': pymysql.cursors.DictCursor
# }

# def connect_db():
#     try:
#         return pymysql.connect(**DB_CONFIG)
#     except Exception as e:
#         print(f"Lỗi kết nối CSDL: {e}")
#         return None

# # --- BỘ SUY DIỄN (INFERENCE ENGINE) TRÊN PYTHON ---
# def run_python_inference(symptoms, vitals):
#     """
#     Thực hiện suy diễn tiến trên Python dựa trên dữ liệu từ React gửi sang.
#     """
#     inference_steps = []
#     final_grade = "1"
#     treatment = "Điều trị ngoại trú, theo dõi tại nhà."
#     found_final = False

#     # Định nghĩa các luật logic (Bạn có thể load từ SQL bảng rule_base nếu muốn động hoàn toàn)
#     # Ở đây tôi viết cứng logic theo đúng file TS bạn gửi để đảm bảo chạy ngay được
#     RULES = [
#         {"id": "CLINICAL_CASE", "name": "Ca lâm sàng", "check": lambda s, v: s['mouthUlcer'] or s['rash']},
#         {"id": "GRADE_4_SPO2", "name": "Độ 4 - Nguy kịch", "check": lambda s, v: v['spo2'] < 92, "grade": "4", "treat": "CẤP CỨU NGAY! Chuyển ICU."},
#         {"id": "GRADE_3_HR", "name": "Độ 3 - Nặng", "check": lambda s, v: v['heartRate'] > 170, "grade": "3", "treat": "NGUY HIỂM! Chuyển tuyến trên ngay."},
#         {"id": "GRADE_2B_N1", "name": "Độ 2b Nhóm 1", "check": lambda s, v: v['startleCount'] >= 2 or (v['heartRate'] > 150 and v['isRestingNoFever']), "grade": "2b", "treat": "CẢNH BÁO! Nhập viện theo dõi sát."},
#         # ... Thêm các luật khác tương tự ...
#     ]

#     for rule in RULES:
#         activated = not found_final and rule['check'](symptoms, vitals)
#         is_final = activated and "grade" in rule
        
#         inference_steps.append({
#             "ruleId": rule['id'],
#             "description": rule['name'],
#             "activated": activated,
#             "isFinal": is_final
#         })

#         if is_final and not found_final:
#             final_grade = rule['grade']
#             treatment = rule['treat']
#             found_final = True

#     return {
#         "resultGrade": final_grade,
#         "treatment": treatment,
#         "inferenceSteps": inference_steps,
#         "isClinicalCase": any(step['activated'] for step in inference_steps if step['ruleId'] == 'CLINICAL_CASE')
#     }

# # --- API ENDPOINTS ---

# @app.route('/diagnose', methods=['POST'])
# def diagnose():
#     data = request.json 
    
#     # Chuyển đổi: Nếu True (tích xanh) -> 1, nếu False -> 0
#     has_comorbidities = 1 if data.get('hasComorbidities') else 0

#     # 1. Lấy thông tin trẻ (Dùng các key khớp chính xác với file TS của bạn)
#     full_name = data.get('childName') or data.get('name') or 'N/A'
#     gender = data.get('childGender') or data.get('gender') or 'N/A'
#     age_months = data.get('childAgeMonths') or data.get('age') or 0

#     # Lấy sinh hiệu
#     vitals = data.get('vitals', {})
#     heart_rate = vitals.get('heartRate', 0)
#     spo2 = vitals.get('spo2', 0)

#     # CHẠY SUY DIỄN TRƯỚC ĐỂ LẤY ĐỘ (GRADE)
#     symptoms = data.get('symptoms', {})
#     result = run_python_inference(symptoms, vitals)
#     final_grade = result['resultGrade'] # Lấy kết quả Độ từ bộ suy diễn
#     treatment_desc = result['treatment']

#     # Lấy dữ liệu từ giao diện
#     # 'limbWeakness' thường là key của "Run chi, yếu chi, loạng choạng"
#     ataxia_val = 1 if symptoms.get('limbWeakness') else 0 

#     # 'startleCount' là số lần giật mình
#     startle_val = vitals.get('startleCount', 0) 

#     # Giả định nhiệt độ dựa trên lựa chọn sốt cao
#     temp_val = 39.5 if symptoms.get('highFever') else 37.0

#     # 2. Lưu vào MySQL thông qua database_connect.py
#     conn = connect_db() 
#     if conn:
#         try:
#             with conn.cursor() as cursor:
#                 # Lưu vào bảng tb_patient_info
#                 sql_patient = "INSERT INTO tb_patient_info (full_name, gender, age_months, has_comorbidities, result_grade) VALUES (%s, %s, %s, %s, %s)"
#                 cursor.execute(sql_patient, (full_name, gender, age_months, has_comorbidities, final_grade))
#                 p_id = conn.insert_id() # Lấy ID vừa tạo tự động
                
#                 # Lưu vào bảng tb_vital_signs_neuro
#                 sql_vitals = "INSERT INTO tb_vital_signs_neuro (patient_id, heart_rate, spo2) VALUES (%s, %s, %s)"
#                 cursor.execute(sql_vitals, (p_id, heart_rate, spo2))

#                 # 3. BỔ SUNG: Lưu kết quả vào bảng tb_grading_result
#                 # Dựa trên cấu trúc bảng của bạn
#                 sql_grading = """
#                     INSERT INTO tb_grading_result (patient_id, current_grade, diagnosis_status) 
#                     VALUES (%s, %s, %s)
#                 """
#                 diagnosis_status = "Đã hoàn thành" if result['isClinicalCase'] else "Cần theo dõi"
#                 cursor.execute(sql_grading, (p_id, f"Độ {final_grade}", diagnosis_status))
                
#                 # BẢNG 4: tb_treatment_plan (Giải quyết image_b2b50e)
#                 sql_treatment = """
#                     INSERT INTO tb_treatment_plan (patient_id, treatment_location, action_description) 
#                     VALUES (%s, %s, %s)
#                 """
#                 # Quyết định nơi điều trị dựa trên Độ
#                 location = "Tại nhà" if final_grade in ["1", "2a"] else "Bệnh viện tuyến tỉnh/TW"
#                 cursor.execute(sql_treatment, (p_id, location, treatment_desc))

#                 # Cập nhật lệnh SQL INSERT
#                 sql_vitals = """
#                     INSERT INTO tb_vital_signs_neuro 
#                     (patient_id, heart_rate, spo2, ataxia, startle_reflex_history, fever_temp) 
#                     VALUES (%s, %s, %s, %s, %s, %s)
#                 """
#                 cursor.execute(sql_vitals, (p_id, heart_rate, spo2, ataxia_val, startle_val, temp_val))

#                 conn.commit()
#                 print(f"✅ ĐÃ LƯU THÀNH CÔNG: {full_name} - Độ:{final_grade}")
#         except Exception as e:
#             print(f"❌ LỖI SQL: {e}")
#         finally:
#             conn.close()
    
#     # 3. Chạy bộ suy diễn và trả kết quả về giao diện
#     symptoms = data.get('symptoms', {})
#     result = run_python_inference(symptoms, vitals)
#     return jsonify(result)

# @app.route('/save_patient', methods=['POST'])
# def save_patient():
#     # Hàm này dùng để lưu lại bản ghi sau khi đã có kết quả chẩn đoán
#     return jsonify({"status": "success", "message": "Đã lưu bản ghi chẩn đoán"})

# @app.route('/history', methods=['GET'])
# def get_all_history():
#     conn = connect_db()
#     if conn:
#         try:
#             with conn.cursor() as cursor:
#                 # Sử dụng LEFT JOIN để lấy dữ liệu từ cả 2 bảng thông qua patient_id
#                 sql = """
#                     SELECT 
#                         p.patient_id as id, 
#                         p.full_name as childName, 
#                         p.gender as childGender, 
#                         p.age_months as childAgeMonths,
#                         p.has_comorbidities as hasComorbidities,
#                         p.result_grade as resultGrade,
#                         p.created_at as createdAt,
#                         v.heart_rate as heartRate, 
#                         v.spo2 as spo2
#                     FROM tb_patient_info p
#                     LEFT JOIN tb_vital_signs_neuro v ON p.patient_id = v.patient_id
#                     ORDER BY p.created_at DESC
#                 """
#                 cursor.execute(sql)
#                 rows = cursor.fetchall()
                
#                 # CHUẨN HÓA DỮ LIỆU: Đảm bảo React luôn nhận được object hợp lệ
#                 for row in rows:
#                     # Chuyển đổi createdAt sang chuỗi ISO nếu cần
#                     if row['createdAt']:
#                         row['createdAt'] = row['createdAt'].isoformat()

#                     # 2. LẤY GIÁ TRỊ THẬT: Thay vì gán cứng '1', ta lấy từ cột resultGrade của SQL
#                     # Nếu cột đó trống (ca cũ), mới mặc định là '1'
#                     final_grade = str(row.get('resultGrade') or '1')

#                     # Gán các object mặc định để tránh lỗi trắng trang trong React
#                     row['result'] = {
#                         'resultGrade': final_grade, 
#                         'isClinicalCase': True,
#                         'treatment': 'Theo dõi theo hướng dẫn y tế.'
#                     }
#                     row['symptoms'] = {
#                         'mouthUlcer': False, 'rash': False, 'highFever': False,
#                         'feverOver2Days': False, 'vomiting': False, 'lethargy': False, 'limbWeakness': False
#                     }
#                     row['vitals'] = {
#                         'heartRate': row.get('heartRate', 0) or 0,
#                         'spo2': row.get('spo2', 0) or 0,
#                         'startleCount': 0,
#                         'isRestingNoFever': False
#                     }
                
#                 return jsonify(rows)
#         finally:
#             conn.close()
#     return jsonify([])

# @app.route('/delete_patient/<id>', methods=['DELETE'])
# def delete_patient(id):
#     conn = connect_db()
#     if conn:
#         try:
#             with conn.cursor() as cursor:
#                 # Nếu bạn đã làm Bước 1 (CASCADE) ở trên, chỉ cần 1 lệnh này là đủ:
#                 sql = "DELETE FROM tb_patient_info WHERE patient_id = %s"
#                 cursor.execute(sql, (id,))
#                 conn.commit()
#                 return jsonify({"status": "success", "message": f"Đã xóa ca bệnh {id}"})
#         except Exception as e:
#             return jsonify({"status": "error", "message": str(e)}), 500
#         finally:
#             conn.close()
#     return jsonify({"status": "error", "message": "Không thể kết nối CSDL"}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
from database_connect import connect_db
import pymysql

app = Flask(__name__)
CORS(app)

# --- BỘ SUY DIỄN (INFERENCE ENGINE) PHIÊN BẢN CẬP NHẬT BỘ Y TẾ 2024 ---
def run_python_inference(symptoms, vitals, lab_tests, patient_info):
    inference_steps = []
    final_grade = "1"
    diagnosis = "Ca lâm sàng TCM"
    differential_diagnosis = None
    treatment = "Điều trị ngoại trú, tái khám mỗi 1-2 ngày."
    found_final = False

    # Trích xuất dữ liệu đầu vào
    age = int(patient_info.get('age') or 0)
    hr = int(vitals.get('heartRate') or 0)
    spo2 = float(vitals.get('spo2') or 100)
    sys_bp = int(vitals.get('systolicBP') or 0)
    dia_bp = int(vitals.get('diastolicBP') or 0)
    pulse_pressure = sys_bp - dia_bp if sys_bp > 0 and dia_bp > 0 else 99
    
    # Xử lý tri giác (Quy đổi AVPU sang GCS nếu cần)
    gcs = int(vitals.get('comaGcs') or 15)
    if vitals.get('avpu') in ['P', 'U']: gcs = 8 

    # --- 1. LUẬT CHẨN ĐOÁN PHÂN BIỆT ---
    locations = symptoms.get('skin_rash_location', [])
    if "Toàn thân" in locations:
        differential_diagnosis = "Theo dõi Thủy đậu (Ban mọc toàn thân)"
    elif "Sau tai" in locations:
        differential_diagnosis = "Theo dõi Sốt phát ban (Ban mọc từ sau tai)"
    elif symptoms.get('mouthUlcer') and not symptoms.get('rash') and symptoms.get('ulcerType') == "Atypical":
        differential_diagnosis = "Viêm loét miệng Ap-tơ"

    # --- 2. HỆ THỐNG LUẬT PHÂN ĐỘ (THỨ TỰ ƯU TIÊN GIẢM DẦN) ---
    RULES = [
        {
            "id": "GRADE_4", "name": "Độ 4 - Nguy kịch",
            "check": lambda: (
                vitals.get('respiratory_arrest') or 
                spo2 < 92 or 
                (sys_bp > 0 and (sys_bp < (70 if age < 12 else 80))) or
                (sys_bp > 0 and pulse_pressure <= 25)
            ),
            "grade": "4", "treat": "CẤP CỨU: Hồi sức tích cực, hỗ trợ hô hấp tuần hoàn (Thở máy, vận mạch)."
        },
        {
            "id": "GRADE_3", "name": "Độ 3 - Nặng",
            "check": lambda: (
                hr > 170 or 
                vitals.get('mottled_skin') or 
                vitals.get('respiratoryDistress') or 
                spo2 < 94 or
                (age < 12 and sys_bp > 100) or
                (12 <= age < 24 and sys_bp > 110) or
                (age >= 24 and sys_bp > 115)
            ),
            "grade": "3", "treat": "NGUY HIỂM: Nhập viện khoa Hồi sức cấp cứu, theo dõi sát mạch, HA mỗi giờ."
        },
        {
            "id": "GRADE_2B_N2", "name": "Độ 2b Nhóm 2",
            "check": lambda: (
                symptoms.get('ataxia') or 
                symptoms.get('nystagmus') or 
                symptoms.get('limbWeakness') or 
                symptoms.get('cranial_nerve_palsy') or
                symptoms.get('muscleToneIncreased') or
                gcs < 10 or
                (symptoms.get('feverTemp', 0) >= 39 and symptoms.get('feverRefractory')) or
                hr > 150
            ),
            "grade": "2b (Nhóm 2)", "treat": "Nhập viện điều trị nội trú. Chỉ định IVIG nếu triệu chứng thần kinh tiến triển."
        },
        {
            "id": "GRADE_2B_N1", "name": "Độ 2b Nhóm 1",
            "check": lambda: (
                vitals.get('startleExam') or 
                int(vitals.get('startleCount') or 0) >= 2 or
                (int(vitals.get('startleCount') or 0) > 0 and (symptoms.get('lethargy') or hr > 130))
            ),
            "grade": "2b (Nhóm 1)", "treat": "Nhập viện điều trị. Theo dõi sát mạch và dấu hiệu giật mình."
        },
        {
            "id": "GRADE_2A", "name": "Độ 2a",
            "check": lambda: (
                int(vitals.get('startleCount') or 0) > 0 or 
                symptoms.get('feverDuration', 0) >= 2 or 
                (symptoms.get('feverTemp', 0) >= 39 and (symptoms.get('vomiting') or symptoms.get('lethargy')))
            ),
            "grade": "2a", "treat": "Nhập viện theo dõi và điều trị nội trú nội khoa."
        }
    ]

    for rule in RULES:
        if not found_final and rule['check']():
            final_grade = rule['grade']
            treatment = rule['treat']
            found_final = True
            inference_steps.append({"ruleId": rule['id'], "activated": True, "description": rule['name']})

    return {
        "resultGrade": final_grade,
        "diagnosis": diagnosis,
        "differential": differential_diagnosis,
        "treatment": treatment,
        "inferenceSteps": inference_steps
    }

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    symptoms = data.get('symptoms', {})
    vitals = data.get('vitals', {})
    patient_info = data.get('patientInfo', {})
    lab_tests = data.get('labTests', {})

    result = run_python_inference(symptoms, vitals, lab_tests, patient_info)

    conn = connect_db()
    if conn:
        try:
            with conn.cursor() as cursor:
                # 1. Lưu thông tin bệnh nhân
                sql_p = "INSERT INTO tb_patient_info (full_name, gender, age_months, has_comorbidities) VALUES (%s, %s, %s, %s)"
                cursor.execute(sql_p, (patient_info.get('name'), patient_info.get('gender'), patient_info.get('age'), 1 if patient_info.get('hasComorbidities') else 0))
                p_id = conn.insert_id()

                # 2. Lưu kết quả chẩn đoán cuối cùng
                sql_r = """INSERT INTO tb_final_results 
                           (patient_id, diagnosis_status, current_grade, treatment_location, differential_alert) 
                           VALUES (%s, %s, %s, %s, %s)"""
                cursor.execute(sql_r, (p_id, result['diagnosis'], result['resultGrade'], result['treatment'], result['differential']))
                
                # 3. Lưu sinh hiệu (để phục vụ lịch sử)
                sql_v = "INSERT INTO tb_vital_signs_neuro (patient_id, heart_rate, spo2, systolic_bp) VALUES (%s, %s, %s, %s)"
                cursor.execute(sql_v, (p_id, vitals.get('heartRate'), vitals.get('spo2'), vitals.get('systolicBP')))

                conn.commit()
        except Exception as e:
            print(f"SQL Error: {e}")
        finally:
            conn.close()

    return jsonify(result)

# ... Các route history và delete giữ nguyên như file trước ...
@app.route('/save_patient', methods=['POST'])
def save_patient():
    # Hàm này dùng để lưu lại bản ghi sau khi đã có kết quả chẩn đoán
    return jsonify({"status": "success", "message": "Đã lưu bản ghi chẩn đoán"})

@app.route('/history', methods=['GET'])
def get_all_history():
    conn = connect_db()
    if conn:
        try:
            with conn.cursor() as cursor:
                # Sử dụng LEFT JOIN để lấy dữ liệu từ cả 2 bảng thông qua patient_id
                sql = """
                    SELECT 
                        p.patient_id as id, 
                        p.full_name as childName, 
                        p.gender as childGender, 
                        p.age_months as childAgeMonths,
                        p.has_comorbidities as hasComorbidities,
                        p.result_grade as resultGrade,
                        p.created_at as createdAt,
                        v.heart_rate as heartRate, 
                        v.spo2 as spo2
                    FROM tb_patient_info p
                    LEFT JOIN tb_vital_signs_neuro v ON p.patient_id = v.patient_id
                    ORDER BY p.created_at DESC
                """
                cursor.execute(sql)
                rows = cursor.fetchall()
                
                # CHUẨN HÓA DỮ LIỆU: Đảm bảo React luôn nhận được object hợp lệ
                for row in rows:
                    # Chuyển đổi createdAt sang chuỗi ISO nếu cần
                    if row['createdAt']:
                        row['createdAt'] = row['createdAt'].isoformat()

                    # 2. LẤY GIÁ TRỊ THẬT: Thay vì gán cứng '1', ta lấy từ cột resultGrade của SQL
                    # Nếu cột đó trống (ca cũ), mới mặc định là '1'
                    final_grade = str(row.get('resultGrade') or '1')

                    # Gán các object mặc định để tránh lỗi trắng trang trong React
                    row['result'] = {
                        'resultGrade': final_grade, 
                        'isClinicalCase': True,
                        'treatment': 'Theo dõi theo hướng dẫn y tế.'
                    }
                    row['symptoms'] = {
                        'mouthUlcer': False, 'rash': False, 'highFever': False,
                        'feverOver2Days': False, 'vomiting': False, 'lethargy': False, 'limbWeakness': False
                    }
                    row['vitals'] = {
                        'heartRate': row.get('heartRate', 0) or 0,
                        'spo2': row.get('spo2', 0) or 0,
                        'startleCount': 0,
                        'isRestingNoFever': False
                    }
                
                return jsonify(rows)
        finally:
            conn.close()
    return jsonify([])

@app.route('/delete_patient/<id>', methods=['DELETE'])
def delete_patient(id):
    conn = connect_db()
    if conn:
        try:
            with conn.cursor() as cursor:
                # Nếu bạn đã làm Bước 1 (CASCADE) ở trên, chỉ cần 1 lệnh này là đủ:
                sql = "DELETE FROM tb_patient_info WHERE patient_id = %s"
                cursor.execute(sql, (id,))
                conn.commit()
                return jsonify({"status": "success", "message": f"Đã xóa ca bệnh {id}"})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
        finally:
            conn.close()
    return jsonify({"status": "error", "message": "Không thể kết nối CSDL"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)