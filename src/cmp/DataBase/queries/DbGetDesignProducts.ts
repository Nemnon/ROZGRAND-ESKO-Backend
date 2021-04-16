import {Pool_BSJobs} from "@/cmp/DataBase";
import sql from 'mssql'
import {GetProductsRequestParams} from "@/cmp/Http/routes/design/GetDesignProducts";


export default async (req: GetProductsRequestParams) => {
    const pool = await Pool_BSJobs.connect()
    const status = req.FStat.length > 0 ? ` and Status_Value in (${req.FStat.split(',').map(v=>`'${v.trim()}'`).join(',')})`:''
    const dbreq = await pool.request()
        .input('FName', sql.NVarChar, req.FName)
        .input('FCust', sql.NVarChar, req.FCust)
        .input('FVal', sql.NVarChar, req.FVal)
        .input('FVid', sql.NVarChar, req.FVid)
        //.input('FStat', sql.NVarChar, req.FStat)
        .input('FCat', sql.NVarChar, req.FCat)
        .input('FID', sql.NVarChar, req.FID)

    const resCount = await dbreq.query(`
            SELECT 
                   COUNT(*) AS count 
            From admin.BSProduct 
            LEFT JOIN admin.BSProductPart on BSProduct.Id=BSProductPart.Product_id 
            LEFT JOIN admin.Customers on Customers.Id=BSProduct.Cusid 
            LEFT JOIN admin.BSPart on BSPart.Id=BSProductPart.Part_id 
            LEFT JOIN admin.BSProductParameter on (BSProductParameter.Pid=BSProduct.Id AND BSProductParameter.Name='ВидПродукции') 
            where
                  BSProductParameter.Value Like '%'+@FVid+'%' and  
                  BSProduct.Name Like '%'+@FName+'%' and 
                  Customers.Name Like '%'+@FCust+'%' and 
                  BSProduct.Category1 Like '%'+@FVal+'%' and 
                  BSProduct.Category3 Like '%'+@FCat+'%' and 
                  BSProduct.Prodid Like '%'+@FID+'%'                  
        `+status)

    const count = resCount.recordset[0].count
    if (count === 0){
        return { page:1, count, data: [] }
    }
    const totalPages = count > 0 ? Math.ceil(count / req.rows ) : 0
    const page = req.page > totalPages ? totalPages : req.page

    const result = await dbreq.query(`
            Select 
                   BSProduct.Prodid, 
                   BSProduct.Name as PName, 
                   Customers.Name, 
                   BSProduct.Category1, 
                   BSProduct.Category3, 
                   BSPart.Status_Value, 
                   BSProductParameter.Value as Vid, 
                   WARN.war as war 
            From admin.BSProduct 
            LEFT JOIN admin.BSProductPart on BSProduct.Id=BSProductPart.Product_id
            LEFT JOIN admin.Customers on Customers.Id=BSProduct.Cusid
            LEFT JOIN admin.BSPart on BSPart.Id=BSProductPart.Part_id
            LEFT JOIN admin.BSProductParameter on (BSProductParameter.Pid=BSProduct.Id AND BSProductParameter.Name='ВидПродукции')
            LEFT JOIN (
                SELECT 
                       BSProduct.Prodid, 1 as war
                FROM
                admin.BSProduct
                LEFT JOIN admin.BSProductPart ON BSProduct.Id = BSProductPart.Product_id
                LEFT JOIN admin.BSPart ON BSPart.Id = BSProductPart.Part_id
                WHERE 
                      BSPart.Status_Value = '4. На согласовании' and 
                      DATEADD(DAY, 1, BSPart.Status_Created) < GETDATE()
                ) as WARN on BSProduct.Prodid = WARN.Prodid
            where
                BSProductParameter.Value Like '%'+@FVid+'%' and
                BSProduct.Name Like '%'+@FName+'%' and
                Customers.Name Like '%'+@FCust+'%' and
                BSProduct.Category1 Like '%'+@FVal+'%' and
                BSProduct.Category3 Like '%'+@FCat+'%' and
                BSProduct.Prodid Like '%'+@FID+'%'
            ` + status + `
            ORDER BY BSProduct.Prodid 
            OFFSET ${(page-1)*req.rows} ROWS FETCH NEXT ${req.rows} ROWS ONLY          
        `)
    //await pool.close()
    return { page, count, data: result.recordset }

}
