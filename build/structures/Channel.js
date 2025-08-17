import ChannelMessageManager from "../managers/ChannelMessageManager";
import ChannelBase from "./ChannelBase";
export default class Channel extends ChannelBase {
    type;
    guildId;
    name;
    topic;
    nsfw;
    position;
    _data;
    messages;
    constructor(client, data) {
        super(client, data.id);
        this.messages = new ChannelMessageManager(client, this);
        this._data = data;
        this.id = data.id;
        this.type = data.type;
        this.topic = data.topic;
        this.guildId = data.guild_id;
        this.name = data.name;
        this.nsfw = data.is_nsfw;
        this.position = data.position;
    }
    async edit(options) {
        const result = await this.client.rest.patch(`/api/channels/${this.id}`, options);
        return this.client.channels.addCache(result.data.id, new Channel(this.client, result.data));
    }
    async startTyping() {
        await this.client.rest.post(`/api/channels/${this.id}/start-typing`);
    }
    strip() {
        return {
            id: this.id,
            type: this.type,
            topic: this.topic,
            guildId: this.guildId,
            name: this.name,
            nsfw: this.name,
        };
    }
}
