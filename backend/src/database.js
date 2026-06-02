const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define o caminho onde o arquivo do banco vai ficar salvo
const dbPath = path.resolve(__dirname, 'banco.sqlite');

// Conecta ou cria o arquivo de banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar no SQLite:', err.message);
  } else {
    console.log('Banco SQLite conectado com sucesso! Arquivo:', dbPath);
  }
});

// Cria a tabela de alunos e mensalidades para o MVP
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      responsavel TEXT NOT NULL,
      telefone TEXT NOT NULL, -- Para mandar o WhatsApp
      valor_mensalidade REAL NOT NULL,
      dia_vencimento INTEGER NOT NULL,
      status_pagamento TEXT DEFAULT 'Em dia' -- 'Em dia' ou 'Inadimplente'
    )
  `);
});

module.exports = db;