import Client from "../client/Client.js";
import FileBase from "./FileBase.js";
export interface FileAPIData {
    id: string;
    created_at: string;
    file_name: string;
    original_url: string | null;
}
export default class File extends FileBase {
    createdAt: Date;
    fileName: string;
    originalUrl: string | null;
    constructor(client: Client, data: FileAPIData);
}
//# sourceMappingURL=File.d.ts.map