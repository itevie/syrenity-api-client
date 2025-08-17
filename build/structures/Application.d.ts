import Client from "../client/Client";
import Base from "./Base";
import User, { UserAPIData } from "./User";
export interface ApplicationAPIData {
    id: number;
    token: string | null;
    application_name: string;
    bot_account: number;
    owner_id: number;
    bot: UserAPIData;
    owner: UserAPIData;
    created_at: string;
}
export default class Application extends Base {
    id: number;
    token: string | null;
    applicationName: string;
    bot: User;
    owner: User;
    createdAt: Date;
    constructor(client: Client, data: ApplicationAPIData);
}
