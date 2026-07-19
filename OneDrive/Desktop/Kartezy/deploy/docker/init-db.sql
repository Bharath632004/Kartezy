-- Initialize finance database extensions and schema
-- Note: Database creation is handled by Docker Compose via POSTGRES_DB env variable

-- Create schema
CREATE SCHEMA IF NOT EXISTS finance;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set search path
SET search_path TO finance, public;
