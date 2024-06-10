
# Porsche Manager Avantgarde

Este projeto é um sistema completo de gerenciamento de veículos, permitindo a inserção, atualização, listagem e exclusão de informações de veículos. Ele é construído usando uma stack moderna que inclui HTML, CSS, Bootstrap, Node.js com Restify, PostgreSQL e Flask. O sistema é organizado em três principais componentes: frontend, backend e banco de dados PostgreSQL, todos integrados via Docker.

## Tecnologias Utilizadas

- **Frontend**: HTML, CSS, Bootstrap
- **Backend**: Node.js com Restify
- **Banco de Dados**: PostgreSQL
- **API**: Flask
- **Containerização**: Docker

## Estrutura do Projeto

O projeto está dividido em três contêineres Docker, definidos no arquivo `docker-compose.yml`:

- `vehicleFrontend`: Contêiner para o frontend da aplicação.
- `vehicleBackend`: Contêiner para o backend, que gerencia as requisições da API.
- `vehicleDatabase`: Contêiner para o PostgreSQL, armazenando todos os dados dos veículos.

## Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

### Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados na sua máquina.

### Passo a passo

1. **Clonar o repositório**

   Clone o repositório do GitHub para a sua máquina local:

   ```bash
   git clone https://github.com/ThiagoMiguel7/C216-Projeto.git
   cd C216-Projeto
   ```

2. **Construir e executar os contêineres**

   Use o Docker Compose para construir as imagens e iniciar os serviços:

   ```bash
   docker-compose up --build
   ```

   Isso criará e iniciará os três contêineres: `vehicleFrontend`, `vehicleBackend` e `vehicleDatabase`.

## Uso

Acesse o frontend da aplicação em `http://localhost:3000`. A aplicação oferece as seguintes funcionalidades:

- **Adicionar um novo veículo**: Acesse a página de inserção de veículo e preencha o formulário.
- **Listar todos os veículos**: Navegue até a página de listagem de veículos para ver todos os veículos cadastrados.
- **Atualizar informações de um veículo**: Na página de listagem, clique no botão de atualizar ao lado do veículo desejado.
- **Excluir um veículo**: Na página de listagem, clique no botão de excluir ao lado do veículo desejado.

## Estrutura de Diretórios

```
C216-Projeto/
├── backend/
│   ├── src/
│   │   └── index.js
│   ├── Dockerfile-backend
│   ├── init.sql
│   ├── package-lock.json
│   └── package.json
├── frontend/
│   ├── assets/
│   │   ├── 1.jpg
│   │   ├── 2.jpg
│   │   └── ...
│   ├── templates/
│   │   ├── atualizar.html
│   │   ├── index.html
│   │   ├── inserir.html
│   │   └── listar.html
│   ├── video/
│   │   └── 911.mp4 (O vídeo 911.mp4 não está no repositório, pois o GitHub não suporta arquivos de vídeo grandes. Por favor, adicione o vídeo manualmente após clonar o repositório.)
│   ├── app.py
│   ├── Dockerfile-frontend
│   └── requirements.txt
├── .gitattributes
├── .gitignore
├── docker-compose.yaml
├── LICENSE
└── README.md
```

## API Endpoints

O backend oferece os seguintes endpoints para interação com o banco de dados:

- **Adicionar um novo veículo**
  - `POST /api/v1/veiculo/inserir`
  - Payload esperado:
    ```json
    {
      "modelo": "string",
      "ano": "number",
      "cor": "string",
      "placa": "string",
      "km": "number"
    }
    ```

- **Listar todos os veículos**
  - `GET /api/v1/veiculo/listar`

- **Atualizar um veículo existente**
  - `POST /api/v1/veiculo/atualizar`
  - Payload esperado:
    ```json
    {
      "id": "number",
      "modelo": "string",
      "ano": "number",
      "cor": "string",
      "placa": "string",
      "km": "number"
    }
    ```

- **Excluir um veículo**
  - `POST /api/v1/veiculo/excluir`
  - Payload esperado:
    ```json
    {
      "id": "number"
    }
    ```

- **Resetar o banco de dados**
  - `DELETE /api/v1/database/reset`

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
