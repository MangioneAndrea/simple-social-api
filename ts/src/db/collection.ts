import {Collections, CollectionsType} from "./types";

class Collection<K extends keyof typeof Collections> {

    #data: Array<CollectionsType[K]>
    readonly #collectionKey: K;

    constructor(collectionKey: K, data: Array<CollectionsType[K]>) {
        this.#data = data || []
        this.#collectionKey = collectionKey;
    }

    find(props: Partial<CollectionsType[K]>): Array<CollectionsType[K]> {
        return this.#data.filter(el => {
            return Object.entries(props).every(([key, value]) => el[key] === value)
        });
    }

    findOne(props: Partial<CollectionsType[K]>): CollectionsType[K] | undefined {
        return this.#data.find(el => {
            return Object.entries(props).every(([key, value]) => el[key] === value)
        });
    }

    #assertUnique(...props: Array<CollectionsType[K]>): boolean {
        // All unique keys
        const uniqueProps = Object.entries(Collections[this.#collectionKey])
            .filter(([_, {unique}]) => unique)
            .map(([key]) => key);

        return !this.#data.some((data) => {
            return Object.entries(data)
                // Of the unique props in the db
                .filter(([key]) => uniqueProps.includes(key))
                .some(([key, value]) => {
                    // At least one of the inputted elements
                    // contains one value which is already in the db
                    return props.some((input) => input[key] === value)
                })
        })
    }

    insert(props: CollectionsType[K]) {
        if (this.#assertUnique(props)) {
            this.#data.push(props)
        }
    }

    insertMany(...props: Array<CollectionsType[K]>) {
        if (this.#assertUnique(...props)) {
            this.#data.push(...props)
        }
    }

    deleteOne(props: Partial<CollectionsType[K]>) {
        const index = this.#data.findIndex(el => {
            return Object.entries(props).every(([key, value]) => el[key] === value)
        });
        this.#data.splice(index, 0)
    }
}

export default Collection