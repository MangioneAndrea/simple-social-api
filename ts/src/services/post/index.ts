import * as Util from "../../util";

export const create = (title: string, content: string) => {
    const id = Util.randomId()
    const Post = {id, title, content}
    db.getCollection("posts").insert(Post)
    return Post
}

export const get = (skip: number, limit: number) => {
    return db.getCollection("posts").find({}, {skip, limit})
}