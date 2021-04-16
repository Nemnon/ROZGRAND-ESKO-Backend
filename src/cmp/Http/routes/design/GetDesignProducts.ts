import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import DbGetDesignProducts from "@/cmp/DataBase/queries/DbGetDesignProducts";

export interface GetProductsRequestParams{
    rows:  number
    page:  number
    FName: string
    FCust: string
    FVal:  string
    FVid:  string
    FStat: string
    FCat:  string
    FID:   string
}

export const DesignProductsOptions: RouteShorthandOptions = {
    schema: {
        querystring: {
            type: 'object',
            required:['rows','page','FName','FCust','FVal','FVid','FStat','FCat','FID'],
            properties: {
                rows: {type: 'number'},
                page: {type: 'number'},
                FName: {type: 'string'},
                FCust: {type: 'string'},
                FVal: {type: 'string'},
                FVid: {type: 'string'},
                FStat: {type: 'string'},
                FCat: {type: 'string'},
                FID: {type: 'string'},
            }
        }
    }
}



export const GetDesignProducts = async (request: FastifyRequest, reply: FastifyReply) =>{
    try{
        const req = <GetProductsRequestParams>request.query
        const data = await DbGetDesignProducts(req)
        return reply.code(200).send(data)
    }catch (err) {
        console.log(err.message)
        return reply.code(500).send({ error: err.message })
    }
}
