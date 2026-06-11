-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 11, 2026 at 07:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skin_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `couriers`
--

CREATE TABLE `couriers` (
  `id` int(11) NOT NULL,
  `vendor_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `couriers`
--

INSERT INTO `couriers` (`id`, `vendor_name`, `phone`, `logo_url`, `created_at`) VALUES
(2, 'J&T Express', '021-7890123', 'courier-1781100431037-jt.png', '2026-04-07 09:27:25'),
(3, 'SiCepat', '021-3456789', 'courier-1781100442538-sicepat.jpg', '2026-04-07 09:27:25'),
(4, 'POS Indonesia', '021-9876543', 'courier-1781100452490-posindo.png', '2026-04-07 09:27:25'),
(5, 'Ninja Express', '021-5551234', 'courier-1781100461470-ninja.png', '2026-04-07 09:27:25'),
(6, 'JNE', '021-1234567', 'courier-1781100410636-jne.png', '2026-04-22 01:07:05');

-- --------------------------------------------------------

--
-- Table structure for table `shipments`
--

CREATE TABLE `shipments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `courier_id` int(11) DEFAULT NULL,
  `tracking_number` varchar(50) NOT NULL,
  `sender_name` varchar(100) NOT NULL,
  `receiver_name` varchar(100) NOT NULL,
  `receiver_address` text DEFAULT NULL,
  `destination` varchar(100) DEFAULT NULL,
  `service_type` varchar(50) DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `item_description` text DEFAULT NULL,
  `status` enum('pending','in-transit','delivered') DEFAULT 'pending',
  `total_cost` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipments`
--

INSERT INTO `shipments` (`id`, `user_id`, `courier_id`, `tracking_number`, `sender_name`, `receiver_name`, `receiver_address`, `destination`, `service_type`, `weight`, `item_description`, `status`, `total_cost`, `created_at`, `updated_at`) VALUES
(1, NULL, 2, 'SWT123456789', 'Budi Santoso', 'Andi Wijaya', 'Jl. Sudirman No. 10, RT 01/RW 02, Kel. Senayan, Kec. Kebayoran Baru, Jakarta Selatan 12190', 'Jakarta', 'Reguler', 1.00, 'Paket', 'delivered', 12500.00, '2026-04-07 09:32:45', '2026-06-10 22:18:14'),
(2, NULL, 2, 'SWT987654321', 'Budi Santoso', 'Rina Marlina', 'Jl. Melati No. 12, RT 03/RW 04, Kel. Cilandak, Kec. Cilandak, Jakarta Selatan 12430', 'Jakarta', 'Reguler', 1.00, 'Paket', 'delivered', 22500.00, '2026-04-07 09:32:45', '2026-06-10 22:18:14'),
(3, NULL, 3, 'SWT555555555', 'Siti Aminah', 'Dian Pratama', 'Jl. Kenanga No. 45, RT 05/RW 06, Kel. Pulo Gadung, Kec. Pulo Gadung, Jakarta Timur 13260', 'Jakarta', 'Reguler', 1.00, 'Paket', 'in-transit', 8250.00, '2026-04-07 09:32:45', '2026-06-10 22:18:14'),
(4, NULL, 3, 'SWT444444444', 'Siti Aminah', 'Bagus Nugroho', 'Jl. Thamrin No. 25, RT 02/RW 01, Kel. Menteng, Kec. Menteng, Jakarta Pusat 10310', 'Jakarta', 'Reguler', 1.00, 'Paket', 'pending', 50000.00, '2026-04-07 09:32:45', '2026-06-10 22:18:14'),
(5, NULL, 2, 'SWT333333333', 'Agus Wijaya', 'Citra Dewi', 'Jl. Mawar No. 78, RT 04/RW 03, Kel. Grogol, Kec. Grogol Petamburan, Jakarta Barat 11450', 'Jakarta', 'Reguler', 1.00, 'Paket', 'pending', 15000.00, '2026-04-07 09:32:45', '2026-06-10 22:18:14'),
(6, NULL, 4, 'SWT111111111', 'Dewi Kartika', 'Eko Prasetyo', 'Jl. Gatot Subroto No. 100, RT 07/RW 05, Kel. Kuningan Barat, Kec. Mampang Prapatan, Jakarta Selatan 12710', 'Jakarta', 'Reguler', 1.00, 'Paket', 'in-transit', 17500.00, '2026-04-07 09:32:45', '2026-06-10 22:18:14'),
(7, NULL, 3, 'SWT222222222', 'Rizki Firmansyah', 'Fitriani', 'Jl. Dahlia No. 90, RT 06/RW 08, Kel. Kapuk, Kec. Cengkareng, Jakarta Barat 11720', 'Jakarta', 'Reguler', 1.00, 'Paket', 'pending', 36000.00, '2026-04-07 09:32:45', '2026-06-10 22:18:14'),
(8, 9, 2, 'SWT666666666', 'Joko Supriyanto', 'Gilang Ramadhan', 'Jl. Anggrek No. 23, RT 08/RW 07, Kel. Kelapa Gading, Kec. Kelapa Gading, Jakarta Utara 14240', 'Jakarta', 'Reguler', 1.00, 'Paket', 'pending', 15000.00, '2026-04-07 09:32:45', '2026-06-10 22:18:14');

-- --------------------------------------------------------

--
-- Table structure for table `shipping_rates`
--

CREATE TABLE `shipping_rates` (
  `id` int(11) NOT NULL,
  `courier_id` int(11) NOT NULL,
  `origin` varchar(100) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `service_type` varchar(50) NOT NULL,
  `price_per_kg` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping_rates`
--

INSERT INTO `shipping_rates` (`id`, `courier_id`, `origin`, `destination`, `service_type`, `price_per_kg`, `created_at`) VALUES
(7, 2, 'Jakarta', 'Surabaya', 'Reguler', 7500.00, '2026-04-07 09:31:32'),
(8, 2, 'Jakarta', 'Bandung', 'Express', 7000.00, '2026-04-07 09:31:32'),
(9, 3, 'Jakarta', 'Bandung', 'Reguler', 5500.00, '2026-04-07 09:31:32'),
(10, 3, 'Jakarta', 'Surabaya', 'Reguler', 9000.00, '2026-04-07 09:31:32'),
(11, 4, 'Jakarta', 'Bandung', 'Reguler', 6000.00, '2026-04-07 09:31:32'),
(12, 4, 'Jakarta', 'Surabaya', 'Reguler', 10000.00, '2026-04-07 09:31:32'),
(13, 2, 'Jakarta', 'Bandung', 'Reguler', 4500.00, '2026-06-10 13:33:15');

-- --------------------------------------------------------

--
-- Table structure for table `tracking_timeline`
--

CREATE TABLE `tracking_timeline` (
  `id` int(11) NOT NULL,
  `shipment_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tracking_timeline`
--

INSERT INTO `tracking_timeline` (`id`, `shipment_id`, `status`, `location`, `description`, `updated_at`) VALUES
(1, 1, 'pending', 'Jakarta', 'Pengiriman telah dibuat', '2026-04-01 03:00:00'),
(2, 1, 'in-transit', 'Jakarta', 'Paket sedang diproses di gudang', '2026-04-02 01:00:00'),
(3, 1, 'in-transit', 'Cikampek', 'Paket dalam perjalanan', '2026-04-03 02:00:00'),
(4, 1, 'delivered', 'Bandung', 'Paket telah diterima', '2026-04-04 07:00:00'),
(5, 2, 'pending', 'Jakarta', 'Pengiriman telah dibuat', '2026-04-02 04:00:00'),
(6, 2, 'in-transit', 'Jakarta', 'Paket sedang diproses di gudang', '2026-04-03 01:00:00'),
(7, 2, 'in-transit', 'Cirebon', 'Paket dalam perjalanan', '2026-04-04 03:00:00'),
(8, 3, 'pending', 'Jakarta', 'Pengiriman telah dibuat', '2026-04-03 02:00:00'),
(9, 4, 'pending', 'Jakarta', 'Pengiriman telah dibuat', '2026-04-04 07:00:00'),
(10, 5, 'pending', 'Jakarta', 'Pengiriman telah dibuat', '2026-04-05 01:00:00'),
(11, 6, 'pending', 'Jakarta', 'Pengiriman telah dibuat', '2026-04-06 02:00:00'),
(12, 6, 'in-transit', 'Jakarta', 'Paket sedang diproses di gudang', '2026-04-07 01:00:00'),
(13, 7, 'pending', 'Jakarta', 'Pengiriman telah dibuat', '2026-04-06 03:00:00'),
(14, 8, 'pending', 'Jakarta', 'Pengiriman telah dibuat', '2026-04-07 04:00:00'),
(15, 2, 'delivered', 'Cirebon', 'Paket telah sampai', '2026-05-19 22:02:15'),
(16, 3, 'in-transit', 'Jakarta', 'Transit', '2026-05-20 00:54:23'),
(17, 1, 'in-transit', 'Jakarta', 'Status berubah menjadi in-transit', '2026-05-21 00:18:25'),
(19, 3, 'in-transit', 'Jakarta', 'Sedang transit', '2026-05-21 04:21:24'),
(20, 3, 'in-transit', 'Bogor', 'Paket sedang disortir di Bogor', '2026-06-03 14:08:55'),
(21, 3, 'in-transit', 'Surabaya', 'Paket sedang disortir', '2026-06-10 15:40:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` enum('admin','staff','courier') NOT NULL DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Admin Utama', 'admin@example.com', '$2y$10$YourHashedPasswordHere1', '081234567890', 'Jl. Admin No. 1, Jakarta', 'admin', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(9, 'Joko Supriyanto', 'joko@example.com', '$2y$10$YourHashedPasswordHere9', '081234567898', 'Jl. Kurir No. 10, Jakarta', 'courier', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(10, 'Ahmad Fahrudin', 'ahmad@example.com', '$2y$10$YourHashedPasswordHere10', '081234567899', 'Jl. Kurir No. 15, Bandung', 'courier', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(11, 'Linda Permata', 'linda@example.com', '$2y$10$YourHashedPasswordHere11', '081234567900', 'Jl. Kurir No. 20, Surabaya', 'courier', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(13, 'Admin 12', 'Admin12@gmail.com', '$2b$10$mwMxPzbuZEujHHGea3w1.eWraFhnkhBCL7qjjNNTVYn/2WwrjaCMO', '08123456789', 'Jl. Merdeka No. 1', 'admin', '2026-04-22 01:00:06', '2026-04-22 01:00:06'),
(15, 'Admin 1', 'admin1@gmail.com', '$2b$10$c9p8efu5BHJDjOp/WGQVTegAzGUa.cAl.YFRy7axWX8xHu4bBQBz.', '88212338166', 'Jl. Margonda, No.56', 'admin', '2026-05-19 10:31:46', '2026-05-19 10:31:46'),
(16, 'Admin Baru', 'admin123@gmail.com', '$2b$10$.HVn.1XuMW4t6GrrGuxzu.cVGbmD95qV3MhaPnAo7pmLlxGGIAHru', '088212338166', 'Jl. Pahlawan, No.23', 'admin', '2026-05-19 10:33:02', '2026-05-19 10:33:02'),
(17, 'Admin 1', 'admin111@gmail.com', '$2b$10$p3XOu9CGxZZjv0LXYddDCulsJgA9XmOJk39i.Gn4zFzXMY/LyazaW', '088212338166', 'JL. Raya', 'admin', '2026-05-20 01:14:01', '2026-05-20 01:14:01'),
(19, 'Elsi', 'kurir111@gmail.com', '$2b$10$tMKL1R8QYLpi6m.MO/0D3.0mQtc1fgKb.x1nehr/R5kirgGhBol56', '088212338166', 'Jalan jalan', 'courier', '2026-06-04 06:49:47', '2026-06-04 06:49:47'),
(20, 'Staff Operasional', 'staff1234@gmail.com', '$2b$10$xcXSQuJ0zkogsbZHZ.RR0.YUCbLocZL6mKEP9HIfByFj0O3DoEqW6', '08821245678', 'Jl. Sejahtera, No. 10', 'staff', '2026-06-10 13:47:50', '2026-06-10 14:04:40'),
(21, 'Amarsya', 'amarsya111@gmail.com', '$2b$10$GsawIDj3CaoJgf6WR/nJReT9OWF88gGsmKr3iA1POn.3oKRzotAkC', '088212445345', 'Jl. Cempaka, No.4', 'courier', '2026-06-10 15:09:48', '2026-06-10 15:09:48'),
(22, 'Rizal Fadillah', 'kurir1@swifttrack.com', '$2b$10$wUM1tdx3eHCNmNItc9oZeut4npPTJBOGH4DKKqcJcn5BaCjUaeQtW', '081234567890', 'Jl. Gatot Subroto No. 10, Jakarta', 'courier', '2026-06-10 22:11:58', '2026-06-10 22:11:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `couriers`
--
ALTER TABLE `couriers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shipments`
--
ALTER TABLE `shipments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracking_number` (`tracking_number`),
  ADD KEY `idx_shipments_user` (`user_id`),
  ADD KEY `idx_shipments_courier` (`courier_id`),
  ADD KEY `idx_shipments_tracking` (`tracking_number`),
  ADD KEY `idx_shipments_status` (`status`),
  ADD KEY `idx_shipments_created` (`created_at`);

--
-- Indexes for table `shipping_rates`
--
ALTER TABLE `shipping_rates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courier_id` (`courier_id`);

--
-- Indexes for table `tracking_timeline`
--
ALTER TABLE `tracking_timeline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tracking_shipment` (`shipment_id`),
  ADD KEY `idx_tracking_updated` (`updated_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `couriers`
--
ALTER TABLE `couriers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `shipments`
--
ALTER TABLE `shipments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `shipping_rates`
--
ALTER TABLE `shipping_rates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tracking_timeline`
--
ALTER TABLE `tracking_timeline`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `shipments`
--
ALTER TABLE `shipments`
  ADD CONSTRAINT `shipments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `shipments_ibfk_2` FOREIGN KEY (`courier_id`) REFERENCES `couriers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `shipping_rates`
--
ALTER TABLE `shipping_rates`
  ADD CONSTRAINT `shipping_rates_ibfk_1` FOREIGN KEY (`courier_id`) REFERENCES `couriers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tracking_timeline`
--
ALTER TABLE `tracking_timeline`
  ADD CONSTRAINT `tracking_timeline_ibfk_1` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
