-- MySQL dump 10.13  Distrib 8.4.13, for Linux (x86_64)
--
-- Host: localhost    Database: habitos_db
-- ------------------------------------------------------
-- Server version	8.4.13-0ubuntu0.26.04.2

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
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `color` varchar(7) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Salud','#2E9E6B'),(2,'Ejercicio','#E4572E'),(3,'Estudio','#3B6FD8'),(4,'Mañana','#F2B134'),(5,'Noche','#5B4B8A'),(6,'Lectura','#8C5E3C'),(7,'Mindfulness','#4FB0C6'),(8,'Alimentación','#7CB342'),(9,'Finanzas','#2F4858'),(10,'Productividad','#D81B60');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','crear tablas','SQL','V1__crear_tablas.sql',-412036541,'eduardo','2026-11-25 02:52:38',130,1),(2,'2','datos prueba','SQL','V2__datos_prueba.sql',1259076348,'eduardo','2026-11-25 02:52:38',16,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habito_categoria`
--

DROP TABLE IF EXISTS `habito_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habito_categoria` (
  `habito_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  PRIMARY KEY (`habito_id`,`categoria_id`),
  KEY `fk_hc_categoria` (`categoria_id`),
  CONSTRAINT `fk_hc_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hc_habito` FOREIGN KEY (`habito_id`) REFERENCES `habitos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habito_categoria`
--

LOCK TABLES `habito_categoria` WRITE;
/*!40000 ALTER TABLE `habito_categoria` DISABLE KEYS */;
INSERT INTO `habito_categoria` VALUES (1,1),(2,1),(6,1),(7,1),(10,1),(2,2),(6,2),(10,2),(14,2),(16,2),(18,2),(5,3),(12,3),(2,4),(4,4),(9,4),(13,4),(14,4),(3,5),(7,5),(11,5),(3,6),(4,7),(11,7),(1,8),(9,8),(8,9),(15,9),(12,10),(13,10);
/*!40000 ALTER TABLE `habito_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitos`
--

DROP TABLE IF EXISTS `habitos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `frecuencia` varchar(20) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `usuario_id` int NOT NULL,
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_habito_usuario` (`usuario_id`),
  CONSTRAINT `fk_habito_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitos`
--

LOCK TABLES `habitos` WRITE;
/*!40000 ALTER TABLE `habitos` DISABLE KEYS */;
INSERT INTO `habitos` VALUES (1,'Beber 2 litros de agua','Tomar agua durante el día','DIARIO',1,4,'2026-11-24 20:52:38'),(2,'Correr 40 minutos','Correr en el parque','DIARIO',1,4,'2026-11-24 20:52:38'),(3,'Leer 20 páginas','Leer antes de dormir','DIARIO',1,5,'2026-11-24 20:52:38'),(4,'Meditar 10 minutos','Meditación guiada','DIARIO',1,5,'2026-11-24 20:52:38'),(5,'Estudiar inglés','Practicar con una app','DIARIO',1,6,'2026-11-24 20:52:38'),(6,'Ir al gimnasio','Rutina de pesas','SEMANAL',1,6,'2026-11-24 20:52:38'),(7,'Dormir 8 horas','Acostarse antes de las 11','DIARIO',1,7,'2026-11-24 20:52:38'),(8,'Registrar gastos','Anotar lo que gasto','DIARIO',1,7,'2026-11-24 20:52:38'),(9,'Comer fruta','Una fruta en el desayuno','DIARIO',1,8,'2026-11-24 20:52:38'),(10,'Caminar 10 mil pasos','Caminar durante el día','DIARIO',1,8,'2026-11-24 20:52:38'),(11,'Escribir un diario','Escribir lo que pasó en el día','DIARIO',1,9,'2026-11-24 20:52:38'),(12,'Repasar apuntes','Repasar la clase del día','SEMANAL',1,10,'2026-11-24 20:52:38'),(13,'Planear el día','Hacer lista de pendientes','DIARIO',1,10,'2026-11-24 20:52:38'),(14,'Estiramientos','Estirar al despertar','DIARIO',1,11,'2026-11-24 20:52:38'),(15,'Ahorrar 50 pesos','Guardar dinero cada semana','SEMANAL',1,12,'2026-11-24 20:52:38'),(16,'Lagartijas 5x10','Hacer lagartijas 10 repeticiones 5 veces','DIARIO',1,4,'2026-11-24 21:04:45'),(18,'Caminar 20 minutos','Asignado por tu coach','DIARIO',1,4,'2026-11-27 01:02:27');
/*!40000 ALTER TABLE `habitos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recordatorios`
--

DROP TABLE IF EXISTS `recordatorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recordatorios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hora` time NOT NULL,
  `dias` varchar(50) NOT NULL,
  `canal` varchar(20) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `habito_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_recordatorio_habito` (`habito_id`),
  CONSTRAINT `fk_recordatorio_habito` FOREIGN KEY (`habito_id`) REFERENCES `habitos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recordatorios`
--

LOCK TABLES `recordatorios` WRITE;
/*!40000 ALTER TABLE `recordatorios` DISABLE KEYS */;
INSERT INTO `recordatorios` VALUES (1,'09:00:00','LUN,MAR,MIE,JUE,VIE','EMAIL',1,1),(2,'07:00:00','LUN,MIE,VIE','WHATSAPP',1,2),(3,'22:00:00','TODOS','SMS',1,3),(4,'08:00:00','TODOS','EMAIL',1,4),(5,'18:00:00','LUN,MAR,MIE,JUE,VIE','WHATSAPP',1,5),(6,'19:00:00','SAB','SMS',1,6),(7,'22:30:00','TODOS','EMAIL',1,7),(8,'21:00:00','TODOS','WHATSAPP',1,8),(9,'08:30:00','TODOS','SMS',1,9),(10,'12:00:00','TODOS','EMAIL',1,10),(11,'21:30:00','TODOS','EMAIL',1,11),(12,'07:30:00','LUN,MAR,MIE,JUE,VIE','WHATSAPP',1,13);
/*!40000 ALTER TABLE `recordatorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registros`
--

DROP TABLE IF EXISTS `registros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `cumplido` tinyint(1) NOT NULL,
  `nota` varchar(255) DEFAULT NULL,
  `habito_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_registro_habito` (`habito_id`),
  CONSTRAINT `fk_registro_habito` FOREIGN KEY (`habito_id`) REFERENCES `habitos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros`
--

LOCK TABLES `registros` WRITE;
/*!40000 ALTER TABLE `registros` DISABLE KEYS */;
INSERT INTO `registros` VALUES (1,'2026-11-17',1,NULL,1),(2,'2026-11-18',1,NULL,1),(3,'2026-11-19',0,'Se me olvidó',1),(4,'2026-11-17',1,'5 km',2),(5,'2026-11-18',1,NULL,2),(6,'2026-11-17',1,NULL,3),(7,'2026-11-18',0,NULL,3),(8,'2026-11-17',1,NULL,4),(9,'2026-11-18',1,NULL,4),(10,'2026-11-19',1,NULL,4),(11,'2026-11-17',1,NULL,5),(12,'2026-11-18',1,NULL,5),(13,'2026-11-18',1,'Pierna',6),(14,'2026-11-17',0,NULL,7),(15,'2026-11-18',1,NULL,7),(16,'2026-11-17',1,NULL,8),(17,'2026-11-17',1,NULL,9),(18,'2026-11-18',1,NULL,9),(19,'2026-11-17',1,NULL,10),(20,'2026-11-17',1,NULL,11),(21,'2026-11-18',1,NULL,11),(22,'2026-11-18',1,NULL,12),(23,'2026-11-17',1,NULL,13),(24,'2026-11-18',0,NULL,13),(25,'2026-11-17',1,NULL,14),(26,'2026-11-18',1,NULL,15);
/*!40000 ALTER TABLE `registros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'COACH'),(3,'USUARIO');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens_invalidados`
--

DROP TABLE IF EXISTS `tokens_invalidados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens_invalidados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(500) NOT NULL,
  `expira` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens_invalidados`
--

LOCK TABLES `tokens_invalidados` WRITE;
/*!40000 ALTER TABLE `tokens_invalidados` DISABLE KEYS */;
INSERT INTO `tokens_invalidados` VALUES (1,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBoYWJpdG9zLmNvbSIsImlkIjoxLCJyb2wiOiJBRE1JTiIsImlhdCI6MTc5NTU3NTc0NiwiZXhwIjoxNzk1NTc5MzQ2fQ.D3IKJIxV9Eg3f4eSqOuEFVGtmp2kMmPKC4P-QBlkm5s','2026-11-24 22:02:26'),(2,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjb2FjaDFAaGFiaXRvcy5jb20iLCJpZCI6Miwicm9sIjoiQ09BQ0giLCJpYXQiOjE3OTU1NzU3OTEsImV4cCI6MTc5NTU3OTM5MX0.g7kkviUPRDRqh12JqJ-Hcgm2xyE1InMjkgRCRaHoaZk','2026-11-24 22:03:11'),(3,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicnVuby4xNzk1NzYyOTQ1QGhhYml0b3MuY29tIiwiaWQiOjEzLCJyb2wiOiJVU1VBUklPIiwiaWF0IjoxNzk1NzYyOTQ1LCJleHAiOjE3OTU3NjY1NDV9.HgZioyMFXRM1nGbv-diT_ar8woDKrcgwfxfQkq9zxQI','2026-11-27 02:02:25');
/*!40000 ALTER TABLE `tokens_invalidados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens_recuperacion`
--

DROP TABLE IF EXISTS `tokens_recuperacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens_recuperacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(100) NOT NULL,
  `usuario_id` int NOT NULL,
  `expira` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `fk_recuperacion_usuario` (`usuario_id`),
  CONSTRAINT `fk_recuperacion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens_recuperacion`
--

LOCK TABLES `tokens_recuperacion` WRITE;
/*!40000 ALTER TABLE `tokens_recuperacion` DISABLE KEYS */;
INSERT INTO `tokens_recuperacion` VALUES (1,'cd3c525b-cbe6-49a4-926d-e5750d836545',4,'2026-11-27 01:32:25',0);
/*!40000 ALTER TABLE `tokens_recuperacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `rol_id` int NOT NULL,
  `coach_id` int DEFAULT NULL,
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_usuario_rol` (`rol_id`),
  KEY `fk_usuario_coach` (`coach_id`),
  CONSTRAINT `fk_usuario_coach` FOREIGN KEY (`coach_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador','admin@habitos.com','$2a$10$ek7hegg/Q2JbA/bvLyUXgeeoDGWOsjdFw9XvwwrjZ6iqqcXTb5j/O','+520000000001',NULL,1,1,NULL,'2026-11-24 20:52:38'),(2,'Laura Coach','coach1@habitos.com','$2a$10$YzAre/gZKU4GPCUhrIw9UO0gTx9zqEDvgWSiEQZBSj6.D3hOHe61C','+520000000002',NULL,1,2,NULL,'2026-11-24 20:52:38'),(3,'Marco Coach','coach2@habitos.com','$2a$10$YzAre/gZKU4GPCUhrIw9UO0gTx9zqEDvgWSiEQZBSj6.D3hOHe61C','+520000000003',NULL,1,2,NULL,'2026-11-24 20:52:38'),(4,'Ana López','ana@habitos.com','$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni','+520000000004',NULL,1,3,2,'2026-11-24 20:52:38'),(5,'Luis Pérez','luis@habitos.com','$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni','+520000000005',NULL,1,3,2,'2026-11-24 20:52:38'),(6,'María Gómez','maria@habitos.com','$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni','+520000000006',NULL,1,3,2,'2026-11-24 20:52:38'),(7,'Carlos Ruiz','carlos@habitos.com','$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni','+520000000007',NULL,1,3,2,'2026-11-24 20:52:38'),(8,'Sofía Díaz','sofia@habitos.com','$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni','+520000000008',NULL,1,3,3,'2026-11-24 20:52:38'),(9,'Jorge Torres','jorge@habitos.com','$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni','+520000000009',NULL,1,3,3,'2026-11-24 20:52:38'),(10,'Valeria Cruz','valeria@habitos.com','$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni','+520000000010',NULL,1,3,3,'2026-11-24 20:52:38'),(11,'Diego Morales','diego@habitos.com','$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni','+520000000011',NULL,1,3,3,'2026-11-24 20:52:38'),(12,'Fernanda Ríos','fernanda@habitos.com','$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni','+520000000012',NULL,1,3,NULL,'2026-11-24 20:52:38'),(13,'Usuario Bruno','bruno.1795762945@habitos.com','$2a$10$KsznxYPi..KNtByIvYyvYe9yXGzJIOgCVXEkXN/W79D16pkxUM/.C','+525500000000',NULL,1,3,NULL,'2026-11-27 01:02:25');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-27  1:04:23
