const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'dog_breeds_db', 
    password: '12345', 
    port: 5432, 
});

// Тестирование подключения к базе данных
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        return;
    }
    console.log('Connected to the database');
    release(); // Освобождаем клиент после тестирования
});

module.exports = pool;