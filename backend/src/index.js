const restify = require('restify');
const { Pool } = require('pg');

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'db',
    database: process.env.POSTGRES_DB || 'veiculos',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: process.env.POSTGRES_PORT || 5432,
});

// Iniciar o servidor
var server = restify.createServer({
    name: 'projeto',
});

async function initDatabase() {
  try {
      await pool.query('DROP TABLE IF EXISTS veiculos');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS veiculos (
          id SERIAL PRIMARY KEY,
          modelo VARCHAR(255) NOT NULL,
          ano INT NOT NULL,
          cor VARCHAR(255) NOT NULL,
          placa VARCHAR(7) NOT NULL,
          km INT NOT NULL
        )
      `);
      console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
      console.error('Erro ao iniciar o banco de dados, tentando novamente em 5 segundos:', error);
      setTimeout(initDatabase, 5000);
  }
}

// Middleware para permitir o parsing do corpo da requisição
server.use(restify.plugins.bodyParser());

// Rota para inserir veículo
server.post('/api/v1/veiculo/inserir', async (req, res, next) => {
  const { modelo, ano, cor, placa, km } = req.body;

  // Validação dos dados
  if (placa.length > 7) {
    return res.send(400, { message: 'Placa não pode ter mais de 7 caracteres' });
  }

  try {
      const result = await pool.query(
        'INSERT INTO veiculos (modelo, ano, cor, placa, km) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [modelo, ano, cor, placa, km]
      );
      res.send(201, result.rows[0]);
      console.log('Veículo inserido com sucesso:', result.rows[0]);
    } catch (error) {
      console.error('Erro ao inserir veículo:', error);
      res.send(500, { message: 'Erro ao inserir veículo', error: error.message });
    }
  return next();
});

// Rota para listar veículos
server.get('/api/v1/veiculo/listar', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM veiculos');
    res.send(result.rows);
    console.log('Veículos encontrados:', result.rows);
  } catch (error) {
    console.error('Erro ao listar veículos:', error);
    res.send(500, { message: 'Erro ao listar veículos', error: error.message });
  }
  return next();
});

// Rota para atualizar veículo
server.post('/api/v1/veiculo/atualizar', async (req, res, next) => {
  const { id, modelo, ano, cor, placa, km } = req.body;

  // Validação dos dados
  if (placa.length > 7) {
    return res.send(400, { message: 'Placa não pode ter mais de 7 caracteres' });
  }

  try {
    const result = await pool.query(
      'UPDATE veiculos SET modelo = $1, ano = $2, cor = $3, placa = $4, km = $5 WHERE id = $6 RETURNING *',
      [modelo, ano, cor, placa, km, id]
    );
    if (result.rowCount === 0) {
      res.send(404, { message: 'Veículo não encontrado' });
    } else {
      res.send(200, result.rows[0]);
      console.log('Veículo atualizado com sucesso:', result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    res.send(500, { message: 'Erro ao atualizar veículo', error: error.message });
  }

  return next();
});

// Rota para excluir veículo
server.post('/api/v1/veiculo/excluir', async (req, res, next) => {
  const { id } = req.body;

  try {
    const result = await pool.query('DELETE FROM veiculos WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.send(404, { message: 'Veículo não encontrado' });
    } else {
      res.send(200, { message: 'Veículo excluído com sucesso' });
      console.log('Veículo excluído com sucesso');
    }
  } catch (error) {
    console.error('Erro ao excluir veículo:', error);
    res.send(500, { message: 'Erro ao excluir veículo', error: error.message });
  }

  return next();
});

// Endpoint para resetar o banco de dados
server.del('/api/v1/database/reset', async (req, res, next) => {
  try {
    await pool.query('DROP TABLE IF EXISTS veiculos');
    await pool.query(`
      CREATE TABLE veiculos (
        id SERIAL PRIMARY KEY,
        modelo VARCHAR(255) NOT NULL,
        ano INT NOT NULL,
        cor VARCHAR(255) NOT NULL,
        placa VARCHAR(7) NOT NULL,
        km INT NOT NULL
      )
    `);
    res.send(200, { message: 'Banco de dados resetado com sucesso' });
    console.log('Banco de dados resetado com sucesso');
  } catch (error) {
    console.error('Erro ao resetar o banco de dados:', error);
    res.send(500, { message: 'Erro ao resetar o banco de dados', error: error.message });
  }

  return next();
});

// Configurando o CORS
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

// Iniciar o servidor
var port = process.env.PORT || 5000;
server.listen(port, function() {
    console.log('Servidor iniciado', server.name, 'na url http://localhost:' + port);
    // Iniciando o banco de dados
    console.log('Iniciando o banco de dados');
    initDatabase();
});
