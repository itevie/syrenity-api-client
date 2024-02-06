import BaseGuild from './BaseGuild.js'
import BaseUser from './BaseUser.js'
import Client from './Client.js'

declare interface UserData {
  id: number;
  username: string;
  discriminator: string;
  avatar: string;
  created_at: number;
  is_bot: boolean;
}

export {UserData};

export interface ExtractedUserData {
  id: number;
  username: string;
  discriminator: string;
  avatar: string;
  createdAt: number;
  isBot: boolean;
}

/**
 * A class representing a Syrenity user
 */
export default class User extends BaseUser {
  public username: string;
  public discriminator: string;
  public avatar: string | null;
  public createdAt: Date;
  public isBot: boolean;

  constructor(id: number, client: Client, prefilledData: UserData) {
    super(id, client);

    this.username = prefilledData.username;
    this.discriminator = prefilledData.discriminator;
    this.avatar = prefilledData.avatar;
    this.createdAt = new Date(prefilledData.created_at);
    this.isBot = prefilledData.is_bot;

    this.client.triggerEvent("userClassCreation", this);
  }

  public extractData(): ExtractedUserData {
    return {
      id: this.id,
      username: this.username,
      discriminator: this.discriminator,
      avatar: this.avatar,
      createdAt: this.createdAt.getTime(),
      isBot: this.isBot
    }
  }
}
