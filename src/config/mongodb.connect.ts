import mongoose = require('mongoose');
import winstonobj from '../helpers/winstonLogger';
import * as config from './';

const options ={
    user:`${config.mngusername}`, 
    pass:`${config.mngpassword}`,
    keepAlive: true, 
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
 }
 
 var connections:any = {};
 const MONGO_URI = `mongodb://${config.mongourl}:${config.mongoport}/${config.mongocollection}?authSource=admin`;

 try {
    mongoose.set('useFindAndModify', false);
    mongoose.connect(MONGO_URI, options);
    mongoose.connection.on('connected', ()=>{  
        winstonobj.logWihWinston({status:true,msg:'Mongoose default connection open to ' + MONGO_URI},'projectmanagementservice');
    });
    
    // If the connection throws an error
    mongoose.connection.on('error', (err)=>{  
        winstonobj.logWihWinston({status:false,msg:'handle mongo errored connections: ' + err},'projectmanagementservice');
    });
    
    // When the connection is disconnected
    mongoose.connection.on('disconnected', ()=>{  
        winstonobj.logWihWinston({status:false,msg:'Mongoose default connection disconnected'},'projectmanagementservice'); 
    });
    
    process.on('SIGINT', ()=>{
        mongoose.connection.close(()=>{
            winstonobj.logWihWinston({status:false,msg:'App terminated, closing mongo connections'},'projectmanagementservice');
            process.exit(0);
        });
    });
 } catch (error) {
     winstonobj.logWihWinston({status:false,msg:error},'projectmanagementservice');
 }

 const getDatabaseConnection = (dbName:any)=>{
    if(connections[dbName]) {
        //database connection already exist. Return connection object
        return connections[dbName];
    } else {
        connections[dbName] = mongoose.createConnection(`mongodb://${config.mongourl}:${config.mongoport}/${dbName}?authSource=admin`, options);
        return connections[dbName];
    }       
}

export default getDatabaseConnection;
