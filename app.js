import express from 'express';
import sequelize from './config/db.config.js';
import User from './models/user.model.js';
import authRouter from './routes/auth.routes.js';

const app = express();
app.use(express.json());


try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false , alter:false, logging: false});
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.use('/api/v1/auth/', authRouter);

app.listen(process.env.PORT, () => {
    console.log('server is running');

})