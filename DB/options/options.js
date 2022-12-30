
export const optionsMariaDB= {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'Coderhouse'
    }
}

export const optionsSQLite3 = {
    client: "sqlite3",
    connection: {
        filename: "./DB/ecommers.sqlite"
    },
    useNullAsDefault: true
}

