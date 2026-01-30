import Client from "../client/Client.js";
import Base from "./Base.js";
import File from "./File.js";
export declare const allowedSizes: number[];
export default class FileBase extends Base {
    url: string;
    id: string;
    constructor(client: Client, url: string);
    withSize(size: (typeof allowedSizes)[number]): string;
    fetch(): Promise<File>;
    static check(url: string | null, size?: (typeof allowedSizes)[number]): string;
}
//# sourceMappingURL=FileBase.d.ts.map