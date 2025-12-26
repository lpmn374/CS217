
/*
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 21, 2025 lúc 03:18 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hfmd_system`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rule_base`
--

CREATE TABLE `rule_base` (
  `rule_id` varchar(50) NOT NULL,
  `priority` int(11) NOT NULL,
  `rule_type` varchar(50) NOT NULL,
  `condition_if` text DEFAULT NULL,
  `action_then` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `rule_base`
--

INSERT INTO `rule_base` (`rule_id`, `priority`, `rule_type`, `condition_if`, `action_then`) VALUES
('DIAG_L1', 20, 'Diagnosis', '(mouth_ulcer = True OR skin_rash = True) AND epidemiology_contact = True', 'diagnosis_status = \"Ca Lâm sàng TCM\"; next_action = \"Thực hiện Phân độ\";'),
('DIAG_L2', 10, 'Diagnosis', 'ev71_result = \"Positive\" OR other_enterovirus_result = \"Positive\" OR viral_isolation_result = \"Positive\"', 'diagnosis_status = \"Ca Xác định TCM\"; next_action = \"Thực hiện Phân độ\";'),
('GRADE_1', 6, 'Grading', '(mouth_ulcer = TRUE OR skin_rash = TRUE) AND current_grade IS NULL', 'current_grade = \"Độ 1\"; treatment_location = \"Ngoại trú\";'),
('GRADE_2A', 5, 'Grading', 'startle_reflex_history = 1 OR fever_duration_days >= 2 OR fever_temp >= 39.0 OR vomiting = TRUE OR lethargy = TRUE', 'current_grade = \"Độ 2a\";'),
('GRADE_2B_N1', 4, 'Grading', 'startle_reflex_exam = TRUE OR startle_reflex_history >= 2 OR (startle_reflex_history >= 1 AND heart_rate > 130)', 'current_grade = \"Độ 2b (Nhóm 1)\"; complication_type = \"Thần kinh cơ năng\";'),
('GRADE_2B_N2', 3, 'Grading', 'ataxia = TRUE OR nystagmus = TRUE OR limb_weakness = TRUE OR (fever_temp >= 39.0 AND heart_rate > 150)', 'current_grade = \"Độ 2b (Nhóm 2)\"; complication_type = \"Thần kinh thực thể\";'),
('GRADE_3', 2, 'Grading', 'heart_rate > 170 OR cranial_nerve_palsy = TRUE OR (respiratory_rate > 0 AND spo2 < 94.0)', 'current_grade = \"Độ 3\"; complication_type = \"Thần kinh thực vật nặng\";'),
('GRADE_4', 1, 'Grading', 'spo2 < 92.0 OR chest_xray_edema = TRUE OR coma_gcs < 10', 'current_grade = \"Độ 4\"; complication_type = \"Hô hấp/Tuần hoàn\";'),
('TREAT_L1_MILD', 30, 'Treatment', 'current_grade = \"Độ 1\" AND age_months >= 12 AND has_comorbidities = FALSE', 'treatment_location = \"Ngoại trú (Tại nhà/Trạm y tế)\"; transfer_needed = FALSE;'),
('TREAT_L2_RISK', 20, 'Treatment', 'current_grade = \"Độ 2a\" OR (current_grade = \"Độ 1\" AND age_months < 12) OR (current_grade = \"Độ 1\" AND has_comorbidities = TRUE)', 'treatment_location = \"Bệnh viện huyện hoặc bệnh viện tư nhân\"; transfer_needed = TRUE;'),
('TREAT_L3_SEVERE', 10, 'Treatment', 'current_grade IN (\"Độ 2b (Nhóm 1)\", \"Độ 2b (Nhóm 2)\", \"Độ 3\", \"Độ 4\")', 'treatment_location = \"Bệnh viện tỉnh hoặc Bệnh viện Nhi/Truyền nhiễm tuyến cuối\"; transfer_needed = TRUE;');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_grading_result`
--

CREATE TABLE `tb_grading_result` (
  `result_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `current_grade` varchar(20) DEFAULT NULL,
  `diagnosis_status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_grading_result`
--

INSERT INTO `tb_grading_result` (`result_id`, `patient_id`, `current_grade`, `diagnosis_status`) VALUES
(1, 19, 'Độ 4', 'Đã hoàn thành');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_patient_info`
--

CREATE TABLE `tb_patient_info` (
  `patient_id` int(11) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `age_months` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `has_comorbidities` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `result_grade` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_patient_info`
--

INSERT INTO `tb_patient_info` (`patient_id`, `full_name`, `age_months`, `gender`, `has_comorbidities`, `created_at`, `result_grade`) VALUES
(16, 'kiko', 34, 'female', 1, '2025-12-21 09:25:16', '4'),
(19, 'Lê Văn Lết', 13, 'male', 1, '2025-12-21 13:47:12', '4');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_treatment_plan`
--

CREATE TABLE `tb_treatment_plan` (
  `treatment_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `treatment_location` varchar(100) DEFAULT NULL,
  `transfer_needed` tinyint(1) DEFAULT NULL,
  `action_description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tb_vital_signs_neuro`
--

CREATE TABLE `tb_vital_signs_neuro` (
  `vs_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `heart_rate` int(11) DEFAULT NULL,
  `spo2` float DEFAULT NULL,
  `ataxia` tinyint(1) DEFAULT NULL,
  `startle_reflex_history` int(11) DEFAULT NULL,
  `fever_temp` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tb_vital_signs_neuro`
--

INSERT INTO `tb_vital_signs_neuro` (`vs_id`, `patient_id`, `heart_rate`, `spo2`, `ataxia`, `startle_reflex_history`, `fever_temp`) VALUES
(16, 16, 80, 80, NULL, NULL, NULL),
(19, 19, 75, 90, NULL, NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `rule_base`
--
ALTER TABLE `rule_base`
  ADD PRIMARY KEY (`rule_id`);

--
-- Chỉ mục cho bảng `tb_grading_result`
--
ALTER TABLE `tb_grading_result`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `tb_grading_result_ibfk_1` (`patient_id`);

--
-- Chỉ mục cho bảng `tb_patient_info`
--
ALTER TABLE `tb_patient_info`
  ADD PRIMARY KEY (`patient_id`);

--
-- Chỉ mục cho bảng `tb_treatment_plan`
--
ALTER TABLE `tb_treatment_plan`
  ADD PRIMARY KEY (`treatment_id`),
  ADD KEY `tb_treatment_plan_ibfk_1` (`patient_id`);

--
-- Chỉ mục cho bảng `tb_vital_signs_neuro`
--
ALTER TABLE `tb_vital_signs_neuro`
  ADD PRIMARY KEY (`vs_id`),
  ADD KEY `tb_vital_signs_neuro_ibfk_1` (`patient_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `tb_grading_result`
--
ALTER TABLE `tb_grading_result`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `tb_patient_info`
--
ALTER TABLE `tb_patient_info`
  MODIFY `patient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `tb_treatment_plan`
--
ALTER TABLE `tb_treatment_plan`
  MODIFY `treatment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `tb_vital_signs_neuro`
--
ALTER TABLE `tb_vital_signs_neuro`
  MODIFY `vs_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `tb_grading_result`
--
ALTER TABLE `tb_grading_result`
  ADD CONSTRAINT `tb_grading_result_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `tb_patient_info` (`patient_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tb_treatment_plan`
--
ALTER TABLE `tb_treatment_plan`
  ADD CONSTRAINT `tb_treatment_plan_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `tb_patient_info` (`patient_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tb_vital_signs_neuro`
--
ALTER TABLE `tb_vital_signs_neuro`
  ADD CONSTRAINT `tb_vital_signs_neuro_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `tb_patient_info` (`patient_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

*/

