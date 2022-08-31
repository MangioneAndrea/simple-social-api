import {Collections, CollectionsType} from "./types";

type Pagination = {
    skip: number,
    limit: number
}

class Collection<K extends keyof typeof Collections> {

    #data: Array<CollectionsType[K]>
    readonly #collectionKey: K;

    constructor(collectionKey: K, data: Array<CollectionsType[K]>) {
        this.#data = data
        this.#collectionKey = collectionKey;
    }

    find(props: Partial<CollectionsType[K]>, pagination?: Pagination): Array<CollectionsType[K]> {
        const subset = this.#data.filter(el => {
            return Object.entries(props).every(([key, value]) => el[key] === value)
        });
        const toLimit = pagination.limit ? pagination.skip + pagination.limit : undefined
        return subset.slice(pagination.skip || 0, toLimit)
    }

    findOne(props: Partial<CollectionsType[K]>): CollectionsType[K] | undefined {
        return this.#data.find(el => {
            return Object.entries(props).every(([key, value]) => el[key] === value)
        });
    }

    #assertUnique(...props: Array<CollectionsType[K]>): void {
        console.log(this.#collectionKey)
        // All unique keys
        const uniqueProps = Object.entries(Collections[this.#collectionKey])
            .filter(([_, {unique}]) => unique)
            .map(([key]) => key);

        this.#data.some((data) => {
            return Object.entries(data)
                // Of the unique props in the db
                .filter(([key]) => uniqueProps.includes(key))
                .some(([key, value]) => {
                    // At least one of the inputted elements
                    // contains one value which is already in the db
                    if (props.some((input) => input[key] === value)) {
                        throw new Error(`Duplicate key "${key}" on collection "${this.#collectionKey}"`)
                    }
                })
        })
    }

    insert(props: CollectionsType[K]) {
        this.#assertUnique(props)
        console.log(this.#data)
        this.#data.push(props)
    }

    insertMany(...props: Array<CollectionsType[K]>): boolean {
        this.#assertUnique(...props)
        this.#data.push(...props)
        return true;
    }

    deleteOne(props: Partial<CollectionsType[K]>) {
        const index = this.#data.findIndex(el => {
            return Object.entries(props).every(([key, value]) => el[key] === value)
        });
        this.#data.splice(index, 0)
    }
}

export default Collection