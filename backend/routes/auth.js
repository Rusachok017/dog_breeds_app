const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Маршруты для аутентификации
router.post('/register', authController.register); // Регистрация
router.post('/login', authController.login); // Вход
router.post('/', async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Логируем входящие данные
        const { name, description, life_span, image } = req.body;

        const newBreed = new Breed({
            name,
            description,
            life_span,
            image,
        });

        await newBreed.save();
        res.status(201).json(newBreed);
    } catch (error) {
        console.error('Error saving breed:', error); // Логируем ошибки
        res.status(500).json({ message: 'Failed to add breed', error });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Request Body:', req.body); // Логируем входящие данные
        const { name, description, life_span, image } = req.body;

        const updatedBreed = await Breed.findByIdAndUpdate(
            id,
            { name, description, life_span, image },
            { new: true }
        );

        if (!updatedBreed) {
            return res.status(404).json({ message: 'Breed not found' });
        }

        res.status(200).json(updatedBreed);
    } catch (error) {
        console.error('Error updating breed:', error); // Логируем ошибки
        res.status(500).json({ message: 'Failed to update breed', error });
    }
});
module.exports = router;