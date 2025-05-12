const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');
const router = express.Router();

// Rota de registro de usuário
router.post('/register', (req, res) => {
  const { nome, login, email, senha } = req.body;

  const hashedPassword = bcrypt.hashSync(senha, 8);

  db.query(
    'INSERT INTO users (nome, login, email, senha) VALUES (?, ?, ?, ?)',
    [nome, login, email, hashedPassword],
    (err) => {
      if (err) {
        console.error(err); // Log do erro no console para debug
        return res.status(500).send({ error: 'Erro ao cadastrar usuário' });
      }
      res.status(200).send({ message: 'Usuário registrado com sucesso!' });
    }
  );
});

// Rota de login de usuário
router.post('/login', (req, res) => {
  const { login, senha } = req.body;

  db.query('SELECT * FROM users WHERE login = ?', [login], (err, results) => {
    if (err) {
      console.error(err); // Log do erro no console para debug
      return res.status(500).send({ error: 'Erro ao processar o login' });
    }
    if (results.length === 0) return res.status(401).send({ message: 'Usuário não encontrado' });

    const user = results[0];

    if (!bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).send({ message: 'Senha inválida' });
    }

    res.status(200).send({ message: 'Login bem-sucedido!' });
  });
});

module.exports = router;
