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
    'database': 'hfmd_system',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def connect_db():
    try: 
        return pymysql.connect(**DB_CONFIG)
    except Exception as e: 
        print(f"Lỗi kết nối CSDL: {e}")
        return None

def run_python_inference(rules, context):
    """
    Chạy bộ suy diễn theo ĐÚNG QUY TRÌNH:
    1. Kiểm tra biến chứng
    2. Kiểm tra bệnh khác (nếu có -> DỪNG)
    3. Phân loại ca bệnh (4->7)
    4. Kiểm tra thể tối cấp (8)
    5. Kiểm tra ca xác định (9)
    6. Phân độ
    7. Chỉ định cận lâm sàng
    8. Phân tuyến điều trị
    """
    
    # Đảm bảo các list không bị None
    for list_key in ['complication_type', 'recommended_next_step', 'lab_orders']:
        if context.get(list_key) is None:
            context[list_key] = []

    globals_dict = {
        "__builtins__": None, 
        "max": max, "min": min, "len": len,
        "True": True, "False": False, "None": None
    }

    # Nhóm luật theo loại
    rules_by_type = {}
    for r in rules:
        rule_type = r['rule_type']
        if rule_type not in rules_by_type:
            rules_by_type[rule_type] = []
        rules_by_type[rule_type].append(r)
    
    # Sắp xếp theo priority
    for rule_type in rules_by_type:
        rules_by_type[rule_type].sort(key=lambda x: x['priority'], reverse=True)

    def execute_rule(rule): # Bỏ context và globals_dict ở đây
        if not rule: return False
        
        cond = str(rule['condition_if']).replace('\xa0', ' ').strip()
        cond = cond.replace('AND', 'and').replace('OR', 'or')

        # Tạo safe_context để tính toán hiệu áp (pulse_pressure)
        # nhưng vẫn giữ các giá trị khác là None để tránh trigger luật sai
        safe_ctx = context.copy()
        if safe_ctx.get('systolic_bp') is not None and safe_ctx.get('diastolic_bp') is not None:
            safe_ctx['pulse_pressure'] = safe_ctx['systolic_bp'] - safe_ctx['diastolic_bp']

        try:
            # Truy cập trực tiếp globals_dict từ hàm cha
            if eval(cond, globals_dict, safe_ctx):
                print(f"✅ Luật {rule['rule_id']} THỎA MÃN")
                actions = rule['action_then'].split(';')
                for action in actions:
                    act_strip = action.strip()
                    if act_strip:
                        # Thực thi trên context gốc
                        exec(act_strip, globals_dict, context)
                return True
        except TypeError:
            # Bắt lỗi khi so sánh số với None (ví dụ: None > 150)
            # Không làm gì cả, coi như luật không thỏa mãn do thiếu dữ liệu
            return False
        except Exception as e:
            print(f"⚠️ Lỗi cú pháp luật {rule['rule_id']}: {e}")
        return False

    # ============ QUY TRÌNH SUY DIỄN ============
    
    print("\n" + "="*80)
    print("🔍 BẮT ĐẦU QUY TRÌNH SUY DIỄN")
    print("="*80)
    
    # BƯỚC 1: KIỂM TRA BIẾN CHỨNG
    print("\n[BƯỚC 1] Kiểm tra biến chứng...")
    if 'Complication' in rules_by_type:
        for rule in rules_by_type['Complication']:
            execute_rule(rule)
    
    has_complications = len(context.get('complication_type', [])) > 0
    print(f"→ Có biến chứng: {has_complications}")
    if has_complications:
        print(f"→ Các biến chứng: {', '.join(context['complication_type'])}")
    
    # BƯỚC 2: KIỂM TRA BỆNH KHÁC (DIFFERENTIAL)
    print("\n[BƯỚC 2] Kiểm tra bệnh khác (Differential)...")
    if 'Differential' in rules_by_type:
        for rule in rules_by_type['Differential']:
            if execute_rule(rule):
                if context.get('stop_program'):
                    print("⛔ DỪNG: Nghi ngờ bệnh khác")
                    return True  # Dừng chương trình
    
    if context.get('differential_alert'):
        print(f"→ Phát hiện: {context['differential_alert']}")
        return True  # Dừng
    else:
        print("→ Không phải bệnh khác, tiếp tục phân loại TCM")
    
    # BƯỚC 3: PHÂN LOẠI CA BỆNH (4->7)
    print("\n[BƯỚC 3] Phân loại ca bệnh TCM...")
    diagnosis_rules = []
    if 'Diagnosis' in rules_by_type:
        # Lấy luật STEP4, STEP5, STEP6, STEP7
        diagnosis_rules = [r for r in rules_by_type['Diagnosis'] 
                          if r['rule_id'] in ['R_STEP4', 'R_STEP5', 'R_STEP6', 'R_STEP7']]
    
    case_found = False
    for rule in diagnosis_rules:
        if execute_rule(rule):
            case_found = True
            print(f"→ Phân loại: {context.get('diagnosis_status')} - {context.get('clinical_form')}")
            break
    
    # BƯỚC 4: KIỂM TRA THỂ TỐI CẤP (STEP8)
    print("\n[BƯỚC 4] Kiểm tra thể tối cấp...")
    if 'Diagnosis' in rules_by_type:
        step8_rule = [r for r in rules_by_type['Diagnosis'] if r['rule_id'] == 'R_STEP8']
        if step8_rule:
            if execute_rule(step8_rule[0]):
                print(f"→ Cập nhật: {context.get('clinical_form')}")
    
    # BƯỚC 5: KIỂM TRA CA XÁC ĐỊNH (STEP9)
    print("\n[BƯỚC 5] Kiểm tra ca xác định...")
    if 'Diagnosis' in rules_by_type:
        step9_rule = [r for r in rules_by_type['Diagnosis'] if r['rule_id'] == 'R_STEP9']
        if step9_rule:
            if execute_rule(step9_rule[0]):
                print(f"→ Cập nhật: {context.get('diagnosis_status')}")
                case_found = True
    
    if not case_found:
        print("→ KHÔNG MẮC BỆNH TCM")
        context['diagnosis_status'] = "Không mắc bệnh/Theo dõi thêm"
        context['current_grade'] = "Không phân độ"
        return True  # Dừng
    
    # BƯỚC 6: PHÂN ĐỘ
    print("\n[BƯỚC 6] Phân độ bệnh...")
    if 'Grading' in rules_by_type:
        for rule in rules_by_type['Grading']:
            if execute_rule(rule):
                print(f"→ Phân độ: {context.get('current_grade')}")
                break  # Dừng ở luật đầu tiên thỏa mãn
    
    if not context.get('current_grade'):
        context['current_grade'] = "Độ 1"
        print("→ Mặc định: Độ 1")
    
    # BƯỚC 7: CHỈ ĐỊNH CẬN LÂM SÀNG
    print("\n[BƯỚC 7] Chỉ định cận lâm sàng...")
    if 'Lab' in rules_by_type:
        for rule in rules_by_type['Lab']:
            execute_rule(rule)
    
    if context.get('lab_orders'):
        print(f"→ Chỉ định: {len(context['lab_orders'])} xét nghiệm")
    else:
        print("→ Không có chỉ định đặc biệt")
    
    # BƯỚC 8: PHÂN TUYẾN ĐIỀU TRỊ
    print("\n[BƯỚC 8] Phân tuyến điều trị...")
    if 'Treatment' in rules_by_type:
        for rule in rules_by_type['Treatment']:
            if execute_rule(rule):
                print(f"→ Tuyến điều trị: {context.get('treatment_location')}")
                break
    
    print("\n" + "="*80)
    print("✅ HOÀN THÀNH QUY TRÌNH SUY DIỄN")
    print("="*80 + "\n")
    
    return False  # Không dừng, đã hoàn thành

