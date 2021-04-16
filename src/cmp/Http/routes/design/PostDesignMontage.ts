import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import FormData from 'form-data'
import xml2js from 'xml2js'
import axios from "axios";

interface IObjectKeys {
    [key: string]: boolean | number;
}

interface DesignMontageConfig extends IObjectKeys{
    RailLeft: boolean
    RailRight: boolean
    RailsWide: boolean
    SetForceCross: boolean
    SetForceDots: boolean
    LeftTestCharts: boolean
    RightTestCharts: boolean
    LocationSign: number
}

export interface DesignMontageRequestQuery {
    products: {
        Product: string
        Val: number
        Amount: number
        Rotate: number
    }[]
    config: DesignMontageConfig
}

// https://www.fastify.io/docs/latest/Validation-and-Serialization/
export const DesignMontageOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required:['products','config'],
            properties: {
                products: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required:['Product', 'Val', 'Amount', 'Rotate'],
                        properties: {
                            Product: { type: 'string', minLength: 11 },
                            Val: { type: 'number'},
                            Amount: { type: 'number'},
                            Rotate: { type: 'number'},
                        }
                    }
                },
                config: {
                    type: 'object',
                    required:['RailLeft','RailRight','RailsWide','SetForceCross','SetForceDots','LeftTestCharts','RightTestCharts','LocationSign'],
                    properties: {
                        RailLeft: { type: 'boolean' },
                        RailRight: { type: 'boolean' },
                        RailsWide: { type: 'boolean' },
                        SetForceCross: { type: 'boolean' },
                        SetForceDots: { type: 'boolean' },
                        LeftTestCharts: { type: 'boolean' },
                        RightTestCharts: { type: 'boolean' },
                        LocationSign: { type: 'number' },
                    }
                },
            }
        }
    }
}

function dataToXML(data: DesignMontageRequestQuery):string{
    const products = data.products
        .map(p => `<Product>${p.Product}</Product>`)
        .filter((value, index, self)=> self.indexOf(value) === index)
        .join('')
    const streams = data.products
        .map(p => `<Stream><Article>${p.Product}</Article><Amount>${p.Amount}</Amount><Rotate>${p.Rotate}</Rotate></Stream>`)
        .join('')
    const config = Object.keys(data.config)
        .map((key) => {
            return `<${key}>${
                Number.isInteger(data.config[key])
                    ? data.config[key]
                    : data.config[key]===true
                        ?'Yes'
                        :'No'
            }</${key}>`})
        .join('')
    return `<?xml version="1.0" encoding="utf-8"?><Layout><Products>${products}</Products><Streams>${streams}</Streams>${config}</Layout>`
}


export const PostDesignMontage = async (request: FastifyRequest, reply: FastifyReply) =>{
    try{
        const data = <DesignMontageRequestQuery>request.body
        const xml = dataToXML(data)
        const form = new FormData();
        form.append('typeCall', 'CreateLayoutJobFromXML')
        form.append('file', xml, {
            contentType: 'application/xml',
            filename: 'file.xml'
        })
        const response = await axios({
            method: 'post',
            url: 'http://eskosrv:4415/ws/web_ap',
            data: form,
            headers: form.getHeaders(),
        });

        const parser = new xml2js.Parser
        const resObj = await parser.parseStringPromise(response.data)
        if (resObj.message?.response){
            return reply.code(200).send(resObj.message)
        } else {
            return reply.code(500).send(resObj.message)
        }
    }catch (err) {
        console.log(err.message)
        return reply.code(500).send({ error: err.message })
    }
}
