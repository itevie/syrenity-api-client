import Client from "../client/Client";
import Base from "./Base";
export default class ChannelBase extends Base {
    id: number;
    constructor(client: Client, id: number);
}
