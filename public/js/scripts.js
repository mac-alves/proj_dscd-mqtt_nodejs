/* 
    conexão de client
        mqtt_proj/connected -> id_client-status
    
    conexão de pontos de clients
        mqtt_proj/connected_points -> id_client-id_ponto_client-status

    mqtt_proj/[id_client] -> id_ponto_client-estado

*/

const TOPIC_CONNECTION_CLIENT = 'mqtt_proj/connected';
const TOPIC_CONNECTION_POINTS = 'mqtt_proj/connected_points';

let idsClients = ['mqtt_mobile'];

let clients = [
    { 
        id: 'mqtt_mobile', 
        name: 'Mac',
        status: 'off',
        points: [
            {
                id: 'nodemcu_lamp',
                name: 'Lampada',
                status: 'off',
                state: 'off',
            }
        ]
    }
]

/**
 * Factory de clients
 */
const clientsFactory = {
    init: function() {
        this.cacheDOM();
        this.render(clients);
    },
    cacheDOM: function() {
        this.$main = $('#main');
    },
    render: function(listUsers) {
        const template = Handlebars.compile($("#user-template").html());
        this.$main.html('');

        listUsers.forEach(user => {
            const context = {
                classStatus: (user.status === 'off') ? '' : 'green',
                idClient: user.id,
                nameClient: user.name,
                infoStatus: (user.status === 'off') ? 'Desconectado' : 'Conectado',
            }
    
            this.$main.prepend(template(context));
            this.renderPoints(user.id, user.points);
        });

        expandCard();        
    },
    renderPoints: function(idClient, listPoints) {
        this.$points = $(`#points-${idClient}`);
        const template = Handlebars.compile($("#points-template").html());
        
        this.$points.html('');

        listPoints.forEach(point => {
            const context = {
                idClient: idClient,
                idPointClient: point.id,
                namePointClient: point.name,
                pointStatus: (point.status === 'off') ? '' : 'on',
                pointState: (point.state === 'off') ? '' : 'on',
            }
    
            this.$points.prepend(template(context));
        });
    },
}

/**
 * Inicializa a factory
 */
clientsFactory.init();

function updateClient(command, topic){
    if (topic.split('/').length > 2) return -1;
    
    if (topic === TOPIC_CONNECTION_CLIENT) {
        const [idCli, status] = command.split('-');
        updateStatusClient(idCli, status);
        clientsFactory.render(clients);
    }

    if (topic === TOPIC_CONNECTION_POINTS) {
        const [idCli, idPoint, status] = command.split('-');
        updatePointClient(idCli, idPoint, status, 'status');
        clientsFactory.renderPoints(idCli, clients.find(cli => cli.id == idCli).points);
    }

    const [jocker, idClient] = topic.split('/');

    if (idsClients.includes(idClient)) {
        const [idPoint, state] = command.split('-');
        updatePointClient(idClient, idPoint, state, 'state');
        clientsFactory.renderPoints(idClient, clients.find(cli => cli.id == idClient).points);
    }

}

/**
 * Atualiza o status do client
 * 
 * @param {*} id id do client
 * @param {*} status novo status 
 */
function updateStatusClient(id, status){
    clients = clients.map(client => {
        if (client.id === id) {
            client.status = (status === '1') ? 'on' : 'off';
            client.status = (status === '1') ? 'on' : 'off';
        }

        return client;
    });
}

/**
 * Atualiza o ponto do client
 * 
 * @param {*} idClient id co client
 * @param {*} idPoint id do ponto
 * @param {*} command novo comando
 * @param {*} attr status / state
 */
function updatePointClient(idClient, idPoint, command, attr){
    clients = clients.map(client => {
        if (client.id === idClient) {
            client.points = client.points.map(point => {
                if (point.id === idPoint) {
                    point[attr] = (command === '1') ? 'on' : 'off';
                }

                return point;
            });
        }

        return client;
    });
}

/**
 * Possibilita a expansão do card
 */
function expandCard(){
    $("input[type=checkbox]").on("click", function(){
        if (!$(this).prop("checked")) {
            $(this).parent().parent().css("width", '150px');
            $(this).parent().parent().css("min-width", '150px');
        } else {
            $(this).parent().parent().css("width", '400px');
            $(this).parent().parent().css("min-width", '400px');
        }
    });
}