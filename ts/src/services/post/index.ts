import * as Util from "../../util";
import db from "../../db";

export const create = (title: string, description: string) => {
    const id = Util.randomId()
    const Post = {id, title, description}
    db.getCollection("post").insert(Post)
    return Post
}