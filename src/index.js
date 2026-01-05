const express = require('express');
const app = express();
const { PORT } = require('./config/serverConfig')
const apiRoutes = require('./routes/index');

const db = require('./models/index');
const bodyParser = require('body-parser');

const setupAndStartServer = ()=>{

    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

    app.use('/api',apiRoutes);


    app.listen(PORT, ()=>{
        console.log(`Server started at PORT ${PORT}`);
        if(process.env.DB_SYNC){
            db.sequelize.sync({alter:true});
        }
    });
}

setupAndStartServer();