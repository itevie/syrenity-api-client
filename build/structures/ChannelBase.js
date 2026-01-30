import Base from "./Base.js";
export default class ChannelBase extends Base {
    id;
    constructor(client, id) {
        super(client);
        this.id = id;
    }
}
