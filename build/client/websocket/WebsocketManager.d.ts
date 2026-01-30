import Client from "../Client";
import { WSHelloMessageData } from "./WebsocketMessages";
import { WebsocketDispatchTypes } from "./WebsocketDispatchTypes";
export default class WebsocketManager {
    private client;
    private wsClient;
    private connectedOnce;
    constructor(client: Client);
    connect(): void;
    private send;
    websocketEvents: {
        open: () => void;
        message: (rawMessage: any) => void;
        close: () => void;
    };
    options: {
        AUTHENTICATE: () => void;
        HELLO: (data: WSHelloMessageData) => Promise<void>;
        DISPATCH: (type: keyof WebsocketDispatchTypes, _data: unknown) => Promise<void>;
    };
}
//# sourceMappingURL=WebsocketManager.d.ts.map