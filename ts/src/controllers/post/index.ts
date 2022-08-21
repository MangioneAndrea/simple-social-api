export const createPost=({name, content}:{name:string, content:string}, ctx: any)=>{
    ctx.assertLoggedIn()
}