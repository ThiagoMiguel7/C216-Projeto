from flask import Flask, render_template, request, redirect, url_for, send_from_directory
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

# Rota para enviar os dados do formulário de cadastro para a API
@app.route('/inserir', methods=['POST'])
def inserir_veiculo():
    modelo = request.form['modelo']
    ano = request.form['ano']
    cor = request.form['cor']
    placa = request.form['placa']
    km = request.form['km']

    payload = {
        'modelo': modelo,
        'ano': ano,
        'cor': cor,
        'placa': placa,
        'km': km
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
    veiculos = [veiculo for veiculo in response.json() if veiculo['id'] == veiculo_id]
    if not veiculos:
        return "Veículo não encontrado", 404
    veiculo = veiculos[0]
    return render_template('atualizar.html', veiculo=veiculo)

# Rota para enviar os dados do formulário de edição de veículo para a API
@app.route('/atualizar/<int:veiculo_id>', methods=['POST'])
def atualizar_veiculo(veiculo_id):
    modelo = request.form['modelo']
    ano = request.form['ano']
    cor = request.form['cor']
    placa = request.form['placa']
    km = request.form['km']

    payload = {
        'id': veiculo_id,
        'modelo': modelo,
        'ano': ano,
        'cor': cor,
        'placa': placa,
        'km': km
    }

    response = requests.post(f"{API_BASE_URL}/atualizar", json=payload)
    
    if response.status_code == 200:
        return redirect(url_for('listar_veiculos'))
    else:
        return "Erro ao atualizar veículo", 500

# Rota para excluir um veículo
@app.route('/excluir/<int:veiculo_id>', methods=['POST'])
def excluir_veiculo(veiculo_id):
    response = requests.post(f"{API_BASE_URL}/excluir", json={'id': veiculo_id})
    
    if response.status_code == 200:
        return redirect(url_for('listar_veiculos'))
    else:
        return "Erro ao excluir veículo", 500

# Rota para resetar o banco de dados
@app.route('/reset-database', methods=['GET'])
def resetar_database():
    response = requests.delete(API_DATABASE_RESET)
    
    if response.status_code == 200:
        return redirect(url_for('index'))
    else:
        return "Erro ao resetar o banco de dados", 500

# Rota para servir arquivos de vídeo
@app.route('/video/<path:filename>')
def video(filename):
    return send_from_directory('video', filename)

@app.route('/assets/<path:filename>')
def assets(filename):
    return send_from_directory('assets', filename)

if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')
