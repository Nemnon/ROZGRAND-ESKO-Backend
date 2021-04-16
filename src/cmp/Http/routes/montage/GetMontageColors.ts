import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import axios from "axios";
import querystring from "querystring";
import xml2js from "xml2js";

interface ParamsRequest{
    id: string
}


export const MontageColorsOptions: RouteShorthandOptions = {
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


async function GetColors(id: string){
    const form = {
        typeCall: 'getListColors',
        jobId: id
    }
    const response = await axios({
        method: 'post',
        url: 'http://eskosrv:4415/ws/web_ap_synchronous',
        data: querystring.encode(form)
    });
    const parser = new xml2js.Parser
    const resObj = await parser.parseStringPromise(response.data)
    console.dir(resObj)
    return resObj
}


export const GetMontageColors = async (request: FastifyRequest, reply: FastifyReply) =>{
    try{
        const {id} = <ParamsRequest>request.params
        const colors = await GetColors(id)
        return reply.code(200).send(colors)
    }catch (err) {
        console.log(err.message)
        return reply.code(500).send({ error: err.message })
    }
}
