const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==================== KONFIGURASI STORAGE ====================
// Tentukan folder penyimpanan file
const uploadDir = "uploads/logos/";

// Pastikan folder uploads/logos ada (buat jika belum)
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage untuk menyimpan file ke disk
const storage = multer.diskStorage({
    // Tentukan folder tujuan
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    
    // Tentukan nama file (rename untuk menghindari overwrite)
    filename: (req, file, cb) => {
        // Format: courier-timestamp-nama_asli
        const timestamp = Date.now();
        const ext = path.extname(file.originalname); // Ambil ekstensi file (.jpg, .png, dll)
        const originalName = path.basename(file.originalname, ext); // Nama file tanpa ekstensi
        const safeName = originalName
            .replace(/\s/g, "_")           // Ganti spasi dengan underscore
            .replace(/[^a-zA-Z0-9_\-]/g, "") // Hapus karakter aneh
            .toLowerCase();                 // Ubah ke huruf kecil
        
        // Hasil: courier-1745823456789-jne_logo.jpg
        cb(null, `courier-${timestamp}-${safeName}${ext}`);
    }
});

// ==================== FILTER FILE (HANYA GAMBAR) ====================
const fileFilter = (req, file, cb) => {
    // Tipe file yang diperbolehkan
    const allowedTypes = [
        "image/jpeg",
        "image/jpg", 
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml"
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        // File valid, lanjutkan upload
        cb(null, true);
    } else {
        // File tidak valid, tolak upload
        cb(new Error("Format file harus gambar (JPG, PNG, GIF, WEBP, atau SVG)"), false);
    }
};

// ==================== KONFIGURASI MULTER ====================
const upload = multer({
    storage: storage,           // Konfigurasi penyimpanan
    fileFilter: fileFilter,     // Filter tipe file
    limits: {
        fileSize: 2 * 1024 * 1024 // Batas ukuran file: 2MB
    }
});

// ==================== EKSPOR MODULE ====================
module.exports = upload;

