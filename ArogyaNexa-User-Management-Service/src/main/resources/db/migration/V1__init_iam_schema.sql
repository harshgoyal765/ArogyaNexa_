-- ============================================================
-- ArogyaNexa IAM Schema - PostgreSQL V1
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- Roles table
-- ============================================================
CREATE TABLE roles (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Permissions table
-- ============================================================
CREATE TABLE permissions (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    resource    VARCHAR(100) NOT NULL,
    action      VARCHAR(50)  NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Role ↔ Permission mapping
-- ============================================================
CREATE TABLE role_permissions (
    role_id       BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role 
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission 
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- ============================================================
-- Users table
-- ============================================================
CREATE TABLE users (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid                    UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    first_name              VARCHAR(100) NOT NULL,
    last_name               VARCHAR(100) NOT NULL,
    email                   VARCHAR(255) NOT NULL UNIQUE,
    phone                   VARCHAR(20),
    password_hash           VARCHAR(255) NOT NULL,
    password_changed_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_enabled              BOOLEAN      NOT NULL DEFAULT TRUE,
    is_account_non_locked   BOOLEAN      NOT NULL DEFAULT TRUE,
    is_email_verified       BOOLEAN      NOT NULL DEFAULT FALSE,
    failed_login_attempts   INT          NOT NULL DEFAULT 0,
    locked_until            TIMESTAMP,
    mfa_enabled             BOOLEAN      NOT NULL DEFAULT FALSE,
    mfa_secret              VARCHAR(255),
    last_login_at           TIMESTAMP,
    created_at              TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              VARCHAR(100),
    updated_by              VARCHAR(100)
);

-- ============================================================
-- User ↔ Role mapping
-- ============================================================
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role 
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ============================================================
-- Refresh tokens
-- ============================================================
CREATE TABLE refresh_tokens (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    user_id     BIGINT       NOT NULL,
    expires_at  TIMESTAMP    NOT NULL,
    revoked     BOOLEAN      NOT NULL DEFAULT FALSE,
    revoked_at  TIMESTAMP,
    device_info VARCHAR(255),
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rt_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Password reset tokens
-- ============================================================
CREATE TABLE password_reset_tokens (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    user_id     BIGINT       NOT NULL,
    expires_at  TIMESTAMP    NOT NULL,
    used        BOOLEAN      NOT NULL DEFAULT FALSE,
    used_at     TIMESTAMP,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prt_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Email verification tokens
-- ============================================================
CREATE TABLE email_verification_tokens (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    user_id     BIGINT       NOT NULL,
    expires_at  TIMESTAMP    NOT NULL,
    used        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evt_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Audit logs
-- ============================================================
CREATE TABLE audit_logs (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT,
    action      VARCHAR(100) NOT NULL,
    resource    VARCHAR(100),
    details     TEXT,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(500),
    status      VARCHAR(20)  NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_audit_user_id  ON audit_logs(user_id);
CREATE INDEX idx_audit_action   ON audit_logs(action);
CREATE INDEX idx_audit_created  ON audit_logs(created_at);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_enabled ON users(is_enabled);

-- ============================================================
-- Trigger for updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Seed: Roles
-- ============================================================
INSERT INTO roles (name, description) VALUES
('SUPER_ADMIN','Full system access'),
('ADMIN','Platform administration'),
('PHARMACIST','Prescription validation and medicine management'),
('SALES_PERSON','Sales and order management'),
('EDITOR','Content and product editing'),
('SHIPPER','Shipping and delivery management'),
('CUSTOMER','Regular customer');

-- ============================================================
-- Seed: Permissions
-- ============================================================
INSERT INTO permissions (name, description, resource, action) VALUES
('USER_READ','View users','USER','READ'),
('USER_WRITE','Create/update users','USER','WRITE'),
('USER_DELETE','Delete users','USER','DELETE'),
('USER_MANAGE','Full user management','USER','MANAGE'),

('PRODUCT_READ','View products','PRODUCT','READ'),
('PRODUCT_WRITE','Create/update products','PRODUCT','WRITE'),
('PRODUCT_DELETE','Delete products','PRODUCT','DELETE'),

('ORDER_READ','View orders','ORDER','READ'),
('ORDER_WRITE','Create/update orders','ORDER','WRITE'),
('ORDER_MANAGE','Full order management','ORDER','MANAGE'),

('PRESCRIPTION_READ','View prescriptions','PRESCRIPTION','READ'),
('PRESCRIPTION_APPROVE','Approve prescriptions','PRESCRIPTION','WRITE'),

('INVENTORY_READ','View inventory','INVENTORY','READ'),
('INVENTORY_WRITE','Update inventory','INVENTORY','WRITE'),

('SHIPPING_READ','View shipments','SHIPPING','READ'),
('SHIPPING_WRITE','Update shipments','SHIPPING','WRITE'),

('REPORT_READ','View reports','REPORT','READ');

-- ============================================================
-- Role → Permission Mapping
-- ============================================================

-- SUPER_ADMIN (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'SUPER_ADMIN';

-- ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN (
'USER_READ','USER_WRITE','PRODUCT_READ','PRODUCT_WRITE',
'ORDER_READ','ORDER_MANAGE','INVENTORY_READ','INVENTORY_WRITE',
'REPORT_READ','PRESCRIPTION_READ'
)
WHERE r.name = 'ADMIN';

-- PHARMACIST
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN (
'PRESCRIPTION_READ','PRESCRIPTION_APPROVE','PRODUCT_READ','INVENTORY_READ'
)
WHERE r.name = 'PHARMACIST';

-- SALES_PERSON
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN (
'ORDER_READ','ORDER_WRITE','PRODUCT_READ','REPORT_READ'
)
WHERE r.name = 'SALES_PERSON';

-- EDITOR
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN (
'PRODUCT_READ','PRODUCT_WRITE','INVENTORY_READ'
)
WHERE r.name = 'EDITOR';

-- SHIPPER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN (
'SHIPPING_READ','SHIPPING_WRITE','ORDER_READ'
)
WHERE r.name = 'SHIPPER';

-- CUSTOMER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN (
'PRODUCT_READ','ORDER_READ','ORDER_WRITE','PRESCRIPTION_READ'
)
WHERE r.name = 'CUSTOMER';