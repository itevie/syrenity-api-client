import Client from "../client/Client";
import Base from "./Base";
import Reaction, { ReactionApiData } from "./Reaction";

export interface MessageAPIData {
  id: number;
  content: string;
  channel_id: number;
  created_at: string;
  author_id: number;
  is_pinned: boolean;
  is_edited: boolean;
  is_system: boolean;
  sys_type: string | null;
  reactions: ReactionApiData[];
}

export default class Message extends Base {
  public id: number;
  public content: string;
  public channelID: number;
  public createdAt: Date;
  public authorId: number;
  public isPinned: boolean;
  public isEdited: boolean;
  public isSystem: boolean;
  public systemType: string | null;
  public reactions: Reaction[];

  constructor(client: Client, data: MessageAPIData) {
    super(client);
    this.client.emit("apiMessageClassCreation", data);

    this.id = data.id;
    this.content = data.content;
    this.channelID = data.channel_id;
    this.createdAt = new Date(data.created_at);
    this.authorId = data.author_id;
    this.isEdited = data.is_edited;
    this.isPinned = data.is_pinned;
    this.isSystem = data.is_system;
    this.systemType = data.sys_type;
    this.reactions = data.reactions.map((x) => new Reaction(this.client, x));
  }

  public async react(emoji: string): Promise<void> {
    await this.client.rest.post(
      `/api/channels/${this.channelID}/messages/${this.id}/reactions/${emoji}`
    );
  }

  public async removeReaction(emoji: string): Promise<void> {
    await this.client.rest.delete(
      `/api/channels/${this.channelID}/messages/${this.id}/reactions/${emoji}`
    );
  }

  public async delete(): Promise<void> {
    await this.client.rest.delete(
      `/api/channels/${this.channelID}/messages/${this.id}`
    );
  }

  public async edit(content: string): Promise<Message> {
    const result = await this.client.rest.patch<MessageAPIData>(
      `/api/channels/${this.channelID}/messages/${this.id}`,
      {
        content,
      }
    );

    return new Message(this.client, result.data);
  }

  public async pin(): Promise<void> {
    await this.client.rest.post(
      `/api/channels/${this.channelID}/pins/${this.id}`
    );
  }

  public async unpin(): Promise<void> {
    await this.client.rest.delete(
      `/api/channels/${this.channelID}/pins/${this.id}`
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
