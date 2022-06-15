const client = require('../config/db');



module.exports = {



    async findAll() {
        
        const result = await client.query('SELECT * FROM "user"');
        return result.rows;
    },

    async getOneUser(id){
        const result = await client.query(`SELECT * FROM "user" WHERE "id" = $1`, [id]);
        return result.rows[0];
    },


    async findByUserName(username) {
        const preparedQuery = {
            text: `
                SELECT * FROM "user" 
                WHERE 'user_name' = $1;`, 
                values: [username]
                };
        const result = await client.query(preparedQuery);
        return result.rows[0];
    },

    async findByUserNameGetId(username) {
        console.log(username);
        const preparedQuery = {
            text: `
            SELECT "id" FROM "user"
            WHERE "user_name" = $1;`, 
                values: [username]
                };
        const result = await client.query(preparedQuery);
        console.log("user id -->", result.rows);
        return result.rows[0];
    },

    async delete(id) {
        const result = await client.query('DELETE FROM "user" WHERE id = $1', [id]);
        return !!result.rowCount;
    },

    async insert(data){
        const preparedQuery = {
            text: `
                INSERT INTO "user"
                (
                    "user_name",
                    "firstname",
                    "lastname",
                    "email",
                    "password"
                )
                VALUES ($1, $2, $3, $4, $5);
            `,
            values: [
                data.user_name,
                data.firstname,
                data.lastname,
                data.email,
                data.password
            ]
        }
        const result = await client.query(preparedQuery);
        console.log("insert userdatamapper passed");
        return result.rowCount;
    },

    async update (data) {
        const preparedQuery = {
            text: `
                UPDATE "user"
                (
                SET "user_name",
                    "email",
                    "password"
                )
                VALUES ($1, $2, $3);
            `,
            values: [
                data.user_name,
                data.email,
                data.password
            ]
        }
        const result = await client.query(preparedQuery);
        return result.rowCount;
    }
    /*  
    name: jeanbon
    email: jeanbon@lemail.mail
    password: ******************
    
    
    
    
    UPDATE nom_table
SET champ1 = 'nouvelle valeur'
[WHERE condition]

UPDATE table
SET colonne_1 = 'valeur 1', colonne_2 = 'valeur 2', colonne_3 = 'valeur 3'
WHERE condition

        */























};