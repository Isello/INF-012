import { useState, useEffect } from 'react';
import { FiUser, FiDelete, FiEdit2 } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Title from '../../components/Title';
import './costumers.css'
import { Link, useNavigate } from 'react-router-dom';
export default function Costumers() {

  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataCadastro, setdataCadastro] = useState('');
  const [clientes, setClientes] = useState([]);
  const history = useNavigate();
  const [idClient, setIdClient] = useState(); 

  useEffect(() => {
    let qualquer = localStorage.getItem("usuarioLogado")
    if (qualquer != null) {
      async function loadClientes() {
        const carregarClientes = fetch("http://localhost:8080/clientes")
          .then(response => response.json())
          .then(data => {
            setClientes(data)
          })
      }
      loadClientes();
    } else {
      history("/")
    }
  }, [clientes]);

  function handleSubmit(e) {
    e.preventDefault();
    //let id = -1;

    if (nome == "" || cnpj == "" || endereco == "") {
      toast.error("Algum campo não está preenchido");
      return;
    }

    if (CNPJ(cnpj) != true) {
      toast.error("CNPJ inválido");
      return;
    }
    let dataCadastro = new Date().toISOString().slice(0, 10).split('-').reverse().join('/')
    try{
      const responseApi = fetch("http://localhost:8080/clientes/",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
         },
         body: JSON.stringify({nome: nome, cnpj: cnpj, endereco: endereco, dataCadastro: dataCadastro})
      })
      toast.success("Cliente salvo");
    }catch(e){
      toast.error("Cliente não foi salvo");
    }

  }

  async function exlcluir(id) {
    fetch('http://localhost:8080/clientes/' + id, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(res => console.log(res))
  }
  async function editar(id) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'React PUT Request Example' })
    };
    fetch('https://jsonplaceholder.typicode.com/posts/1', requestOptions)
      .then(response => response.json())
      .then(data => this.setState({ id: data.id }));
  }

  function CNPJ(value) {
    if (!value) return false
  
    // Aceita receber o valor como string, número ou array com todos os dígitos
    const isString = typeof value === 'string'
    const validTypes = isString || Number.isInteger(value) || Array.isArray(value)
  
    // Elimina valor em formato inválido
    if (!validTypes) return false
  
    // Filtro inicial para entradas do tipo string
    if (isString) {
      // Limita ao máximo de 18 caracteres, para CNPJ formatado
      if (value.length > 18) return false
  
      // Teste Regex para veificar se é uma string apenas dígitos válida
      const digitsOnly = /^\d{14}$/.test(value)
      // Teste Regex para verificar se é uma string formatada válida
      const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(value)
  
      // Se o formato é válido, usa um truque para seguir o fluxo da validação
      if (digitsOnly || validFormat) 
      return true
      // Se não, retorna inválido
      else return false
    }
  
    // Guarda um array com todos os dígitos do valor
    const match = value.toString().match(/\d/g)
    const numbers = Array.isArray(match) ? match.map(Number) : []
  
    // Valida a quantidade de dígitos
    if (numbers.length !== 14) return false
    
    // Elimina inválidos com todos os dígitos iguais
    const items = [...new Set(numbers)]
    if (items.length === 1) return false
  
    // Cálculo validador
    const calc = (x) => {
      const slice = numbers.slice(0, x)
      let factor = x - 7
      let sum = 0
  
      for (let i = x; i >= 1; i--) {
        const n = slice[x - i]
        sum += n * factor--
        if (factor < 2) factor = 9
      }
  
      const result = 11 - (sum % 11)
  
      return result > 9 ? 0 : result
    }
  
    // Separa os 2 últimos dígitos de verificadores
    const digits = numbers.slice(12)
    
    // Valida 1o. dígito verificador
    const digit0 = calc(12)
    if (digit0 !== digits[0]) return false
  
    // Valida 2o. dígito verificador
    const digit1 = calc(13)
    return digit1 === digits[1]
  }




  return (
    <div>
      <Header />

      <div className="content">
        <Title nome="Clientes">
          <FiUser size={25} />
        </Title>


        <div className="container">
          <form onSubmit={(e) => { handleSubmit(e) }} className="form-profile costumers">
            <label>Nome</label>
            <input placeholder="Digite o Nome Fantasia" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

            <label>CNPJ</label>
            <input placeholder="Digite o CNPJ" type="text" value={cnpj} onChange={(e) => { setCnpj(e.target.value) }} />

            <label>Endereço</label>
            <input placeholder="Digite o seu Endereço" type="text" value={endereco} onChange={(e) => { setEndereco(e.target.value) }} />

            <button className="button-costumers" type="submit">Salvar</button>
          </form>
        </div>
        <table>
          <thead>
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">CNPJ</th>
              <th scope="col">Endereço</th>
              <th scope="col">Cadastrado em</th>
              <th scope="col">#</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => {
              return (
                <tr>
                  <td data-label="Cliente">{cliente.nome}</td>
                  <td data-label="CNPJ">{cliente.cnpj}</td>
                  <td data-label="Endereço">{cliente.endereco}</td>
                  <td data-label="Cadastrado">20/06/2021</td>
                  <td data-label="#">
                    <button onClick={() => { exlcluir(cliente.id) }} className="action" style={{ backgroundColor: '#3583f6' }}>
                      <FiDelete color="#FFF" size={17} />
                    </button>
                    <button className="action" style={{ backgroundColor: '#F6a935' }}>
                      <FiEdit2 color="#FFF" size={17} />
                    </button>
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>
    </div>
  );
}