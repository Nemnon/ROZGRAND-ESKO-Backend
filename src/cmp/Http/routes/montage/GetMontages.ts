import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import DbGetMontages from "@/cmp/DataBase/queries/DbGetMontages";

export interface RequestQuery{
    rows:  number
    page:  number
    FProdId:   string
}

export const MontagesOptions: RouteShorthandOptions = {
    schema: {
        querystring: {
            type: 'object',
            required:['rows','page','FProdId'],
            properties: {
                rows: {type: 'number'},
                page: {type: 'number'},
                FProdId: {type: 'string'},
            }
        }
    }
}


export const GetMontages = async (request: FastifyRequest, reply: FastifyReply) =>{
    try{
        const req = <RequestQuery>request.query
        const data = await DbGetMontages(req)
        return reply.code(200).send(data)
    }catch (err) {
        console.log(err.message)
        return reply.code(500).send({ error: err.message })
    }
}
