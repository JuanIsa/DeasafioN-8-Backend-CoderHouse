'use strict';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { create } from 'express-handlebars';
import { Server as socketServer } from 'socket.io';
import http from 'http';
const app = express();
const server = http.createServer(app);
const io = new socketServer(server);
//----------------------------------------
import ClientSQL from './resources/sql.js';
import ClientMySQL from './resources/MySQL.js';
import { optionsSQLite3, optionsMariaDB } from '../DB/options/options.js';

const SQL = new ClientSQL(optionsSQLite3);
const MySQL = new ClientMySQL(optionsMariaDB);
//----------------------------------------
await SQL.createTable()
    .then(() => console.log('Tabla LITE creada con éxito'))
    .catch(error => console.log('El error de creación fué: ', error))

await MySQL.createTable()
    .then(() => console.log('Tabla MariaBD creada con éxito'))
    .catch(error => console.log('El error de creación fué: ', error))
//---------------------------------------


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8080;
const hbs = create({
    extname: '.hbs',
    partialsDir: [__dirname + '/views/components']
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

io.on('connection', async socket => {
    console.log('Usuario conectado')
    
    const dataProducts = await MySQL.readData()
    io.emit('productos', dataProducts);
    
    socket.on('newProduct', async dataOfFront => {
        await MySQL.insertData({ title: dataOfFront.title, price: dataOfFront.price, thumbnail: dataOfFront.thumbnail })
            .then(() => console.log('datos insertados con éxito'))
            .catch(error => console.log('El error de inserción fué: ', error));
        const dataProducts = await MySQL.readData()
        io.emit('productos', dataProducts);
    })
    //------------------------------------------------------------------------

    const dataChat = await SQL.readData()
    io.emit('chatList', dataChat);

    socket.on('newChat', async infoFront => {
        await SQL.insertData([{ userMail: infoFront.userMail, date: infoFront.date, textChat: infoFront.textChat }])
            .then(() => console.log('datos insertados con éxito'))
            .catch(error => console.log('El error de inserción fué: ', error));

        const dataChat = await SQL.readData()
        io.emit('chatList', dataChat);
    });

});



server.listen(PORT);
console.log('Server en puerto: ' + PORT);