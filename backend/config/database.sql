-- phpMyAdmin SQL Dump
-- SAAS ERP/CRM Multi-Tenant Schema

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `erp_dashboard`;
USE `erp_dashboard`;

-- --------------------------------------------------------
-- Table structure for table `firms`
-- --------------------------------------------------------
CREATE TABLE `firms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firm_id` int(11) DEFAULT NULL, -- NULL for Super Admins
  `role` enum('super_admin','admin','employee','client') NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `firm_id` (`firm_id`),
  CONSTRAINT `users_firm_fk` FOREIGN KEY (`firm_id`) REFERENCES `firms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `clients`
-- --------------------------------------------------------
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firm_id` int(11) NOT NULL, -- Core Isolation
  `user_id` int(11) DEFAULT NULL, -- Links to their login account
  `company_name` varchar(255) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `service_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`service_details`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `firm_id` (`firm_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `clients_firm_fk` FOREIGN KEY (`firm_id`) REFERENCES `firms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `clients_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `employees`
-- --------------------------------------------------------
CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firm_id` int(11) NOT NULL, -- Core Isolation
  `user_id` int(11) DEFAULT NULL, -- Links to their login account
  `employee_code` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `firm_id` (`firm_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `employees_firm_fk` FOREIGN KEY (`firm_id`) REFERENCES `firms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `employees_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `incoming_register`
-- --------------------------------------------------------
CREATE TABLE `incoming_register` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firm_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `sender_name` varchar(255) NOT NULL,
  `received_by` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('received','processed','delivered') DEFAULT 'received',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `firm_id` (`firm_id`),
  CONSTRAINT `incoming_firm_fk` FOREIGN KEY (`firm_id`) REFERENCES `firms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `visitor_register`
-- --------------------------------------------------------
CREATE TABLE `visitor_register` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firm_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `visitor_name` varchar(255) NOT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `entry_time` time DEFAULT NULL,
  `exit_time` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `firm_id` (`firm_id`),
  CONSTRAINT `visitor_firm_fk` FOREIGN KEY (`firm_id`) REFERENCES `firms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `attendance`
-- --------------------------------------------------------
CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firm_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `status` enum('present','absent','late','half_day') DEFAULT 'present',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `firm_id` (`firm_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `attendance_firm_fk` FOREIGN KEY (`firm_id`) REFERENCES `firms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a default Super Admin for initial login
INSERT INTO `users` (`firm_id`, `role`, `name`, `email`, `password_hash`, `status`) 
VALUES (NULL, 'super_admin', 'System Super Admin', 'superadmin@cvr.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'); 
-- Note: Password is 'password'

COMMIT;
