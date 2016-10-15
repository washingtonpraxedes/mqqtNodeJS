var Hapi = require('hapi');
var Mqtt = require('mqtt');
var firebase = require("firebase");

//initializing firebase
var config = {
  apiKey: "AIzaSyCr1CH-4UVUYwyZbU8iKzh-oft_lRBiO74",
  authDomain: "mqttapp-c5afc.firebaseapp.com",
  databaseURL: "https://mqttapp-c5afc.firebaseio.com",
  storageBucket: "mqttapp-c5afc.appspot.com",
  messagingSenderId: "61201021461"
};
firebase.initializeApp(config);

var server = new Hapi.Server();
server.connection({ port: 3000 });

const TOPIC = 'test';
const DATA_TYPE1 = 'temperature';
const DATA_TYPE2 = 'light';

var client = Mqtt.connect('tcp://192.168.25.5:1883');

var messageG = '';

client.on('connect', function () {
  console.log('conectou com BROKER..');
  client.subscribe(TOPIC+'/'+DATA_TYPE1);
  client.subscribe(TOPIC+'/'+DATA_TYPE2);
})

var writeTemperatureData = function (topic, message) {
  var newSubscribeKey = firebase.database().ref().child('subscribe/'+ TOPIC + '/' + DATA_TYPE1 ).push().key;
  firebase.database().ref('subcribe/'+ TOPIC + '/' + DATA_TYPE1 + newSubscribeKey).update({
    topic: topic,
    message: message
  });
}

var writeTemperatureLight = function (topic, message) {
  var newSubscribeKey = firebase.database().ref().child('subscribe/'+ TOPIC + '/' + DATA_TYPE2 ).push().key;
  firebase.database().ref('subcribe/'+ TOPIC + '/' + DATA_TYPE2 + newSubscribeKey).update({
    topic: topic,
    message: message
  });
}

client.on('message', function (topic, message) {
  console.log('message ' + message + ' in topic ' + topic);

  if(topic == TOPIC + '/' + DATA_TYPE1){
    console.log('entrou no if temperatura');
    writeTemperatureData(topic,message);
  }
  else if (topic == TOPIC + '/' + DATA_TYPE2){
    console.log('entrou no if luz');
    writeTemperatureLight(topic,message);
  }
})

// server.route({
//   method: 'POST',
//   path: '/publish/{topic}',
//   handler: function (request, reply) {
//     console.log('payload: ' + request.payload.msg);
//     var topic = request.params.topic;
//     //  var command = request.payload.msg;
//     // publish(topic,msg);
//     console.log("param " + topic);
//     // reply('message sent');

//   }
// });

// server.route({
//   method: 'GET',
//   path: '/subscribe/{topic}',
//   handler: function (request, reply) {
//     console.log('topic ' + encodeURIComponent(request.params.topic));
//     var topic = request.params.topic;
//     console.log(topic);
//     subscribe(topic);
//     reply(messageG.toString());

//   }

// });

// server.start((err) => {

//   if (err) {
//     throw err;
//   }
//   console.log('Server running at:', server.info.uri);
// });