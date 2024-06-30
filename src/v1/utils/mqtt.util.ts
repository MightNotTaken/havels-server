import mqtt, { MqttClient } from "mqtt";
class MQTT {
  client: MqttClient = null;
  listeners: any = {};
  connectionCallback: any = null;

  connect() {
    return new Promise((res: any, rej: any) => {
      this.client = mqtt.connect(
        `mqtt://${process.env.MQTT_USERNAME}:${process.env.MQTT_PASSWORD}@${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
      );

      this.client.on("connect", () => {
        res(true);
        if (this.connectionCallback) {
            this.connectionCallback(this.client);
        }
      });

      this.client.on("message", (topic: any, message: Buffer) => {
        const data = message.toString();
        if (this.listeners[topic]) {
            this.listeners[topic](data);
        }
      });

      this.client.on("error", (error: any) => {
        rej(error);
      });

      this.client.on("close", () => {
        console.log("Connection closed. Reconnecting...");
        this.client.reconnect();
      });

      this.client.on("end", () => {
        console.log("Connection ended. Reconnecting...");
        this.client.reconnect();
      });
      
    });
  }

  onConnect(callback: any) {
    this.connectionCallback = callback;
  }

  removeListener(event: any) {
    return new Promise((res: any, rej: any) => {
        this.client.unsubscribe(event, (error: any) => {
            if (error) {
                rej(error);
            } else {
                delete this.listeners[event];
                res(true);
            }
        });
    });
  }

  listen(event: any, callback: any) {
    return new Promise(async (res: any, rej: any) => {
        try {
            await this.removeListener(event);
        } catch (error) {}
        this.client.subscribe(event, (error) => {
            if (!error) {
                this.listeners[event] = callback;
                res();   
            } else {
                rej(error);
            }
        })
    });
  }
};
const MQTTService = new MQTT();
export default MQTTService;