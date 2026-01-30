import Client from "../client/Client.js";
import Channel from "../structures/Channel.js";
import BaseManager from "./BaseManager.js";
export default class ChannelManager extends BaseManager<number, Channel> {
    constructor(client: Client);
    fetch(id: number, force?: boolean): Promise<Channel>;
}
//# sourceMappingURL=ChannelManager.d.ts.map