const functions = require('firebase-functions');
const rp = require('request-promise')
var admin = require("firebase-admin");

var serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://melitest-5bc38.firebaseio.com"
});

let db = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    console.log('Se ejecutara cada 1 minuto!');

    const url = 'https://jsonplaceholder.typicode.com/users'
  
    var options = {
        uri: url,
        method: "GET",
        json: true
    };
     
    rp(options).then((jsonresponse) => {
         for(var i = 0 ; i < jsonresponse.length; i++){
            var obj = jsonresponse[i]
            var docid = obj.id
            db.collection("scrapeusertest").doc(String(docid)).set(obj).then(() =>{
                console.log("Datos subidos a firestore correctamente")
            }).catch(error =>{
                console.log("Hubo un error al subir uno de los datos a Firebase",error)
            });
        }
        return console.log("Se enviaron todos los datos a Firestore")
    })
    .catch((err) => {
        console.log('Ocurrio un error:', err)
    });
    return null;
  });
