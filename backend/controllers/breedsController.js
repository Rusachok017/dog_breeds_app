const pool = require('../config/db');

// Получить все породы
exports.getAllBreeds = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM breeds');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Создать новую породу
exports.createBreed = async (req, res) => {
    const { name, description, life_span, image } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO breeds (name, description, life_span, image) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, life_span, image]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Обновить породу
exports.updateBreed = async (req, res) => {
    const { id } = req.params;
    const { name, description, life_span, image } = req.body;

    try {
        const result = await pool.query(
            'UPDATE breeds SET name = $1, description = $2, life_span = $3, image = $4 WHERE id = $5 RETURNING *',
            [name, description, life_span, image, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Breed not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Удалить породу
exports.deleteBreed = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM breeds WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Breed not found' });
        }

        res.json({ message: 'Breed deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};