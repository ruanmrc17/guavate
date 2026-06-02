const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
// === IMPORTAÇÕES DO WHATSAPP ===
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa o cliente do WhatsApp
const whatsappClient = new Client({
    authStrategy: new LocalAuth()
});

whatsappClient.on('qr', (qr) => {
    console.log('=== ESCANEIE O QR CODE ABAIXO PARA CONECTAR O WHATSAPP ===');
    qrcode.generate(qr, { small: true });
});

whatsappClient.on('ready', () => {
    console.log('🤖 Disparador do WhatsApp está PRONTO e conectado!');
});

whatsappClient.initialize();

// ==========================================
// CONFIGURAÇÃO DO BANCO DE DADOS
// ==========================================
const db = new sqlite3.Database('./banco.db', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados', err.message);
    } else {
        console.log('📦 Conectado ao banco SQLite com sucesso!');
        // SOLUÇÃO DO ERRO 500: Cria a tabela se ela não existir
        db.run(`CREATE TABLE IF NOT EXISTS alunos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            responsavel TEXT,
            telefone TEXT,
            valor_mensalidade REAL,
            dia_vencimento INTEGER,
            status_pagamento TEXT
        )`);
    }
}); 

// ==========================================
// ROTAS DA API
// ==========================================

// SOLUÇÃO DO ERRO 404: Rota para LISTAR os alunos na tabela
app.get('/api/alunos', (req, res) => {
    db.all(`SELECT * FROM alunos`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Rota para CADASTRAR alunos e disparar o WhatsApp
// Rota para CADASTRAR alunos e disparar o WhatsApp
// Rota para CADASTRAR alunos e disparar o WhatsApp
app.post('/api/alunos', (req, res) => {
    const { nome, responsavel, telefone, valor_mensalidade, dia_vencimento } = req.body;

    const query = `INSERT INTO alunos (nome, responsavel, telefone, valor_mensalidade, dia_vencimento, status_pagamento) VALUES (?, ?, ?, ?, ?, 'Em dia')`;
    
    db.run(query, [nome, responsavel, telefone, valor_mensalidade, dia_vencimento], async function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // === DISPARO AUTOMÁTICO DO WHATSAPP (COM CORREÇÃO DE DDD) ===
        try {
            let numeroLimpo = telefone.replace(/\D/g, ''); // Remove traços e espaços
            
            if (!numeroLimpo.startsWith('55')) {
                numeroLimpo = '55' + numeroLimpo;
            }

            // Hackerzinho do Nono Dígito para o Brasil
            // Exemplo esperado: 55 + 82 + 999803338 (13 dígitos)
            if (numeroLimpo.length === 13) {
                const ddd = parseInt(numeroLimpo.substring(2, 4));
                
                // No banco de dados do WhatsApp, DDDs acima de 28 NÃO usam o 9º dígito
                if (ddd > 28) {
                    // Isso remove o '9' que fica logo após o DDD (posição 4 da string)
                    numeroLimpo = numeroLimpo.substring(0, 4) + numeroLimpo.substring(5);
                }
            }

            const chatId = `${numeroLimpo}@c.us`;
            console.log(`🤖 Ignorando o 9º dígito regional. Tentando ID interno: ${chatId}`);

            const mensagem = `Olá ${responsavel}! O cadastro do(a) aluno(a) ${nome} foi realizado com sucesso. A mensalidade ficou no valor de R$ ${valor_mensalidade} com vencimento todo dia ${dia_vencimento}. Sejam bem-vindos! 🛡️`;

            await whatsappClient.sendMessage(chatId, mensagem);
            console.log(`✉️ Mensagem enviada para ${responsavel} com sucesso!`);
            
        } catch (whatsError) {
            console.error(`⚠️ Falha ao enviar WhatsApp para ${responsavel}:`, whatsError.message);
        }
        // ============================================================

        res.json({ id: this.lastID, message: 'Aluno cadastrado com sucesso!' });
    });
});
app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));