SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `tb_treatment_plan`, `tb_grading_result`, `tb_vital_signs_neuro`, `Patient`, `ClinicalAssessment`, `VitalSignsNeuro`, `DiagnosticOutput`, `LabTests`, `HFMDGrading`, `TreatmentPlan`, `rule_base`;
SET FOREIGN_KEY_CHECKS = 1;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. Bảng Patient (Thông tin hành chính)
CREATE TABLE `Patient` (
  `patient_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `age_months` int(11) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `epidemiology_contact` tinyint(1) DEFAULT 0,
  `has_comorbidities` tinyint(1) DEFAULT 0,
  `comorbidities_detail` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Bảng ClinicalAssessment (Khám lâm sàng)
CREATE TABLE `ClinicalAssessment` (
  `ca_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `fever` tinyint(1) DEFAULT 0,
  `fever_temp` float DEFAULT NULL,
  `fever_duration_days` int(11) DEFAULT 0,
  `fever_refractory` tinyint(1) DEFAULT 0,
  `symptom_progression_speed` varchar(20) DEFAULT 'Normal',
  `mouth_ulcer` tinyint(1) DEFAULT 0,
  `ulcer_characteristics` varchar(20) DEFAULT NULL,
  `history_ulcer_recurrence` tinyint(1) DEFAULT 0,
  `skin_rash` tinyint(1) DEFAULT 0,
  `skin_rash_location` varchar(255) DEFAULT NULL,
  `rash_type` varchar(50) DEFAULT NULL,
  `post_auricular_lymph_nodes` tinyint(1) DEFAULT 0,
  `mucosal_bleeding` tinyint(1) DEFAULT 0,
  `rash_itchiness` tinyint(1) DEFAULT 0,
  `rash_stages` varchar(50) DEFAULT NULL,
  `skin_rash_pain` tinyint(1) DEFAULT 0,
  `vomiting` tinyint(1) DEFAULT 0,
  `lethargy` tinyint(1) DEFAULT 0,
  `sleep_disturbance` tinyint(1) DEFAULT 0,
  `irritable_crying` tinyint(1) DEFAULT 0,
  `poor_feeding` tinyint(1) DEFAULT 0,
  `sore_throat` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ca_id`),
  CONSTRAINT `chk_temp` CHECK (`fever_temp` > 37 OR `fever` = 0),
  CONSTRAINT `fk_ca_patient` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Bảng VitalSignsNeuro (Dấu hiệu sinh tồn & Thần kinh)
CREATE TABLE `VitalSignsNeuro` (
  `vsn_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `heart_rate` int(11) DEFAULT NULL,
  `respiratory_rate` int(11) DEFAULT NULL,
  `respiratory_distress` tinyint(1) DEFAULT 0,
  `systolic_bp` int(11) DEFAULT NULL,
  `diastolic_bp` int(11) DEFAULT NULL,
  `pulse_pressure` int(11) DEFAULT NULL,
  `unmeasurable_bp_pulse` tinyint(1) DEFAULT 0,
  `capillary_refill_time` int(11) DEFAULT NULL,
  `spo2` float DEFAULT NULL,
  `apnea_gasping` tinyint(1) DEFAULT 0,
  `cyanosis` tinyint(1) DEFAULT 0,
  `mottled_skin` tinyint(1) DEFAULT 0,
  `sweating` tinyint(1) DEFAULT 0,
  `startle_reflex_history` int(11) DEFAULT 0,
  `startle_reflex_exam` tinyint(1) DEFAULT 0,
  `ataxia` tinyint(1) DEFAULT 0,
  `nystagmus` tinyint(1) DEFAULT 0,
  `limb_weakness` tinyint(1) DEFAULT 0,
  `cranial_nerve_palsy` tinyint(1) DEFAULT 0,
  `muscle_tone_increased` tinyint(1) DEFAULT 0,
  `avpu_score` char(1) DEFAULT 'A',
  `coma_gcs` int(11) DEFAULT NULL,
  PRIMARY KEY (`vsn_id`),
  CONSTRAINT `fk_vsn_patient` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Bảng LabTests (Xét nghiệm - BỔ SUNG)
CREATE TABLE `LabTests` (
  `lab_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `ev71_result` varchar(20) DEFAULT 'NotDone', -- Positive/Negative/NotDone
  `other_enterovirus_result` varchar(20) DEFAULT 'NotDone',
  `viral_isolation_result` varchar(20) DEFAULT 'NotDone',
  `chest_xray_edema` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`lab_id`),
  CONSTRAINT `fk_lab_patient` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Bảng HFMDGrading (Phân độ chi tiết - BỔ SUNG)
CREATE TABLE `HFMDGrading` (
  `grading_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `current_grade` varchar(50) DEFAULT NULL,
  `complication_type` text DEFAULT NULL, -- Lưu dạng chuỗi cách nhau dấu phẩy
  PRIMARY KEY (`grading_id`),
  CONSTRAINT `fk_grading_patient` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 6. Bảng TreatmentPlan (Kế hoạch điều trị - BỔ SUNG)
CREATE TABLE `TreatmentPlan` (
  `tp_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `treatment_location` varchar(200) DEFAULT NULL,
  `transfer_needed` tinyint(1) DEFAULT 0,
  `current_facility_level` varchar(255) DEFAULT NULL,
  `warning_signs` text DEFAULT NULL,
  `oxygen_support` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`tp_id`),
  CONSTRAINT `fk_tp_patient` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 7. Bảng DiagnosticOutput (Kết quả tổng hợp cho giao diện)
CREATE TABLE `DiagnosticOutput` (
  `output_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `diagnosis_status` varchar(100) DEFAULT NULL,
  `current_grade` varchar(50) DEFAULT NULL,
  `clinical_form` varchar(100) DEFAULT NULL,
  `complication_type` text DEFAULT NULL,
  `lab_orders` text DEFAULT NULL,
  `treatment_location` varchar(200) DEFAULT NULL,
  `priority_level` char(1) DEFAULT '3',
  `differential_alert` text DEFAULT NULL,
  `recommended_next_step` text DEFAULT NULL,
  PRIMARY KEY (`output_id`),
  CONSTRAINT `fk_output_patient` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 8. Bảng rule_base
CREATE TABLE `rule_base` (
  `rule_id` varchar(50) NOT NULL,
  `priority` int(11) NOT NULL,
  `rule_type` varchar(50) NOT NULL,
  `condition_if` text DEFAULT NULL,
  `action_then` text DEFAULT NULL,
  PRIMARY KEY (`rule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
TRUNCATE TABLE `rule_base`;

INSERT INTO `rule_base` (`rule_id`, `priority`, `rule_type`, `condition_if`, `action_then`) VALUES

-- BƯỚC 2: BIẾN CHỨNG (5 LUẬT) - P: 1000

('R2.3.1', 1000, 'Complication', 
'(startle_reflex_history >= 1) OR (startle_reflex_exam == True) OR (lethargy == True) OR (ataxia == True) OR (nystagmus == True) OR (squint == True)', 
'if "Thần kinh" not in complication_type: complication_type.append("Thần kinh"); priority_level = "1"; recommended_next_step.append("Theo dõi sát, phân độ TCM liên tục, chuẩn bị chuyển tuyến nếu tiến triển.");'),

('R2.3.2', 995, 'Complication', 
'(limb_weakness == True) OR (cranial_nerve_palsy == True) OR (muscle_tone_increased == True) OR (avpu_score IN ("P", "U")) OR (coma_gcs < 8)', 
'if "Thần kinh" not in complication_type: complication_type.append("Thần kinh"); priority_level = "1"; recommended_next_step.append("Hồi sức tích cực – chuyển tuyến chuyên sâu.");'),

('R2.3.3', 990, 'Complication', 
'(heart_rate > 150) OR (capillary_refill_time > 2) OR (mottled_skin == True) OR (sweating == True)', 
'if "Tim mạch" not in complication_type: complication_type.append("Tim mạch"); priority_level = "1"; recommended_next_step.append("Theo dõi huyết động, cảnh báo sốc.");'),

('R2.3.4', 985, 'Complication', 
'(respiratory_distress == True) OR (respiratory_rate > 50) OR (respiratory_rate_high == True) OR (spo2 < 94) OR (stridor == True) OR (apnea_gasping == True)', 
'if "Hô hấp" not in complication_type: complication_type.append("Hô hấp"); priority_level = "1"; recommended_next_step.append("Thở oxy, theo dõi sát, chuẩn bị đặt nội khí quản nếu xấu.");'),

('R2.3.5', 980, 'Complication', 
'(chest_xray_edema == True) OR ((respiratory_distress == True) AND (cyanosis == True))', 
'if "Hô hấp" not in complication_type: complication_type.append("Hô hấp"); if "Tim mạch" not in complication_type: complication_type.append("Tim mạch"); priority_level = "1"; recommended_next_step.append("Đặt nội khí quản – hồi sức tích cực – chuyển tuyến an toàn.");'),

-- BƯỚC 3: PHÂN BIỆT (7 LUẬT) - P: 900 -> DỪNG CHƯƠNG TRÌNH
('R2.2.1', 907, 'Differential', 'mouth_ulcer == True and skin_rash == False and ulcer_characteristics == "Atypical" and history_ulcer_recurrence == True', 'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Ap-tơ"; stop_program = True;'),
('R2.2.2', 906, 'Differential', 'skin_rash == True and rash_type == "Phỏng nước điển hình" and skin_rash_location == "Toàn thân" and rash_stages == "Nhiều độ tuổi" and rash_itchiness == True', 'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Thủy đậu"; stop_program = True;'),
('R2.2.3', 905, 'Differential', 'skin_rash == True and (rash_type == "Chấm xuất huyết" or rash_type == "Bầm máu") and fever_temp >= 39.0 and mucosal_bleeding == True', 'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Sốt xuất huyết"; stop_program = True;'),
('R2.2.4', 904, 'Differential', 'skin_rash == True and rash_type == "Hoại tử trung tâm" and fever_temp >= 39.0 and symptom_progression_speed == "Very Fast"', 'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Nhiễm khuẩn huyết do Não mô cầu"; stop_program = True;'),
('R2.2.5', 903, 'Differential', 'skin_rash == True AND rash_type == "Mụn mủ" AND skin_rash_pain == True', 'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Viêm da mủ"; stop_program = True;'),
('R2.2.6', 902, 'Differential', 'skin_rash == True AND rash_type == "Hồng ban và sần" AND post_auricular_lymph_nodes == True', 'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Sốt phát ban"; stop_program = True;'),
('R2.2.7', 901, 'Differential', 'skin_rash == True AND rash_type == "Hồng ban đa dạng" AND rash_itchiness == True', 'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Dị ứng da"; stop_program = True;'),

-- BƯỚC 4, 5, 6, 7: PHÂN LOẠI BAN ĐẦU
('R_STEP4', 800, 'Diagnosis', '(mouth_ulcer == True and ulcer_characteristics == "Typical" and history_ulcer_recurrence == False) or (skin_rash == True and rash_type == "Phỏng nước điển hình" and skin_rash_location == "Lòng bàn tay, chân, gối, khuỷu, mông" and epidemiology_contact == True)', 'diagnosis_status = "Ca lâm sàng TCM"; clinical_form = "Cấp tính"; priority_level = "2";'),
('R_STEP5', 700, 'Diagnosis', 'diagnosis_status == None and mouth_ulcer == True and skin_rash == False and epidemiology_contact == True', 'diagnosis_status = "Ca lâm sàng TCM"; clinical_form = "Không điển hình (Chỉ loét miệng)"; priority_level = "2";'),
('R_STEP6', 600, 'Diagnosis', 'diagnosis_status == None and mouth_ulcer == False and skin_rash == False and complication_type != None and epidemiology_contact == True', 'diagnosis_status = "Ca lâm sàng TCM"; clinical_form = "Không điển hình (Thể kín)"; priority_level = "1";'),
('R_STEP7', 500, 'Diagnosis', 'diagnosis_status == None and (fever == True and (poor_feeding == True or sore_throat == True) and epidemiology_contact == True and mouth_ulcer == False and skin_rash == False)', 'diagnosis_status = "Ca nghi ngờ TCM"; priority_level = "3";'),

-- BƯỚC 8: GHI ĐÈ THỂ TỐI CẤP (P: 400)
('R_STEP8', 400, 'Diagnosis', 'diagnosis_status == "Ca lâm sàng TCM" and symptom_progression_speed == "Very Fast"', 'clinical_form = "Tối cấp"; priority_level = "1";'),

-- BƯỚC 9: GHI ĐÈ CA XÁC ĐỊNH (P: 300)
('R_STEP9', 300, 'Diagnosis', 'ev71_result == "Positive" or other_enterovirus_result == "Positive" or viral_isolation_result == "Positive"', 'diagnosis_status = "Ca xác định TCM";'),

-- PHÂN ĐỘ (6 LUẬT: 2.4.1 -> 2.4.6)

('G4', 200, 'Grading', '(apnea_gasping == True) or (cyanosis == True or spo2 < 92.0) or (chest_xray_edema == True) or (unmeasurable_bp_pulse == True) or (age_months < 12 and systolic_bp > 0 and systolic_bp < 70) or (age_months >= 12 and systolic_bp > 0 and systolic_bp < 80) or (pulse_pressure <= 25)', 'current_grade = "Độ 4"; priority_level = "1"; oxygen_support = True;'),
('G3', 190, 'Grading', '(heart_rate > 170 and fever == False) or (heart_rate > (170 + max(0, fever_temp - 38) * 10) and fever == True) or (age_months < 12 and systolic_bp >= 100) or (age_months >= 12 and age_months < 24 and systolic_bp >= 110) or (age_months >= 24 and systolic_bp >= 115) or (respiratory_rate_high == True) or (respiratory_distress == True) or (stridor == True) or (spo2 < 94.0) or (mottled_skin == True) or (sweating == True)', 'current_grade = "Độ 3"; oxygen_support = True;'),
('G2B2', 185, 'Grading', '(fever_temp >= 39.0 and fever_refractory == True) or (heart_rate > 150 and fever == False) or (heart_rate > (150 + max(0, fever_temp - 38) * 10) and fever == True) or (ataxia == True) or (nystagmus == True) or (squint == True) or (limb_weakness == True) or (cranial_nerve_palsy == True) or (muscle_tone_increased == True) or (coma_gcs < 10) or (avpu_score in ["P"])', 'current_grade = "Độ 2b (Nhóm 2)"; if "Thần kinh" not in complication_type: complication_type.append("Thần kinh");'),
('G2B1', 180, 'Grading', '(startle_reflex_exam == True) or (startle_reflex_history >= 2) or (startle_reflex_history >= 1 and lethargy == True) or (startle_reflex_history >= 1 and heart_rate > 130 and fever == False) or (startle_reflex_history >= 1 and heart_rate > (130 + max(0, fever_temp - 38) * 10) and fever == True)', 'current_grade = "Độ 2b (Nhóm 1)"; if "Thần kinh" not in complication_type: complication_type.append("Thần kinh");'),
('G2A', 170, 'Grading', '(startle_reflex_history > 0 and startle_reflex_history < 2 and startle_reflex_exam == False) or (fever_duration_days > 2) or (fever_temp >= 39.0 and (vomiting == True or lethargy == True or sleep_disturbance == True or irritable_crying == True))', 'current_grade = "Độ 2a";'),
('G1', 160, 'Grading', 'current_grade == None and diagnosis_status != None and (mouth_ulcer == True or skin_rash == True)', 'current_grade = "Độ 1";'),

-- LUẬT CẬN LÂM SÀNG (3 LUẬT: 2.5.1 -> 2.5.3)
('L2.5.1', 100, 'Lab', 'current_grade IN ("Độ 2a", "Độ 2b (Nhóm 1)", "Độ 2b (Nhóm 2)", "Độ 3", "Độ 4")', 'lab_orders.append("Xét nghiệm Công thức máu: Theo dõi bạch cầu và tiểu cầu. ");'),
('L2.5.2', 90, 'Lab', 'current_grade IN ("Độ 2b (Nhóm 1)", "Độ 2b (Nhóm 2)", "Độ 3", "Độ 4")', 'lab_orders.append("Chỉ định đo đường huyết, điện giải đồ, X-quang phổi. Lấy mẫu xét nghiệm vi rút. ");'),
('L2.5.3', 80, 'Lab', 'heart_rate >= 150 OR "Tim mạch" IN complication_type', 'lab_orders.append(" Chỉ định đo Troponin I, siêu âm tim. ");'),

-- LUẬT PHÂN TUYẾN (3 LUẬT: 2.6.1 -> 2.6.3)
('T2.6.1', 50, 'Treatment', 'current_grade == "Độ 1" AND age_months >= 12 AND has_comorbidities = False', 'treatment_location = "Ngoại trú (Tại nhà/Trạm y tế)"; transfer_needed = False; recommended_next_step.append(" Tái khám mỗi 1–2 ngày, dặn dấu hiệu chuyển nặng. ");'),
('T2.6.2', 45, 'Treatment', 'current_grade == "Độ 2a" OR (current_grade = "Độ 1" AND (age_months < 12 OR has_comorbidities = True))', 'treatment_location = "Bệnh viện huyện hoặc bệnh viện tư nhân"; transfer_needed = (current_facility_level == "Tuyến trạm y tế xã / Phòng khám tư nhân") ; recommended_next_step.append("Nhập viện để theo dõi sát vì cơ địa trẻ có nguy cơ chuyển nặng nhanh. ");'),
('T2.6.3', 40, 'Treatment', 'current_grade IN ("Độ 2b (Nhóm 1)", "Độ 2b (Nhóm 2)", "Độ 3", "Độ 4")', 'treatment_location = "Bệnh viện tỉnh hoặc Bệnh viện Nhi/Truyền nhiễm tuyến cuối"; transfer_needed = True ; priority_level = "1" ; recommended_next_step.append("Hồi sức tích cực, hội chẩn và chuyển tuyến an toàn nếu không đủ điều kiện. ")');
COMMIT;