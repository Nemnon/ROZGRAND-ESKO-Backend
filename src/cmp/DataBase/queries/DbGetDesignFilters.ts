import {DesignFiltersRequestQuery, DesignFiltersTypes} from "@/cmp/Http/routes/design/GetDesignFilters";
import {Pool_BSJobs} from "@/cmp/DataBase";
import sql from "mssql";


export default async (req: DesignFiltersRequestQuery) => {
    let sqlQuery = '';
    switch (req.type) {
        case DesignFiltersTypes.name:
            sqlQuery = `SELECT TOP 10 BSProduct.Name as value FROM admin.BSProduct where BSProduct.Name Like '%'+@filter+'%' order by BSProduct.Name`
            break
        case DesignFiltersTypes.cat:
            sqlQuery = `SELECT DISTINCT TOP 10 BSProduct.Category3 as value FROM admin.BSProduct where BSProduct.Category3 Like '%'+@filter+'%' order by BSProduct.Category3`
            break
        case DesignFiltersTypes.cust:
            sqlQuery = `SELECT TOP 10 Customers.Name as value FROM admin.Customers where Customers.Name Like '%'+@filter+'%' order by Customers.Name`
            break
        case DesignFiltersTypes.status:
            sqlQuery = `SELECT DISTINCT admin.BSPart.Status_Value as value FROM admin.BSPart order by Status_Value`
            break
        case DesignFiltersTypes.val:
            sqlQuery = `SELECT DISTINCT TOP 10 BSProduct.Category1 as value FROM admin.BSProduct where BSProduct.Category1 Like '%'+@filter+'%' order by BSProduct.Category1`
            break
        case DesignFiltersTypes.vid:
            sqlQuery = `SELECT DISTINCT TOP 10 BSProductParameter.Value as value FROM admin.BSProductParameter where BSProductParameter.Name = 'ВидПродукции' and BSProductParameter.Value Like '%'+@filter+'%' order by BSProductParameter.Value`
            break
    }

    if (sqlQuery.length > 0) {
        const pool = await Pool_BSJobs.connect()
        const dbResp = await pool.request()
            .input('filter', sql.NVarChar, req.filter)
            .query(sqlQuery)
        return dbResp.recordset
    }

    return []
}
