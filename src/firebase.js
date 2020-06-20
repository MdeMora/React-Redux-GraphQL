import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
var firebaseConfig = {
    apiKey: "AIzaSyAdJqmdvKke5vHO4KohIcftvqO2Hc5O7I4",
    authDomain: "react-redux-graphql-test.firebaseapp.com",
    databaseURL: "https://react-redux-graphql-test.firebaseio.com",
    projectId: "react-redux-graphql-test",
    storageBucket: "react-redux-graphql-test.appspot.com",
    messagingSenderId: "715549641202",
    appId: "1:715549641202:web:67688164d77364be50436b",
    measurementId: "G-E71TYQMXJH"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  let db = firebase.firestore().collection('favs')

  export function getFavs(uid){
    return db.doc(uid).get()
      .then(snap => snap.data().favoritos)
  }

  export function updateDB(array,uid){
    return db.doc(uid).set({favoritos:[...array]})
  }
//   firebase.analytics();

  export function loginWithGoogle(){
      let provider = new firebase.auth.GoogleAuthProvider()
      return firebase.auth().signInWithPopup(provider)
      .then(snap => snap.user)
  }

  export function signOutGoogle(){
      firebase.auth().signOut()
  }