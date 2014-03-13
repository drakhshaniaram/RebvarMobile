SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `RebvarMobileDB` ;
CREATE SCHEMA IF NOT EXISTS `RebvarMobileDB` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
SHOW WARNINGS;
USE `RebvarMobileDB` ;

-- -----------------------------------------------------
-- Table `admin`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `admin` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT NOT NULL,
  `passwd` VARCHAR(45) NULL,
  `uname` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `category` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `category` (
  `id` INT NOT NULL,
  `cat_name` VARCHAR(45) NULL,
  `cat_pic_addr` VARCHAR(145) NULL,
  `admin_id` INT NOT NULL,
  PRIMARY KEY (`id`, `admin_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `title`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `title` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `title` (
  `id` INT NOT NULL,
  `text` VARCHAR(45) NULL,
  `category_id` INT NOT NULL,
  `category_admin_id` INT NOT NULL,
  PRIMARY KEY (`id`, `category_id`, `category_admin_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `detail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `detail` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `detail` (
  `id` INT NOT NULL,
  `text` VARCHAR(5000) NULL,
  `pic_add` VARCHAR(145) NULL,
  `date` VARCHAR(45) NULL,
  `title_id` INT NOT NULL,
  `title_category_id` INT NOT NULL,
  `title_category_admin_id` INT NOT NULL,
  PRIMARY KEY (`id`, `title_id`, `title_category_id`, `title_category_admin_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `family` VARCHAR(45) NULL,
  `phone_number` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `comment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `comment` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `comment` (
  `id` INT NOT NULL,
  `date` VARCHAR(45) NULL,
  `text` VARCHAR(45) NULL,
  `detail_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`, `detail_id`, `user_id`))
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `answer`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `answer` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `answer` (
  `id` INT NOT NULL,
  `text` VARCHAR(145) NULL,
  `uname` VARCHAR(45) NULL,
  `comment_id` INT NOT NULL,
  `comment_detail_id` INT NOT NULL,
  `comment_user_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  PRIMARY KEY (`id`, `comment_id`, `comment_detail_id`, `comment_user_id`, `admin_id`))
ENGINE = InnoDB;

SHOW WARNINGS;
USE `RebvarMobileDB` ;

-- -----------------------------------------------------
-- View `view1`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `view1` ;
SHOW WARNINGS;
DROP TABLE IF EXISTS `view1`;
SHOW WARNINGS;
USE `RebvarMobileDB`;

SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
