SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `tb_treatment_plan`, `tb_grading_result`, `tb_vital_signs_neuro`, `tb_patient_info`, `rule_base`;
SET FOREIGN_KEY_CHECKS = 1;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. Cấu trúc bảng `tb_patient_info`
CREATE TABLE `tb_patient_info` (
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

-- 2. Cấu trúc bảng `tb_vital_signs_neuro`
CREATE TABLE `tb_vital_signs_neuro` (
  `vs_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `fever` tinyint(1) DEFAULT 0,
  `fever_temp` float DEFAULT NULL,
  `fever_duration_days` int(11) DEFAULT 0,
  `fever_refractory` tinyint(1) DEFAULT 0,
  `mouth_ulcer` tinyint(1) DEFAULT 0,
  `ulcer_characteristics` varchar(20) DEFAULT NULL,
  `history_ulcer_recurrence` tinyint(1) DEFAULT 0,
  `skin_rash` tinyint(1) DEFAULT 0,
  `skin_rash_location` varchar(100) DEFAULT NULL,
  `rash_type` varchar(50) DEFAULT NULL,
  `post_auricular_lymph_nodes` tinyint(1) DEFAULT 0,
  `rash_itchiness` tinyint(1) DEFAULT 0,
  `rash_stages` varchar(50) DEFAULT NULL,
  `skin_rash_pain` tinyint(1) DEFAULT 0,
  `vomiting` tinyint(1) DEFAULT 0,
  `lethargy` tinyint(1) DEFAULT 0,
  `sleep_disturbance` tinyint(1) DEFAULT 0,
  `irritable_crying` tinyint(1) DEFAULT 0,
  `poor_feeding` tinyint(1) DEFAULT 0,
  `sore_throat` tinyint(1) DEFAULT 0,
  `fatigue` tinyint(1) DEFAULT 0,
  `symptom_progression_speed` varchar(20) DEFAULT 'Normal',
  `heart_rate` int(11) DEFAULT NULL,
  `respiratory_rate` int(11) DEFAULT NULL,
  `systolic_bp` int(11) DEFAULT NULL,
  `diastolic_bp` int(11) DEFAULT NULL,
  `pulse_pressure` int(11) DEFAULT NULL,
  `unmeasurable_bp_pulse` tinyint(1) DEFAULT 0,
  `respiratory_rate_high` tinyint(1) DEFAULT 0,
  `stridor` tinyint(1) DEFAULT 0,
  `spo2` float DEFAULT NULL,
  `coma_gcs` int(11) DEFAULT NULL,
  `avpu_score` char(1) DEFAULT 'A',
  `startle_reflex_history` int(11) DEFAULT 0,
  `startle_reflex_exam` tinyint(1) DEFAULT 0,
  `ataxia` tinyint(1) DEFAULT 0,
  `nystagmus` tinyint(1) DEFAULT 0,
  `squint` tinyint(1) DEFAULT 0,
  `limb_weakness` tinyint(1) DEFAULT 0,
  `muscle_tone_increased` tinyint(1) DEFAULT 0,
  `cranial_nerve_palsy` tinyint(1) DEFAULT 0,
  `respiratory_distress` tinyint(1) DEFAULT 0,
  `apnea_gasping` tinyint(1) DEFAULT 0,
  `cyanosis` tinyint(1) DEFAULT 0,
  `mottled_skin` tinyint(1) DEFAULT 0,
  `sweating` tinyint(1) DEFAULT 0,
  `wbc_count` float DEFAULT NULL,	
  `blood_glucose` float DEFAULT NULL,
  `platelet_count` float DEFAULT NULL,
  `crp_level` float DEFAULT NULL,
  `troponin_i` float DEFAULT NULL,
  `ev71_result` varchar(20) DEFAULT 'NotDone',
  `other_enterovirus_result` varchar(20) DEFAULT 'NotDone',
  `viral_isolation_result`  varchar(20) DEFAULT 'NotDone',
  `chest_xray_edema` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`vs_id`),
  CONSTRAINT `fk_vs_patient` FOREIGN KEY (`patient_id`) REFERENCES `tb_patient_info` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Cấu trúc bảng `tb_grading_result`
CREATE TABLE `tb_grading_result` (
  `result_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `diagnosis_status` varchar(50) DEFAULT NULL,
  `clinical_form` varchar(50) DEFAULT NULL,
  `current_grade` varchar(20) DEFAULT NULL,
  `priority_level` char(1) DEFAULT '3',
  `complication_type` varchar(50) DEFAULT NULL,
  `differential_alert` varchar(100) DEFAULT NULL,
  `primary_evidence` varchar(100) DEFAULT NULL,
  `recommended_next_step` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`result_id`),
  CONSTRAINT `fk_grade_patient` FOREIGN KEY (`patient_id`) REFERENCES `tb_patient_info` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Cấu trúc bảng `tb_treatment_plan`
CREATE TABLE `tb_treatment_plan` (
  `treatment_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `treatment_location` varchar(100) DEFAULT NULL,
  `transfer_needed` tinyint(1) DEFAULT 0,
  `warning_signs` text DEFAULT NULL,
  `oxygen_support` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`treatment_id`),
  CONSTRAINT `fk_treat_patient` FOREIGN KEY (`patient_id`) REFERENCES `tb_patient_info` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Cấu trúc bảng `rule_base`
CREATE TABLE `rule_base` (
  `rule_id` varchar(50) NOT NULL,
  `priority` int(11) NOT NULL,
  `rule_type` varchar(50) NOT NULL,
  `condition_if` text DEFAULT NULL,
  `action_then` text DEFAULT NULL,
  PRIMARY KEY (`rule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Nạp dữ liệu vào bảng `rule_base`
-- --------------------------------------------------------
INSERT INTO `rule_base` (`rule_id`, `priority`, `rule_type`, `condition_if`, `action_then`) VALUES
('DIFF_APHTHOUS', 110, 'Differential', 'mouth_ulcer = True AND skin_rash = False AND ulcer_characteristics = "Atypical" AND history_ulcer_recurrence = True', 'differential_alert = "Ap tơ"; recommended_next_step = "Theo dõi thêm, có khả năng là viêm loét miệng Ap-tơ";'),
('DIFF_VARICELLA', 105, 'Differential', 'skin_rash = True AND rash_type = "Phỏng nước điển hình" AND skin_rash_location = "Toàn thân" AND rash_stages = "Nhiều độ tuổi" AND rash_itchiness = True', 'differential_alert = "Thủy đậu"; recommended_next_step = "Nghi ngờ Thủy đậu (Varicella). Phỏng nước TCM thường khu trú và không ngứa";'),
('DIFF_DENGUE', 100, 'Differential', 'skin_rash = True AND (rash_type = "Chấm xuất huyết" OR rash_type = "Bầm máu") AND fever_temp >= 39.0', 'differential_alert = "Sốt xuất huyết/Nhiễm khuẩn huyết"; recommended_next_step = "Nghi ngờ Sốt xuất huyết Dengue, cần làm thêm NS1Ag";'),
('DIFF_MENINGOCOCCAL', 101, 'Differential', 'skin_rash = True AND rash_type = "Hoại tử"', 'differential_alert = "Sốt xuất huyết/Nhiễm khuẩn huyết"; recommended_next_step = "CẤP CỨU: Nghi ngờ nhiễm khuẩn huyết do Não mô cầu";'),
('DIFF_PYODERMA', 95, 'Differential', 'skin_rash = True AND rash_type = "Mụn mủ" AND skin_rash_pain = True', 'differential_alert = "Viêm da mủ"; recommended_next_step = "Nghi ngờ Viêm da mủ, kiểm tra tình trạng vệ sinh da";'),
('DIFF_ALLERGY', 90, 'Differential', 'skin_rash = True AND rash_type = "Hồng ban đa dạng" AND rash_itchiness = True AND fever = False', 'differential_alert = "Dị ứng"; recommended_next_step = "Nghi ngờ Dị ứng da";'),
('DIFF_EXANTHEMA', 91, 'Differential', 'skin_rash = True AND rash_type = "Hồng ban và sẩn" AND fever = True AND post_auricular_lymph_nodes = True', 'differential_alert = "Sốt phát ban"; recommended_next_step = "Nghi ngờ Sốt phát ban (Roseola/Rubella)";'),
('DIFF_APHTHOUS_ALT', 111, 'Differential', 'mouth_ulcer = True AND ulcer_characteristics = "Typical" AND history_ulcer_recurrence = True', 'differential_alert = "Ap tơ"; recommended_next_step = "Loét miệng có tiền sử tái phát, theo dõi Ap-tơ";'),
('DIAG_SUSPECTED', 85, 'Diagnosis', 'fever = True AND (poor_feeding = True OR sore_throat = True) AND epidemiology_contact = True AND mouth_ulcer = False AND skin_rash = False', 'diagnosis_status = "Ca nghi ngờ TCM"; priority_level = "3"; recommended_next_step = "Theo dõi sát dấu hiệu loét miệng/phát ban trong 24 - 48h tới";'),
('DIAG_CLINICAL_TYPICAL', 84, 'Diagnosis', '(mouth_ulcer = True AND ulcer_characteristics = "Typical" AND history_ulcer_recurrence = False) OR (skin_rash = True AND skin_rash_location IN ("Lòng bàn tay, chân, gối, khuỷu, mông")) AND epidemiology_contact = True', 'diagnosis_status = "Ca lâm sàng TCM"; clinical_form = "Cấp tính"; priority_level = "2"; recommended_next_step = "Kích hoạt Module Phân độ và Chỉ định xét nghiệm vi rút";'),
('DIAG_CLINICAL_ULCER_ONLY', 83, 'Diagnosis', 'mouth_ulcer = True AND skin_rash = False AND epidemiology_contact = True AND diagnosis_status IS NULL', 'diagnosis_status = "Ca lâm sàng TCM"; clinical_form = "Không điển hình (Chỉ loét miệng)"; priority_level = "2"; recommended_next_step = "Theo dõi sát chuyển độ và làm xét nghiệm vi rút";'),
('DIAG_CLINICAL_HIDDEN', 82, 'Diagnosis', '(startle_reflex_history > 0 OR startle_reflex_exam = True) AND epidemiology_contact = True AND mouth_ulcer = False AND skin_rash = False', 'diagnosis_status = "Ca lâm sàng TCM"; clinical_form = "Không điển hình (Thể kín)"; priority_level = "1"; recommended_next_step = "CẢNH BÁO: Trẻ có dấu hiệu thần kinh dù không có phát ban điển hình. Nhập viện cấp cứu và xét nghiệm PCR ngay";'),
('DIAG_ULTRA_ACUTE', 81, 'Diagnosis', 'diagnosis_status = "Ca lâm sàng TCM" AND symptom_progression_speed = "Very Fast"', 'clinical_form = "Tối cấp"; priority_level = "1"; recommended_next_step = "CẢNH BÁO: Thể tối cấp - Nguy cơ tử vong rất cao, hồi sức cấp cứu khẩn cấp.";'),
('DIAG_CONFIRMED', 80, 'Diagnosis', 'diagnosis_status = "Ca lâm sàng TCM" AND (ev71_result = "Positive" OR other_enterovirus_result = "Positive" OR viral_isolation_result = "Positive")', 'diagnosis_status = "Ca xác định TCM"; recommended_next_step = "Ghi nhận tác nhân. Nếu là EV71, tăng tần suất theo dõi biến chứng thần kinh";'),
('GRADE_4', 10, 'Grading', 'apnea_gasping = True OR cyanosis = True OR spo2 < 92 OR chest_xray_edema = True OR unmeasurable_bp_pulse = True OR ((systolic_bp < 70) AND (age_months < 12)) OR ((systolic_bp < 80) AND (age_months >= 12)) OR pulse_pressure <= 25', 'current_grade = "Độ 4"; priority_level = "1";'),
('GRADE_3', 20, 'Grading', '((heart_rate > 170) AND (fever = False)) OR ((systolic_bp > 100) AND age_months < 12) OR ((systolic_bp > 110) AND (age_months >= 12 AND age_months <= 23)) OR ((systolic_bp > 115) AND (age_months >=24)) OR respiratory_distress = True OR spo2 < 94 OR mottled_skin = True OR sweating = True', 'current_grade = "Độ 3"; priority_level = "1";'),
('GRADE_2B_N2', 30, 'Grading', '((mouth_ulcer = True OR skin_rash = True) AND fever = true AND fever_temp >= 39 AND fever_refractory = True) OR (heart_rate > 150 AND fever = false) OR ataxia = True OR nystagmus = True OR squint = True OR limb_weakness = True OR cranial_nerve_palsy = True OR muscle_tone_increased = True OR coma_gcs < 10 OR avpu_score = "P"', 'current_grade = "Độ 2b (Nhóm 2)"; priority_level = "1";'),
('GRADE_2B_N1', 40, 'Grading', 'startle_reflex_exam = True OR startle_reflex_history >= 2 OR (startle_reflex_history > 0 AND lethargy = True) OR (startle_reflex_history > 0 AND heart_rate > 130 AND fever = False)', 'current_grade = "Độ 2b (Nhóm 1)"; priority_level = "1";'),
('GRADE_2A', 50, 'Grading', '(startle_reflex_history > 0 AND startle_reflex_history < 2 AND startle_reflex_exam = False) OR fever_duration_days >= 2 OR (fever_temp >= 39 AND (vomiting = True OR lethargy = True OR sleep_disturbance = True OR irritable_crying = True))', 'current_grade = "Độ 2a"; priority_level = "2";'),
('GRADE_1', 60, 'Grading', 'mouth_ulcer = True OR skin_rash = True', 'current_grade = "Độ 1"; priority_level = "3";'),
('TREAT_L1_MILD', 30, 'Treatment', 'current_grade = ''Độ 1'' AND age_months >= 12 AND has_comorbidities = FALSE', 'treatment_location = ''Ngoại trú (Tại nhà/Trạm y tế)''; transfer_needed = FALSE;'),
('TREAT_L2_RISK', 20, 'Treatment', 'current_grade = ''Độ 1'' AND (age_months < 12 OR has_comorbidities = TRUE) OR current_grade = ''Độ 2a''', 'treatment_location = ''Bệnh viện huyện hoặc bệnh viện tư nhân''; transfer_needed = TRUE;'),
('TREAT_L3_SEVERE', 10, 'Treatment', 'current_grade IN (''Độ 2b (Nhóm 1)'', ''Độ 2b (Nhóm 2)'', ''Độ 3'', ''Độ 4'')', 'treatment_location = ''Bệnh viện tỉnh hoặc Tuyến cuối''; transfer_needed = TRUE;');

COMMIT;