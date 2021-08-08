import winstonobj from "./winstonLogger";
import { Tedis } from "tedis";
import { redisport, redispassword, redishost } from "../config";

class redisHelperClass {
  redisinstance: any;

  constructor() {
    try {
      this.redisinstance = new Tedis({
        port: redisport ? parseInt(redisport) : 6379,
        host: `${redishost}`,
        password: `${redispassword}`, //uncomment to use
      });
    } catch (error) {
      winstonobj.logWihWinston(
        {
          status: false,
          message: "Failed to connect to redis server",
        },
        "ErrorLogs"
      );
    }
  }

  /**
   * hash
   */
  writeRedisHash = async (hashkey: string, data: object) => {
    try {
      const res = await this.redisinstance.hmset(`${hashkey}`, data);
      if (res == "OK") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);

      winstonobj.logWihWinston(
        {
          status: false,
          messsage: "Failed to save redis hmax",
          error: error,
        },
        "ErrorLogs"
      );
      return false;
    }
  };

  readRedisHash = async (hashkey: string) => {
    return await this.redisinstance.hgetall(hashkey);
  };

  // redis string key value
  writeKeyValue = async (key: string, value: string) => {
    try {
      await this.redisinstance.set(key, value);
    } catch (error) {
      winstonobj.logWihWinston(
        {
          status: false,
          messsage: "Failed to save redis key:value",
        },
        "ErrorLogs"
      );
    }
  };

  saveHash = async (key: string, jsondata: Object) => {
    try {
      await this.redisinstance.hmset(key, jsondata);
      this.redisinstance.expire(key, 86400000);
    } catch (error) {
      winstonobj.logWihWinston(
        {
          status: false,
          messsage: "Failed to save redis key:json",
        },
        "ErrorLogs"
      );
    }
  };

  redisReadHash = async (key: string) => {
    return this.redisinstance.hgetall(key);
  };

  getKeyValueString = async (hashkey: string) => {
    return await this.redisinstance.get(hashkey);
  };

  deleteKeyValueString = (hashkey: string) => {
    this.redisinstance.del(hashkey);
  };

  setNewSession(oldkey: any, key: string, value: string) {
    this.deleteKeyValueString(oldkey);
    this.writeKeyValue(key, value);
  }
}

const redisHelperObj = new redisHelperClass();
export default redisHelperObj;
