import Client from "../client/Client.js";
import File from "../structures/File.js";
import BaseManager from "./BaseManager.js";
export default class FileManager extends BaseManager<string, File> {
    constructor(client: Client);
    fetch(id: string): Promise<File>;
    upload(fileName: string, base64: string): Promise<File>;
}
//# sourceMappingURL=FileManager.d.ts.map