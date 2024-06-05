
# Sistema de Cadastro de Veículos

Este projeto é um sistema de cadastro de veículos que permite a inserção, atualização, listagem e exclusão de informações de veículos. Ele é dividido em três principais componentes: um frontend, um backend e um banco de dados PostgreSQL.

## Tecnologias Utilizadas

- **Frontend**: 
- **Backend**: Node.js com Restify
- **Database**: PostgreSQL

## Estrutura do Projeto

O projeto está dividido em três contêineres Docker:

- `vehicleFrontend`: Contêiner para o frontend da aplicação.
- `vehicleBackend`: Contêiner para o backend, que gerencia as requisições da API.
- `vehicleDatabase`: Contêiner para o PostgreSQL, armazenando todos os dados dos veiculos.

## Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1. **Clonar o repositório**

   ```bash
   git clone https://github.com/ThiagoMiguel7/C216-Projeto.git
   cd projeto
   ```

2. **Construir e executar os contêineres**

   Utilize o Docker Compose para construir e iniciar os serviços:

   ```bash
   docker-compose up --build
   ```

## Uso

Acesse o frontend da aplicação em `http://localhost:3000`. As funcionalidades incluem:

- **Adicionar um novo veiculo**: Acessível através do formulário de inserção no frontend.
- **Listar todos os veiculos**: Visualize todos os veiculos cadastrados.
- **Atualizar informações de um veiculo**: Através da página de detalhes de cada veiculo.
- **Excluir um veiculo**: Pode ser feito na lista de veiculos ou na página de detalhes.

## API Endpoints

O backend oferece vários endpoints para interação com o banco de dados:

- `POST /api/v1/veiculo/inserir`: Adiciona um novo veiculo
- `GET /api/v1/veiculo/listar`: Lista todos os veiculos
- `POST /api/v1/veiculo/atualizar`: Atualiza um veiculo existente
- `POST /api/v1/veiculo/excluir`: Exclui um veiculo

## Contribuição

Contribuições são sempre bem-vindas! Por favor, leia o guia de contribuição para saber como ajudar.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

