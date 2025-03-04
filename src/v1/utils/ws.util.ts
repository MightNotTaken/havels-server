import WebSocket from 'ws';
import { BehaviorSubject} from 'rxjs';
class WSUtil {
    wss = null;
    dataPipelines = {
        'ps': new BehaviorSubject(null as any),
        'calib': new BehaviorSubject(null as any),
        'spm': new BehaviorSubject(null as any)
    }
    
    constructor() {
    }
    
    
    getTime() {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return hours + ':' + minutes + ':' + seconds;
    }

    getDate() {
        const date = new Date();
        const year = String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return year + '/' + month + '/' + day;
    }

    init(server) {
        this.wss = new WebSocket.Server({ server });
        this.wss.on('connection', (ws) => {
            console.log('Client connected');
            ws.send(JSON.stringify({
                event: 'utc',
                data: this.getDate() + ' ' + this.getTime()
            }));
            
            ws.on('message', (message) => {
                try {
                    const {event, data} = JSON.parse(message);
                    this.dataPipelines[event].next(data);
                } catch (error) {
                    console.error(error);
                }                
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
        if (this.wss) {
            console.log('websocket server initialized')
        }
    }
}

const wsUtil = new WSUtil();
export default wsUtil;