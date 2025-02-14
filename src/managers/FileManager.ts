import Client from "../client/Client";
import File, { FileAPIData } from "../structures/File";
import BaseManager from "./BaseManager";

export default class FileManager extends BaseManager<string, File> {
  constructor(client: Client) {
    super(client);
  }

  public async fetch(id: string): Promise<File> {
    const result = await this.client.rest.get<FileAPIData>(`/api/files/${id}`);
    return this.addCache(result.data.id, new File(this.client, result.data));
  }

  public async upload(fileName: string, base64: string): Promise<File> {
    const result = await this.client.rest.post<FileAPIData>(`/api/files`, {
      file_name: fileName,
      data: base64,
    });
    return this.addCache(result.data.id, new File(this.client, result.data));
  }
}