-- PHPMyAdmin SQL Dump
-- Hệ thống Chuyên gia Chẩn đoán & Phân độ Tay Chân Miệng (TCM)
-- Phác đồ cập nhật: QĐ 292/BYT 2024
-- Tác vụ: Tự động tính hiệu áp, Phân tầng logic chẩn đoán & phân độ

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hfmd_system`
--
CREATE DATABASE IF NOT EXISTS `hfmd_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `hfmd_system`;

-- --------------------------------------------------------
-- 1. BẢNG THÔNG TIN BỆNH NHÂN (Patient Info)
-- --------------------------------------------------------
CREATE TABLE `tb_patient_info` (
  `patient_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `age_months` int(11) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `epidemiology_contact` tinyint(1) DEFAULT 0,
  `has_comorbidities` tinyint(1) DEFAULT 0,
  `comorbidities_detail` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 2. BẢNG ĐÁNH GIÁ LÂM SÀNG (Clinical Assessment)
-- --------------------------------------------------------
CREATE TABLE `tb_clinical_assessment` (
  `assessment_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `fever` tinyint(1) DEFAULT 0,
  `fever_temp` float DEFAULT NULL,
  `fever_duration_days` int(11) DEFAULT 0,
  `fever_refractory` tinyint(1) DEFAULT 0,
  `symptom_progression_speed` varchar(20) DEFAULT 'Normal', -- Normal / Very Fast
  `mouth_ulcer` tinyint(1) DEFAULT 0,
  `ulcer_characteristics` varchar(50) DEFAULT 'Typical', -- Typical / Atypical
  `history_ulcer_recurrence` tinyint(1) DEFAULT 0,
  `skin_rash` tinyint(1) DEFAULT 0,
  `skin_rash_location` text DEFAULT NULL,
  `rash_type` varchar(100) DEFAULT NULL,
  `rash_itchiness` tinyint(1) DEFAULT 0,
  `rash_stages` varchar(50) DEFAULT NULL, -- Đồng đều / Nhiều độ tuổi
  `skin_rash_pain` tinyint(1) DEFAULT 0,
  `vomiting` tinyint(1) DEFAULT 0,
  `lethargy` tinyint(1) DEFAULT 0,
  `sleep_disturbance` tinyint(1) DEFAULT 0,
  `irritable_crying` tinyint(1) DEFAULT 0,
  `poor_feeding` tinyint(1) DEFAULT 0,
  `sore_throat` tinyint(1) DEFAULT 0,
  `fatigue` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`assessment_id`),
  KEY `fk_clinical_patient` (`patient_id`),
  CONSTRAINT `fk_clinical_patient` FOREIGN KEY (`patient_id`) REFERENCES `tb_patient_info` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 3. BẢNG SINH HIỆU & THẦN KINH (Tự động tính Hiệu áp)
