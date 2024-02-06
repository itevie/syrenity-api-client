import BaseChannel from './BaseChannel.js'
import BaseMessage from './BaseMessage.js'
import BaseUser from './BaseUser.js'
import Client from './Client.js'

export interface MessageData {
  id: number;
  channel_id: number;
  author_id: number;
  content: string;
  created_at: number;
  is_pinned: boolean;
  is_edited: boolean;
  is_system: boolean;
  sys_type?: string;
}

export default class Message extends BaseMessage {
  public content: string;
  public isPinned: boolean;
  public isEdited: boolean;
  public isSystem: boolean;
  public systemType?: string;
  public createdAt: Date;

  public author: BaseUser;

  constructor(id: number, channelId: number, client: Client, data: MessageData) {
    super(id, channelId, client);

    // Load the data
    this.content = data.content;
    this.isPinned = data.is_pinned;
    this.isEdited = data.is_edited;
    this.isSystem = data.is_system;
    this.systemType = data.sys_type;
    this.createdAt = new Date(data.created_at);

    this.author = new BaseUser(data.author_id, client);
  }

  public async delete() {
    this.client.sendHTTP(`/channels/${this.channel.id}/messages/${this.id}`, "DELETE");
  }
}