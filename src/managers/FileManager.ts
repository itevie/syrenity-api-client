import Client from "../client/Client";
import File from "../structures/File";
import CacheManager from "./CacheManager";

interface CreateFileOptions {
    /**
     * The name of the file
     */
    name: string,

    /**
     * Base64 data of the file
     */
    data: string,
}

export default class FileManager extends CacheManager<typeof File, string> {
    constructor(client: Client) {
        super(client, File);
    }

    public async fetch(id: string): Promise<File> {
        // Check if cache has it
        if (this.cache.has(id)) {
            return this.cache.get(id);
        }

        // Fetch it
        const data = (await this.client.sendHTTP(`/files/${id}`, "get")).data;
        const instance = new File(this.client, data);
        this.cache.set(id, instance);
        return instance;
    }

    public async create(options: CreateFileOptions): Promise<File> {
        const data = (await this.client.sendHTTP(`/files`, "post", {
            file_name: options.name,
            data: options.data
        })).data;

        const instance = new File(this.client, data);
        this.cache.set(instance.id, instance);
        return instance;
    }
}