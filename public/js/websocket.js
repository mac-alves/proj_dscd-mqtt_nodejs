const config = {
    host: '192.168.100.101',
    port: Number(9001),
    clientId: 'nodejs',
    user: 'mac-alves',
    password: '12345678',
    topicJoker: 'mqtt_proj/#'
}

/**
 * Invocada quando o conecta com o blocker
 */
function onConnect() {
    console.log("onConnect");
    client.subscribe("mqtt_proj/#");
    onSendMessage(`${config.clientId}-1`, "mqtt_proj/connected");
}

/**
 * Invocada caso haja falha na conexão
 * 
 * @param {*} responseObject
 */
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

/**
 * Recebe as mensagem
 * 
 * @param {*} message 
 */
function onMessageArrived(message) {
   updateClient(message.payloadString, message.destinationName);
}

/**
 * Função responsável por enviar uma mensagem
 * 
 * @param {*} msg 
 * @param {*} topic 
 */
function onSendMessage(msg, topic) {
    const message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message);
}

/**
 * Instância um novo client Paho
 */
const client = new Paho.MQTT.Client(config.host, config.port, config.clientId);

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

/**
 * Conecta-se ao broker
 */
client.connect({
    onSuccess: onConnect,
    userName : config.user,
    password : config.password
});