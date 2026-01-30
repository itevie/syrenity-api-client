import Client from "../client/Client.js";
import Base from "./Base.js";
import FileBase from "./FileBase.js";
import Reaction, { ReactionApiData } from "./Reaction.js";
import User, { UserAPIData } from "./User.js";
import { WebhookAPIData } from "./Webhook.js";

export interface MessageAPIData {
  id: number;
  content: string;
  channel_id: number;
  created_at: string;
  author_id: number;
  author: UserAPIData;
  is_pinned: boolean;
  is_edited: boolean;
  is_system: boolean;
  sys_type: string | null;
  reactions: ReactionApiData[];
  webhook_id: string;
  webhook: WebhookAPIData;
  proxy_id: number;
}

export interface AuthorDisplay {
  type: "normal" | "proxy";
  username: string;
  avatar: FileBase;
}

export default class Message extends Base {
  public id: number;
  public content: string;
  public channelID: number;
  public createdAt: Date;
  public authorId: number;
  public author: User;
  public isPinned: boolean;
  public isEdited: boolean;
  public isSystem: boolean;
  public systemType: string | null;
  public reactions: Reaction[];
  public webhookId: string;

  public _data: MessageAPIData;

  constructor(client: Client, data: MessageAPIData) {
    super(client);
    this.client.emit("apiMessageClassCreation", data);

    this.id = data.id;
    this.content = data.content;
    this.channelID = data.channel_id;
    this.createdAt = new Date(data.created_at);
    this.authorId = data.author_id;
    this.author = new User(client, data.author);
    this.isEdited = data.is_edited;
    this.isPinned = data.is_pinned;
    this.isSystem = data.is_system;
    this.systemType = data.sys_type;
    this.reactions = data.reactions.map((x) => new Reaction(this.client, x));
    this.webhookId = data.webhook_id;

    this._data = data;
  }

  public getDisplay(): AuthorDisplay {
    if (this._data.webhook) {
      return {
        avatar: new FileBase(this.client, this._data.webhook.proxy_user.avatar),
        username: this._data.webhook.proxy_user.username,
        type: "proxy",
      };
    }

    return {
      avatar: this.author.avatar,
      username: this.author.username,
      type: "normal",
    };
  }

  public async react(emoji: string): Promise<void> {
    await this.client.rest.post(
      `/api/channels/${this.channelID}/messages/${this.id}/reactions/${emoji}`,
    );
  }

  public async removeReaction(emoji: string): Promise<void> {
    await this.client.rest.delete(
      `/api/channels/${this.channelID}/messages/${this.id}/reactions/${emoji}`,
    );
  }

  public async delete(): Promise<void> {
    await this.client.rest.delete(
      `/api/channels/${this.channelID}/messages/${this.id}`,
    );
  }

  public async edit(content: string): Promise<Message> {
    const result = await this.client.rest.patch<MessageAPIData>(
      `/api/channels/${this.channelID}/messages/${this.id}`,
      {
        content,
      },
    );

    return new Message(this.client, result.data);
  }

  public async pin(): Promise<void> {
    await this.client.rest.post(
      `/api/channels/${this.channelID}/pins/${this.id}`,
    );
  }

  public async unpin(): Promise<void> {
    await this.client.rest.delete(
      `/api/channels/${this.channelID}/pins/${this.id}`,
    );
  }

  public strip() {
    return {
      id: this.id,
      content: this.content,
      channelID: this.channelID,
      createdAt: this.createdAt,
      authorId: this.authorId,
      isEdited: this.isEdited,
      isPinned: this.isPinned,
      isSystem: this.isSystem,
      systemType: this.systemType,
    } as const;
  }
}
