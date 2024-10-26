import Client from "../client/Client";
import Channel from "../structures/Channel";
import BaseManager from "./BaseManager";
import Message, { MessageAPIData } from "../structures/Message";

export default class ChannelMessageManager extends BaseManager<number, Channel> {
  public channel: Channel;

  constructor(client: Client, channel: Channel) {
    super(client);

    this.channel = channel;
  }

  public async send(content: string): Promise<Message> {
    let result = await this.client.rest.post<MessageAPIData>(`/api/channels/${this.channel.id}/messages`, {
      content
    });
    return new Message(this.client, result.data);
  }

  public async query(): Promise<Message[]> {
    let result = await this.client.rest.get<MessageAPIData[]>(`/api/channels/${this.channel.id}/messages`);
    return (result.data || []).map(x => new Message(this.client, x));
  }
}