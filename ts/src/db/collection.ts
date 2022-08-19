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

    insert(props: T) {
        this.#data.push(props)
    }

    insertMany(...props: Array<T>) {
        this.#data.push(...props)
    }


    deleteOne(props: Partial<T>) {
        const index = this.#data.findIndex(el => {
            return Object.entries(props).every(([key, value]) => el[key] === value)
        });
        this.#data.splice(index, 0)
    }
}

export default Collection