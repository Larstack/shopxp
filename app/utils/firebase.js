import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCZaLie7YlM1PShcFomOFSUvfEYSDpNNHU",
  authDomain: "shopxp-9e859.firebaseapp.com",
  databaseURL: "https://shopxp-9e859.firebaseio.com",
  projectId: "shopxp-9e859",
  storageBucket: "shopxp-9e859.appspot.com",
  messagingSenderId: "214626305007",
  appId: "1:214626305007:web:7a570d85426f964ea92c1a",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