def save_to_db(conn, ctx):
    """Lưu toàn bộ dữ liệu vào database"""
    try:
        with conn.cursor() as cursor:
            # 1. LƯU PATIENT
            sql_p = """
                INSERT INTO Patient 
                (full_name, age_months, gender, epidemiology_contact, has_comorbidities, comorbidities_detail) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql_p, (
                ctx.get('full_name', 'N/A'), 
                ctx.get('age_months', 0),
                ctx.get('gender', 'Nam'),
                ctx.get('epidemiology_contact', 0),
                ctx.get('has_comorbidities', 0),
                ctx.get('comorbidities_detail', '')
            ))
            p_id = conn.insert_id()

            # 2. LƯU CLINICALASSESSMENT
            sql_ca = """
                INSERT INTO ClinicalAssessment 
                (patient_id, fever, fever_temp, fever_duration_days, fever_refractory,
                 mouth_ulcer, ulcer_characteristics, history_ulcer_recurrence,
                 skin_rash, skin_rash_location, rash_type, rash_stages, 
                 rash_itchiness, skin_rash_pain, post_auricular_lymph_nodes,
                 mucosal_bleeding, symptom_progression_speed, vomiting, lethargy,
                 sleep_disturbance, irritable_crying, poor_feeding, sore_throat)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql_ca, (
                p_id, ctx.get('fever', 0), ctx.get('fever_temp', 0),
                ctx.get('fever_duration_days', 1), ctx.get('fever_refractory', 0),
                ctx.get('mouth_ulcer', 0), ctx.get('ulcer_characteristics'),
                ctx.get('history_ulcer_recurrence', 0), ctx.get('skin_rash', 0),
                ctx.get('skin_rash_location'), ctx.get('rash_type'),
                ctx.get('rash_stages'), ctx.get('rash_itchiness', 0),
                ctx.get('skin_rash_pain', 0), ctx.get('post_auricular_lymph_nodes', 0),
                ctx.get('mucosal_bleeding', 0), ctx.get('symptom_progression_speed'),
                ctx.get('vomiting', 0), ctx.get('lethargy', 0),
                ctx.get('sleep_disturbance', 0), ctx.get('irritable_crying', 0),
                ctx.get('poor_feeding', 0), ctx.get('sore_throat', 0)
            ))

            # 3. LƯU VITALSIGNSNEURO
            sql_vsn = """
                INSERT INTO VitalSignsNeuro
                (patient_id, heart_rate, respiratory_rate, respiratory_distress,
                 systolic_bp, diastolic_bp, pulse_pressure, unmeasurable_bp_pulse,
                 capillary_refill_time, spo2, apnea_gasping, cyanosis, mottled_skin,
                 sweating, startle_reflex_history, startle_reflex_exam, ataxia,
                 nystagmus, limb_weakness, cranial_nerve_palsy, muscle_tone_increased,
                 avpu_score, coma_gcs)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql_vsn, (
                p_id, ctx.get('heart_rate', 100), ctx.get('respiratory_rate', 25),
                ctx.get('respiratory_distress', 0), ctx.get('systolic_bp', 95),
                ctx.get('diastolic_bp', 65), ctx.get('pulse_pressure', 30),
                ctx.get('unmeasurable_bp_pulse', 0), ctx.get('capillary_refill_time', 2),
                ctx.get('spo2', 100), ctx.get('apnea_gasping', 0),
                ctx.get('cyanosis', 0), ctx.get('mottled_skin', 0),
                ctx.get('sweating', 0), ctx.get('startle_reflex_history', 0),
                ctx.get('startle_reflex_exam', 0), ctx.get('ataxia', 0),
                ctx.get('nystagmus', 0), ctx.get('limb_weakness', 0),
                ctx.get('cranial_nerve_palsy', 0), ctx.get('muscle_tone_increased', 0),
                ctx.get('avpu_score', 'A'), ctx.get('coma_gcs', 15)
            ))

            # 4. LƯU LABTESTS
            sql_lab = """
                INSERT INTO LabTests
                (patient_id, ev71_result, other_enterovirus_result, 
                 viral_isolation_result, chest_xray_edema)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql_lab, (
                p_id, ctx.get('ev71_result', 'NotDone'),
                ctx.get('other_enterovirus_result', 'NotDone'),
                ctx.get('viral_isolation_result', 'NotDone'),
                ctx.get('chest_xray_edema', 0)
            ))

            # 5. LƯU DIAGNOSTICOUTPUT
            comp_str = ", ".join(ctx.get('complication_type', [])) if isinstance(ctx.get('complication_type'), list) else ""
            lab_str = ", ".join(ctx.get('lab_orders', [])) if isinstance(ctx.get('lab_orders'), list) else ""
            rec_str = " ".join(ctx.get('recommended_next_step', [])) if isinstance(ctx.get('recommended_next_step'), list) else str(ctx.get('recommended_next_step', ''))

            sql_output = """
                INSERT INTO DiagnosticOutput 
                (patient_id, diagnosis_status, current_grade, clinical_form, 
                 complication_type, lab_orders, treatment_location, 
                 priority_level, differential_alert, recommended_next_step) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql_output, (
                p_id, ctx.get('diagnosis_status'), ctx.get('current_grade'),
                ctx.get('clinical_form'), comp_str, lab_str,
                ctx.get('treatment_location'), str(ctx.get('priority_level', '3')),
                ctx.get('differential_alert'), rec_str
            ))

            conn.commit()
            print(f"✅ Đã lưu bệnh nhân: {ctx.get('full_name')} - Độ: {ctx.get('current_grade')}")
    except Exception as e:
        print(f"❌ Lỗi lưu DB: {e}")
        conn.rollback()

def clean_ctx(val):
    """Chuyển đổi mảng 1 phần tử thành chuỗi, xử lý None"""
    if isinstance(val, list):
        return val[0] if len(val) > 0 else ""
    if val is None:
        return ""
    return val

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    p = data.get('patient', {})
    c = data.get('clinical', {})
    v = data.get('vitals', {})
    l = data.get('lab', {})

    def to_int(val):
        if val is None or str(val).strip() == '': return None
        try: return int(val)
        except: return None

    def to_float(val):
        if val is None or str(val).strip() == '': return None
        try: return float(val)
        except: return None

    # Trong hàm diagnose, trước khi tạo ctx
    avpu_raw = v.get('avpu_score', 'A')
    if isinstance(avpu_raw, list) and len(avpu_raw) > 0:
        avpu_raw = avpu_raw[0]
    elif not avpu_raw:
        avpu_raw = 'A'

    ctx['avpu_score'] = str(avpu_raw)

    # KHỞI TẠO CONTEXT
    # Lấy giá trị sốt trước
    has_fever = int(c.get('fever', 0) or 0)
    ctx = {
        'full_name': p.get('full_name', 'N/A'),
        'age_months': to_int(p.get('age_months')) ,
        'gender': p.get('gender', 'N/A'),
        'epidemiology_contact': int(p.get('epidemiology_contact', 0) or 0),
        'has_comorbidities': int(p.get('has_comorbidities', 0) or 0),
        'comorbidities_detail': p.get('comorbidities_detail', ''),
        'fever': int(c.get('fever', 0) or 0),
        'fever_temp': to_float(c.get('fever_temp')) if has_fever == 1 else None,
        'fever_duration_days': to_int(c.get('fever_duration_days')) if has_fever == 1 else None,
        'fever_refractory': int(c.get('fever_refractory', 0) or 0),
        'mouth_ulcer': int(c.get('mouth_ulcer', 0) or 0),
        'ulcer_characteristics': c.get('ulcer_characteristics', 'Typical'),
        'history_ulcer_recurrence': int(c.get('history_ulcer_recurrence', 0) or 0),
        'skin_rash': int(c.get('skin_rash', 0) or 0),
        'rash_type': c.get('rash_type', ''),
        'skin_rash_location': c.get('skin_rash_location', ''),
        'rash_stages': c.get('rash_stages', ''),
        'rash_itchiness': int(c.get('rash_itchiness', 0) or 0),
        'skin_rash_pain': int(c.get('skin_rash_pain', 0) or 0),
        'post_auricular_lymph_nodes': int(c.get('post_auricular_lymph_nodes', 0) or 0),
        'mucosal_bleeding': int(c.get('mucosal_bleeding', 0) or 0),
        'symptom_progression_speed': c.get('symptom_progression_speed', 'Normal'),
        'vomiting': int(c.get('vomiting', 0) or 0),
        'lethargy': int(c.get('lethargy', 0) or 0),
        'sleep_disturbance': int(c.get('sleep_disturbance', 0) or 0),
        'irritable_crying': int(c.get('irritable_crying', 0) or 0),
        'poor_feeding': int(c.get('poor_feeding', 0) or 0),
        'sore_throat': int(c.get('sore_throat', 0) or 0),

        'heart_rate': to_int(v.get('heart_rate')),
        'respiratory_rate': to_int(v.get('respiratory_rate')),
        'respiratory_rate_high': int(v.get('respiratory_rate_high', 0) or 0),
        'respiratory_distress': int(v.get('respiratory_distress', 0) or 0),
        'spo2': to_float(v.get('spo2')),
        'systolic_bp': to_int(v.get('systolic_bp')),
        'diastolic_bp': to_int(v.get('diastolic_bp')),
        'pulse_pressure': to_int(v.get('pulse_pressure')),
        'unmeasurable_bp_pulse': int(v.get('unmeasurable_bp_pulse', 0) or 0),
        'capillary_refill_time': to_int(v.get('capillary_refill_time')),
        'mottled_skin': int(v.get('mottled_skin', 0) or 0),
        'sweating': int(v.get('sweating', 0) or 0),
        'cyanosis': int(v.get('cyanosis', 0) or 0),
        'stridor': int(v.get('stridor', 0) or 0),
        'apnea_gasping': int(v.get('apnea_gasping', 0) or 0),
        'startle_reflex_history': int(v.get('startle_reflex_history', 0) or 0),
        'startle_reflex_exam': int(v.get('startle_reflex_exam', 0) or 0),
        'ataxia': int(v.get('ataxia', 0) or 0),
        'nystagmus': int(v.get('nystagmus', 0) or 0),
        'squint': int(v.get('squint', 0) or 0),
        'limb_weakness': int(v.get('limb_weakness', 0) or 0),
        'cranial_nerve_palsy': int(v.get('cranial_nerve_palsy', 0) or 0),
        'muscle_tone_increased': int(v.get('muscle_tone_increased', 0) or 0),
        'avpu_score': v.get('avpu_score', 'A') or 'A',
        'coma_gcs': int(v.get('coma_gcs', 15) or 15),

        'ev71_result': l.get('ev71_result', 'NotDone'),
        'other_enterovirus_result': l.get('other_enterovirus_result', 'NotDone'),
        'viral_isolation_result': l.get('viral_isolation_result', 'NotDone'),
        'chest_xray_edema': int(l.get('chest_xray_edema', 0) or 0),

        'complication_type': [], 
        'recommended_next_step': [], 
        'lab_orders': [],
        'diagnosis_status': None, 
        'clinical_form': None, 
        'current_grade': None,
        'priority_level': "3", 
        'differential_alert': None, 
        'stop_program': False,
        'treatment_location': None, 
        'transfer_needed': False, 
        'oxygen_support': False,
        'current_facility_level': data.get('current_facility_level', 'Tuyến trạm y tế xã / Phòng khám tư nhân')
    }

    # Trước khi chạy inference, dọn dẹp các trường chuỗi quan trọng
    for key in ['skin_rash_location', 'rash_type', 'ulcer_characteristics', 
                'rash_stages', 'symptom_progression_speed', 'avpu_score',
                'ev71_result', 'other_enterovirus_result', 'viral_isolation_result']:
        ctx[key] = clean_ctx(ctx.get(key))

    conn = connect_db()
    if not conn: 
        return jsonify({"error": "Lỗi kết nối CSDL"}), 500
    
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM rule_base ORDER BY priority DESC")
            all_rules = cursor.fetchall()
        
        # CHẠY QUY TRÌNH SUY DIỄN
        run_python_inference(all_rules, ctx)

        # Lưu vào database
        save_to_db(conn, ctx)
        
    finally:
        conn.close()
    
    return jsonify(ctx)

@app.route('/history', methods=['GET'])
def get_history():
    conn = connect_db()
    if not conn: 
        return jsonify({"error": "DB Error"}), 500
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT p.patient_id as id, p.full_name as name, 
                       p.created_at as date, p.age_months, 
                       o.current_grade as grade, o.diagnosis_status as diagnosis,
                       o.treatment_location as treatment, 
                       o.complication_type as complication
                FROM Patient p
                JOIN DiagnosticOutput o ON p.patient_id = o.patient_id
                ORDER BY p.created_at DESC
            """
            cursor.execute(sql)
            return jsonify(cursor.fetchall())
    finally:
        conn.close()

@app.route('/delete_patient/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    conn = connect_db()
    if not conn:
        return jsonify({"error": "DB Error"}), 500
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM Patient WHERE patient_id = %s", (patient_id,))
            conn.commit()
            return jsonify({"status": "success"})
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
