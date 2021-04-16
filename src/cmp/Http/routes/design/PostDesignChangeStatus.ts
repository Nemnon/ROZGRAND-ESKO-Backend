import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import axios from "axios";
import querystring from "querystring";

interface ParamsRequest{
    id: string
}

interface BodyRequest{
    newStatus: string
    user: string
    comment: string
}


export const PostDesignChangeStatusOptions: RouteShorthandOptions = {
    schema: {
        params: {
            type: 'object',
            required:['id'],
            properties: {
                id: {type: 'string', minLength: 11}
            }
        },
        body: {
            type: 'object',
            required:['newStatus','user', 'comment'],
            properties: {
                newStatus: { type: 'string', minLength: 5 },
                user: { type: 'string' },
                comment: { type: 'string' },
            }
        }
    }
}


async function changeStatus(id:string, hostName:string, data: BodyRequest){
    const form = {
        typeCall: 'ChangeStatus',
        productId: id,
        newProductStatus: data.newStatus,
        Comment: data.comment,
        hostName
    }
    await axios({
        method: 'post',
        url: 'http://eskosrv:4415/ws/web_ap_synchronous',
        data: querystring.encode(form)
    });
}

async function sendAlarm(id:string, data: BodyRequest){
    const form = {
        typeCall: 'sendAlarmChangeStatus',
        productId: id,
        Comment: data.comment,
        toUser: data.user
    }
    await axios({
        method: 'post',
        url: 'http://eskosrv:4415/ws/web_ap',
        data: querystring.encode(form)
    });
}


export const PostDesignChangeStatus = async (request: FastifyRequest, reply: FastifyReply) =>{
    try{
        const hostName = request.ip
        const {id} = <ParamsRequest>request.params
        const data = <BodyRequest>request.body

        await changeStatus(id, hostName, data)

        if (data.user) {
            await sendAlarm(id, data)
        }

        return reply.code(200).send()
    }catch (err) {
        console.log(err.message)
        return reply.code(500).send({ error: err.message })
    }
}
