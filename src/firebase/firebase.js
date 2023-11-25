import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDnYFruPNccK_hfCmKQA8TcyMj8vxgXNRY",
  authDomain: "timetable-1168e.firebaseapp.com",
  projectId: "timetable-1168e",
  storageBucket: "timetable-1168e.appspot.com",
  messagingSenderId: "1003445784721",
  appId: "1:1003445784721:web:d3c1b6b1fd121125da2f30",
};

firebase.initializeApp(firebaseConfig);
firebase.auth();

export default firebase;
