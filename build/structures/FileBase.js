import Base from "./Base";
export const allowedSizes = [32, 64, 128, 256, 512, 1024, 2048];
export default class FileBase extends Base {
    url;
    id;
    constructor(client, url) {
        super(client);
        if (url?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
            this.id = url;
            this.url = `${client.options.baseUrl}/files/${this.id}`;
        }
        else {
            this.url = url;
        }
    }
    withSize(size) {
        return this.id ? `${this.url}?size=${size}` : this.url;
    }
    async fetch() {
        return await this.client.files.fetch(this.id);
    }
    static check(url, size = null) {
        if (url?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
            return `/files/${url}${size ? `?size=${size}` : ""}`;
        }
        else {
            return url;
        }
    }
}
