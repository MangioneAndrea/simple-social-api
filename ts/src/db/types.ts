import User from "./models/user";
import Post from "./models/post";

export interface CollectionType {
    [key: string]: {
        unique?: boolean
        type: string
    }
}

export const Collections: { [key: string]: CollectionType } = {
    users: User,
    posts: Post
}

export type CollectionsType = {
    [key in keyof typeof Collections]: {
        [field in keyof typeof Collections[key]]: typeof Collections[key][field] extends { type: unknown } ? typeof Collections[key][field]["type"] : never
    }

}
