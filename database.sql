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
  `age_months` int(11) NOT NULL CHECK (`age_months` >= 0),
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
  `fever_duration_days` int(11) DEFAULT NULL,
  CONSTRAINT `chk_fever_days` CHECK ((`fever`= 0 and `fever_duration_days` IS NULL AND `fever_temp` IS NULL) or (`fever` = 1 and `fever_duration_days` >= 1)),
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
  `heart_rate` int(11) DEFAULT NULL CHECK (`heart_rate` > 0),
  `respiratory_rate` int(11) DEFAULT NULL CHECK (`respiratory_rate` > 0),
  `respiratory_distress` tinyint(1) DEFAULT 0,
  `systolic_bp` int(11) DEFAULT NULL CHECK (`systolic_bp` > 0),
  `diastolic_bp` int(11) DEFAULT NULL CHECK (`diastolic_bp` > 0),
  `pulse_pressure` int(11) DEFAULT NULL CHECK (`pulse_pressure` > 0),
  `unmeasurable_bp_pulse` tinyint(1) DEFAULT 0,
  `capillary_refill_time` int(11) DEFAULT NULL CHECK (`capillary_refill_time` > 0),
  `respiratory_rate_high` tinyint(1) DEFAULT 0,
  `spo2` float DEFAULT NULL CHECK (`spo2` > 0 AND `spo2` <= 100),
  `apnea_gasping` tinyint(1) DEFAULT 0,
  `cyanosis` tinyint(1) DEFAULT 0,
  `mottled_skin` tinyint(1) DEFAULT 0,
  `sweating` tinyint(1) DEFAULT 0,
  `startle_reflex_history` int(11) DEFAULT 0 CHECK (`startle_reflex_history` >= 0),
  `startle_reflex_exam` tinyint(1) DEFAULT 0,
  `ataxia` tinyint(1) DEFAULT 0,
  `nystagmus` tinyint(1) DEFAULT 0,
  `limb_weakness` tinyint(1) DEFAULT 0,
  `squint` tinyint(1) DEFAULT 0,
  `cranial_nerve_palsy` tinyint(1) DEFAULT 0,
  `muscle_tone_increased` tinyint(1) DEFAULT 0,
  `avpu_score` char(1) DEFAULT 'A',
  `coma_gcs` int(11) DEFAULT NULL CHECK (`coma_gcs` >= 3),
  PRIMARY KEY (`vsn_id`),
  CONSTRAINT `fk_vsn_patient` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Bảng LabTests (Xét nghiệm)
