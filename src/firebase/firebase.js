import firebase from 'firebase';

const firebaseConfig = {
	apiKey: "AIzaSyCm2ToFCR3BZQkQRbaD5ugnOdB31b2nKsQ",
	authDomain: "time-table-5a350.firebaseapp.com",
	databaseURL: "https://time-table-5a350-default-rtdb.firebaseio.com",
	projectId: "time-table-5a350",
	storageBucket: "time-table-5a350.appspot.com",
	messagingSenderId: "153362038507",
	appId: "1:153362038507:web:9dab03cbffbee007cf88ae",
	measurementId: "G-QJSL8TSLE0"
};

firebase.initializeApp(firebaseConfig);
firebase.auth();

export default firebase;
