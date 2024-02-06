import Channel, { ChannelData } from './Channel.js';
import Client from './Client.js'
import Message, { MessageData } from './Message.js'

export default class BaseChannel {
  public id: number;
  protected client: Client;

  constructor(id: number, client: Client) {
    this.id = id;
    this.client = client;
  }

  public async fetch() {
    const res = await this.client.sendHTTP(`/channels/${this.id}`);
    return new Channel((res.data as ChannelData).id, this.client, (res.data as ChannelData));
  }

  public async startTyping() {
    await this.client.sendHTTP(`/channels/${this.id}/typing`, "POST");
  }

  messages = {
    fetch: async (amount: number, startAt: number | null): Promise<Message[]> => {
      const res = await this.client.sendHTTP(
        `/channels/${this.id}/messages`
        + `?amount=${amount}`
        + (startAt ? `&start_at=${startAt}` : "")
      );

      const messages = res.data?.messages as MessageData[];

      // Turn it into Message[]
      const returningMessages: Message[] = [];

      // Loop through them
      for (const message of messages) {
        returningMessages.push(
          new Message(message.id, message.channel_id, this.client, message)
        );
      }

      // Finished
      return returningMessages;
    },

    create: async (content: string): Promise<Message> => {
      const res = await this.client.sendHTTP(
        `/channels/${this.id}/messages`,
        "POST",
        {
          content
        }
      );

      const data = res.data as MessageData;
      return new Message(data.id, data.channel_id, this.client, data);
    }
  }
}