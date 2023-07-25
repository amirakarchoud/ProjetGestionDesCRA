create database proxym_cra;

CREATE USER 'cra_user'@'%' IDENTIFIED BY 'proxym';

GRANT ALL PRIVILEGES ON proxym_cra.* TO 'cra_user'@'%';

FLUSH PRIVILEGES;
