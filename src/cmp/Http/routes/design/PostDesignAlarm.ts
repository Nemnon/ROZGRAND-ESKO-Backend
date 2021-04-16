import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import axios from "axios";
import querystring from "querystring";

enum RequestType{
    Sources = 'Sources',
    Report = 'Report'
}

interface BodyRequest{
    prodId: string
    user: string
    type: RequestType
    isChanges: boolean
    fileList: string
}


export const DesignAlarmOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required:['prodId','user', 'type', 'isChanges', 'fileList'],
            properties: {
                prodId: { type: 'string', minLength: 11 },
                user: { type: 'string' },
                type: {
                    type: 'string',
                    enum: ['Sources', 'Report']
                },
                isChanges: { type: 'boolean'},
                fileList: { type: 'string'},
            }
        }
    }
}


async function PostAlarm(data: BodyRequest){
    const form = {
        typeCall: data.type === RequestType.Report
            ? 'sendAlarmAcceptReport'
            : data.isChanges
                ? 'sendAlarmNewChanges'
                : 'sendAlarmNewSource',
        productId: data.prodId,
        pathFiles: data.fileList.replace(/\\/g, '\\\\'),
        toUser: data.user
    }
    console.log(form)
    const response = await axios({
        method: 'post',
        url: 'http://eskosrv:4415/ws/web_ap',
        data: querystring.encode(form)
    });
}



export const PostDesignAlarm = async (request: FastifyRequest, reply: FastifyReply) =>{
    try{
        const data = <BodyRequest>request.body
        await PostAlarm(data)
        return reply.code(200).send()
    }catch (err) {
        console.log(err.message)
        return reply.code(500).send({ error: err.message })
    }
}
