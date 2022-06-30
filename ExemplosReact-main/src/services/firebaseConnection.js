import {initializeApp} from "firebase/app"
import{getAuth} from "firebase/auth"

const firebaseConfig={
    apiKey: "AIzaSyCxhCMffsrHm0WvnZUBZNhKtROksqhRC0o",
    authDomain: "lace-51f20.firebaseapp.com",
    projectId: "lace-51f20",
    storageBucket: "lace-51f20.appspot.com",
    messagingSenderId: "117295912489",
    appId: "1:117295912489:web:833a782902a7d59b9eee38"
}

const app=initializeApp(firebaseConfig);
var auth=null;
if(app){
    auth=getAuth();
}

export default auth;