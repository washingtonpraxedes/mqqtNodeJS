var Hapi = require('mqtt');
var Mqtt = require('hapi');

var server = Hapi.Server();
var client = Mqtt.connect('localhost:8883');

var messageG='';

var publish = function (topic, msg) {
    mqtt.publish(topic, msg, function () {
        console.log("msg '" + msg + "' sent");
    });
}

var subscribe = function (topic) {
    mqtt.subscribe(topic, function () {
        console.log("topic '" + topic + "' subscribed");
    })
}

client.on('message', function (topic, message) {
messageG = message;
})

server.route({
    method: 'POST',
    path: 'publish/{topic}',
    handler: function (reply, request) {
        var topic = request.params.topic;
        var command = request.payload.msg;
        publish(topic,msg);
        reply('message sent');

    }
});

server.route({
      method: 'POST',
    path: 'subscribe/{topic}',
    handler: function (reply, request) {
        var topic = request.params.topic;
        publish(topic,msg);
        var json = JSON.parse('{"message": "'+ messageG +'"}');
        reply(json);

    }

})