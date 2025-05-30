import "dotenv/config"
import express from 'express';
import sequelize from './config/db.config.js';
import authRouter from './routes/auth.routes.js';
import adminRouter from "./routes/admin.routes.js";


const app = express();
app.use(express.json());

app.set('view engine', 'ejs')

try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false , alter:false, logging: false});
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/admin/', adminRouter);

app.listen(process.env.PORT, () => {
    console.log('server is running');

})