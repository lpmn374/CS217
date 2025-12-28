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
import pymysql
import re

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'hfdm_system',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def connect_db():
    try: return pymysql.connect(**DB_CONFIG)
    except Exception as e: return None

def run_python_inference(rules, context, step_mode=False):
    """
    step_mode=True: Dừng ngay khi thỏa mãn 1 luật (Dùng cho Phân độ hoặc Phân loại đơn nhất)
    step_mode=False: Chạy tất cả các luật thỏa mãn (Dùng cho Biến chứng, Cận lâm sàng)
    """
    executed_any = False
    # Sắp xếp theo priority giảm dần
    sorted_rules = sorted(rules, key=lambda x: x['priority'], reverse=True)
    
    for r in sorted_rules:
        # Chuẩn hóa cú pháp SQL sang Python
        cond = r['condition_if'].replace('AND', 'and').replace('OR', 'or').replace('None', 'None')
        cond = re.sub(r'(?<![<>!])=(?!=)', '==', cond)
        if 'IN (' in cond or 'in (' in cond:
            cond = re.sub(r'in\s*\((.*?)\)', r'in [\1]', cond, flags=re.IGNORECASE)

        try:
            allowed_names = {"__builtins__": None, "max": max, "min": min, "abs": abs, "len": len}
            if eval(cond, allowed_names, context):
                exec(r['action_then'], {"__builtins__": None}, context)
                executed_any = True
                if step_mode or context.get('stop_program'):
                    break
        except Exception as e:
            print(f"Lỗi thực thi luật {r['rule_id']}: {e}")
            
    return executed_any

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    # Khởi tạo ngữ cảnh với đầy đủ các trường cần thiết cho 9 bước
    ctx = {
        **data.get('patient', {}), **data.get('clinical', {}), 
        **data.get('vitals', {}), **data.get('lab', {}),
        'complication_type': [], 'recommended_next_step': [], 'lab_orders': [],
        'diagnosis_status': None, 'clinical_form': None, 'current_grade': None,
        'priority_level': "3", 'differential_alert': None, 'stop_program': False,
        'treatment_location': None, 'transfer_needed': False, 'oxygen_support': False
    }

    conn = connect_db()
    if not conn: return jsonify({"error": "Lỗi kết nối CSDL"}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM rule_base")
        all_rules = cursor.fetchall()
        
        # Nhóm luật theo loại
        rules_by_type = {t: [r for r in all_rules if r['rule_type'] == t] 
                         for t in ['Complication', 'Differential', 'Diagnosis', 'Grading', 'Lab', 'Treatment']}

        # --- THỰC THI THEO 9 BƯỚC CỦA BẠN ---

        # BƯỚC 2: Kiểm tra biến chứng (Thông báo nhưng không dừng)
        run_python_inference(rules_by_type['Complication'], ctx)

        # BƯỚC 3: Kiểm tra bệnh khác (Nếu thỏa -> Gán stop_program = True và Dừng)
        if run_python_inference(rules_by_type['Differential'], ctx):
            if ctx.get('stop_program'):
                return jsonify(ctx)

        # BƯỚC 4, 5, 6, 7: Phân loại ca bệnh ban đầu
        # Dùng step_mode=True vì chỉ cần rơi vào 1 trong các loại này
        diag_base_rules = [r for r in rules_by_type['Diagnosis'] if r['rule_id'] in ['R_STEP4', 'R_STEP5', 'R_STEP6', 'R_STEP7']]
        found_base = run_python_inference(diag_base_rules, ctx, step_mode=True)

        # Nếu không thỏa mãn bất kỳ bước nào từ 4-7 -> Không mắc bệnh -> Dừng
        if not found_base:
            ctx['diagnosis_status'] = "Không mắc bệnh"
            ctx['current_grade'] = "Không phân độ"
            return jsonify(ctx)

        # BƯỚC 8: Ghi đè Thể tối cấp (Dựa trên progression speed)
        step8_rules = [r for r in rules_by_type['Diagnosis'] if r['rule_id'] == 'R_STEP8']
        run_python_inference(step8_rules, ctx)

        # BƯỚC 9: Ghi đè Ca xác định (Dựa trên kết quả xét nghiệm)
        step9_rules = [r for r in rules_by_type['Diagnosis'] if r['rule_id'] == 'R_STEP9']
        run_python_inference(step9_rules, ctx)

        # --- SAU KHI XÁC ĐỊNH CA BỆNH -> TIẾN HÀNH PHÂN ĐỘ ---
        # Ưu tiên Độ 4 > 3 > 2b > 2a > 1 nhờ priority và step_mode=True
        run_python_inference(rules_by_type['Grading'], ctx, step_mode=True)

        # --- BỔ SUNG: CHỈ ĐỊNH CẬN LÂM SÀNG & PHÂN TUYẾN ---
        run_python_inference(rules_by_type['Lab'], ctx)
        run_python_inference(rules_by_type['Treatment'], ctx)

    finally:
        conn.close()

    # Trả về kết quả cuối cùng bao gồm lab_orders và tất cả output
    return jsonify(ctx)

@app.route('/history', methods=['GET'])
def get_history():
    conn = connect_db()
    if not conn: return jsonify({"error": "DB Error"}), 500
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT p.patient_id as id, p.full_name as name, p.created_at as date,
                       p.age_months, g.current_grade as grade, o.diagnosis_status as diagnosis,
                       t.treatment_location as treatment, g.complication_type as complication
                FROM Patient p
                LEFT JOIN DiagnosticOutput o ON p.patient_id = o.patient_id
                LEFT JOIN HFMDGrading g ON p.patient_id = g.patient_id
                LEFT JOIN TreatmentPlan t ON p.patient_id = t.patient_id
                ORDER BY p.created_at DESC
            """
            cursor.execute(sql)
            return jsonify(cursor.fetchall())
    finally:
        conn.close()

@app.route('/delete_patient/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    conn = connect_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM Patient WHERE patient_id = %s", (patient_id,))
            conn.commit()
            return jsonify({"status": "success"})
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)