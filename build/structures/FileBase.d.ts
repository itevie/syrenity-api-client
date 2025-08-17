import Client from "../client/Client";
import Base from "./Base";
import File from "./File";
export declare const allowedSizes: number[];
export default class FileBase extends Base {
    url: string;
    id: string;
    constructor(client: Client, url: string);
    withSize(size: (typeof allowedSizes)[number]): string;
    fetch(): Promise<File>;
    static check(url: string | null, size?: (typeof allowedSizes)[number]): string;
}
