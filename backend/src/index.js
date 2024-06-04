const restify = require('restify');
const { Pool } = require('pg');

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres', // Usuário do banco de dados
    host: process.env.POSTGRES_HOST || 'db', // Este é o nome do serviço do banco de dados no Docker Compose
    database: process.env.POSTGRES_DB || 'hoteis',
    password: process.env.POSTGRES_PASSWORD || 'password', // Senha do banco de dados
    port: process.env.POSTGRES_PORT || 5432,
});

// iniciar o servidor
var server = restify.createServer({
    name: 'pratica-hoteis',
});

// Iniciando o banco de dados
async function initDatabase() {
    try {
        await pool.query('DROP TABLE IF EXISTS hoteis');
        await pool.query('CREATE TABLE IF NOT EXISTS hoteis (id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, localizacao VARCHAR(255) NOT NULL, classificacao INTEGER NOT NULL, email_contato VARCHAR(255) NOT NULL)');
        console.log('Banco de dados de hotéis inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao iniciar o banco de dados, tentando novamente em 5 segundos:', error);
        setTimeout(initDatabase, 5000);
    }
}

// Middleware para permitir o parsing do corpo da requisição
server.use(restify.plugins.bodyParser());

// Endpoint para inserir um novo hotel
server.post('/api/v1/hotel/inserir', async (req, res, next) => {
    const { nome, localizacao, classificacao, email_contato } = req.body;

    try {
        const result = await pool.query(
          'INSERT INTO hoteis (nome, localizacao, classificacao, email_contato) VALUES ($1, $2, $3, $4) RETURNING *',
          [nome, localizacao, classificacao, email_contato]
        );
        res.send(201, result.rows[0]);
        console.log('Hotel inserido com sucesso:', result.rows[0]);
      } catch (error) {
        console.error('Erro ao inserir hotel:', error);
        res.send(500, { message: 'Erro ao inserir hotel' });
      }
    return next();
});

// Endpoint para listar todos os hotéis
server.get('/api/v1/hotel/listar', async (req, res, next) => {
    try {
      const result = await pool.query('SELECT * FROM hoteis');
      res.send(result.rows);
      console.log('Hotéis encontrados:', result.rows);
    } catch (error) {
      console.error('Erro ao listar hotéis:', error);
      res.send(500, { message: 'Erro ao listar hotéis' });
    }
    return next();
  });

// Endpoint para atualizar um hotel existente
server.post('/api/v1/hotel/atualizar', async (req, res, next) => {
    const { id, nome, localizacao, classificacao, email_contato } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE hoteis SET nome = $1, localizacao = $2, classificacao = $3, email_contato = $4 WHERE id = $5 RETURNING *',
        [nome, localizacao, classificacao, email_contato, id]
      );
      if (result.rowCount === 0) {
        res.send(404, { message: 'Hotel não encontrado' });
      } else {
        res.send(200, result.rows[0]);
        console.log('Hotel atualizado com sucesso:', result.rows[0]);
      }
    } catch (error) {
      console.error('Erro ao atualizar hotel:', error);
      res.send(500, { message: 'Erro ao atualizar hotel' });
    }
  
    return next();
  });

// Endpoint para excluir um hotel pelo ID
server.post('/api/v1/hotel/excluir', async (req, res, next) => {
    const { id } = req.body;
  
    try {
      const result = await pool.query('DELETE FROM hoteis WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.send(404, { message: 'Hotel não encontrado' });
      } else {
        res.send(200, { message: 'Hotel excluído com sucesso' });
        console.log('Hotel excluído com sucesso');
      }
    } catch (error) {
      console.error('Erro ao excluir hotel:', error);
      res.send(500, { message: 'Erro ao excluir hotel' });
    }
  
    return next();
});

// Endpoint para resetar o banco de dados
server.del('/api/v1/database/reset', async (req, res, next) => {
  try {
    await pool.query('DROP TABLE IF EXISTS hoteis');
    await pool.query('CREATE TABLE IF NOT EXISTS hoteis (id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, localizacao VARCHAR(255) NOT NULL, classificacao INTEGER NOT NULL, email_contato VARCHAR(255) NOT NULL)');
    res.send(200, { message: 'Banco de dados resetado com sucesso' });
    console.log('Banco de dados resetado com sucesso');
  } catch (error) {
    console.error('Erro ao resetar o banco de dados:', error);
    res.send(500, { message: 'Erro ao resetar o banco de dados' });
  }
  return next();
});

// iniciar o servidor
var port = process.env.PORT || 5000;
// configurando o CORS
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With'
    );
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
server.listen(port, function() {
    console.log('Servidor iniciado', server.name, 'na url http://localhost:' + port);
    // Iniciando o banco de dados
    console.log('Iniciando o banco de dados');
    initDatabase();
});