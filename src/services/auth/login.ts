import jwt from 'jsonwebtoken'

// Just random key... we don't really care for security :D
const examplePrivateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIIBOQIBAAJAVGB3WG7UL1ZmEDoonu4A4kGLtli899SJqd/Hj4tlTFZgeC21ulQA\n" +
    "bo0nbcAzukCEjvrnO0lCBO45QRHWJnRAIQIDAQABAkBPWhGjR0eh5T1DUY7WOLr4\n" +
    "DfCY4seEw4tcCSqiotP3f8fGq+eClbUF3lNHqQ7mS0UrMI20A35KDtq/qCCyhtoB\n" +
    "AiEAmGV7hm1G59Zcebn9E8MdRB5wGfE4OeHV/tXIx/ppEjECIQCNvRnZLeC6vhtC\n" +
    "Dw5NREbZkiMkZS8rL8ZbvJu3xoQg8QIhAI4Y8hjiA99gbVHDLksi/0Lo7rYByd+O\n" +
    "yC6ZwGFXCGnBAiAflaAI8Vw+wNY6Jji9pxVSrmn+Vj3olcDR+HmKvkX7QQIgKmLb\n" +
    "2C06hRdjSHR11IfQftWD7Rr9lRFeSVrGGWao3rI=\n" +
    "-----END RSA PRIVATE KEY-----"

export const login = (email: string, password: string) => {
    return jwt.sign({email}, examplePrivateKey, {algorithm: 'RS256'});
}

export const verify = (token: string) => {
    return jwt.verify(token, examplePrivateKey, {algorithms: ['RS256']});
}