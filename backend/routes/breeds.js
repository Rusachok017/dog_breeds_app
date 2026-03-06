const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

// Получить все породы
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM breeds');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Создать новую породу
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, description, life_span, image } = req.body;

        if (!name || !description || !life_span || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await pool.query(
            'INSERT INTO breeds (name, description, life_span, image) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, life_span, image]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Обновить породу
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const { name, description, life_span, image } = req.body;

        const result = await pool.query(
            'UPDATE breeds SET name = $1, description = $2, life_span = $3, image = $4 WHERE id = $5 RETURNING *',
            [name, description, life_span, image, numericId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Breed not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Удалить породу
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const result = await pool.query('DELETE FROM breeds WHERE id = $1 RETURNING *', [numericId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Breed not found' });
        }

        res.json({ message: 'Breed deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;