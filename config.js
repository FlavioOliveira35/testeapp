

  // Import the functions you need from the SDKs you need
  //import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries*/


// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAc38Mx5TRU7dIQk91djTtqsbJILnEPj-Y",
 authDomain: "controletarefas-e0251.firebaseapp.com", 
 projectId: "controletarefas-e0251", 
 storageBucket: "controletarefas-e0251.firebasestorage.app", 
 messagingSenderId: "895862679232", 
 appId: "1:895862679232:web:d61b017a67b29eb37d2f25" }; 

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
//const app = initializeApp(firebaseConfig);

// Referências para serviços do Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Coleções do Firestore
const maquinasRef = db.collection("maquinas");
const operacoesRef = db.collection('operacoes');
const pecasRef = db.collection('pecas');
const manutencoesRef = db.collection('manutencoes');
const alertasRef = db.collection('alertas');


