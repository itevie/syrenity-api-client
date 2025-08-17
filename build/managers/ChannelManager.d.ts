import Client from "../client/Client";
import Channel from "../structures/Channel";
import BaseManager from "./BaseManager";
export default class ChannelManager extends BaseManager<number, Channel> {
    constructor(client: Client);
    fetch(id: number, force?: boolean): Promise<Channel>;
}
