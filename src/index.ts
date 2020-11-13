import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import path from 'path';
import http from 'http';
import routes from './routes';

/**
 * Variaveis gerais
 */
const app = express();
const server = http.createServer(app);

/**
 * Configurações do servidor
 */
// app.use(engine);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'ejs');
app.use(express.json());
app.use(routes);
app.disable('etag');

/**
 * Inicialização do servidor
 */
server.listen(process.env.PORT || 3000, () => {
	console.log(
		`Server iniciado em: ${process.env.APP_URL}`
	);
});