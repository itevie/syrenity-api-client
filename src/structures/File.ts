import Client from "../client/Client";
import Base from "./Base";

interface FileDetails {
    id: string,
    file_name: string,
    created_at: number,
}

export default class File extends Base {
    public id: string;
    public fileName: string;
    public createdAt: Date;

    constructor(client: Client, details: FileDetails) {
        super(client);

        this.id = details.id;
        this.fileName = details.file_name;
        this.createdAt = new Date(details.created_at);
    }

    static resolveFile(client: Client, url: string | undefined): string {
        if (!url) return File.resolveFile(client, Client.defaultAvatarUrl);

        // CHeck if it is a syrenity-file://
        if (url.startsWith("syrenity-file://")) {
            // First part should be the ID, second part the optional file name
            let parts = url.replace("syrenity-file://", "").split("/");
            return File.generateFullUrl(client, parts[0], parts[1]);
        }

        // Else just return it back
        return url;
    }

    static generateFullUrl(client: Client, id: string, fileName?: string) {
        return (
            `http${client.options.api.useSecure ? "s" : ""
            }://${client.options.api.host
            }/files/${id}${fileName ? ("/" + encodeURIComponent(fileName)) : ""
            }`
        );
    }

    get url() {
        return (
            `http${this.client.options.api.useSecure ? "s" : ""}://${this.client.options.api.host}/files/${this.id}/${encodeURIComponent(this.fileName)}`
        );
    }

    get syrenityUrl() {
        return (
            `syrenity-file://${this.id}`
        );
    }
}