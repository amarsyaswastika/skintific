-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 22 Apr 2026 pada 03.36
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `swifttrack_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `couriers`
--

CREATE TABLE `couriers` (
  `id` int(11) NOT NULL,
  `vendor_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `couriers`
--

INSERT INTO `couriers` (`id`, `vendor_name`, `phone`, `logo_url`, `created_at`) VALUES
(1, 'JNE', '021-1234567', 'https://example.com/logos/jne.png', '2026-04-07 09:27:25'),
(2, 'J&T Express', '021-7890123', 'https://example.com/logos/jnt.png', '2026-04-07 09:27:25'),
(3, 'SiCepat', '021-3456789', 'https://example.com/logos/sicepat.png', '2026-04-07 09:27:25'),
(4, 'POS Indonesia', '021-9876543', 'https://example.com/logos/pos.png', '2026-04-07 09:27:25'),
(5, 'Ninja Express', '021-5551234', 'https://example.com/logos/ninja.png', '2026-04-07 09:27:25'),
(6, 'JNE', '021-1234567', NULL, '2026-04-22 01:07:05');

-- --------------------------------------------------------

--
-- Struktur dari tabel `shipments`
--

CREATE TABLE `shipments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `courier_id` int(11) DEFAULT NULL,
  `tracking_number` varchar(50) NOT NULL,
  `sender_name` varchar(100) NOT NULL,
  `receiver_name` varchar(100) NOT NULL,
  `status` enum('pending','in-transit','delivered') DEFAULT 'pending',
  `total_cost` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `shipments`
--

INSERT INTO `shipments` (`id`, `user_id`, `courier_id`, `tracking_number`, `sender_name`, `receiver_name`, `status`, `total_cost`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 'SWT123456789', 'Budi Santoso', 'Andi Wijaya', 'delivered', 12500.00, '2026-04-07 09:32:45', '2026-04-07 09:32:45'),
(2, 4, 2, 'SWT987654321', 'Budi Santoso', 'Rina Marlina', 'in-transit', 22500.00, '2026-04-07 09:32:45', '2026-04-07 09:32:45'),
(3, 5, 3, 'SWT555555555', 'Siti Aminah', 'Dian Pratama', 'pending', 8250.00, '2026-04-07 09:32:45', '2026-04-07 09:32:45'),
(4, 5, 1, 'SWT444444444', 'Siti Aminah', 'Bagus Nugroho', 'pending', 50000.00, '2026-04-07 09:32:45', '2026-04-07 09:32:45'),
(5, 6, 2, 'SWT333333333', 'Agus Wijaya', 'Citra Dewi', 'pending', 15000.00, '2026-04-07 09:32:45', '2026-04-07 09:32:45'),
(6, 7, 1, 'SWT111111111', 'Dewi Kartika', 'Eko Prasetyo', 'in-transit', 17500.00, '2026-04-07 09:32:45', '2026-04-07 09:32:45'),
(7, 8, 3, 'SWT222222222', 'Rizki Firmansyah', 'Fitriani', 'pending', 36000.00, '2026-04-07 09:32:45', '2026-04-07 09:32:45'),
(8, 9, 2, 'SWT666666666', 'Joko Supriyanto', 'Gilang Ramadhan', 'pending', 15000.00, '2026-04-07 09:32:45', '2026-04-07 09:32:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `shipping_rates`
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
-- Dumping data untuk tabel `shipping_rates`
--

INSERT INTO `shipping_rates` (`id`, `courier_id`, `origin`, `destination`, `service_type`, `price_per_kg`, `created_at`) VALUES
(1, 1, 'Jakarta', 'Bandung', 'Reguler', 5000.00, '2026-04-07 09:31:32'),
(2, 1, 'Jakarta', 'Surabaya', 'Reguler', 8000.00, '2026-04-07 09:31:32'),
(3, 1, 'Jakarta', 'Bali', 'Reguler', 10000.00, '2026-04-07 09:31:32'),
(4, 1, 'Jakarta', 'Bandung', 'Express', 8000.00, '2026-04-07 09:31:32'),
(5, 1, 'Jakarta', 'Surabaya', 'Express', 12000.00, '2026-04-07 09:31:32'),
(6, 2, 'Jakarta', 'Bandung', 'Reguler', 4500.00, '2026-04-07 09:31:32'),
(7, 2, 'Jakarta', 'Surabaya', 'Reguler', 7500.00, '2026-04-07 09:31:32'),
(8, 2, 'Jakarta', 'Bandung', 'Express', 7000.00, '2026-04-07 09:31:32'),
(9, 3, 'Jakarta', 'Bandung', 'Reguler', 5500.00, '2026-04-07 09:31:32'),
(10, 3, 'Jakarta', 'Surabaya', 'Reguler', 9000.00, '2026-04-07 09:31:32'),
(11, 4, 'Jakarta', 'Bandung', 'Reguler', 6000.00, '2026-04-07 09:31:32'),
(12, 4, 'Jakarta', 'Surabaya', 'Reguler', 10000.00, '2026-04-07 09:31:32');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tracking_timeline`
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
-- Dumping data untuk tabel `tracking_timeline`
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
(14, 8, 'pending', 'Jakarta', 'Pengiriman telah dibuat', '2026-04-07 04:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` enum('admin','staff','customer','courier') DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Admin Utama', 'admin@example.com', '$2y$10$YourHashedPasswordHere1', '081234567890', 'Jl. Admin No. 1, Jakarta', 'admin', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(2, 'Staff Marketing', 'staff@example.com', '$2y$10$YourHashedPasswordHere2', '081234567891', 'Jl. Staff No. 2, Bandung', 'staff', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(3, 'Staff Operasional', 'staff2@example.com', '$2y$10$YourHashedPasswordHere3', '081234567892', 'Jl. Staff No. 3, Surabaya', 'staff', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(4, 'Budi Santoso', 'budi@example.com', '$2y$10$YourHashedPasswordHere4', '081234567893', 'Jl. Mawar No. 5, Jakarta', 'customer', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(5, 'Siti Aminah', 'siti@example.com', '$2y$10$YourHashedPasswordHere5', '081234567894', 'Jl. Melati No. 8, Bandung', 'customer', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(6, 'Agus Wijaya', 'agus@example.com', '$2y$10$YourHashedPasswordHere6', '081234567895', 'Jl. Anggrek No. 12, Surabaya', 'customer', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(7, 'Dewi Kartika', 'dewi@example.com', '$2y$10$YourHashedPasswordHere7', '081234567896', 'Jl. Kenanga No. 3, Yogyakarta', 'customer', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(8, 'Rizki Firmansyah', 'rizki@example.com', '$2y$10$YourHashedPasswordHere8', '081234567897', 'Jl. Cempaka No. 7, Malang', 'customer', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(9, 'Joko Supriyanto', 'joko@example.com', '$2y$10$YourHashedPasswordHere9', '081234567898', 'Jl. Kurir No. 10, Jakarta', 'courier', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(10, 'Ahmad Fahrudin', 'ahmad@example.com', '$2y$10$YourHashedPasswordHere10', '081234567899', 'Jl. Kurir No. 15, Bandung', 'courier', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(11, 'Linda Permata', 'linda@example.com', '$2y$10$YourHashedPasswordHere11', '081234567900', 'Jl. Kurir No. 20, Surabaya', 'courier', '2026-04-07 09:14:49', '2026-04-07 09:14:49'),
(12, 'Staff 1', 'Staff1@gmail.com', '$2b$10$uvoe8VqRKaOUynhSFVxWm.C1/d0RJNgAWkPU4PMcppYv7gU/vrWzm', '08123456789', 'Jl. Merdeka No. 1', 'customer', '2026-04-22 00:53:00', '2026-04-22 00:53:00'),
(13, 'Admin 12', 'Admin12@gmail.com', '$2b$10$mwMxPzbuZEujHHGea3w1.eWraFhnkhBCL7qjjNNTVYn/2WwrjaCMO', '08123456789', 'Jl. Merdeka No. 1', 'admin', '2026-04-22 01:00:06', '2026-04-22 01:00:06');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `couriers`
--
ALTER TABLE `couriers`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `shipments`
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
-- Indeks untuk tabel `shipping_rates`
--
ALTER TABLE `shipping_rates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courier_id` (`courier_id`);

--
-- Indeks untuk tabel `tracking_timeline`
--
ALTER TABLE `tracking_timeline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tracking_shipment` (`shipment_id`),
  ADD KEY `idx_tracking_updated` (`updated_at`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `couriers`
--
ALTER TABLE `couriers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `shipments`
--
ALTER TABLE `shipments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `shipping_rates`
--
ALTER TABLE `shipping_rates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `tracking_timeline`
--
ALTER TABLE `tracking_timeline`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `shipments`
--
ALTER TABLE `shipments`
  ADD CONSTRAINT `shipments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `shipments_ibfk_2` FOREIGN KEY (`courier_id`) REFERENCES `couriers` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `shipping_rates`
--
ALTER TABLE `shipping_rates`
  ADD CONSTRAINT `shipping_rates_ibfk_1` FOREIGN KEY (`courier_id`) REFERENCES `couriers` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tracking_timeline`
--
ALTER TABLE `tracking_timeline`
  ADD CONSTRAINT `tracking_timeline_ibfk_1` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
