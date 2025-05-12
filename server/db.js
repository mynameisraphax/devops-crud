const mysql = require('mysql2');
require('dotenv').config();

// Verificando se todas as variáveis estão definidas
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Erro: Variável de ambiente ${key} não está definida.`);
    process.exit(1);
  }
});

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
    process.exit(1);
  }
  if (conn) {
    console.log('✅ Conectado ao MySQL com sucesso!');
    conn.release();
  }
});

module.exports = connection;