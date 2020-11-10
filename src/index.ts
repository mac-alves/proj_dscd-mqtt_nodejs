import dotenv from 'dotenv';
dotenv.config()

import mqtt from 'mqtt';

const client = mqtt.connect(process.env.URL_MQTT, {
    clientId:process.env.ID_CLIENT_MQTT,
    username:process.env.USER_MQTT,
    password:process.env.PASSWORD_MQTT,
    clean:true
});
 
client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})