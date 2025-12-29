

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
    Chạy bộ suy diễn: Vừa PRINT ra console, vừa LƯU VẾT (Inference Trace) để gửi về Frontend.
    Đã tích hợp logic tính pulse_pressure và xử lý lỗi so sánh None.
    """
    # 1. Khởi tạo danh sách lưu vết suy diễn cho Frontend
    inference_trace = []

    def log_and_print(step_label, message, rule_id=None, status="info"):
        """Hàm hỗ trợ: Vừa print console, vừa ghi log cho Frontend"""
        prefix = f"[{step_label}]" if step_label else ""
        rule_info = f" (Luật {rule_id})" if rule_id else ""
        print(f"{prefix} {message}{rule_info}")
        
        inference_trace.append({
            "step": step_label,
            "message": message,
            "rule_id": rule_id,
            "status": status  # info, success, warning, danger
        })

    # Đảm bảo các list không bị None
    for list_key in ['complication_type', 'recommended_next_step', 'lab_orders']:
        if context.get(list_key) is None:
            context[list_key] = []

    globals_dict = {
        "__builtins__": None, 
        "max": max, "min": min, "len": len,
        "True": True, "False": False, "None": None
    }

    # Nhóm luật theo loại và sắp xếp theo priority
    rules_by_type = {}
    for r in rules:
        rule_type = r['rule_type']
        if rule_type not in rules_by_type:
            rules_by_type[rule_type] = []
        rules_by_type[rule_type].append(r)
    
    for rule_type in rules_by_type:
        rules_by_type[rule_type].sort(key=lambda x: x['priority'], reverse=True)

    def execute_rule(rule, current_step_label):
        """Thực thi luật với xử lý an toàn pulse_pressure và lỗi so sánh None"""
        if not rule: return False
        
        cond = str(rule['condition_if']).replace('\xa0', ' ').strip()
        cond = cond.replace('AND', 'and').replace('OR', 'or')
        # Hỗ trợ cú pháp IN (...)
        cond = re.sub(r'IN\s*\((.*?)\)', r'in [\1]', cond, flags=re.IGNORECASE)

        # Tạo safe_context để tính toán pulse_pressure nội bộ
        safe_ctx = context.copy()
        if safe_ctx.get('systolic_bp') is not None and safe_ctx.get('diastolic_bp') is not None:
            safe_ctx['pulse_pressure'] = safe_ctx['systolic_bp'] - safe_ctx['diastolic_bp']

        try:
            if eval(cond, globals_dict, safe_ctx):
                log_and_print(current_step_label, f"✅ Luật thỏa mãn: {rule.get('description', rule['rule_id'])}", rule['rule_id'], "success")
                
                actions = rule['action_then'].split(';')
                for action in actions:
                    act_strip = action.strip()
                    if act_strip:
                        exec(act_strip, globals_dict, context)
                return True
        except TypeError:
            # Bắt lỗi khi so sánh số với None (ví dụ: None > 150) -> Coi như luật không khớp
            return False
        except Exception as e:
            log_and_print(current_step_label, f"⚠️ Lỗi cú pháp tại luật {rule['rule_id']}: {e}", rule['rule_id'], "danger")
        return False

    # ==================== BẮT ĐẦU QUY TRÌNH SUY DIỄN ====================
    print("\n" + "="*80)
    log_and_print("HỆ THỐNG", "🔍 BẮT ĐẦU QUY TRÌNH SUY DIỄN", status="info")
    print("="*80)

    # BƯỚC 1: KIỂM TRA BIẾN CHỨNG
    log_and_print("BƯỚC 1", "Kiểm tra biến chứng...")
    if 'Complication' in rules_by_type:
        for rule in rules_by_type['Complication']:
            execute_rule(rule, "BƯỚC 1")
    
    # BƯỚC 2: BỆNH KHÁC (DIFFERENTIAL)
    log_and_print("BƯỚC 2", "Kiểm tra chẩn đoán phân biệt...")
    if 'Differential' in rules_by_type:
        for rule in rules_by_type['Differential']:
            if execute_rule(rule, "BƯỚC 2"):
                if context.get('stop_program') or context.get('differential_alert'):
                    log_and_print("⛔ DỪNG", f"Nghi ngờ bệnh khác: {context.get('differential_alert')}", status="warning")
                    return True, inference_trace

    # BƯỚC 3: PHÂN LOẠI CA BỆNH (4 -> 7)
    log_and_print("BƯỚC 3", "Phân loại ca bệnh TCM (R_STEP4 -> R_STEP7)...")
    case_found = False
    if 'Diagnosis' in rules_by_type:
        diag_rules = [r for r in rules_by_type['Diagnosis'] if r['rule_id'] in ['R_STEP4', 'R_STEP5', 'R_STEP6', 'R_STEP7']]
        for rule in diag_rules:
            if execute_rule(rule, "BƯỚC 3"):
                case_found = True
                log_and_print("BƯỚC 3", f"→ Kết quả: {context.get('diagnosis_status')} - {context.get('clinical_form')}")
                break

    # BƯỚC 4: KIỂM TRA THỂ TỐI CẤP (R_STEP8)
    log_and_print("BƯỚC 4", "Kiểm tra thể tối cấp (R_STEP8)...")
    if 'Diagnosis' in rules_by_type:
        step8 = next((r for r in rules_by_type['Diagnosis'] if r['rule_id'] == 'R_STEP8'), None)
        if execute_rule(step8, "BƯỚC 4"):
            log_and_print("BƯỚC 4", f"→ Cập nhật lâm sàng: {context.get('clinical_form')}")

    # BƯỚC 5: KIỂM TRA CA XÁC ĐỊNH (R_STEP9)
    log_and_print("BƯỚC 5", "Kiểm tra tiêu chuẩn ca xác định (R_STEP9)...")
    if 'Diagnosis' in rules_by_type:
        step9 = next((r for r in rules_by_type['Diagnosis'] if r['rule_id'] == 'R_STEP9'), None)
        if execute_rule(step9, "BƯỚC 5"):
            case_found = True
            log_and_print("BƯỚC 5", f"→ Cập nhật trạng thái: {context.get('diagnosis_status')}")

    # Xử lý nếu không tìm thấy ca bệnh
    if not case_found:
        log_and_print("KẾT THÚC", "❌ KHÔNG PHÁT HIỆN DẤU HIỆU MẮC TCM", status="warning")
        context['diagnosis_status'] = "Không mắc bệnh/Theo dõi thêm"
        context['current_grade'] = "Không phân độ"
        return True, inference_trace

    # BƯỚC 6: PHÂN ĐỘ
    log_and_print("BƯỚC 6", "Tiến hành phân độ bệnh...")
    if 'Grading' in rules_by_type:
        for rule in rules_by_type['Grading']:
            if execute_rule(rule, "BƯỚC 6"):
                log_and_print("BƯỚC 6", f"→ Kết quả phân độ: {context.get('current_grade')}")
                break
    
    if not context.get('current_grade'):
        context['current_grade'] = "Độ 1"
        log_and_print("BƯỚC 6", "→ Mặc định: Độ 1")

    # BƯỚC 7: CHỈ ĐỊNH CẬN LÂM SÀNG
    log_and_print("BƯỚC 7", "Đưa ra chỉ định cận lâm sàng...")
    if 'Lab' in rules_by_type:
        for rule in rules_by_type['Lab']:
            execute_rule(rule, "BƯỚC 7")

    # BƯỚC 8: TUYẾN ĐIỀU TRỊ
    log_and_print("BƯỚC 8", "Xác định tuyến điều trị và xử trí...")
    if 'Treatment' in rules_by_type:
        for rule in rules_by_type['Treatment']:
            if execute_rule(rule, "BƯỚC 8"):
                log_and_print("BƯỚC 8", f"→ Tuyến điều trị: {context.get('treatment_location')}")
                break

    print("\n" + "="*80)
    log_and_print("HOÀN THÀNH", "✅ QUY TRÌNH SUY DIỄN KẾT THÚC THÀNH CÔNG", status="success")
    print("="*80 + "\n")
    
    return False, inference_trace

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

    # --- KHỞI TẠO CONTEXT ---
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

    # Dọn dẹp các trường chuỗi
    for key in ['skin_rash_location', 'rash_type', 'ulcer_characteristics', 
                'rash_stages', 'symptom_progression_speed', 'avpu_score',
                'ev71_result', 'other_enterovirus_result', 'viral_isolation_result']:
        ctx[key] = clean_ctx(ctx.get(key))

    conn = connect_db()
    if not conn: 
        return jsonify({"error": "Lỗi kết nối CSDL"}), 500
    
    # Khởi tạo biến trace để tránh lỗi nếu try block thất bại
    inference_trace = []

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM rule_base ORDER BY priority DESC")
            all_rules = cursor.fetchall()
        
        # --- SỬA TẠI ĐÂY: Chạy suy diễn và lấy vết (trace) ---
        stop_flag, inference_trace = run_python_inference(all_rules, ctx)

        # Lưu kết quả vào database như bình thường
        save_to_db(conn, ctx)
        
    except Exception as e:
        print(f"Lỗi trong quá trình xử lý: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
    
    # --- SỬA TẠI ĐÂY: Trả về kết quả chẩn đoán kèm Cây suy diễn ---
    return jsonify({
        "result": ctx,
        "inference_trace": inference_trace
    })

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
