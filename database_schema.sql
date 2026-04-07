-- Create Database
CREATE DATABASE IF NOT EXISTS cdmis_db;
USE cdmis_db;

-- Departments Table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role ENUM('Administrator', 'Departmental Records Custodian', 'Staff') NOT NULL,
    department_id INT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Documents Table
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department_id INT NULL,
    uploader_id INT NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    review_date DATE NULL,
    version INT DEFAULT 1,
    restriction_type ENUM('Public', 'Confidential') DEFAULT 'Public',
    status ENUM('Draft', 'Approved', 'Archived') DEFAULT 'Draft',
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500),
    type VARCHAR(100),
    meta_tags TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
);

-- NAP Data Table (1-to-1 with Documents)
CREATE TABLE nap_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL UNIQUE,
    office_name VARCHAR(255),
    department VARCHAR(255),
    telephone VARCHAR(50),
    section VARCHAR(255),
    email VARCHAR(255),
    address VARCHAR(500),
    person_in_charge VARCHAR(255),
    date_prepared DATE,
    period_covered VARCHAR(255),
    volume VARCHAR(255),
    medium VARCHAR(255),
    restriction VARCHAR(255),
    location VARCHAR(255),
    frequency VARCHAR(255),
    duplication VARCHAR(255),
    time_value ENUM('T', 'P', ''),
    utility_value VARCHAR(255), -- Stored as comma-separated or JSON
    retention_active VARCHAR(50),
    retention_storage VARCHAR(50),
    retention_total VARCHAR(50),
    disposition VARCHAR(255),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- Document Versions Table
CREATE TABLE document_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    version INT NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500),
    uploader_id INT NOT NULL,
    description TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Document Requests Table
CREATE TABLE document_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    requester_id INT NOT NULL,
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    purpose TEXT NOT NULL,
    id_upload_url VARCHAR(500),
    approver_id INT NULL,
    decision_date DATETIME NULL,
    reviewer_comment TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Activity Logs Table
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    department_id INT NULL,
    document_id INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    type ENUM('success', 'error', 'info') DEFAULT 'info',
    related_document_id INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- Insert Default Data
INSERT INTO departments (name) VALUES ('Administrative'), ('IT Department'), ('HR Department');

INSERT INTO users (employee_id, name, role, department_id, password) VALUES 
('PIA - 0001', 'Admin User', 'Administrator', 1, '1234'),
('PIA - 0002', 'DRC User', 'Departmental Records Custodian', 2, '1234'),
('PIA - 0003', 'Staff User', 'Staff', 3, '1234');
