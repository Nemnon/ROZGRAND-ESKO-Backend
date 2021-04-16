import fastify from "fastify";
import cors from 'fastify-cors'
import fastifyStatic from "fastify-static";
import fastifyMultipart from "fastify-multipart";
import router from "./Router";
import path from "path";

const server = fastify({
    logger: { level: 'warn'}
})

async function buildServer () {
    await server.register(cors, {origin: '*'})
    await server.register(fastifyMultipart)
    await server.register(router)
    await server.register(fastifyStatic, {
        root: path.resolve(__dirname, './static/'),
        prefix: '/'
    })

    server.setNotFoundHandler((req, res) => {
        res.sendFile('index.html')
    })

    return server
}

buildServer()
    .then(serverSSL => serverSSL.listen(81, '0.0.0.0'))
    .then(()=>{console.log('HTTP server started, port 81')})
    .catch(console.error)


export default server
