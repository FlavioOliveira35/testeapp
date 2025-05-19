

  const firebaseConfig = {
    apiKey: "AIzaSyAlFPchcsdsyJWmOZUqfdbm-EbwkF01Awc",
    authDomain: "controle-4b27d.firebaseapp.com",
    projectId: "controle-4b27d",
    storageBucket: "controle-4b27d.firebasestorage.app",
    messagingSenderId: "194889796690",
    appId: "1:194889796690:web:c3162d4193252454fee38b"
  };

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referências para serviços do Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Coleções do Firestore
const maquinasRef = db.collection('maquinas');
const operacoesRef = db.collection('operacoes');
const pecasRef = db.collection('pecas');
const manutencoesRef = db.collection('manutencoes');
const alertasRef = db.collection('alertas');