-- --------------------------------------------------------
CREATE TABLE `tb_vital_signs_neuro` (
  `vs_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `heart_rate` int(11) DEFAULT NULL,
  `respiratory_rate` int(11) DEFAULT NULL,
  `respiratory_distress` tinyint(1) DEFAULT 0,
  `systolic_bp` int(11) DEFAULT NULL,
  `diastolic_bp` int(11) DEFAULT NULL,
  -- Tự động tính Hiệu áp (Pulse Pressure)
  `pulse_pressure` int(11) AS (systolic_bp - diastolic_bp) VIRTUAL,
  `unmeasurable_bp_pulse` tinyint(1) DEFAULT 0,
  `spo2` float DEFAULT NULL,
  `apnea_gasping` tinyint(1) DEFAULT 0,
  `cyanosis` tinyint(1) DEFAULT 0,
  `mottled_skin` tinyint(1) DEFAULT 0,
  `sweating` tinyint(1) DEFAULT 0,
  `startle_reflex_history` int(11) DEFAULT 0,
  `startle_reflex_exam` tinyint(1) DEFAULT 0,
  `ataxia` tinyint(1) DEFAULT 0,
  `nystagmus` tinyint(1) DEFAULT 0,
  `squint` tinyint(1) DEFAULT 0,
  `limb_weakness` tinyint(1) DEFAULT 0,
  `cranial_nerve_palsy` tinyint(1) DEFAULT 0,
  `muscle_tone_increased` tinyint(1) DEFAULT 0,
  `avpu_score` varchar(5) DEFAULT 'A',
  `coma_gcs` int(11) DEFAULT 15,
  PRIMARY KEY (`vs_id`),
  KEY `fk_vital_patient` (`patient_id`),
  CONSTRAINT `fk_vital_patient` FOREIGN KEY (`patient_id`) REFERENCES `tb_patient_info` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 4. BẢNG XÉT NGHIỆM (Lab Tests)
-- --------------------------------------------------------
CREATE TABLE `tb_lab_tests` (
  `lab_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `wbc_count` float DEFAULT NULL,
  `blood_glucose` float DEFAULT NULL,
  `ev71_result` varchar(20) DEFAULT 'NotDone',
  `other_enterovirus_result` varchar(20) DEFAULT 'NotDone',
  `viral_isolation_result` varchar(20) DEFAULT 'NotDone',
  `chest_xray_edema` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`lab_id`),
  KEY `fk_lab_patient` (`patient_id`),
  CONSTRAINT `fk_lab_patient` FOREIGN KEY (`patient_id`) REFERENCES `tb_patient_info` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 5. BẢNG KẾT QUẢ CUỐI CÙNG (Final Results)
