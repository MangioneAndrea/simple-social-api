import * as Services from "../../services"

export const createPost = ({name, content}: { name: string, content: string }, ctx: any) => {
    ctx.assertLoggedIn()
    Services.Post.create(name, content)
}