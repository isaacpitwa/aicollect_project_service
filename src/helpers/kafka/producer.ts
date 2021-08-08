const kafka = require('kafka-node');
import * as config from '../../config/index'
const { HighLevelProducer } = kafka;
const Client = kafka.KafkaClient;

class kafkaProducer{

  client :any;
  producer : any;

  constructor(){
    this.client = new Client({
      kafkaHost: `${config.kafkaHost}:${config.kafkaport}`,
      noAckBatchOptions: {
        noAckBatchSize: 1000,
        noAckBatchAge: 300,
      },
    });
    this.producer = new HighLevelProducer(this.client, {
      requireAcks: 1,
    });
  }

  sendToQueue(topic:any, messages:any,callback:any){
    messages = Buffer.from(JSON.stringify(messages));
    this.producer.send([{topic,messages,attributes: 2}],(err:any, result:any) => {
        if (err) {
            callback(err,null);
        }else{
          callback(null,true);
        }
    });
  }

  sendToQueueNoCallback(topic:any,messages:any){
    this.producer.send([{topic,messages,attributes: 2}],(err:any, result:any) => {
        if (err) {
          console.log(err);
        }
    });
  }
}

const producerObj = new kafkaProducer();
export default producerObj;