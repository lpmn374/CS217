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

def run_python_inference(rules, context, step_mode=False):
    """
    Chạy bộ suy diễn với context đã cho
    step_mode=True: Dừng sau rule đầu tiên thỏa điều kiện
    """
    executed_any = False
    sorted_rules = sorted(rules, key=lambda x: x['priority'], reverse=True)
    
    # Đảm bảo các list không bị None
    for list_key in ['complication_type', 'recommended_next_step', 'lab_orders']:
        if context.get(list_key) is None:
            context[list_key] = []

    globals_dict = {
        "__builtins__": None, 
        "max": max, "min": min, "len": len,
        "True": True, "False": False, "None": None
    }

    for r in sorted_rules:
        cond = str(r['condition_if']).replace('\xa0', ' ').strip()
        cond = cond.replace('AND', 'and').replace('OR', 'or')
        cond = re.sub(r'IN\s*\((.*?)\)', r'in [\1]', cond, flags=re.IGNORECASE)

        try:
            if eval(cond, globals_dict, context):
                print(f"✅ Luật {r['rule_id']} THỎA MÃN | Priority: {r['priority']}")
                actions = r['action_then'].split(';')
                for action in actions:
                    act_strip = action.strip()
                    if act_strip:
                        exec(act_strip, globals_dict, context)
                
                executed_any = True
                if step_mode or context.get('stop_program'):
                    break
            else:
                print(f"⏭️  Luật {r['rule_id']} không thỏa | Priority: {r['priority']}")
        except Exception as e:
            print(f"⚠ Lỗi tại luật {r['rule_id']}: {e} | Logic: {cond}")
            
    return executed_any

