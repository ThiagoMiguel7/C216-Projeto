from flask import Flask, render_template, request, redirect, url_for, jsonify
import requests
import os

app = Flask(__name__)

# Definindo as variáveis de ambiente
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000/api/v1/veiculo")
API_DATABASE_RESET = os.getenv("API_DATABASE_RESET", "http://localhost:5000/api/v1/database/reset") 

# Rota para a página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Rota para exibir o formulário de cadastro de veículo
@app.route('/inserir', methods=['GET'])
def inserir_veiculo_form():
    return render_template('inserir.html')

# Rota para enviar os dados do formulário de cadastro de veículo para a API
@app.route('/inserir', methods=['POST'])
def inserir_veiculo():
    marca = request.form['marca']
    modelo = request.form['modelo']
    ano = request.form['ano']
    preco = request.form['preco']

    payload = {
        'marca': marca,
        'modelo': modelo,
        'ano': ano,
        'preco': preco
    }

    response = requests.post(f'{API_BASE_URL}/inserir', json=payload)
    
    if response.status_code == 201:
        return redirect(url_for('listar_veiculos'))
    else:
        return "Erro ao inserir veículo", 500

# Rota para listar todos os veículos
@app.route('/listar', methods=['GET'])
def listar_veiculos():
    response = requests.get(f'{API_BASE_URL}/listar')
    veiculos = response.json()
    return render_template('listar.html', veiculos=veiculos)

# Rota para exibir o formulário de edição de veículo
@app.route('/atualizar/<int:veiculo_id>', methods=['GET'])
def atualizar_veiculo_form(veiculo_id):
    response = requests.get(f"{API_BASE_URL}/listar")
    # Filtrando apenas o veículo correspondente ao ID
    veiculos = [veiculo for veiculo in response.json() if veiculo['id'] == veiculo_id]
    if len(veiculos) == 0:
        return "Veículo não encontrado", 404
    veiculo = veiculos[0]
    return render_template('atualizar.html', veiculo=veiculo)

# Rota para enviar os dados do formulário de edição de veículo para a API
@app.route('/atualizar/<int:veiculo_id>', methods=['POST'])
def atualizar_veiculo(veiculo_id):
    marca = request.form['marca']
    modelo = request.form['modelo']
    ano = request.form['ano']
    preco = request.form['preco']

    payload = {
        'id': veiculo_id,
        'marca': marca,
        'modelo': modelo,
        'ano': ano,
        'preco': preco
    }

    response = requests.post(f"{API_BASE_URL}/atualizar", json=payload)
    
    if response.status_code == 200:
        return redirect(url_for('listar_veiculos'))
    else:
        return "Erro ao atualizar veículo", 500

# Rota para excluir um veículo
@app.route('/excluir/<int:veiculo_id>', methods=['POST'])
def excluir_veiculo(veiculo_id):
    payload = {'id': veiculo_id}

    response = requests.post(f"{API_BASE_URL}/excluir", json=payload)
    
    if response.status_code == 200:
        return redirect(url_for('listar_veiculos'))
    else:
        return "Erro ao excluir veículo", 500

# Rota para resetar o database
@app.route('/reset-database', methods=['GET'])
def resetar_database():
    response = requests.delete(API_DATABASE_RESET)
    
    if response.status_code == 200:
        return redirect(url_for('index'))
    else:
        return "Erro ao resetar o database", 500


if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')