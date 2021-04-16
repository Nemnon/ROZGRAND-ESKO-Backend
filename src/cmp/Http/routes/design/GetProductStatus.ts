import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import DbGetProductStatus from "@/cmp/DataBase/queries/DbGetProductStatus";



interface ProductStatusRequest{
    id: string
}


export const ProductStatusOptions: RouteShorthandOptions = {
    schema: {
        params: {
            type: 'object',
            required:['id'],
            properties: {
                id: {type: 'string', minLength: 11}
            }
        }
    }
}


export const GetProductStatus = async (request: FastifyRequest, reply: FastifyReply) =>{
    try{
        const {id} = <ProductStatusRequest>request.params
        const data = await DbGetProductStatus(id)
        return reply.code(200).send(data)
    }catch (err) {
        console.log(err.message)
        return reply.code(500).send({ error: err.message })
    }
}