-- --------------------------------------------------------
CREATE TABLE `tb_final_results` (
  `result_id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `diagnosis_status` varchar(100) DEFAULT NULL,
  `clinical_form` varchar(100) DEFAULT NULL,
  `current_grade` varchar(50) DEFAULT NULL,
  `treatment_location` varchar(255) DEFAULT NULL,
  `transfer_needed` tinyint(1) DEFAULT 0,
  `priority_level` varchar(20) DEFAULT 'NORMAL',
  `recommended_next_step` text DEFAULT NULL,
  PRIMARY KEY (`result_id`),
  KEY `fk_final_patient` (`patient_id`),
  CONSTRAINT `fk_final_patient` FOREIGN KEY (`patient_id`) REFERENCES `tb_patient_info` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 6. BẢNG CƠ SỞ LUẬT (Rule Base)
-- --------------------------------------------------------
CREATE TABLE `rule_base` (
  `rule_id` varchar(50) NOT NULL,
  `rule_type` varchar(50) NOT NULL,
  `priority` int(11) NOT NULL,
  `condition_if` text NOT NULL,
  `action_then` text NOT NULL,
  PRIMARY KEY (`rule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- NẠP DỮ LIỆU LUẬT (Hệ Chuyên Gia Hoàn Chỉnh)
-- --------------------------------------------------------
INSERT INTO `rule_base` (`rule_id`, `rule_type`, `priority`, `condition_if`, `action_then`) VALUES

-- LUẬT CHẨN ĐOÁN (DIAG)
('DIAG_L1', 'Diagnosis', 1, 
'(mouth_ulcer = 1 AND ulcer_characteristics = "Typical") OR (skin_rash = 1 AND epidemiology_contact = 1)', 
'diagnosis_status = "Ca lâm sàng TCM"; clinical_form = "Điển hình"'),

('DIAG_L2', 'Diagnosis', 2, 
'ev71_result = "Positive" OR other_enterovirus_result = "Positive" OR viral_isolation_result = "Positive"', 
'diagnosis_status = "Ca xác định TCM"'),

-- LUẬT PHÂN ĐỘ (ƯU TIÊN ĐỘ 4 ĐẾN ĐỘ 1)
('GRADE_4', 'Grading', 10, 
'apnea_gasping = 1 OR cyanosis = 1 OR spo2 < 92 OR unmeasurable_bp_pulse = 1 OR (systolic_bp < 70 AND age_months < 12) OR (systolic_bp < 80 AND age_months >= 12) OR pulse_pressure <= 25', 
'current_grade = "Độ 4"; priority_level = "CRITICAL"'),

('GRADE_3', 'Grading', 20, 
'(heart_rate > 170 AND fever = 0) OR (age_months < 12 AND systolic_bp > 100) OR (age_months BETWEEN 12 AND 23 AND systolic_bp > 110) OR (age_months >= 24 AND systolic_bp > 115) OR respiratory_distress = 1 OR spo2 < 94 OR mottled_skin = 1 OR sweating = 1', 
'current_grade = "Độ 3"; priority_level = "CRITICAL"'),

('GRADE_2B_N2', 'Grading', 30, 
'(fever_temp >= 39 AND fever_refractory = 1) OR (heart_rate > 150 AND fever = 0) OR ataxia = 1 OR nystagmus = 1 OR limb_weakness = 1 OR cranial_nerve_palsy = 1 OR coma_gcs < 10', 
'current_grade = "Độ 2b (Nhóm 2)"'),

('GRADE_2B_N1', 'Grading', 40, 
'startle_reflex_exam = 1 OR startle_reflex_history >= 2 OR (startle_reflex_history >= 1 AND lethargy = 1) OR (startle_reflex_history >= 1 AND heart_rate > 130 AND fever = 0)', 
'current_grade = "Độ 2b (Nhóm 1)"'),

('GRADE_2A', 'Grading', 50, 
'(startle_reflex_history > 0 AND startle_reflex_history < 2 AND startle_reflex_exam = 0) OR fever_duration_days > 2 OR (fever_temp >= 39 AND (vomiting = 1 OR lethargy = 1 OR sleep_disturbance = 1 OR irritable_crying = 1))', 
'current_grade = "Độ 2a"'),

('GRADE_1', 'Grading', 60, 
'mouth_ulcer = 1 OR skin_rash = 1', 
'current_grade = "Độ 1"'),

-- LUẬT PHÂN TUYẾN & XỬ TRÍ
('TREAT_01', 'Treatment', 100, 
'current_grade = "Độ 1" AND age_months >= 12 AND has_comorbidities = 0', 
'treatment_location = "Ngoại trú"; transfer_needed = 0'),

('TREAT_02', 'Treatment', 110, 
'current_grade = "Độ 2a" OR (current_grade = "Độ 1" AND (age_months < 12 OR has_comorbidities = 1))', 
'treatment_location = "Bệnh viện Tuyến huyện/tỉnh"; transfer_needed = 1'),

('TREAT_03', 'Treatment', 120, 
'current_grade IN ("Độ 2b (Nhóm 1)", "Độ 2b (Nhóm 2)", "Độ 3", "Độ 4")', 
'treatment_location = "Bệnh viện Tuyến cuối (Hồi sức tích cực)"; transfer_needed = 1');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;