CREATE TABLE `LabTests` (
  `lab_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `ev71_result` varchar(20) DEFAULT 'NotDone',
  `other_enterovirus_result` varchar(20) DEFAULT 'NotDone',
  `viral_isolation_result` varchar(20) DEFAULT 'NotDone',
  `chest_xray_edema` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`lab_id`),
  CONSTRAINT `fk_lab_patient` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Bảng HFMDGrading (Phân độ chi tiết)
CREATE TABLE `HFMDGrading` (
  `grading_id` int(11) NOT NULL AUTO_INCREMENT,
  `current_grade` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`grading_id`),
  UNIQUE KEY `uk_grade` (`current_grade`) -- Rất quan trọng để làm khóa ngoại
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- NẠP DỮ LIỆU DANH MỤC (BẮT BUỘC)
INSERT INTO `HFMDGrading` (`current_grade`, `description`) VALUES 
('Độ 1', 'Tay chân miệng thể nhẹ'),
('Độ 2a', 'Biến chứng thần kinh nhẹ'),
('Độ 2b (Nhóm 1)', 'Biến chứng thần kinh nặng N1'),
('Độ 2b (Nhóm 2)', 'Biến chứng thần kinh nặng N2'),
('Độ 3', 'Biến chứng thần kinh thực vật/Hô hấp/Tuần hoàn'),
('Độ 4', 'Nguy kịch');

-- 6. Bảng TreatmentPlan (Kế hoạch điều trị)
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
  `recommended_next_step` text DEFAULT NULL,
  `treatment_location` varchar(200) DEFAULT NULL,
  `priority_level` char(1) DEFAULT '3',
  `differential_alert` text DEFAULT NULL,
  PRIMARY KEY (`output_id`),
  CONSTRAINT `fk_output_patient` FOREIGN KEY (`patient_id`) REFERENCES `Patient` (`patient_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_output_grading` FOREIGN KEY (`current_grade`) REFERENCES `HFMDGrading` (`current_grade`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Bảng rule_base
CREATE TABLE `rule_base` (
  `rule_id` varchar(50) NOT NULL,
  `priority` int(11) NOT NULL,
  `rule_type` varchar(50) NOT NULL,
  `condition_if` text DEFAULT NULL,
  `action_then` text DEFAULT NULL,
  PRIMARY KEY (`rule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- LUẬT SUY DIỄN THEO QUY TRÌNH MỚI
-- =====================================================

TRUNCATE TABLE `rule_base`;

INSERT INTO `rule_base` (`rule_id`, `priority`, `rule_type`, `condition_if`, `action_then`) VALUES

-- =====================================================
-- BƯỚC 1: BIẾN CHỨNG (Priority: 1000-900)
-- =====================================================
('R2.3.1', 1000, 'Complication', 
'(startle_reflex_history >= 1) or (startle_reflex_exam == 1) or (lethargy == 1) or (ataxia == 1) or (nystagmus == 1) or (squint == 1)', 
'if "Thần kinh" not in complication_type: complication_type.append("Thần kinh"); priority_level = "1"; recommended_next_step.append("Theo dõi sát, phân độ TCM liên tục, chuẩn bị chuyển tuyến nếu tiến triển. ");'),

('R2.3.2', 995, 'Complication', 
'(limb_weakness == 1) or (cranial_nerve_palsy == 1) or (muscle_tone_increased == 1) or (avpu_score in ["P", "U"]) or (coma_gcs < 8)', 
'if "Thần kinh" not in complication_type: complication_type.append("Thần kinh"); priority_level = "1"; recommended_next_step.append("Hồi sức tích cực – chuyển tuyến chuyên sâu. ");'),

('R2.3.3', 990, 'Complication', 
'(heart_rate > 150) or ((heart_rate or 100) < 40) or (capillary_refill_time > 2) or (mottled_skin == 1) or (sweating == 1)', 
'if "Tim mạch" not in complication_type: complication_type.append("Tim mạch"); priority_level = "1"; recommended_next_step.append("Theo dõi huyết động, cảnh báo sốc. ");'),

('R2.3.4', 985, 'Complication', 
'(respiratory_distress == 1) or (respiratory_rate > 50) or ((respiratory_rate or 25) < 10) or (respiratory_rate_high == 1) or (spo2 < 94) or (apnea_gasping == 1)', 
'if "Hô hấp" not in complication_type: complication_type.append("Hô hấp"); priority_level = "1"; recommended_next_step.append("Thở oxy, theo dõi sát, chuẩn bị đặt nội khí quản nếu xấu. ");'),

('R2.3.5', 980, 'Complication', 
'(chest_xray_edema == 1) or ((respiratory_distress == 1) and (cyanosis == 1))', 
'if "Hô hấp" not in complication_type: complication_type.append("Hô hấp"); if "Tim mạch" not in complication_type: complication_type.append("Tim mạch"); priority_level = "1"; recommended_next_step.append("Đặt nội khí quản – hồi sức tích cực – chuyển tuyến an toàn. ");'),

-- =====================================================
-- BƯỚC 2: PHÂN BIỆT BỆNH KHÁC (Priority: 900-850) - DỪNG CHƯƠNG TRÌNH
-- =====================================================
('R2.2.1', 907, 'Differential', 
'mouth_ulcer == 1 and skin_rash == 0 and ulcer_characteristics == "Atypical" and history_ulcer_recurrence == 1 and ev71_result != "Positive" and other_enterovirus_result != "Positive" and viral_isolation_result != "Positive"', 
'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Ap-tơ"; stop_program = True; recommended_next_step.append("Trẻ nghi ngờ mắc Ap-tơ. Cần đưa trẻ đến cơ sở y tế để kiểm tra và làm xét nghiệm loại trừ. ");'),

('R2.2.2', 906, 'Differential', 
'skin_rash == 1 and rash_type == "Phỏng nước điển hình" and skin_rash_location == "Toàn thân" and rash_stages == "Nhiều độ tuổi" and rash_itchiness == 1 and ev71_result != "Positive" and other_enterovirus_result != "Positive" and viral_isolation_result != "Positive"', 
'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Thủy đậu"; stop_program = True; recommended_next_step.append("Trẻ nghi ngờ mắc Thủy đậu. Cần đưa trẻ đến cơ sở y tế để kiểm tra và làm xét nghiệm loại trừ. ");'),

('R2.2.3', 905, 'Differential', 
'skin_rash == 1 and (rash_type == "Chấm xuất huyết" or rash_type == "Bầm máu") and fever_temp >= 39.0 and mucosal_bleeding == 1 and ev71_result != "Positive" and other_enterovirus_result != "Positive" and viral_isolation_result != "Positive"', 
'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Sốt xuất huyết"; stop_program = True; recommended_next_step.append("Trẻ nghi ngờ mắc Sốt xuất huyết. Cần đưa trẻ đến cơ sở y tế để kiểm tra và làm xét nghiệm loại trừ. ");'),

('R2.2.4', 904, 'Differential', 
'skin_rash == 1 and rash_type == "Hoại tử trung tâm" and fever_temp >= 39.0 and symptom_progression_speed == "Very Fast" and ev71_result != "Positive" and other_enterovirus_result != "Positive" and viral_isolation_result != "Positive"', 
'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Nhiễm khuẩn huyết do não mô cầu"; stop_program = True; recommended_next_step.append("Trẻ nghi ngờ mắc Nhiễm khuẩn huyết do Não mô cầu. Cần nhanh đưa trẻ đến cơ sở y tế để kiểm tra, cấp cứu và làm xét nghiệm loại trừ. ");'),

('R2.2.5', 903, 'Differential', 
'skin_rash == 1 and rash_type == "Mụn mủ" and skin_rash_pain == 1 and ev71_result != "Positive" and other_enterovirus_result != "Positive" and viral_isolation_result != "Positive"', 
'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Viêm da mủ"; stop_program = True; recommended_next_step.append("Trẻ nghi ngờ mắc Viêm da mủ. Cần đưa trẻ đến cơ sở y tế để kiểm tra và làm xét nghiệm loại trừ. ");'),

('R2.2.6', 902, 'Differential', 
'skin_rash == 1 and rash_type == "hong_ban_san" and post_auricular_lymph_nodes == 1 and ev71_result != "Positive" and other_enterovirus_result != "Positive" and viral_isolation_result != "Positive"', 
'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Sốt phát ban"; stop_program = True; recommended_next_step.append("Trẻ nghi ngờ mắc Sốt phát ban. Cần đưa trẻ đến cơ sở y tế để kiểm tra và làm xét nghiệm loại trừ. ");'),

('R2.2.7', 901, 'Differential', 
'skin_rash == 1 and rash_type == "hong_ban_da_dang" and rash_itchiness == 1 and ev71_result != "Positive" and other_enterovirus_result != "Positive" and viral_isolation_result != "Positive"', 
'diagnosis_status = "Nghi ngờ bệnh khác"; differential_alert = "Dị ứng da"; stop_program = True; recommended_next_step.append("Trẻ nghi ngờ mắc Dị ứng da. Cần đưa trẻ đến cơ sở y tế để kiểm tra và làm xét nghiệm loại trừ. ");'),

-- =====================================================
-- BƯỚC 3: PHÂN LOẠI CA BỆNH (4-7) (Priority: 800-500)
-- =====================================================
-- BƯỚC 4: Ca lâm sàng điển hình
('R_STEP4', 800, 'Diagnosis', 
'(mouth_ulcer == 1 and ulcer_characteristics == "Typical" and history_ulcer_recurrence == 0) or (skin_rash == 1 and rash_type == "Phỏng nước điển hình" and (skin_rash_location == "Lòng bàn tay, chân, gối, khuỷu, mông" or epidemiology_contact == 1 or rash_stages == "Đồng đều"))', 
'diagnosis_status = "Ca lâm sàng TCM"; clinical_form = "Cấp tính"; priority_level = "2"; recommended_next_step.append("Theo dõi sát các dấu hiệu chuyển độ và làm xét nghiệm vi rút để khẳng định. ");'),

-- BƯỚC 5: Ca lâm sàng không điển hình (chỉ loét miệng)
('R_STEP5', 700, 'Diagnosis', 
'(diagnosis_status == None and mouth_ulcer == 1 and skin_rash == 0 and (history_ulcer_recurrence == 0 or epidemiology_contact == 1))', 
'diagnosis_status = "Ca lâm sàng TCM"; clinical_form = "Không điển hình (Chỉ loét miệng)"; priority_level = "2";'),

-- BƯỚC 6: Ca lâm sàng không điển hình (thể kín - chỉ có triệu chứng nội khoa)
('R_STEP6', 600, 'Diagnosis', 
'diagnosis_status == None and mouth_ulcer == 0 and skin_rash == 0 and len(complication_type) > 0 and epidemiology_contact == 1', 
'diagnosis_status = "Ca lâm sàng TCM"; clinical_form = "Không điển hình (Thể kín)"; priority_level = "1";'),

-- BƯỚC 7: Ca nghi ngờ
('R_STEP7', 500, 'Diagnosis', 
'diagnosis_status == None and (fever == 1 and (poor_feeding == 1 or sore_throat == 1) and epidemiology_contact == 1 and mouth_ulcer == 0 and skin_rash == 0)', 
'diagnosis_status = "Ca nghi ngờ TCM"; priority_level = "3"; recommended_next_step.append("Theo dõi sát dấu hiệu loét miệng/phát ban trong 24 - 48h tới. ");'),

-- =====================================================
-- BƯỚC 4: GHI ĐÈ THỂ TỐI CẤP (8) (Priority: 400 -> 850)
-- =====================================================
('R_STEP8', 850, 'Diagnosis', 
'diagnosis_status == "Ca lâm sàng TCM" and symptom_progression_speed == "Very Fast"', 
'clinical_form = "Tối cấp"; priority_level = "1"; recommended_next_step.append("Thể tối cấp - Nguy cơ tử vong rất cao, hồi sức cấp cứu khẩn cấp. ");'),

-- =====================================================
-- BƯỚC 5: GHI ĐÈ CA XÁC ĐỊNH (9) (Priority: 300 -> 890)
-- =====================================================
('R_STEP9', 890, 'Diagnosis', 
'ev71_result == "Positive" or other_enterovirus_result == "Positive" or viral_isolation_result == "Positive"', 
'diagnosis_status = "Ca xác định TCM";'),

-- =====================================================
-- BƯỚC 6: PHÂN ĐỘ (Priority: 200-160)
-- =====================================================
('G4', 200, 'Grading', 
'(apnea_gasping == 1) or (cyanosis == 1 or spo2 < 92.0) or (chest_xray_edema == 1) or (unmeasurable_bp_pulse == 1) or (age_months < 12 and systolic_bp > 0 and systolic_bp < 70) or (age_months >= 12 and systolic_bp > 0 and systolic_bp < 80) or (pulse_pressure <= 25)', 
'current_grade = "Độ 4"; priority_level = "1"; oxygen_support = True; recommended_next_step.append("Suy hô hấp tuần hoàn rất nặng. Yêu cầu hồi sức cấp cứu khẩn cấp (vận mạch, thở máy, cân nhắc lọc máu). ");'),

('G3', 190, 'Grading', 
'(age_months < 12 and systolic_bp >= 100) or (age_months >= 12 and age_months < 24 and systolic_bp >= 110) or (age_months >= 24 and systolic_bp >= 115) or (respiratory_rate_high == 1) or (respiratory_distress == 1) or (spo2 < 94.0) or (mottled_skin == 1) or (sweating == 1) or (heart_rate > 170 and fever == 0) or (heart_rate > (170 + max(0, (fever_temp or 38) - 38) * 10) and fever == 1)', 
'current_grade = "Độ 3"; oxygen_support = True; recommended_next_step.append("Biến chứng thần kinh thực vật, suy hô hấp, tuần hoàn nặng. Theo dõi sát mạch, huyết áp. ");'),

('G2B2', 185, 'Grading', 
'(ataxia == 1) or (nystagmus == 1) or (squint == 1) or (limb_weakness == 1) or (cranial_nerve_palsy == 1) or (muscle_tone_increased == 1) or (coma_gcs < 10) or (avpu_score in ["P"]) or ((mouth_ulcer == 1 or skin_rash == 1) and fever_temp >= 39.0 and fever_refractory == 1) or (heart_rate > 150 and fever == 0) or (heart_rate > (150 + max(0, (fever_temp or 38) - 38) * 10) and fever == 1)', 
'current_grade = "Độ 2b (Nhóm 2)"; if "Thần kinh" not in complication_type: complication_type.append("Thần kinh"); recommended_next_step.append("Có biến chứng thần kinh nặng. Điều trị tích cực, theo dõi sát các chỉ số như mạch, huyết áp, SpO2. ");'),

('G2B1', 180, 'Grading', 
'(startle_reflex_exam == 1) or (startle_reflex_history >= 2) or (startle_reflex_history >= 1 and lethargy == 1) or (startle_reflex_history >= 1 and heart_rate > 130 and fever == 0) or (startle_reflex_history >= 1 and heart_rate > (130 + max(0, (fever_temp or 38) - 38) * 10) and fever == 1)', 
'current_grade = "Độ 2b (Nhóm 1)"; if "Thần kinh" not in complication_type: complication_type.append("Thần kinh"); recommended_next_step.append("Có dấu hiệu biến chứng thần kinh giai đoạn sớm. Theo dõi mạch, nhiệt độ, huyết áp, nhịp thở, kiểu thở, tri giác, ran phổi, SpO2 (tất cả trẻ có mạch nhanh hoặc mạch chậm phải đo huyết áp) mỗi 1-3 giờ trong 6 giờ đầu, sau đó theo chu kỳ 4 - 6 giờ. ");'),

('G2A', 170, 'Grading', 
'(startle_reflex_history > 0 and startle_reflex_history < 2 and startle_reflex_exam == 0) or (fever_duration_days > 2) or (fever_temp >= 39.0 and (vomiting == 1 or lethargy == 1 or sleep_disturbance == 1 or irritable_crying == 1))', 
'current_grade = "Độ 2a"; recommended_next_step.append("Biến chứng thần kinh nhẹ, cần theo dõi sát: Đảm bảo dinh dưỡng, nghỉ ngơi và vệ sinh cho trẻ. Theo dõi sinh hiệu: mạch, nhiệt độ, nhịp thở, tri giác, SpO2 mỗi 6-12 giờ. Cần tái khám nếu có thêm triệu chứng hoặc triệu chứng chuyển xấu. ");'),

('G1', 160, 'Grading', 
'current_grade == None and diagnosis_status != None and (mouth_ulcer == 1 or skin_rash == 1)', 
'current_grade = "Độ 1"; recommended_next_step.append(“Đảm bảo dinh dưỡng, nghỉ ngơi và vệ sinh cho trẻ. Tái khám mỗi 1 - 2 ngày trong 7-10 ngày đầu của bệnh. Trẻ có sốt phải tái khám mỗi ngày cho đến khi hết sốt ít nhất 48 giờ. Cần tái khám nếu có thêm triệu chứng hoặc triệu chứng chuyển xấu. ”);'),

-- =====================================================
-- BƯỚC 7: CHỈ ĐỊNH CẬN LÂM SÀNG (Priority: 100-80)
-- =====================================================
('L2.5.1', 100, 'Lab', 
'current_grade in ["Độ 2a", "Độ 2b (Nhóm 1)", "Độ 2b (Nhóm 2)", "Độ 3", "Độ 4"]', 
'lab_orders.append("Xét nghiệm Công thức máu: Theo dõi bạch cầu và tiểu cầu. ");'),

('L2.5.2', 90, 'Lab', 
'current_grade in ["Độ 2b (Nhóm 1)", "Độ 2b (Nhóm 2)", "Độ 3", "Độ 4"]', 
'lab_orders.append("Chỉ định đo đường huyết, điện giải đồ, X-quang phổi. Lấy mẫu xét nghiệm vi rút. ");'),

('L2.5.3', 80, 'Lab', 
'heart_rate >= 150 or "Tim mạch" in complication_type', 
'lab_orders.append(" Chỉ định đo Troponin I, siêu âm tim. ");'),

-- =====================================================
-- BƯỚC 8: PHÂN TUYẾN ĐIỀU TRỊ (Priority: 50-40)
-- =====================================================
('T2.6.1', 50, 'Treatment', 
'current_grade == "Độ 1" and age_months >= 12 and has_comorbidities == 0', 
'treatment_location = "Ngoại trú (Tại nhà /Trạm y tế)"; transfer_needed = False; recommended_next_step.append(" Tái khám mỗi 1–2 ngày, chú ý dấu hiệu chuyển nặng. ");'),

('T2.6.2', 45, 'Treatment', 
'current_grade == "Độ 2a" or (current_grade == "Độ 1" and (age_months < 12 or has_comorbidities == 1))', 
'treatment_location = "Bệnh viện huyện hoặc bệnh viện tư nhân"; transfer_needed = (current_facility_level == "Tuyến trạm y tế xã / Phòng khám tư nhân") ; recommended_next_step.append("Nhập viện để theo dõi sát vì cơ địa trẻ có nguy cơ chuyển nặng nhanh. ");'),

('T2.6.3', 40, 'Treatment', 
'current_grade in ["Độ 2b (Nhóm 1)", "Độ 2b (Nhóm 2)", "Độ 3", "Độ 4"]', 
'treatment_location = "Bệnh viện tỉnh hoặc Bệnh viện Nhi/Truyền nhiễm tuyến cuối"; transfer_needed = True ; priority_level = "1" ; recommended_next_step.append("Hồi sức tích cực, hội chẩn và chuyển tuyến an toàn nếu không đủ điều kiện. ")');

-- Nếu là Độ 1 mà có dấu hiệu thần kinh nhẹ (tương ứng R2.3.1) -> Lên Độ 2b Nhóm 1
INSERT INTO `rule_base` (`rule_id`, `priority`, `rule_type`, `condition_if`, `action_then`) 
VALUES ('UPGRADE_2B1', 182, 'UpGrading', 
'current_grade == "Độ 1" and "Thần kinh" in complication_type and (startle_reflex_history >= 1 or lethargy == 1)', 
'current_grade = "Độ 2b (Nhóm 1)";');

-- Nếu là Độ 1 mà có dấu hiệu thần kinh nặng (tương ứng R2.3.2) -> Lên Độ 2b Nhóm 2
INSERT INTO `rule_base` (`rule_id`, `priority`, `rule_type`, `condition_if`, `action_then`) 
VALUES ('UPGRADE_2B2', 187, 'UpGrading', 
'current_grade == "Độ 1" and "Thần kinh" in complication_type and (avpu_score in ["V", "P", "U"] or coma_gcs < 13 or limb_weakness == 1)', 
'current_grade = "Độ 2b (Nhóm 2)";');

COMMIT;