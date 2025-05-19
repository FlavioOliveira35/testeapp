
  // Your web app's Firebase configuration
  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";

  const firebaseConfig = {    
    apiKey: "AIzaSyAlFPchcsdsyJWmOZUqfdbm-EbwkF01Awc",
    authDomain: "controle-4b27d.firebaseapp.com",
    projectId: "controle-4b27d",
    storageBucket: "controle-4b27d.firebasestorage.app",
    messagingSenderId: "194889796690",
    appId: "1:194889796690:web:c3162d4193252454fee38b"
  };
  

const app = initializeApp(firebaseConfig);
// Inicializar Firebase
//firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Referências para as coleções
const maquinasRef = db.collection("maquinas");
console.log(maquinasRef);
const operacoesRef = db.collection("operacoes");
const pecasRef = db.collection("pecas");
const manutencoesRef = db.collection("manutencoes");
const alertasRef = db.collection("alertas");
