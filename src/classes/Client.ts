import Axios, { AxiosError, AxiosResponse, isAxiosError, RawAxiosRequestConfig } from 'axios'
import { ClientEvents } from "../ClientEvents";
import opCodes from "../opCodes.js";
import Guild, { GuildData } from "./Guild.js";
import User from "./User.js";
import HTTPError from './HTTPError.js'
import Message from './Message.js'
import CacheManager from './CacheManager.js'
import BaseGuild from "./BaseGuild.js";
import Channel from './Channel.js';
import BaseUser from './BaseUser.js';
import BaseChannel from './BaseChannel.js';
import Relationship from './Relationship.js';
import BaseInvite from './BaseInvite.js';
import FriendRequest from './FriendRequest.js';
import Util from './Util.js';

// For browsers
const is_browser =
  // eslint-disable-next-line node/no-unsupported-features/es-builtins
  Object.getPrototypeOf(Object.getPrototypeOf(globalThis)) !== Object.prototype;

// Check which websocket to use for browser compatibility
const ws = is_browser
  ? WebSocket
  : import("ws") as any;

interface ClientConfig {
  baseURL?: string;
  apiURL?: string;
  useSecure?: boolean;
  maximumReconnectAttempts?: number;
  ignoreIsBrowser?: boolean;
}

interface WSMessage {
  op: keyof typeof opCodes,
  t: string;
  d: {
    [key: string]: any;
  }
}

/**
 * Client for connecting to the Syrenity server
 */
export default class Client {
  public baseURL = "localhost:3000";
  public apiURL = this.baseURL + "/api";
  public useSecure = false;
  private token: string | null = null;
  private wsClient: typeof ws;
  private firstConnect = true;
  private connectAttempts = 0;
  private maximumReconnectAttempts = 5;
  private ignoreIsBrowser = false;
  
  /**
   * Contains a user object for the currently logged in account
   */
  public currentUser: User = null;

  public cacheManager: CacheManager;
  public util: Util = new Util(this);

  // Events
  private events: {[key: string]: Function | null} = {
    ready: null,
    debug: null,
    error: null,

    disconnect: null,
    reconnect: null,
    reconnectionFailure: null,

    messageCreate: null,
    messageDelete: null,

    channelCreate: null,

    typingStart: null,
  }

  /**
   * Sets up the client class
   * @param data Optional data
   */
  constructor(data: ClientConfig = {}) {
    this.cacheManager = new CacheManager(this);
    
    if (data) {
      // Set all the given data
      if (data.apiURL)
        this.apiURL = data.apiURL;
      if (data.baseURL)
        this.baseURL = data.baseURL;
      if (data.useSecure)
        this.useSecure = data.useSecure;
      if (data.maximumReconnectAttempts)
        this.maximumReconnectAttempts = data.maximumReconnectAttempts;
      if (data.ignoreIsBrowser)
        this.ignoreIsBrowser = data.ignoreIsBrowser;
    }
  }

  // ----- Stuff to do with WS and the likes -----

  /**
   * Logs the client into the server
   * @param token The token for the user
   */
  public login(token: string) {
    const uri = `ws${this.useSecure ? "s" : ""}://${this.baseURL}`;

    this.log(`Login at ${new Error().stack}`);

    // Set token
    this.token = token;
    this.log(`Logging in with token ${this.censorToken(token)} at ${uri}`);

    // Reset data
    this.wsClient = null;

    // Create the client
    this.wsClient = new ws(uri);
    this.registerWSEvents();
  }

