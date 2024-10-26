import Client from "../client/Client";
import Base from "./Base";
import ChannelMessageManager from "../managers/ChannelMessageManager";

export interface ChannelAPIData {
  id: number;
  type: "channel" | "dm";
  guild_id: number | null;
  name: string;
  topic: string | null;
  is_nsfw: boolean;
}

export default class Channel extends Base {
  public id: number;
  public type: "channel" | "dm";
  public guildId: number | null;
  public name: string;
  public topic: string | null;
  public nsfw: boolean;

  public messages: ChannelMessageManager;

  constructor(client: Client, data: ChannelAPIData) {
    super(client);

    this.messages = new ChannelMessageManager(client, this);

    this.id = data.id;
    this.type = data.type;
    this.topic = data.topic;
    this.guildId = data.guild_id;
    this.name = data.name;
    this.nsfw = data.is_nsfw;
  }

  public strip() {
    return {
      id: this.id,
      type: this.type,
      topic: this.topic,
      guildId: this.guildId,
      name: this.name,
      nsfw: this.name
    } as const;
  }
}