import { useState, useContext, useEffect} from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import { FiSettings, FiUpload } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

export default function Profile(){
  const { user, signOut, setUser, setLocalUser} = useContext(AuthContext);
  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar]=useState(null);
  const history=useNavigate();
  
  useEffect(()=>{
    let usuarioLogado = localStorage.getItem('usuarioLogado')
    let emailLogado = localStorage.getItem("EmailLogado")
    if( usuarioLogado!=null){
      const url = fetch("http://localhost:8080/usuarios?email=" + emailLogado,{
                   method: "GET",
                   headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                   },
                }).then(response => response.json())
                .then(data => {
                  //setNome(data[0].nome)
                  setEmail(data[0].email)
                  })
                
    }else{
      history("/")
    }
  })

function handleFile(e){
}

 async function handleSave(e){
    e.preventDefault();
    if(nome == ""){
      toast.error("Preencha o nome")
      return;
    }

    let emailLogado = localStorage.getItem("EmailLogado")
    const url = fetch("http://localhost:8080/usuarios?email=" + emailLogado,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
        },
        }).then(response => response.json())
          .then(data => {
            try{
              const responsePut = fetch("http://localhost:8080/usuarios/"+ data[0].id,{
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin":"*",
                  "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                },
                body: JSON.stringify({nome: nome, email: email})
              })
              toast.success("Nome modificado");
            }catch(e){
              toast.error("Nome não foi alterado");
            }
        });
  }

  async function sair(e){
    e.preventDefault();
    signOut()
    history("/")
  }

  async function handleUpload(){
   
  }
  return(
    <div>
      <Header/>

      <div className="content">
        <Title nome="Meu perfil">
          <FiSettings size={25} />
        </Title>


        <div className="container">
          <form onSubmit={(e)=>handleSave(e)} className="form-profile">
            <label className="label-avatar">
              <span>
                <FiUpload color="#000" size={25} />
              </span>

              <input type="file" accept="image/*" onChange={handleFile}/><br/>
              { avatarUrl === null ? 
                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuario" />
                :
                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuario" />
              }
            </label>

            <label>Nome</label>
            <input type="text" value={nome} onChange={ (e) => setNome(e.target.value) } />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />     

            <button type="submit">Salvar</button>       

          </form>
        </div>

        <div className="container">
            <button className="logout-btn" onClick={  (e)=>sair(e)} >
               Sair
            </button>
        </div>

      </div>
    </div>
  )
}