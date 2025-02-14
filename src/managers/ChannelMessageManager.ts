import Client from "../client/Client";
import Channel from "../structures/Channel";
import BaseManager from "./BaseManager";
import Message, { MessageAPIData } from "../structures/Message";

export interface ChannelMessageQueryOptions {
  amount?: number;
  startAt?: number;
  fromUser?: number;
  isPinned?: boolean;
}

export default class ChannelMessageManager extends BaseManager<
  number,
  Channel
> {
  public channel: Channel;

  constructor(client: Client, channel: Channel) {
    super(client);

    this.channel = channel;
  }

  public async send(content: string): Promise<Message> {
    let result = await this.client.rest.post<MessageAPIData>(
      `/api/channels/${this.channel.id}/messages`,
      {
        content,
      }
    );
    return new Message(this.client, result.data);
  }

  public async query(options?: ChannelMessageQueryOptions): Promise<Message[]> {
    let url = `/api/channels/${this.channel.id}/messages`;
    if (Object.entries(options || {}).length !== 0) url += "?";
    if (options?.amount) url += `amount=${options.amount}&`;
    if (options?.fromUser) url += `from_user=${options.fromUser}&`;
    if (options?.isPinned) url += `is_pinned=${options.isPinned}&`;
    if (options?.startAt) url += `start_at=${options.startAt}&`;

    let result = await this.client.rest.get<MessageAPIData[]>(url);

    return (result.data || []).map((x) => new Message(this.client, x));
  }
}
