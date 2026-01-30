import Client from "../client/Client.js";
import FileBase from "./FileBase.js";

export interface FileAPIData {
  id: string;
  created_at: string;
  file_name: string;
  original_url: string | null;
}

export default class File extends FileBase {
  public createdAt: Date;
  public fileName: string;
  public originalUrl: string | null;

  constructor(client: Client, data: FileAPIData) {
    super(client, data.id);

    this.createdAt = new Date(data.created_at);
    this.fileName = data.file_name;
    this.originalUrl = data.original_url;
  }
}
