// Validasi Register
function validateRegister(data) {
  // Validasi name (required)
  if (!data.name || data.name.trim() === "") {
    return "Nama harus diisi";
  }

  // Validasi email (required)
  if (!data.email || data.email.trim() === "") {
    return "Email wajib diisi";
  }

  // Validasi password (required)
  if (!data.password) {
    return "Password wajib diisi";
  }

  return null;
}

// Validasi Login
function validateLogin(data) {
  if (!data.email || data.email.trim() === "") {
    return "Email wajib diisi";
  }
  if (!data.password) {
    return "Password wajib diisi";
  }
  return null;
}

module.exports = { validateRegister, validateLogin };
