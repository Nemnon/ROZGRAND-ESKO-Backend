import {Pool_BSJobs, Pool_EskoAddon} from "@/cmp/DataBase";
import sql from 'mssql'

export default async (id: string) => {
    const pool = await Pool_EskoAddon.connect()
    const result = await pool.request()
        .input('id', sql.NVarChar, id)
        .query(`
            Select 
                   LogProductsStatus.Id,
                   convert(varchar(20),LogProductsStatus.Status_Created,120) as Status_Created,
                   LogProductsStatus.Status_Value, 
                   LogProductsStatus.Status_User, 
                   LogProductsStatus.Status_Host, 
                   LogProductsStatus.Status_Comment
            From admin.LogProductsStatus
            where LogProductsStatus.Product_id = @id
            order by LogProductsStatus.Status_Created DESC     
        `)
    return result.recordset
}

