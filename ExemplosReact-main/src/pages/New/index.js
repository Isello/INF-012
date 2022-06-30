import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './new.css';
import firebase from '../../services/firebaseConnection';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export default function New() {

    const [cria, setCria] = useState(localStorage.getItem("idChamado"))
    const [clientes, setClientes] = useState([]);
    const [loadingClientes, setLoadingClientes] = useState(true);
    const [clienteSelecionado, setClienteSelecionado] = useState(1);
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');
    const history = useNavigate();
    const {emailUsuario}= useContext(AuthContext);

    useEffect(() => {
        let usuarioLogado = localStorage.getItem('usuarioLogado')
        let emailLogado = localStorage.getItem("EmailLogado")
        if (usuarioLogado != null) {
            async function loadClientes() {
                try{
                    fetch("http://localhost:8080/chamados?id="+cria)
                    .then(response => response.json())
                    .then(data =>{
                      
                        if(data[0] != null){
                            setClienteSelecionado(data[0].cliente.clienteId)
                            setAssunto(data[0].assunto)
                            setStatus(data[0].status)
                            setComplemento(data[0].complemento)
                            async function loadClientes() {
                                const url = fetch("http://localhost:8080/clientes")
                                .then(response => response.json())
                                .then(data =>{
                                  setClientes(data);
                                  setLoadingClientes(false);
                                })
                              }
                              loadClientes();
                              localStorage.removeItem("idChamadoEdicao")
                        }else{
                            async function loadClientes() {
                                const url = fetch("http://localhost:8080/clientes")
                                .then(response => response.json())
                                .then(data =>{
                                  setClientes(data);
                                  setLoadingClientes(false);
                                })
                              }
                              loadClientes();
                        }
                    })
                }catch(e){
    
                }
                
            }
            loadClientes();
        } else {
            history("/")
        }
    }, []);

    async function handleChamado(e) {
        e.preventDefault();
        if(complemento == ""){
            toast.error("Complemento vazio")
            return;
        }
        const today = new Date();
        let dataCadastro = today.toLocaleDateString();
        const responseApi = fetch("http://localhost:8080/chamados/",{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin":"*",
                                "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                               },
                            body: JSON.stringify({assunto: assunto,status: status,complemento: complemento,  dataCadastro: dataCadastro})
                        })
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title nome="Novo chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">

                    <form onSubmit={(e) => { handleChamado(e) }} className="form-profile">
                        <label>Cliente</label>
                        {loadingClientes ?
                            <input type="text" value="Carregando..." />
                            : <select value={clienteSelecionado} onChange={(e) => setClienteSelecionado(e.target.value)}>
                                {clientes.map((item, index) => {
                                    return (<option key={item.id} value={item.id}>{item.nome}</option>);
                                })}
                            </select>
                        }


                        <label>Assunto</label>
                        <select value={assunto} onChange={(e) => setAssunto(e.target.value)}>
                            <option value="Suporte">Suporte</option>
                            <option value="Financeiro">Financeiro</option>
                            <option value="Visita">Visita</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "Aberto"} />
                            <span>Em Aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "Progresso"} />
                            <span>Em Progresso</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "Atendido"} />
                            <span>Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea type="text"
                            placeholder="Descreva seu problema aqui"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)} />

                        <button type="submit">Registrar</button>
                    </form>

                </div>

            </div>
        </div>
    );
}