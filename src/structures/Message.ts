import Client from "../client/Client";
import Base from "./Base";

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
      systemType: this.systemType
    } as const;
  }
}