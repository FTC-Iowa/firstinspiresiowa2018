import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
import "firebase/auth";

Firebase.initializeApp({
  apiKey: "AIzaSyDQOhAqHtOOjWetSbzfvdlpXB_RMtfb_NU",
  authDomain: "firstinspiresiowa2018.firebaseapp.com",
  databaseURL: "https://firstinspiresiowa2018.firebaseio.com",
  projectId: "firstinspiresiowa2018",
  storageBucket: "firstinspiresiowa2018.appspot.com",
  messagingSenderId: "42095702430"

  // apiKey: "AIzaSyCUOWbLrQa8qlJ-nGpxbSCD-X2yVVA_sr0",
  // authDomain: "firstinspiresiowa2018-dev.firebaseapp.com",
  // databaseURL: "https://firstinspiresiowa2018-dev.firebaseio.com",
  // projectId: "firstinspiresiowa2018-dev",
  // storageBucket: "firstinspiresiowa2018-dev.appspot.com",
  // messagingSenderId: "369294091136"
});

const firestore = Firebase.firestore();
const firestorage = Firebase.storage();
const firefunctions = Firebase.functions();
// firefunctions.useFunctionsEmulator("http://localhost:5000");
const fireauth = Firebase.auth();

firestore.settings({
  timestampsInSnapshots: true
});

export default {
  Firebase,
  firestore,
  firestorage,
  firefunctions,
  fireauth
};
