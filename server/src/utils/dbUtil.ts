import { Client, Pool, QueryResult } from 'pg';
import config = require('./../config');
import logger = require('./../utils/logger');
import * as fs from 'fs';
import * as path from 'path';

const pgconfig = {
    user: config.db.user,
    database: config.db.database,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    max: config.db.max,
    idleTimeoutMillis: config.db.idleTimeoutMillis,
    connectionTimeoutMillis: 2000
}

const pool = new Pool(pgconfig);

logger.info(`DB Connection Settings: ${JSON.stringify(pgconfig)}`);

pool.on('error', function (err:Error) {
    logger.error(`idle client error, ${err.message} | ${err.stack}`);
});

// Load .sql files
let caregiverDataFile = fs.readFileSync(path.join(__dirname, '../../', 'sql/caregiver.sql')).toString();
let patientDataFile = fs.readFileSync(path.join(__dirname, '../../', 'sql/patient.sql')).toString();
let visitDataFile = fs.readFileSync(path.join(__dirname, '../../', 'sql/visit.sql')).toString();

pool.query(caregiverDataFile, function(err, res) {
    if(err) {
        console.log('error: ', err);
    }
    console.log('caregiver Table is successfully created');
})
pool.query(patientDataFile, function(err, res) {
    if(err) {
        console.log('error: ', err);
    }
    console.log('patient Table is successfully created');
})
pool.query(visitDataFile, function(err, res) {
    if(err) {
        console.log('error: ', err);
    }
    console.log('visit Table is successfully created');
})

/* 
 * Single Query to Postgres
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlToDB = async (sql:string, data:string[]) => {
    logger.debug(`sqlToDB() sql: ${sql} | data: ${data}`);
    let result : QueryResult;
    try {
        result = await pool.query(sql, data);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

/*
 * Retrieve a SQL client with transaction from connection pool. If the client is valid, either
 * COMMMIT or ROALLBACK needs to be called at the end before releasing the connection back to pool.
 */
export const getTransaction = async () => {
    logger.debug(`getTransaction()`);
    const client : Client = await pool.connect();
    try {
        await client.query('BEGIN');
        return client;
    } catch (error) {
        throw new Error(error.message);
    }
}

/* 
 * Execute a sql statment with a single row of data
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlExecSingleRow = async (client:Client, sql:string, data:string[][]) => {
    logger.debug(`sqlExecSingleRow() sql: ${sql} | data: ${data}`);
    let result : QueryResult;
    try {
        result = await client.query(sql, data);
        logger.debug(`sqlExecSingleRow(): ${result.command} | ${result.rowCount}`);
        return result
    } catch (error) {
        logger.error(`sqlExecSingleRow() error: ${error.message} | sql: ${sql} | data: ${data}`);
        throw new Error(error.message);
    }
}

/*
 * Execute a sql statement with multiple rows of parameter data.
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlExecMultipleRows = async (client:Client, sql:string, data:string[][]) => {
    logger.debug(`inside sqlExecMultipleRows()`);
    logger.debug(`sqlExecMultipleRows() data: ${data}`);
    if (data.length !== 0) {
        for(let item of data) {
            try {
                logger.debug(`sqlExecMultipleRows() item: ${item}`);
                logger.debug(`sqlExecMultipleRows() sql: ${sql}`);
                await client.query(sql, item);
            } catch (error) {
                logger.error(`sqlExecMultipleRows() error: ${error}`);
                throw new Error(error.message);
            }
        }
    } else {
        logger.error(`sqlExecMultipleRows(): No data available`);
        throw new Error('sqlExecMultipleRows(): No data available');
    }
}

/*
 * Rollback transaction
 */
export const rollback = async (client:Client) => {
    if (typeof client !== 'undefined' && client) {
        try {
            logger.info(`sql transaction rollback`);
            await client.query('ROLLBACK');
        } catch (error) {
            throw new Error(error.message);
        } finally {
            client.release();
        }
    } else {
        logger.warn(`rollback() not excuted. client is not set`);
    }
}

/*
 * Commit transaction
 */
export const commit = async (client:Client) => {
    logger.debug(`sql transaction committed`);
    try {
        await client.query('COMMIT');
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}
