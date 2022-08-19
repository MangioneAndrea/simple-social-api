import Collection from "./collection";
import type User from "./models/user";

type Collections = {
    users: User
}


class DB {
    data: {
        [K in keyof Collections]: Array<Collections[K]>
    }


    constructor() {
        this.data = {users: [{email: "andrea", password: "asd"}]};
    }

    getCollection<K extends keyof Collections>(collection: K): Collection<Collections[K]> {
        return new Collection(this.data[collection])
    }


}


export default new DB();