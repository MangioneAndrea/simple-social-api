import fs from "fs"
import Collection from "./collection";
import {Collections, CollectionsType} from "./types";
import {dirname} from "path";
import {fileURLToPath} from "url";

const DB_PATH = dirname(fileURLToPath(import.meta.url)) + "/../../../db/database.json"

type Data = {
    [K in keyof typeof Collections]: Array<CollectionsType[K]>
}

class DB {
    #data: Data

    constructor() {
        this.#data = JSON.parse(fs.readFileSync(DB_PATH) as unknown as string) as unknown as Data;
        setInterval(()=>{
            this.#sync()
        }, 200)
    }

    #sync() {
        fs.writeFileSync(DB_PATH, JSON.stringify(this.#data, null, 2));
    }

    getCollection<K extends keyof CollectionsType>(collection: K): Collection<K> {
        return new Collection(collection, this.#data[collection])
    }
}


export default new DB();