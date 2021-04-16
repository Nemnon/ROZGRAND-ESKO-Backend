import {FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import path from "path";
import * as fs from "fs";
import axios from "axios";
import xml2js from "xml2js";
import * as querystring from "querystring";
import moment from "moment";

interface FoldersForProductInterface{
    [key: string]: string
}

interface FilesInterface{
    filename: string
    filepath: string
    srvFilepath: string
    result: boolean
    error: string
}

enum PostType{
    Sources = 'Sources',
    Report = 'Report'
}

interface PostFilesRequest{
    id: string
}

export const PostFilesOptions: RouteShorthandOptions = {
    schema: {
        params: {
            type: 'object',
            required:['id'],
            properties: {
                id: {type: 'string', minLength: 11}
            }
        },
        headers: {
            type: 'object',
            required:['XPost-Type'],
            properties: {
                'XPost-Type': {type: 'string', enum: ['Sources', 'Report']},
                XChanges: {type: 'boolean'}
            }
        }
    }
}


const FoldersForProductSources:FoldersForProductInterface = {}
const FoldersForProductReport:FoldersForProductInterface = {}


async function getFolderForProduct(id: string, type: PostType){
    const form = {
        typeCall: type === PostType.Report
            ? 'getFolderForProductReportFromProductId'
            : 'getFolderForProductSourcesFromProductId',
        productId: id
    }

    const response = await axios({
        method: 'post',
        url: 'http://eskosrv:4415/ws/web_ap_synchronous',
        data: querystring.encode(form)
    });

    const parser = new xml2js.Parser
    const resObj = await parser.parseStringPromise(response.data)
    if (resObj.message?.error?.length > 0) {
        console.log(resObj.message.error[0].msg)
        throw new Error(resObj.message.error[0].msg)
    }
    return resObj.message.path[0]
}


export const PostFiles = async (request: FastifyRequest, reply: FastifyReply) =>{
    try{
        let destFolder = ''
        const timeStamp = moment().format('YYYY-MM-DD HH-mm-ss')
        const {id} = <PostFilesRequest>request.params
        const postType = <PostType>request.headers['xpost-type']
        const isChanges = request.headers['xchanges']

        if (postType === PostType.Report){
            destFolder = FoldersForProductReport[id] || await getFolderForProduct(id, PostType.Report)
            FoldersForProductReport[id] = destFolder
        } else {
            destFolder = FoldersForProductSources[id] || await getFolderForProduct(id, PostType.Sources)
            FoldersForProductSources[id] = destFolder
        }

        if (isChanges){
            destFolder = path.join(destFolder, timeStamp)
        }

        if (!fs.existsSync(destFolder)){
            fs.mkdirSync(destFolder, {recursive: true});
        }

        const tmpDir = path.resolve(__dirname, './tmp')
        if (!fs.existsSync(tmpDir)){
            fs.mkdirSync(tmpDir, {recursive: true});
        }

        const files = <FilesInterface[]>(await request.saveRequestFiles({tmpdir: tmpDir}))
           .map(r => { return {filename:r.filename, filepath:r.filepath, srvFilepath:path.join(destFolder, r.filename)}})

        for (const file of files) {
            try {
                fs.copyFileSync(file.filepath, file.srvFilepath)
                //console.log(file.filename, 'was copied to destination.txt');
                file.result = true
            } catch (err){
                console.log(err.message)
                file.result = false
                file.error = err.message
            }
        }

        return reply.code(200).send(files)
    }catch (err) {
        console.log(err.message)
        return reply.code(500).send({ error: err.message })
    }
}
