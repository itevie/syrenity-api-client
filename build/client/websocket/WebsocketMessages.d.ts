import { GuildData } from "../../structures/Server";
import { UserData } from "../../structures/User";
export interface WSHelloMessageData {
    heartbeat_interval: number;
    user: UserData;
    guilds: {
        [key: number]: GuildData;
    };
}
//# sourceMappingURL=WebsocketMessages.d.ts.map