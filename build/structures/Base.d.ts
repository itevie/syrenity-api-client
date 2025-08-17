import Client from "../client/Client";
export default class Base {
    protected client: Client;
    constructor(client: Client);
    strip(): object;
}
