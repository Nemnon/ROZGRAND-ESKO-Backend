import {ConnectionPool} from "mssql";

const DB_CONFIG_BSJobs = {
    user: 'admin',
    password: 'admin',
    server: '192.168.7.204',
    database: 'BSJobs',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        enableArithAbort: true
    }
}

const DB_CONFIG_EskoAddon = {
    user: 'admin',
    password: 'admin',
    server: '192.168.7.204',
    database: 'EskoAddon',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        enableArithAbort: true
    }
}

export const Pool_BSJobs = new ConnectionPool(DB_CONFIG_BSJobs)
export const Pool_EskoAddon = new ConnectionPool(DB_CONFIG_EskoAddon)

