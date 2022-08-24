const PostType = {
    id: {
        type: "string",
        unique: true
    },
    title: {
        type: "string"
    },
    content: {
        type: "string"
    }
}

export default PostType