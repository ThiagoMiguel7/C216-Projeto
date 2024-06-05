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

// iniciar o servidor
var server = restify.createServer({
    name: 'veiculos',
});

// Iniciando o banco de dados
async function initDatabase() {
    try {
        await pool.query('DROP TABLE IF EXISTS veiculos');
        await pool.query('CREATE TABLE IF NOT EXISTS veiculos (id SERIAL PRIMARY KEY, marca VARCHAR(255) NOT NULL, modelo VARCHAR(255) NOT NULL, ano INTEGER NOT NULL, preco DECIMAL NOT NULL)');
        console.log('Banco de dados de veículos inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao iniciar o banco de dados, tentando novamente em 5 segundos:', error);
        setTimeout(initDatabase, 5000);
    }
}

// Middleware para permitir o parsing do corpo da requisição
server.use(restify.plugins.bodyParser());

// Endpoint para inserir um novo veículo
server.post('/api/v1/veiculo/inserir', async (req, res, next) => {
    const { marca, modelo, ano, preco } = req.body;

    try {
        const result = await pool.query(
          'INSERT INTO veiculos (marca, modelo, ano, preco) VALUES ($1, $2, $3, $4) RETURNING *',
          [marca, modelo, ano, preco]
        );
        res.send(201, result.rows[0]);
        console.log('Veículo inserido com sucesso:', result.rows[0]);
      } catch (error) {
        console.error('Erro ao inserir veículo:', error);
        res.send(500, { message: 'Erro ao inserir veículo' });
      }
    return next();
});

// Endpoint para listar todos os veículos
server.get('/api/v1/veiculo/listar', async (req, res, next) => {
    try {
      const result = await pool.query('SELECT * FROM veiculos');
      res.send(result.rows);
      console.log('Veículos encontrados:', result.rows);
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      res.send(500, { message: 'Erro ao listar veículos' });
    }
    return next();
  });

// Endpoint para atualizar um veículo existente
server.post('/api/v1/veiculo/atualizar', async (req, res, next) => {
    const { id, marca, modelo, ano, preco } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE veiculos SET marca = $1, modelo = $2, ano = $3, preco = $4 WHERE id = $5 RETURNING *',
        [marca, modelo, ano, preco, id]
      );
      if (result.rowCount === 0) {
        res.send(404, { message: 'Veículo não encontrado' });
      } else {
        res.send(200, result.rows[0]);
        console.log('Veículo atualizado com sucesso:', result.rows[0]);
      }
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      res.send(500, { message: 'Erro ao atualizar veículo' });
    }
  
    return next();
  });

// Endpoint para excluir um veículo pelo ID
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
      res.send(500, { message: 'Erro ao excluir veículo' });
    }
  
    return next();
});

// Endpoint para resetar o banco de dados
server.del('/api/v1/database/reset', async (req, res, next) => {
  try {
    await pool.query('DROP TABLE IF EXISTS veiculos');
    await pool.query('CREATE TABLE IF NOT EXISTS veiculos (id SERIAL PRIMARY KEY, marca VARCHAR(255) NOT NULL, modelo VARCHAR(255) NOT NULL, ano INTEGER NOT NULL, preco DECIMAL NOT NULL)');
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