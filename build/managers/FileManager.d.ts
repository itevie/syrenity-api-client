import Client from "../client/Client";
import File from "../structures/File";
import BaseManager from "./BaseManager";
export default class FileManager extends BaseManager<string, File> {
    constructor(client: Client);
    fetch(id: string): Promise<File>;
    upload(fileName: string, base64: string): Promise<File>;
}
