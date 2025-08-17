export default class Base {
    client;
    constructor(client) {
        this.client = client;
    }
    strip() {
        return {};
    }
}
