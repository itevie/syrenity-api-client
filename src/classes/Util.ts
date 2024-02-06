import { BaseUser, Client, User } from "../index.js"
import BaseMember from "./BaseMember.js";

export default class Util {
  protected client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Converts an array of members into an array of users
   * @param members 
   * @returns 
   */
  public memberArrayToUser(members: BaseMember[]): BaseUser[] {
    let userArray: BaseUser[] = [];

    for (const member of members)
      userArray.push(member.user);

    return userArray;
  }

  /**
   * Converts a BaseUser array into a User array
   * @param users 
   */
  public async fetchUserArray(users: BaseUser[]): Promise<User[]> {
    let filledOut: User[] = [];

    for (const user of users)
      filledOut.push(await user.fetch());

    return filledOut;
  }

  
}