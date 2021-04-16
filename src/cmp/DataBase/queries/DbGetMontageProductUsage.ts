import {Pool_BSJobs} from "@/cmp/DataBase";
import sql from 'mssql'

export default async (id: string) => {
    const pool = await Pool_BSJobs.connect()
    const {recordset} = await pool.request()
        .input('id', sql.NVarChar, id)
        .query(`
            SELECT 
                   BSProduct.Prodid, 
                   BSProduct.Name as PName, 
                   Customers.Name
            FROM Jobs
                     LEFT JOIN BSProductUsage on Jobs.JID = BSProductUsage.Jid
                     LEFT JOIN BSProduct on BSProduct.Id = BSProductUsage.Product_id
                     LEFT JOIN Customers ON Customers.Id = BSProduct.Cusid
            WHERE Jobs.Name = @id ORDER BY BSProduct.Prodid  
        `)
    return recordset
}

