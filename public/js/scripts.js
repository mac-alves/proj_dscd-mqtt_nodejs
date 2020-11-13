const TOPIC_JOKER = 'mqtt_proj/#';
const TOPIC_CONNECTION_CLIENT = 'mqtt_proj/connected';

let idsClients = ['mb'];

let clients = [
    { 
        id: 'mb', 
        name: 'Mac',
        status: 'off',
        open: false,
        points: [
            {
                id: 'lp',
                name: 'Lâmpada',
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
    render: function(listClients) {
        const template = Handlebars.compile($("#user-template").html());
        this.$main.html('');

        listClients.forEach(client => {
            const context = {
                classStatus: (client.status === 'off') ? '' : 'green',
                idClient: client.id,
                nameClient: client.name,
                infoStatus: (client.status === 'off') ? 'Desconectado' : 'Conectado',
                checked: client.open ? 'checked' : '',
            }
    
            this.$main.prepend(template(context));
            this.renderPoints(client.id, client.points);
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
    // console.log('command', command);
    // console.log('topic', topic);
    if (topic.split('/').length < 2) return -1;

    if (topic === TOPIC_CONNECTION_CLIENT) {
        const [idCli, status] = command.split('-');
        updateStatusClient(idCli, status);
        clientsFactory.render(clients);
        return;
    }

    const idClient = topic.split('/')[1];
    const isPoint = topic.split('/')[2];

    if (idsClients.includes(idClient)) {
        const [idPoint, state] = command.split('-');
        updatePointClient(idClient, idPoint, state, isPoint);
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
function updatePointClient(idClient, idPoint, command, isPoint){
    clients = clients.map(client => {
        if (client.id === idClient) {
            client.points = client.points.map(point => {
                if (point.id === idPoint) {
                    point.state = (command === '1') ? 'on' : 'off';
                    point.status = (isPoint != null) ? 'on' : point.status;
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
            $(this).parent().parent().removeClass("checked");
        } else {
            $(this).parent().parent().addClass("checked");
        }

        clients = clients.map(client => {
            if (client.id === $(this).val()) {
                client.open = !$(this).prop("checked") ? false : true;
            }

            return client;
        });
    });
}