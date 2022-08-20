import Collection from "./collection";
import {Collections, CollectionsType} from "./types";


class DB {
    data: {
        [K in keyof typeof Collections]: Array<CollectionsType[K]>
    }

    constructor() {
        this.data = {users: [{email: "andrea", password: "asd"}]};
    }

    getCollection<K extends keyof CollectionsType>(collection: K): Collection<K> {
        return new Collection(collection, this.data[collection])
    }
}


export default new DB();