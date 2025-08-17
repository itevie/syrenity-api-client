import FileBase from "./FileBase";
export default class File extends FileBase {
    createdAt;
    fileName;
    originalUrl;
    constructor(client, data) {
        super(client, data.id);
        this.createdAt = new Date(data.created_at);
        this.fileName = data.file_name;
        this.originalUrl = data.original_url;
    }
}
