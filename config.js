// Firebase SDK - Configuração Modular (ES6)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1FPchcsdsyJWmOZUqfdbm-EbwkF01Awc",
  authDomain: "controle-4b27d.firebaseapp.com",
  projectId: "controle-4b27d",
  storageBucket: "controle-4b27d.firestorage.app",
  messagingSenderId: "194889796690",
  appId: "1:194889796690:web:c3162d4193252454fee38b"
};

// Inicializar Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referências para as coleções
const maquinasCollection = collection(db, 'maquinas');
const operacoesCollection = collection(db, 'operacoes');
const pecasCollection = collection(db, 'pecas');
const manutencoesCollection = collection(db, 'manutencoes');
const alertasCollection = collection(db, 'alertas');

// Verificar se o Firebase está inicializado corretamente
console.log("Firebase inicializado:", app.name);
console.log("Firestore disponível:", !!db);

// Exportar para uso em outros módulos
export {
  app,
  db,
  maquinasCollection,
  operacoesCollection,
  pecasCollection,
  manutencoesCollection,
  alertasCollection,
  collection,  
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
};
