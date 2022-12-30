import knexLIB from "knex";

class ClientMySQL {
    constructor(config) {
        this.knex = knexLIB(config);
    }

    createTable() {
        return this.knex.schema.dropTableIfExists('products')
            .finally(() => {
                return this.knex.schema.createTable('products', table => {
                    table.increments('id').primary();
                    table.string('title', 50).notNullable();
                    table.float('price').notNullable();
                    table.string('thumbnail', 250).notNullable();
                })
            })
    }
    insertData(data) {
        return this.knex('products').insert(data);
    }

    readData() {
        return this.knex('products').select('*');
    }
    close() {
        this.knex.destroy();
        console.log('Tabla cerrada con éxito');
    }
}

export default ClientMySQL;