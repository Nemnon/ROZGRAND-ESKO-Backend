import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import DbGetMontageProductUsage from "@/cmp/DataBase/queries/DbGetMontageProductUsage";



interface ParamsRequest{
    id: string
}


export const MontageProductUsageOptions: RouteShorthandOptions = {
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


export const GetMontageProductUsage = async (request: FastifyRequest, reply: FastifyReply) =>{
    try{
        const {id} = <ParamsRequest>request.params
        const data = await DbGetMontageProductUsage(id)
        return reply.code(200).send(data)
    }catch (err) {
        console.log(err.message)
        return reply.code(500).send({ error: err.message })
    }
}
