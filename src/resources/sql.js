import knexLIB from "knex";

class ClientSQL {
    constructor(config) {
        this.knex = knexLIB(config);
    }

    createTable() {
        return this.knex.schema.dropTableIfExists('chats')
            .finally(() => {
                return this.knex.schema.createTable('chats', table => {
                    table.increments('id').primary();
                    table.string('userMail', 50).notNullable();
                    table.string('date', 22).notNullable();
                    table.string('textChat', 200).notNullable();
                })
            })
    }
    insertData(data) {
        return this.knex('chats').insert(data);
    }

    readData() {
        return this.knex('chats').select('*');
    }
    close() {
        this.knex.destroy();
        console.log('Tabla cerrada con éxito');
    }
}

export default ClientSQL;