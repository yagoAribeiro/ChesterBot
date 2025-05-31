-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: chester
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `guild`
--

DROP TABLE IF EXISTS `guild`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guild` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `DiscordID` varchar(128) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `DiscordID` (`DiscordID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guild`
--

LOCK TABLES `guild` WRITE;
/*!40000 ALTER TABLE `guild` DISABLE KEYS */;
INSERT INTO `guild` VALUES (2,'1302796631829250099'),(1,'1343928048335978598');
/*!40000 ALTER TABLE `guild` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guilduser`
--

DROP TABLE IF EXISTS `guilduser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guilduser` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `GuildID` int NOT NULL,
  `DiscordID` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `GuildID` (`GuildID`),
  CONSTRAINT `guilduser_ibfk_1` FOREIGN KEY (`GuildID`) REFERENCES `guild` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guilduser`
--

LOCK TABLES `guilduser` WRITE;
/*!40000 ALTER TABLE `guilduser` DISABLE KEYS */;
/*!40000 ALTER TABLE `guilduser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `GuildUserID` int NOT NULL,
  `InventoryType` tinyint NOT NULL,
  `Currency` float DEFAULT NULL,
  `MaxWeigth` float DEFAULT NULL,
  `CustomIdentifier` varchar(128) DEFAULT NULL,
  `CustomDescription` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `GuildUserID` (`GuildUserID`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`GuildUserID`) REFERENCES `guilduser` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `GuildID` int NOT NULL,
  `ItemName` varchar(128) NOT NULL,
  `ItemResume` varchar(256) DEFAULT NULL,
  `ItemDescription` varchar(2048) DEFAULT NULL,
  `Effect` varchar(2048) DEFAULT NULL,
  `Weight` float DEFAULT NULL,
  `ItemValue` float DEFAULT NULL,
  `Secret` tinyint(1) DEFAULT NULL,
  `CreationDate` datetime NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `GuildID` (`GuildID`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`GuildID`) REFERENCES `guild` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `iteminstance`
--

DROP TABLE IF EXISTS `iteminstance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `iteminstance` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `InventoryID` int NOT NULL,
  `ItemID` int NOT NULL,
  `Amount` float NOT NULL,
  `LastUpdate` datetime NOT NULL,
  `InstanceIndex` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `InventoryID` (`InventoryID`),
  KEY `ItemID` (`ItemID`),
  CONSTRAINT `iteminstance_ibfk_1` FOREIGN KEY (`InventoryID`) REFERENCES `inventory` (`ID`),
  CONSTRAINT `iteminstance_ibfk_2` FOREIGN KEY (`ItemID`) REFERENCES `item` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `iteminstance`
--

LOCK TABLES `iteminstance` WRITE;
/*!40000 ALTER TABLE `iteminstance` DISABLE KEYS */;
/*!40000 ALTER TABLE `iteminstance` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-31 10:36:49
