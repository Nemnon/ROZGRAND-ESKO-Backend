import {Pool_BSJobs} from "@/cmp/DataBase";
import sql from 'mssql'
import {RequestQuery} from "@/cmp/Http/routes/montage/GetMontages";

export default async (req: RequestQuery) => {
    const pool = await Pool_BSJobs.connect()
    const dbRequest = await pool.request()
        .input('FProdId', sql.NVarChar, req.FProdId)

    const resCount = await dbRequest.query(`
        SELECT 
            DISTINCT COUNT(*) AS count 
        FROM Jobs
            LEFT JOIN BSProductUsage on Jobs.JID = BSProductUsage.Jid
            LEFT JOIN BSProduct on BSProduct.Id = BSProductUsage.Product_id
        WHERE BSProduct.Prodid LIKE '%'+@FProdId+'%'               
        `)

    const count = resCount.recordset[0].count
    if (count === 0){
        return { page:1, count, data: [] }
    }
    const totalPages = count > 0 ? Math.ceil(count / req.rows ) : 0
    const page = req.page > totalPages ? totalPages : req.page

    const result = await dbRequest.query(`
        SELECT 
            DISTINCT Jobs.Name 
        FROM 
            Jobs 
            LEFT JOIN BSProductUsage on Jobs.JID = BSProductUsage.Jid 
            LEFT JOIN BSProduct on BSProduct.Id = BSProductUsage.Product_id 
        WHERE BSProduct.Prodid LIKE '%'+@FProdId+'%'
        ORDER BY Jobs.Name ASC
        OFFSET ${(page-1)*req.rows} ROWS FETCH NEXT ${req.rows} ROWS ONLY`)

    return { page, count, data: result.recordset }

}
