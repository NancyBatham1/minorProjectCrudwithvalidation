import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DRIVER,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

export default sequelize;