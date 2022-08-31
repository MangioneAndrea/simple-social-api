import * as Services from "../../services"

export const createPost = ({title, content}: { title: string, content: string }, ctx: any) => {
    ctx.assertLoggedIn()
    return Services.Post.create(title, content)
}

export const posts = ({page, amount}: { page: number, amount: number }, ctx: any) => {
    ctx.assertLoggedIn()
    if (page < 1) throw new Error("Page must be a positive integer");
    if (amount < 1) throw new Error("Amount must be a positive integer");
    const skip = (page - 1) * amount
    return Services.Post.get(skip, amount)
}