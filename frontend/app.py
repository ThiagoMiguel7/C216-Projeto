from flask import Flask, render_template, request, redirect, url_for, jsonify
import requests
import os

app = Flask(__name__)

# Definindo as variáveis de ambiente
API_BASE_URL = os.getenv("API_BASE_URL" , "http://localhost:5000/api/v1/hotel")
API_DATABASE_RESET = os.getenv("API_DATABASE_RESET" , "http://localhost:5000/api/v1/database/reset") 

# Rota para a página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Rota para exibir o formulário de cadastro
@app.route('/inserir', methods=['GET'])
def inserir_hotel_form():
    return render_template('inserir.html')

# Rota para enviar os dados do formulário de cadastro para a API
@app.route('/inserir', methods=['POST'])
def inserir_hotel():
    nome = request.form['nome']
    localizacao = request.form['localizacao']
    classificacao = request.form['classificacao']
    email_contato = request.form['email_contato']

    payload = {
        'nome': nome,
        'localizacao': localizacao,
        'classificacao': classificacao,
        'email_contato': email_contato
    }

    response = requests.post(f'{API_BASE_URL}/inserir', json=payload)
    
    if response.status_code == 201:
        return redirect(url_for('listar_hoteis'))
    else:
        return "Erro ao inserir hotel", 500

# Rota para listar todos os hotéis
@app.route('/listar', methods=['GET'])
def listar_hoteis():
    response = requests.get(f'{API_BASE_URL}/listar')
    hoteis = response.json()
    return render_template('listar.html', hoteis=hoteis)

# Rota para exibir o formulário de edição de hotel
@app.route('/atualizar/<int:hotel_id>', methods=['GET'])
def atualizar_hotel_form(hotel_id):
    response = requests.get(f"{API_BASE_URL}/listar")
    #filtrando apenas o hotel correspondente ao ID
    hoteis = [hotel for hotel in response.json() if hotel['id'] == hotel_id]
    if len(hoteis) == 0:
        return "Hotel não encontrado", 404
    hotel = hoteis[0]
    return render_template('atualizar.html', hotel=hotel)

# Rota para enviar os dados do formulário de edição de hotel para a API
@app.route('/atualizar/<int:hotel_id>', methods=['POST'])
def atualizar_hotel(hotel_id):
    nome = request.form['nome']
    localizacao = request.form['localizacao']
    classificacao = request.form['classificacao']
    email_contato = request.form['email_contato']

    payload = {
        'id': hotel_id,
        'nome': nome,
        'localizacao': localizacao,
        'classificacao': classificacao,
        'email_contato': email_contato
    }

    response = requests.post(f"{API_BASE_URL}/atualizar", json=payload)
    
    if response.status_code == 200:
        return redirect(url_for('listar_hoteis'))
    else:
        return "Erro ao atualizar hotel", 500

# Rota para excluir um hotel
@app.route('/excluir/<int:hotel_id>', methods=['POST'])
def excluir_hotel(hotel_id):
    payload = {'id': hotel_id}

    response = requests.post(f"{API_BASE_URL}/excluir", json=payload)
    
    if response.status_code == 200  :
        return redirect(url_for('listar_hoteis'))
    else:
        return "Erro ao excluir hotel", 500

#Rota para resetar o database
@app.route('/reset-database', methods=['GET'])
def resetar_database():
    response = requests.delete(API_DATABASE_RESET)
    
    if response.status_code == 200  :
        return redirect(url_for('index'))
    else:
        return "Erro ao resetar o database", 500


if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')