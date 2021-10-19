import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyBjYowX1DesInIkiWR350KdlZU0FZntP5E",
    authDomain: "backendr-dac72.firebaseapp.com",
    projectId: "backendr-dac72",
    storageBucket: "backendr-dac72.appspot.com",
    messagingSenderId: "1049129332087",
    appId: "1:1049129332087:web:38b1c2d524563f620dc572"
  };

  firebase.initializeApp(firebaseConfig)

  export default firebase;