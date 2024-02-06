import { Message } from '../index.js';
import BaseChannel from './BaseChannel.js'
import Client from './Client.js'
import { MessageData } from './Message.js';

export default class BaseMessage {
  public id: number;
  public channel: BaseChannel;
  protected client: Client;

  constructor(id: number, channelId: number, client: Client) {
    this.id = id;
    this.client = client;
    this.channel = new BaseChannel(channelId, client);
  }

  public async edit (content: string): Promise<Message> {
    const res = await this.client.sendHTTP(
      `/channels/${this.channel.id}/messages/${this.id}`,
      "PATCH",
      {
        content
      }
    );

    const data = res.data as MessageData;
    return new Message(data.id, data.channel_id, this.client, data);
  }
}