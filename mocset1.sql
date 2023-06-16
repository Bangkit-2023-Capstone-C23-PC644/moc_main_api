-- --------------------------------------------------------
-- Host:                         34.101.128.251
-- Server version:               8.0.26-google - (Google)
-- Server OS:                    Linux
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for mocset
CREATE DATABASE IF NOT EXISTS `mocset` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mocset`;

-- Dumping structure for table mocset.activity
CREATE TABLE IF NOT EXISTS `activity` (
  `activityid` int NOT NULL AUTO_INCREMENT,
  `hid` decimal(7,0) NOT NULL,
  `status` int NOT NULL,
  `pplestimate` int NOT NULL,
  `timeadded` datetime NOT NULL,
  PRIMARY KEY (`activityid`),
  KEY `FK_activity_hospitals` (`hid`),
  CONSTRAINT `FK_activity_hospitals` FOREIGN KEY (`hid`) REFERENCES `hospitals` (`hospitalID`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table mocset.hospitals
CREATE TABLE IF NOT EXISTS `hospitals` (
  `hospitalID` decimal(7,0) NOT NULL,
  `namaRS` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alamat` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lintang` decimal(9,6) NOT NULL,
  `bujur` decimal(9,6) NOT NULL,
  `kemampuan_penyelenggaraan` int NOT NULL,
  `status_akreditasi` int NOT NULL,
  `jumlah_tempat_tidur_perawatan_umum` int NOT NULL,
  `jumlah_tempat_tidur_perawatan_persalinan` int NOT NULL,
  `jml_dokter_umum` int NOT NULL,
  `jml_dokter_gigi` int NOT NULL,
  `jml_perawat` int NOT NULL,
  `jml_bidan` int NOT NULL,
  `jml_ahli_gizi` int NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `location` point NOT NULL,
  `quota_ruang_tunggu` int NOT NULL,
  PRIMARY KEY (`hospitalID`) USING BTREE,
  UNIQUE KEY `namaRS` (`namaRS`),
  UNIQUE KEY `kode_puskesmas` (`hospitalID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table mocset.users
CREATE TABLE IF NOT EXISTS `users` (
  `nik` decimal(16,0) NOT NULL DEFAULT '0',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lintang` decimal(9,6) NOT NULL,
  `bujur` decimal(9,6) NOT NULL,
  PRIMARY KEY (`nik`) USING BTREE,
  UNIQUE KEY `nik` (`nik`) USING BTREE,
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
