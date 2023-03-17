const firebase = require("firebase")
const firebaseConfig = {
    apiKey: "AIzaSyBwb-M39igbZBu5dVVLBLgNnIFQxtoIx4I",
    authDomain: "pruebaflutter-8ee34.firebaseapp.com",
    projectId: "pruebaflutter-8ee34",
    storageBucket: "pruebaflutter-8ee34.appspot.com",
    messagingSenderId: "1000782766177",
    appId: "1:1000782766177:web:d10dae434ca13378c10a20"
  };

  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const Cotizacion = db.collection("cotizaciones");
  module.exports = Cotizacion;