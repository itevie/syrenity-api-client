import Client from "../client/Client";

export default class Base {
    protected client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Removes everything from the resource, except values of type
     * boolean, number, null, string, undefined, etc.
     * 
     * Useful for printing to the console.
     * @returns The stripped object
     */
    public strip(): object {
        let values = {};

        for (const i in this) {
            if (
                ["string", "number", "boolean"].includes(typeof this[i])
                || this[i] === null
                || this[i] === undefined
            ) {
                values[i.toString()] = this[i];
            }
        }

        return values;
    }
}