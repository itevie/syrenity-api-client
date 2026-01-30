import Client from "../client/Client.js";
export default class BaseManager<ID, CLASS, DATA_CLASS = {}> {
    protected client: Client;
    cache: Map<ID, CLASS>;
    protected loading: Map<ID, Axios.IPromise<Axios.AxiosXHR<DATA_CLASS>>>;
    constructor(client: Client);
    handle(id: ID, cb: () => Axios.IPromise<Axios.AxiosXHR<DATA_CLASS>>): Promise<DATA_CLASS>;
    getCache(id: ID): CLASS | null;
    addCache(id: ID, value: CLASS): CLASS;
}
//# sourceMappingURL=BaseManager.d.ts.map