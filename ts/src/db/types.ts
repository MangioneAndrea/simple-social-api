import User from "./models/user";
import Collection from "./collection";

export interface CollectionType {
    [key: string]: {
        unique?: boolean
        type: string
    }
}

export const Collections: { [key: string]: CollectionType } = {
    users: User
}

export type CollectionsType = {
    [key in keyof typeof Collections]: {
        [field in keyof typeof Collections[key]]: typeof Collections[key][field] extends { type: unknown } ? typeof Collections[key][field]["type"] : never
    }

}
