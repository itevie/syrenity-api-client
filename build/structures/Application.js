import Base from "./Base";
import User from "./User";
export default class Application extends Base {
    id;
    token;
    applicationName;
    bot;
    owner;
    createdAt;
    constructor(client, data) {
        super(client);
        this.id = data.id;
        this.token = data.token;
        this.applicationName = data.application_name;
        this.bot = new User(client, data.bot);
        this.owner = new User(client, data.owner);
    }
}
