import * as Util from "../../util";
import db from "../../db";

export const create = (title: string, description: string) => {
    const id = Util.randomId()
    const Post = {id, title, description}
    db.getCollection("post").insert(Post)
    return Post
}

export const get = (skip: number, limit: number) => {
    return db.getCollection("post").find({}, {skip, limit})
}