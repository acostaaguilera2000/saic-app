-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-05-2026 a las 18:29:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `saic_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia_evento`
--

CREATE TABLE `asistencia_evento` (
  `id_miembro` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comunicado`
--

CREATE TABLE `comunicado` (
  `id_comunicado` int(11) NOT NULL,
  `asunto` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` date NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `culto`
--

CREATE TABLE `culto` (
  `id_culto` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time DEFAULT NULL,
  `tipo_culto` varchar(100) DEFAULT NULL,
  `id_dirigente` int(11) DEFAULT NULL,
  `dirigente_externo` varchar(100) DEFAULT NULL,
  `id_predicador` int(11) DEFAULT NULL,
  `predicador_externo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `culto`
--

INSERT INTO `culto` (`id_culto`, `fecha`, `hora`, `tipo_culto`, `id_dirigente`, `dirigente_externo`, `id_predicador`, `predicador_externo`) VALUES
(12, '2026-05-25', '19:00:00', 'Culto General', NULL, 'Juan pedro', NULL, 'Emanuel'),
(13, '2026-05-26', '19:00:00', 'Culto de Oración', NULL, 'Servio rodriguez', NULL, 'Juan Mendez'),
(14, '2026-05-30', '07:00:00', 'Culto General', 4, NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `donacion`
--

CREATE TABLE `donacion` (
  `id_donacion` int(11) NOT NULL,
  `id_miembro` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` date NOT NULL,
  `tipo` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

CREATE TABLE `evento` (
  `id_evento` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `lugar` varchar(100) DEFAULT NULL,
  `responsable` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logistica_culto`
--

CREATE TABLE `logistica_culto` (
  `id_logistica` int(11) NOT NULL,
  `id_culto` int(11) NOT NULL,
  `id_sonido` int(11) DEFAULT NULL,
  `id_multimedia` int(11) DEFAULT NULL,
  `id_aseo` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `logistica_culto`
--

INSERT INTO `logistica_culto` (`id_logistica`, `id_culto`, `id_sonido`, `id_multimedia`, `id_aseo`, `observaciones`) VALUES
(2, 13, NULL, NULL, 2, '#1 Todos debemos apoyar en el aseo\r\n#2 Debemos llegar temprano');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `miembro`
--

CREATE TABLE `miembro` (
  `id_miembro` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `documento` varchar(20) NOT NULL,
  `fecha_registro` date NOT NULL,
  `fecha_bautismo` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `miembro`
--

INSERT INTO `miembro` (`id_miembro`, `nombre`, `apellido`, `documento`, `fecha_registro`, `fecha_bautismo`, `activo`) VALUES
(1, 'Katyuska Karelys', 'Mendez Mercado', '23451890', '2026-04-13', '2021-04-15', 1),
(2, 'Manuel Andres', 'Acosta Aguilera', '1002487577', '2026-05-17', '2019-03-24', 1),
(3, 'Ana ', 'Mercado', '1002487573', '2026-02-22', NULL, 0),
(4, 'Andrés ', 'Trujillo Rodriguez', '12345678', '2026-05-25', '2003-05-25', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `miembro_ministerio`
--

CREATE TABLE `miembro_ministerio` (
  `id_miembro` int(11) NOT NULL,
  `id_ministerio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ministerio`
--

CREATE TABLE `ministerio` (
  `id_ministerio` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `rol` enum('admin','tesorero','lider','miembro') NOT NULL,
  `username` varchar(100) NOT NULL,
  `id_miembro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `email`, `password`, `rol`, `username`, `id_miembro`) VALUES
(1, 'root@gmail.com', '$2b$10$AKz10saKaNgg4W49UhosZuyg/BuPiAs.gzoXwpf.1LKQ.4F6a.k76', 'admin', 'root', NULL),
(2, 'acostaaguilera2000@gmail.com', '$2b$10$zDdX93Q525TeY9K7fdlCj./Dih8TFrO14rS/tM7PydD9M1AGxlb3C', 'admin', 'Madrew', NULL),
(4, 'katy@gmail.com', '$2b$10$RkXS3DeqbZeDv2rzWAuTGufjzaD5dYauhCfF/H8Xv67aMn4TBlzxu', 'admin', 'katy', 1),
(6, 'melromo95@gmail.com', '$2b$10$pfmpZ22/38mKySB2.YipYuFNL92wUq/VhUHfi5luVU57G4pyV/ZCG', 'admin', 'MelRomo', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencia_evento`
--
ALTER TABLE `asistencia_evento`
  ADD PRIMARY KEY (`id_miembro`,`id_evento`),
  ADD KEY `id_evento` (`id_evento`);

--
-- Indices de la tabla `comunicado`
--
ALTER TABLE `comunicado`
  ADD PRIMARY KEY (`id_comunicado`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `culto`
--
ALTER TABLE `culto`
  ADD PRIMARY KEY (`id_culto`),
  ADD KEY `id_dirigente` (`id_dirigente`),
  ADD KEY `id_predicador` (`id_predicador`);

--
-- Indices de la tabla `donacion`
--
ALTER TABLE `donacion`
  ADD PRIMARY KEY (`id_donacion`),
  ADD KEY `id_miembro` (`id_miembro`);

--
-- Indices de la tabla `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id_evento`);

--
-- Indices de la tabla `logistica_culto`
--
ALTER TABLE `logistica_culto`
  ADD PRIMARY KEY (`id_logistica`),
  ADD UNIQUE KEY `id_culto` (`id_culto`),
  ADD KEY `fk_logistica_sonido` (`id_sonido`),
  ADD KEY `fk_logistica_multimedia` (`id_multimedia`),
  ADD KEY `fk_logistica_aseo` (`id_aseo`);

--
-- Indices de la tabla `miembro`
--
ALTER TABLE `miembro`
  ADD PRIMARY KEY (`id_miembro`),
  ADD UNIQUE KEY `documento` (`documento`);

--
-- Indices de la tabla `miembro_ministerio`
--
ALTER TABLE `miembro_ministerio`
  ADD PRIMARY KEY (`id_miembro`,`id_ministerio`),
  ADD KEY `id_ministerio` (`id_ministerio`);

--
-- Indices de la tabla `ministerio`
--
ALTER TABLE `ministerio`
  ADD PRIMARY KEY (`id_ministerio`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `id_miembro` (`id_miembro`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comunicado`
--
ALTER TABLE `comunicado`
  MODIFY `id_comunicado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `culto`
--
ALTER TABLE `culto`
  MODIFY `id_culto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `donacion`
--
ALTER TABLE `donacion`
  MODIFY `id_donacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `logistica_culto`
--
ALTER TABLE `logistica_culto`
  MODIFY `id_logistica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `miembro`
--
ALTER TABLE `miembro`
  MODIFY `id_miembro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ministerio`
--
ALTER TABLE `ministerio`
  MODIFY `id_ministerio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencia_evento`
--
ALTER TABLE `asistencia_evento`
  ADD CONSTRAINT `asistencia_evento_ibfk_1` FOREIGN KEY (`id_miembro`) REFERENCES `miembro` (`id_miembro`),
  ADD CONSTRAINT `asistencia_evento_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`);

--
-- Filtros para la tabla `comunicado`
--
ALTER TABLE `comunicado`
  ADD CONSTRAINT `comunicado_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `culto`
--
ALTER TABLE `culto`
  ADD CONSTRAINT `culto_ibfk_1` FOREIGN KEY (`id_dirigente`) REFERENCES `miembro` (`id_miembro`),
  ADD CONSTRAINT `culto_ibfk_2` FOREIGN KEY (`id_predicador`) REFERENCES `miembro` (`id_miembro`);

--
-- Filtros para la tabla `donacion`
--
ALTER TABLE `donacion`
  ADD CONSTRAINT `donacion_ibfk_1` FOREIGN KEY (`id_miembro`) REFERENCES `miembro` (`id_miembro`);

--
-- Filtros para la tabla `logistica_culto`
--
ALTER TABLE `logistica_culto`
  ADD CONSTRAINT `fk_logistica_aseo` FOREIGN KEY (`id_aseo`) REFERENCES `miembro` (`id_miembro`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_logistica_culto` FOREIGN KEY (`id_culto`) REFERENCES `culto` (`id_culto`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_logistica_multimedia` FOREIGN KEY (`id_multimedia`) REFERENCES `miembro` (`id_miembro`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_logistica_sonido` FOREIGN KEY (`id_sonido`) REFERENCES `miembro` (`id_miembro`) ON DELETE SET NULL;

--
-- Filtros para la tabla `miembro_ministerio`
--
ALTER TABLE `miembro_ministerio`
  ADD CONSTRAINT `miembro_ministerio_ibfk_1` FOREIGN KEY (`id_miembro`) REFERENCES `miembro` (`id_miembro`),
  ADD CONSTRAINT `miembro_ministerio_ibfk_2` FOREIGN KEY (`id_ministerio`) REFERENCES `ministerio` (`id_ministerio`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_miembro`) REFERENCES `miembro` (`id_miembro`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
