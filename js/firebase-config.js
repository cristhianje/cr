// COPIE e COLE aqui a config do seu projeto Firebase (ex: do painel -> SDK snippet)
const firebaseConfig = {
  // ATENÇÃO: O apiKey é gerado para cada aplicativo web.
  // Você precisa obtê-lo do Console do Firebase.
  // Vá em "Configurações do Projeto" -> "Seus aplicativos" -> clique no seu app web
  // -> selecione "Config" para o snippet do SDK.
  apiKey: "AIzaSyAroRtuDBk1Hpb3giNhKr3lUcygrdNkaXI", // Exemplo: "AIzaSyBnRKitQGBX0u8k4COwDTILYxCJ4Mf7xzE"
  authDomain: "iptu-4bf88.firebaseapp.com",
  projectId: "iptu-4bf88",
  storageBucket: "iptu-4bf88.appspot.com",
  messagingSenderId: "17615356795",
  // ATENÇÃO: O appId é gerado para cada aplicativo web.
  // Você precisa obtê-lo do Console do Firebase, da mesma forma que o apiKey.
  appId: "1:17615356795:web:a460b2cbe2d453a573f3de", // Exemplo: "1:875614679042:web:5813c3e70a33e91ba0371b"
  measurementId: "G-Z8FBBYXJY3"
};

// Inicializa Firebase
if (!window.firebase.apps || !window.firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
