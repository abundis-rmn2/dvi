
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `dvi_db` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `dvi_db`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `data_media`
--

CREATE TABLE `data_media` (
  `id` int(11) NOT NULL,
  `user_id` varchar(80) DEFAULT NULL,
  `MUID` varchar(50) NOT NULL,
  `pk` varchar(50) DEFAULT NULL,
  `m_id` varchar(50) DEFAULT NULL,
  `taken_at` datetime DEFAULT current_timestamp(),
  `media_type` int(50) DEFAULT NULL,
  `product_type` varchar(300) DEFAULT NULL,
  `location` varchar(300) DEFAULT NULL,
  `comment_count` int(50) DEFAULT NULL,
  `like_count` int(50) DEFAULT NULL,
  `caption_text` varchar(1000) DEFAULT NULL,
  `media` varchar(200) DEFAULT NULL,
  `hashtags_used` longblob NOT NULL,
  `hashtag_origin` mediumtext DEFAULT NULL,
  `inference_custom` longtext DEFAULT NULL,
  `hashtag_detection` longtext DEFAULT NULL,
  `inference_world` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `data_recent_hashtags`
--

CREATE TABLE `data_recent_hashtags` (
  `id` int(11) NOT NULL,
  `MUID` varchar(50) NOT NULL,
  `hashtag` varchar(50) NOT NULL,
  `no_publications` int(11) NOT NULL,
  `IG_related_hashtags` longblob NOT NULL,
  `hashtags_founded` longblob NOT NULL,
  `mined_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `data_users`
--

CREATE TABLE `data_users` (
  `id` int(11) NOT NULL,
  `MUID` varchar(50) DEFAULT NULL,
  `pk` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `full_name` varchar(50) DEFAULT NULL,
  `is_private` tinyint(1) DEFAULT NULL,
  `profile_pic_url` varchar(200) DEFAULT NULL,
  `media_count` int(200) NOT NULL,
  `following_count` int(50) DEFAULT NULL,
  `follower_count` int(50) DEFAULT NULL,
  `biography` varchar(1000) DEFAULT NULL,
  `external_url` varchar(200) DEFAULT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `is_business` tinyint(1) DEFAULT NULL,
  `public_email` varchar(100) DEFAULT NULL,
  `city_id` varchar(50) DEFAULT NULL,
  `city_name` varchar(50) DEFAULT NULL,
  `following` longblob DEFAULT NULL,
  `mined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hashtag_cache`
--

CREATE TABLE `hashtag_cache` (
  `id` int(11) NOT NULL,
  `storage` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `queue`
--

CREATE TABLE `queue` (
  `id` int(11) NOT NULL,
  `MUID` varchar(50) NOT NULL,
  `seed_node` mediumtext NOT NULL,
  `mining_depth` int(11) NOT NULL,
  `mining_type` varchar(50) NOT NULL,
  `hashtag_media_amount` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bot_username` varchar(50) NOT NULL,
  `iteration_no` int(10) NOT NULL,
  `finished_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `MUID` varchar(255) NOT NULL,
  `seed_node` mediumtext NOT NULL,
  `mining_depth` int(10) DEFAULT NULL,
  `mining_type` varchar(50) NOT NULL,
  `hashtag_media_amount` int(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_logs`
--

CREATE TABLE `user_logs` (
  `id` int(1) NOT NULL,
  `user` mediumtext NOT NULL,
  `session` mediumtext NOT NULL,
  `date` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `data_media`
--
ALTER TABLE `data_media`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `data_recent_hashtags`
--
ALTER TABLE `data_recent_hashtags`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `data_users`
--
ALTER TABLE `data_users`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `hashtag_cache`
--
ALTER TABLE `hashtag_cache`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `queue`
--
ALTER TABLE `queue`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indices de la tabla `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user_logs`
--
ALTER TABLE `user_logs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `data_media`
--
ALTER TABLE `data_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `data_recent_hashtags`
--
ALTER TABLE `data_recent_hashtags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `data_users`
--
ALTER TABLE `data_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `hashtag_cache`
--
ALTER TABLE `hashtag_cache`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `queue`
--
ALTER TABLE `queue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_logs`
--
ALTER TABLE `user_logs`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
