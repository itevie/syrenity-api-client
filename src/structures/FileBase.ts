import Client from "../client/Client";
import Base from "./Base";
import File, { FileAPIData } from "./File";

export const allowedSizes = [32, 64, 128, 256, 512, 1024, 2048];

export default class FileBase extends Base {
  public url: string;
  public id: string;

  constructor(client: Client, url: string) {
    super(client);

    if (
      url?.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      this.id = url;
      this.url = `${client.options.baseUrl}/files/${this.id}`;
    } else {
      this.url = url;
    }
  }

  public withSize(size: (typeof allowedSizes)[number]): string {
    return this.id ? `${this.url}?size=${size}` : this.url;
  }

  public async fetch(): Promise<File> {
    return await this.client.files.fetch(this.id);
  }

  public static check(
    url: string | null,
    size: (typeof allowedSizes)[number] = null
  ) {
    if (
      url?.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      return `/files/${url}${size ? `?size=${size}` : ""}`;
    } else {
      return url;
    }
  }
}
