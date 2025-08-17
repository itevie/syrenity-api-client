import File from "../structures/File";
import BaseManager from "./BaseManager";
export default class FileManager extends BaseManager {
    constructor(client) {
        super(client);
    }
    async fetch(id) {
        const result = await this.client.rest.get(`/api/files/${id}`);
        return this.addCache(result.data.id, new File(this.client, result.data));
    }
    async upload(fileName, base64) {
        const result = await this.client.rest.post(`/api/files`, {
            file_name: fileName,
            data: base64,
        });
        return this.addCache(result.data.id, new File(this.client, result.data));
    }
}
