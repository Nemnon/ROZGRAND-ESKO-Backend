import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import DbGetDesignFilters from "@/cmp/DataBase/queries/DbGetDesignFilters";

export enum DesignFiltersTypes{
    name = 'name',
    cust = 'cust',
    val = 'val',
    vid = 'vid',
    status = 'status',
    cat = 'cat'
}

export interface DesignFiltersRequestQuery {
    type: DesignFiltersTypes
    filter: string
}

// https://www.fastify.io/docs/latest/Validation-and-Serialization/
export const DesignFiltersOptions: RouteShorthandOptions = {
    schema: {
        querystring: {
            type: 'object',
            required:['type','filter'],
            properties: {
                type: {
                    type: 'string',
                    enum: ['name', 'cust', 'val', 'vid', 'status', 'cat']
                },
                filter: {type: 'string'},
            }
        }
    }
}

export const GetDesignFilters = async (request: FastifyRequest, reply: FastifyReply) =>{
    try{
        const req = <DesignFiltersRequestQuery>request.query
        const data = await DbGetDesignFilters(req)
        return reply.code(200).send(data)
    }catch (err) {
        console.log(err.message)
        return reply.code(500).send({ error: err.message })
    }
}
