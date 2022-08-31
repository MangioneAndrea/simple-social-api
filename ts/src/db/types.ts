import Models from "./models"


export interface CollectionType {
    [key: string]: {
        unique?: boolean
        type: string
    }
}

type t = typeof Models.users



export const Collections: { [key in keyof typeof Models]: CollectionType } = {
    users: Models.users,
    posts: Models.posts
}


export type CollectionsType = {
    [key in keyof typeof Collections]: {
        [field in keyof typeof Collections[key]]: typeof Collections[key][field] extends { type: unknown } ? typeof Collections[key][field]["type"] : never
    }

}
