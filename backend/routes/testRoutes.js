const express = require('express');
const router = express.Router();
const { query, queryOne } = require('../config/database');

// GET semua users
router.get('/users', async (req, res) => {
    const result = await query('SELECT id, name, email, role FROM users');
    
    if (result.success) {
        res.json({ success: true, data: result.data });
    } else {
        res.status(500).json({ success: false, message: result.error });
    }
});

// GET user by ID
router.get('/users/:id', async (req, res) => {
    const result = await queryOne('SELECT id, name, email, role FROM users WHERE id = ?', [req.params.id]);
    
    if (result.success) {
        if (result.data) {
            res.json({ success: true, data: result.data });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } else {
        res.status(500).json({ success: false, message: result.error });
    }
});

module.exports = router;