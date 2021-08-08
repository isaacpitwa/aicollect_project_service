
import winstonobj from './winstonLogger'
import producerObj from './kafka/producer';

class QueueingHelper{

    constructor() {}

    sendToQueue = (data:any,receivingQueue:string) => {
    //send to queue
        // data =  Buffer.from(JSON.stringify(data));
        producerObj.sendToQueue(`${receivingQueue}`,data,(err:any,res:any)=>{
            if(err){
                console.log(err)
                // winstonobj.logWihWinston({status:false,msg:"Queueing error",err:JSON.stringify(err)},'UserManagementLogs');   
            }else{
            // winstonobj.logWihWinston({status:true,msg:"Sent to queue"},'UserManagementLogs');
            }
        });
    //send to queue
    }
}
const QueueingHelperObj = new QueueingHelper();
export default QueueingHelperObj;