def save_to_db(conn, ctx):
    """Lưu toàn bộ dữ liệu vào database"""
    try:
        with conn.cursor() as cursor:
            # 1. LƯU PATIENT
            sql_p = """
                INSERT INTO Patient 
                (full_name, age_months, gender, epidemiology_contact, has_comorbidities) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql_p, (
                ctx.get('full_name', 'N/A'), 
                ctx.get('age_months', 0),
                ctx.get('gender', 'Nam'),
                ctx.get('epidemiology_contact', 0),
                ctx.get('has_comorbidities', 0)
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
                ctx.get('fever_duration_days', 0), ctx.get('fever_refractory', 0),
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
                p_id, ctx.get('heart_rate', 0), ctx.get('respiratory_rate', 0),
                ctx.get('respiratory_distress', 0), ctx.get('systolic_bp', 0),
                ctx.get('diastolic_bp', 0), ctx.get('pulse_pressure', 0),
                ctx.get('unmeasurable_bp_pulse', 0), ctx.get('capillary_refill_time', 0),
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

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    p = data.get('patient', {})
    c = data.get('clinical', {})
    v = data.get('vitals', {})
    l = data.get('lab', {})

    # ✅ DEBUG: In ra dữ liệu nhận được
    print("\n" + "="*80)
    print("📥 DỮ LIỆU NHẬN TỪ REACT:")
    print("="*80)
    print(f"Clinical data: {c}")
    print(f"skin_rash: {c.get('skin_rash')}")
    print(f"rash_type: {c.get('rash_type')}")
    print(f"skin_rash_location (RAW): {c.get('skin_rash_location')}")
    print(f"rash_stages: {c.get('rash_stages')}")
    print(f"rash_itchiness: {c.get('rash_itchiness')}")
    print("="*80 + "\n")

    # KHỞI TẠO CONTEXT
    # ✅ SỬA: Xử lý skin_rash_location từ mảng thành chuỗi
    raw_location = c.get('skin_rash_location', '')
    if isinstance(raw_location, list):
        skin_rash_location = raw_location[0] if len(raw_location) > 0 else ''
    else:
        skin_rash_location = raw_location

    ctx = {
        'full_name': p.get('full_name', 'N/A'),
        'age_months': int(p.get('age_months', 0) or 0),
        'gender': p.get('gender', 'Nam'),
        'epidemiology_contact': int(p.get('epidemiology_contact', 0) or 0),
        'has_comorbidities': int(p.get('has_comorbidities', 0) or 0),

        'fever': int(c.get('fever', 0) or 0),
        'fever_temp': float(c.get('fever_temp', 0) or 0),
        'fever_duration_days': int(c.get('fever_duration_days', 0) or 0),
        'fever_refractory': int(c.get('fever_refractory', 0) or 0),
        'mouth_ulcer': int(c.get('mouth_ulcer', 0) or 0),
        'ulcer_characteristics': c.get('ulcer_characteristics', 'Typical'),
        'history_ulcer_recurrence': int(c.get('history_ulcer_recurrence', 0) or 0),
        'skin_rash': int(c.get('skin_rash', 0) or 0),
        'rash_type': c.get('rash_type', ''),
        'skin_rash_location': skin_rash_location,  # ✅ SỬA: Sử dụng biến đã chuyển đổi
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

        'heart_rate': int(v.get('heart_rate', 0) or 0),
        'respiratory_rate': int(v.get('respiratory_rate', 0) or 0),
        'respiratory_rate_high': int(v.get('respiratory_rate_high', 0) or 0),
        'respiratory_distress': int(v.get('respiratory_distress', 0) or 0),
        'spo2': float(v.get('spo2', 100) or 98),
        'systolic_bp': int(v.get('systolic_bp', 0) or 95),
        'diastolic_bp': int(v.get('diastolic_bp', 0) or 65),
        'pulse_pressure': int(v.get('pulse_pressure', 0) or 30),
        'unmeasurable_bp_pulse': int(v.get('unmeasurable_bp_pulse', 0) or 0),
        'capillary_refill_time': int(v.get('capillary_refill_time', 0) or 0),
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

        'complication_type': [], 'recommended_next_step': [], 'lab_orders': [],
        'diagnosis_status': None, 'clinical_form': None, 'current_grade': None,
        'priority_level': "3", 'differential_alert': None, 'stop_program': False,
        'treatment_location': None, 'transfer_needed': False, 'oxygen_support': False,
        'current_facility_level': data.get('current_facility_level', 'Tuyến trạm y tế xã / Phòng khám tư nhân')
    }

    # ✅ DEBUG: In ra context sau khi xử lý
    print("\n" + "="*80)
    print("🔧 CONTEXT SAU KHI XỬ LÝ:")
    print("="*80)
    print(f"skin_rash: {ctx['skin_rash']}")
    print(f"rash_type: {ctx['rash_type']}")
    print(f"skin_rash_location: {ctx['skin_rash_location']}")
    print(f"rash_stages: {ctx['rash_stages']}")
    print(f"rash_itchiness: {ctx['rash_itchiness']}")
    print("="*80 + "\n")

    conn = connect_db()
    if not conn: 
        return jsonify({"error": "Lỗi kết nối CSDL"}), 500
    
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM rule_base")
            all_rules = cursor.fetchall()
        
        rules_by_type = {
            t: [r for r in all_rules if r['rule_type'] == t] 
            for t in ['Complication', 'Differential', 'Diagnosis', 'Grading', 'Lab', 'Treatment']
        }

        # === LUỒNG SUY DIỄN ĐÚNG THEO YÊU CẦU ===
        
        # Bước 2: Kiểm tra biến chứng
        run_python_inference(rules_by_type['Complication'], ctx)
        
        # Bước 3: Phân biệt bệnh khác (CHỈ CHẠY 1 LẦN)
        if run_python_inference(rules_by_type['Differential'], ctx):
            if ctx.get('stop_program'):
                save_to_db(conn, ctx)
                return jsonify(ctx)

        # Bước 4-7: Phân loại ban đầu
        diag_base = [r for r in rules_by_type['Diagnosis'] 
                     if r['rule_id'] in ['R_STEP4', 'R_STEP5', 'R_STEP6', 'R_STEP7']]
        
        if not run_python_inference(diag_base, ctx, step_mode=True):
            # KHÔNG MẮC BỆNH -> DỪNG
            ctx['diagnosis_status'] = "Không mắc bệnh/Theo dõi thêm"
            ctx['current_grade'] = "Không phân độ"
            save_to_db(conn, ctx)
            return jsonify(ctx)
        
        # Bước 8: Ghi đè thể tối cấp
        run_python_inference([r for r in rules_by_type['Diagnosis'] 
                              if r['rule_id'] in ['R_STEP8', 'R_STEP9']], ctx)
        
        # Bước 9: Phân độ
        run_python_inference(rules_by_type['Grading'], ctx, step_mode=True)
        
        # Chỉ định cận lâm sàng
        run_python_inference(rules_by_type['Lab'], ctx)
        
        # Phân tuyến điều trị
        run_python_inference(rules_by_type['Treatment'], ctx)

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
