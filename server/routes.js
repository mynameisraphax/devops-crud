const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');
const router = express.Router();

router.post('/register', (req, res) => {
  const { nome, login, email, senha } = req.body;

  const hashedPassword = bcrypt.hashSync(senha, 8);

  db.query(
    'INSERT INTO users (nome, login, email, senha) VALUES (?, ?, ?, ?)',
    [nome, login, email, hashedPassword],
    (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: 'Usuário registrado com sucesso!' });
    }
  );
});

router.post('/login', (req, res) => {
  const { login, senha } = req.body;

  db.query('SELECT * FROM users WHERE login = ?', [login], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send({ message: 'Usuário não encontrado' });

    const user = results[0];

    if (!bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).send({ message: 'Senha inválida' });
    }

    res.status(200).send({ message: 'Login bem-sucedido!' });
  });
});

module.exports = router;