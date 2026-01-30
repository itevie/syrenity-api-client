import Channel from "../../structures/Channel";
import { MessageData } from "../../structures/Message";
import { UserData } from "../../structures/User";
export interface WebsocketDispatchTypes {
    "MessageCreate": {
        message: MessageData;
    };
    "MessageEdit": {
        message: MessageData;
    };
    "MessageDelete": {
        messageId: number;
        channelId: number;
    };
    "ChannelCreate": {
        channel: Channel;
    };
    "ChannelUpdate": {
        channel: Channel;
    };
    "ChannelDelete": {
        channelId: number;
        guildId: number;
    };
    "UserUpdate": {
        user: UserData;
    };
}
//# sourceMappingURL=WebsocketDispatchTypes.d.ts.map