import winstonobj from "../winstonLogger";

const kafka = require('kafka-node');
const { ConsumerGroup } = kafka;

export default class kafkaConsumer{
    consumerGroup: any;
    constructor(topic:string,option:{kafkaHost:string,groupId:string}){
        let options:any =option
        options.fromOffset='latest';
        options.commitOffsetsOnFirstJoin=true;
        options.autoCommit=true;
        options.autoCommitIntervalMs=5000;
        options.fetchMaxBytes=1024*1024;
        options.metaDataMaxAgeMs=5000

        this.consumerGroup = new ConsumerGroup(options, topic);
        this.queueSignals();
    }

    listenToQueue(callback:any){
        winstonobj.logWihWinston({ message: 'listening on ' + this.consumerGroup.options.groupId },'SuccessLogs');
        this.consumerGroup.on('message', (record:any) => {
            const message = record.value.toString('utf-8');
            callback(null,message);
          });
          
        this.consumerGroup.on('error', (err:any) => {
            winstonobj.logWihWinston({ message: 'listening on ' + `mlQueue-consumer error ---------->`, err },'ErrorLogs');
            callback(err,null);
        });
    }

    queueSignals(){
        process.on('SIGINT', ()=>{
            winstonobj.logWihWinston({ message: 'Shutdown started --------->' },'SuccessLogs');
            this.consumerGroup.close((err: any) => {
            winstonobj.logWihWinston({ message: 'Kafka connection closed --------->' },'SuccessLogs');
            process.exit(err ? 1 : 0);
            });
        });
          
        process.on('SIGTERM', ()=>{
            winstonobj.logWihWinston({ message: 'Shutdown started --------->' },'SuccessLogs');
            this.consumerGroup.close((err:any) => {
                winstonobj.logWihWinston({ message: 'Kafka connection closed --------->' },'SuccessLogs');
                process.exit(err ? 1 : 0);
        });
        });
    }

}