  /**
   * Checks whether or not the client is logged in
   * with cookies
   */
  public isLoggedIn(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.sendHTTP("/users/@me", "GET").then(() => {
        resolve(true);
      }).catch(() => {
        resolve(false);
      });
    });
  }

  public async loginWithoutWebsockets(token: string) {
    this.log(`Set token without websockets - no further action needed`);
    this.token = token;
    this.currentUser = await this.user(-1).fetch();
  }

  /**
   * Registes an event
   * @param event The event to listen to
   * @param callback The function that will e ran once this event is fired
   */
  public on<T extends keyof ClientEvents>(
    event: T,
    callback: (...args: ClientEvents[T]) => void
  ): void {
    // Register it
    this.events[event] = callback;
  }

  /**
   * Triggers an event
   * @param event The event name to be fired
   * @param data The arguments for the event
   */
  public triggerEvent<T extends keyof ClientEvents>(
    event: T,
    ...data: ClientEvents[T]
  ): void {
    // Check if it is registered
    if (this.events[event]) {
      // Trigger it
      this.events[event](...data);
    }
  }

  /**
   * Registeres all the WS events
   */
  private registerWSEvents(): void {
    for (const i in this.wsEvents) {
      // For browser support
      if (is_browser) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.wsClient['on' + i] = this.wsEvents[i];
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      else this.wsClient?.on(i, this.wsEvents[i]);
    }
  }

  /**
   * Attempts to reconnect to the WS server
   */
  private reconnect() {
    // Check if the attempt is more than the maximum reconnection attempts
    if (this.connectAttempts > this.maximumReconnectAttempts) {
      this.triggerEvent("reconnectionFailure");
      throw new Error(`Failed to connect to WS server, took more than ${this.maximumReconnectAttempts} attempts. Check debug event for details`);
    }

    this.log(`Attempting to reconnect to server for ${this.connectAttempts} time`, "ws");

    // Cleanup the websocket
    this.wsClient.close();
    this.wsClient = null;

    // Try to reconnect
    this.connectAttempts++;
    this.login(this.token)
  }

  private wsEvents = {
    open: (): void => {
      this.log(`WS connection opened`, "ws");
      this.connectAttempts = 0;
    },

    error: (error: any) => {
      this.log(`Encounted error: ${error.message}`, "error");

      if (this.connectAttempts != 0) {
        this.log(`Failed to connect - attempting again in 5 seconds`, "ws");
        setTimeout(() => {
          this.reconnect();
        }, 5000);
      }
    },

    close: (): void => {
      this.log(`WS connection closed`, "ws");
      this.triggerEvent("disconnect");

      if (this.connectAttempts != 0) {
        this.log(`Reconnect function already running, skipping`, "ws");
        return;
      }

      // Attempt reconnect
      try {
        if (this.firstConnect || !this.wsClient.close) {
          this.log(`NOT reconnecting as this is first connect`, "ws");
          return;
        }

        this.reconnect();
      } catch (err) {
        console.log("error", err);
      }
    },

    message: (dataString: string) => {
      // For browser compatibility
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (is_browser) dataString = dataString.data;

      // Parse message
      const data = JSON.parse(dataString) as WSMessage;

      // Check if it has an operation code
      if (Object.prototype.hasOwnProperty.call(data, "op")) {
        this.log(`Received WS message with OP: ${data.op}`);

        // Check if client can respond to this operation code
        if (this.operations[data.op]) {
          this.operations[data.op](data);
        }
      }
    }
  }

  // ----- Dispatch handler -----

  private operations = {
    [opCodes.HELLO]: (data: WSMessage) => {
      if (!this.firstConnect)
        return this.triggerEvent("reconnect");
      this.log(`Successfully connected as ${data.d.user.username}, loading hello data`, "hello");

      // Load ready data
      const readyData = {
        guilds: [],
        user: new User(data.d.user.id, this, data.d.user)
      };

      this.currentUser = readyData.user;

      // Load guilds
      for (const i in data.d.guilds) {
        readyData.guilds.push(new Guild(data.d.guilds[i].id, this, (data.d.guilds[i])));
      }

      // Successfully finished
      this.triggerEvent("ready", readyData);
      this.firstConnect = false;
      this.log(`Finished initialisation!`, "hello");
    },

    [opCodes.AUTHENTICATE]: (data: WSMessage) => {
      this.log("Sending token to server", "auth");
      this.wsClient.send(JSON.stringify({
        op: opCodes.AUTHENTICATE,
        d: {
          token: this.token
        }
      }))
    },

    [opCodes.DISPATCH]: (data: WSMessage) => {
      this.log(`Received DISPATCH ${data.t}`, "dispatch");
      switch (data.t) {
        case "MESSAGE_CREATE":
          // Construct message
          const message = new Message(data.d.message.id, data.d.message.channel_id, this, data.d.message);

          // Trigger event
          this.triggerEvent("messageCreate", message);
          break;
        case "MESSAGE_UPDATE":
          // Construct message
          const updateMessageBody = new Message(data.d.message.id, data.d.message.channel_id, this, data.d.message);

          // Trigger event
          this.triggerEvent("messageUpdate", updateMessageBody);
          break;
        case "MESSAGE_DELETE":
          this.triggerEvent("messageDelete", {
            messageId: data.d.message_id,
            channel: this.channel(data.d.channel_id),
            guild: this.guild(data.d.guild_id)
          });
          break;
        case "TYPING_START":
          this.triggerEvent("typingStart", {
            user: new BaseUser(data.d.user_id, this),
            guild: new BaseGuild(data.d.guild_id, this),
            channel: new BaseChannel(data.d.channel_id, this),
          });
          break;
        case "CHANNEL_CREATE":
          this.triggerEvent("channelCreate", new Channel(data.d.channel.id, this, data.d.channel));
          break;
      }
    },

    [opCodes.ERROR]: (data: WSMessage) => {
      const error = new Error(`${data.d.error.message} (${data.d.error.statusCode})`);
      // Check if it is fatal
      /*if (data.d.fatal) {
        throw error;
      }*/

      // Trigger event instead
      console.log("hi");
      if (!this.events["error"]) throw error;
      this.triggerEvent("error", error);
    }
  }

  // ----- HTTP -----

  /**
   * Send a HTTP request to Syrenity server
   * @param origUrl The URL to fetch, only the pathname e.g. (/channels/x/messages)
   * @param method The method to use
   * @param data The body of the request
   * @returns The axios response
   */
  public async sendHTTP(
    origUrl: string,
    method: 'GET' | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
    data: {[key: string]: any} | null = null 
  ): Promise<AxiosResponse>{
    // Construct actual URL
    const url = `http${this.useSecure ? "s" : ""}://${this.apiURL}${origUrl}`;
    this.log(`${method.toUpperCase()} ${url}`, "http");

    // Construct the sending data
    const sendingData: RawAxiosRequestConfig = {
      url,
      method,
      headers: {
        Authorization: `Token ${this.token}`
      }
    };

    // Remove auth header if it is a browser so the server uses the session
    if (is_browser && !this.ignoreIsBrowser) delete sendingData.headers?.Authorization;

    // Check if there is data
    if (data) sendingData.data = data;

    // Function to throw a error
    const throwError = (err: Error) => {
      this.triggerEvent("error", err);

      // Check if it was an axios error
      if (Axios.isAxiosError(err)) {
        const res = err.response;
        if (!res) throw err;
        throw new HTTPError(`${res.data?.message || "Unknown Error"}`, {
          url: url,
          error: res.data?.message,
          rawResponse: res.data,
          rawError: res.data?.at ? res.data : res.data?.errors ? res.data?.errors : null
        });
      }
  
      // Just handle other errors
      else {
        throw err;
      }
    }

    let res: AxiosResponse = null;

    try {
      // Create request
      res = await Axios(sendingData);
    } catch (err) {
      throwError(err);
    }

    // Check if it was okay
    if (res.status > 399) {
      throwError(new Error(`Axios did not return OK status code: ${res.status}`));
    }
    
    return res;
  }

  // ----- Utility Functions -----

  /**
   * Sends a debug message as an event
   * @param text The text to send
   * @param type The debug message type
   */
  public log(text: string, type = "info") {
    this.triggerEvent("debug", `[${type} @ ${new Date().toLocaleTimeString()}]: ${text}`);
  }
  
  /**
   * Censors the token for logging
   * @param token The token to be censored
   * @returns The censored token
   */
  private censorToken(token: string) {
    const parts = token.split('.');
    if (!parts[2]) return token;
    parts[2] = parts[2].replace(/[A-Za-z0-9-]/g, '*');
    return parts.join('.');
  }

  // ----- Classes for making stuff which can't be placed anywhere else -----

  /**
   * Stuff to do with guilds
   */
  guilds = {
    /**
     * Join a guild via an invite code
     * @param inviteCode The invite code to use
     */
    join: async (inviteCode: string): Promise<void> => {
      await this.sendHTTP(`/invites/${inviteCode}`, "POST");
    },


    /**
     * Fetch the current user's guild list
     */
    fetchList: async (): Promise<Guild[]> => {
      const res = await this.sendHTTP(`/users/${this.currentUser.id}/guilds`);
      const sending: Guild[] = [];

      for (const guild of (res.data.guilds as GuildData[])) {
        sending.push(new Guild(guild.id, this.wsClient, guild));
      } 

      return sending;
    },
    
    /**
     * Creates a guild as the currently logged in user
     * @param name The name of the guild
     * @param avatar The avatar of the guild
     * @returns The created guild
     */
    create: async (name: string, avatar: string | null = null): Promise<Guild> => {
      const res = await this.sendHTTP(`/guilds`, "POST", {
        name,
        avatar,
      });

      return new Guild(res.data.id, this, res.data);
    }
  }

  channels = {
    
  }

  /**
   * Stuff to do with relationships (friends)
   */
  relationships = {
    /**
     * Stuff to do with friend requests
     */
    requests: {
      fetchList: async (): Promise<FriendRequest[]> => {
        const requests = await this.sendHTTP(`/users/@me/relationships`);
        const sending: FriendRequest[] = [];

        for (const request of requests.data.requests) {
          sending.push(new FriendRequest(this, request));
        }

        return sending;
      }
    },

    /**
     * Fetches a list of all relationships with the current user
     * @returns The list of relationships
     */
    fetchList: async (): Promise<Relationship[]> => {
      const res = await this.sendHTTP(`/users/@me/channels`);

      const sending = [];

      for (const i in res.data.relationships) {
        sending.push(new Relationship(this, res.data.relationships[i]));
      }

      return sending;
    },

    /**
     * Fetches the list of DMs the user is in by 
     * returning a list of users
     * @returns List of users
     */
    fetchRecipientList: async (): Promise<User[]> => {
      const list = (await this.relationships.fetchList())
        .map(r => r.user1.id !== this.currentUser.id ? r.user1 : r.user2);
      const users: User[] = [];

      for (const user of list)
        users.push(await user.fetch());
      
      return users;
    },

    /**
     * Creates a relationship with the current user and another user
     * @param recipient The user to create the relationship with
     * @returns The created relationship
     */
    create: async (recipient: number): Promise<Relationship> => {
      const res = await this.sendHTTP(`/users/@me/relationships/${recipient}`, "POST");
      console.log(res.data);
      return new Relationship(this, res.data);
    }
  }

  // ----- Reference class makers -----

  /**
   * Returns a reference to a base guild
   * @param id The ID of the guild
   * @returns The base guild
   */
  public guild(id: number): BaseGuild {
    return new BaseGuild(id, this);
  }

  /**
   * Returns a references to a base user
   * @param id The ID of the user
   * @returns The base user
   */
  public user(id: number): BaseUser {
    return new BaseUser(id, this);
  }

  /**
   * Returns a references to a base channel
   * @param id The ID of the channel
   * @returns The base channel
   */
  public channel(id: number): BaseChannel {
    return new BaseChannel(id, this);
  }

  /**
   * Returns a references to a base invite
   * @param id The ID of the invite
   * @returns The base invite
   */
  public invite(id: string): BaseInvite {
    return new BaseInvite(id, this);
  }
}
