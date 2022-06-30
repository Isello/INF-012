import logo from '../../assets/login.png'
import { useState, useContext } from 'react';
import {AuthContext} from '../../contexts/auth';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
function SignUp() {
    const [nome, setNome]=useState('');
    const [email, setEmail]=useState('');
    const [senha, setSenha]=useState('');
    const {signUp, loading}=useContext(AuthContext);
    const history=useNavigate();
    localStorage.removeItem('usuarioLogado')
    
    async function handleSubmit(e){
      e.preventDefault();
     if(email!==''&&senha!==''&&nome!==''){
      try{
        const teoria = await signUp(email, senha, nome)
        if(teoria==true){
          toast.success('Usuário cadastrado!');
          history("/")
          toast.success('Pode logar!');
        }
      }catch(errado){
        toast.error("Deu errado.")
      }
     }else{toast.error("Algum campo está vazio.")}
      
    }

    return (
      <div className="conteiner-center">
        <div className="login">
          
          <div className="login-area">
            <img src={logo} alt="Logo do Sistema"/>
          </div>
         
          <form onSubmit={handleSubmit}>
            <h1>Nova Conta</h1>
            <input type="text" value={nome} placeholder="Seu nome"  onChange={(e)=>{setNome(e.target.value)}} />
            <input type="text" value={email} placeholder="email@email.com"  onChange={(e)=>{setEmail(e.target.value)}} />
            <input type="password" value={senha} placeholder="*****" onChange={(e)=>{setSenha(e.target.value)}}/>
            <button type="submit">Cadastrar</button>
          </form>
         
          <Link to="/">Já possui uma conta? Entre aqui!</Link>
       
        </div>
      </div>
    );
  }
  

  
  export default SignUp;