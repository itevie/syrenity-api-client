import Client from "../client/Client";
import Base from "./Base";
import File from "./File";

export interface UserData {
    id: number;
    username: string;
    discriminator: number;
    avatar: string;
    created_at: number;
    is_bot: boolean;
    bio: string;
}

export interface UpdateUserOptions {
    /**
     * Must be a syrenity-file://
     */
    avatar?: File,
}

export default class User extends Base {
    public id: number;
    public username: string;
    public discriminator: number;
    public avatar: string;
    public createdAt: Date;
    public isBot: boolean;
    public bio: string;
    public oldData: UserData;

    get fullUsername() {
        return `${this.username}#${this.discriminator}`;
    }

    constructor(client: Client, options: UserData) {
        super(client);

        this.oldData = options;

        this.id = options.id;
        this.username = options.username;
        this.discriminator = options.discriminator;
        this.avatar = options.avatar;
        this.createdAt = new Date(options.created_at);
        this.isBot = options.is_bot;
        this.bio = options.bio;

        this.client.emit("userClassCreation", this.oldData);
    }

    public async edit(options: UpdateUserOptions): Promise<User> {
        const body: { [key: string]: any } = {};
        if (options.avatar) body.avatar = options.avatar.syrenityUrl;

        const data = (await this.client.sendHTTP(`/users/${this.id}`, "patch", body)).data;
        return await this.client.users.addData(data);
    }

    public async createToken(): Promise<string> {
        const data = (await this.client.sendHTTP(`/users/${this.id}/tokens`, "post")).data;
        return data.token;
    }
}