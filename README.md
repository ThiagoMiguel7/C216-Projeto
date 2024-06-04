
# Sistema de Cadastro de Hotéis

Este projeto é um sistema de cadastro de hotéis que permite a inserção, atualização, listagem e exclusão de informações de hotéis. Ele é dividido em três principais componentes: um frontend, um backend e um banco de dados PostgreSQL.

## Tecnologias Utilizadas

- **Frontend**: 
- **Backend**: Node.js com Restify
- **Database**: PostgreSQL

## Estrutura do Projeto

O projeto está dividido em três contêineres Docker:

- `hotelFrontend`: Contêiner para o frontend da aplicação.
- `hotelBackend`: Contêiner para o backend, que gerencia as requisições da API.
- `hotelDatabase`: Contêiner para o PostgreSQL, armazenando todos os dados dos hotéis.

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

- **Adicionar um novo hotel**: Acessível através do formulário de inserção no frontend.
- **Listar todos os hotéis**: Visualize todos os hotéis cadastrados.
- **Atualizar informações de um hotel**: Através da página de detalhes de cada hotel.
- **Excluir um hotel**: Pode ser feito na lista de hotéis ou na página de detalhes.

## API Endpoints

O backend oferece vários endpoints para interação com o banco de dados:

- `POST /api/v1/hotel/inserir`: Adiciona um novo hotel
- `GET /api/v1/hotel/listar`: Lista todos os hotéis
- `POST /api/v1/hotel/atualizar`: Atualiza um hotel existente
- `POST /api/v1/hotel/excluir`: Exclui um hotel

## Contribuição

Contribuições são sempre bem-vindas! Por favor, leia o guia de contribuição para saber como ajudar.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

