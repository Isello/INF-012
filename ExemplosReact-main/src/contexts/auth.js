import { useState, createContext, useEffect } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut } from "firebase/auth"
import {default as auth} from "../services/firebaseConnection"
import { Link, useNavigate } from 'react-router-dom';
export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [emailUsuario, setEmailUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    //const history=useNavigate();


    useEffect(() => {
        function loadUser() {
            const storagedUser = localStorage.getItem("usuarioLogado");
            if (storagedUser) {
                setUser(JSON.parse(storagedUser));
                //setLoading(true);
            }
            //setLoading(false);
        }
        loadUser();
    }, []);

    async function signUp(email, password, nome) {
        setLoading(true);
        //Criar usario no Firebase baseado no email e senha e Salvador em um banco mysql
        try{
            const volta = await createUserWithEmailAndPassword(auth, email, password)
            const responseApi = fetch("http://localhost:8080/usuarios/",{
                   method: "POST",
                   headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Methods":"POST,PATCH,OPTIONS"
                   },
                   body: JSON.stringify({nome: nome, email: email}) 
                })
            setLoading(true);
            localStorage.setItem("EmailLogado",email);
            return true;
        }catch(errado){
            toast.error("Deu errado.")
            return false
        }
    }

    async function signIn(email, password) {
        setLoading(true);
        
        //Fazer Login no firebase
        try{
            const volta = await signInWithEmailAndPassword(auth, email, password)
            setEmailUsuario(volta._tokenResponse.email)
            setLocalUser(volta)
            console.log(volta);
            //console.log(volta._tokenResponse.email);
            toast.success('Bem-vindo de volta!!');
            return true
        }
        catch(errado){
            toast.error("Deu errado.")
            return false
        }  
        
    }


    async function signOut() {
        //Fazer logout no firebase
        signOut(auth)
        localStorage.removeItem('usuarioLogado')
        //history("/")
    }

    function setLocalUser(data){
        localStorage.setItem('usuarioLogado', JSON.stringify(data));
    }

    return (
        <AuthContext.Provider value={{
            emailUsuario,
            signed: !!user,
            user,
            signUp,
            signOut,
            signIn,
            loading,
            setUser,
            setLocalUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider;