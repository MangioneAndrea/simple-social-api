import Db from "./index";

class Collection<T extends { [key: string]: any }> {
    #data: Array<T>

    constructor(data: Array<T>) {
        this.#data = data || []
    }

    find(props: Partial<T>): Array<T> {
        return this.#data.filter(el => {
            return Object.entries(props).every(([key, value]) => el[key] === value)
        });
    }

    findOne(props: Partial<T>): T | undefined {
        return this.#data.find(el => {
            return Object.entries(props).every(([key, value]) => el[key] === value)
        });
    }
}

export default Collection