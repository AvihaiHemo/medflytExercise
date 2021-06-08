import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import * as dbUtil from './../utils/dbUtil';

interface Report {
    year: number,
    caregivers: {
        name: string,
        patients: string[]
    }[]
}

export const getReport = async (req: Request, res: Response) => {

    const sql = `
        SELECT
            caregiver.id      AS caregiver_id,
            caregiver.name    AS caregiver_name,
            patient.id        AS patient_id,
            patient.name      AS patient_name,
            visit.date        AS visit_date
        FROM caregiver
        JOIN visit ON visit.caregiver = caregiver.id
        JOIN patient ON patient.id = visit.patient
        WHERE visit.date >= '${req.params.year}-01-01' AND visit.date < '${parseInt(req.params.year) + 1}-01-01';
    `;
    
    let result : QueryResult;
    try {
        result = await dbUtil.sqlToDB(sql, []);
        const report: Report = {
            year: parseInt(req.params.year),
            caregivers: []
        };

        for(let row of result.rows) {
            let isExsitsIndex = report.caregivers.findIndex(x => x.name == row.caregiver_name);
            if(isExsitsIndex != -1) {
                report.caregivers[isExsitsIndex].patients.push(row.patient_name)
            } else {
                report.caregivers.push({
                    name: row.caregiver_name,
                    patients: [row.patient_name]
                })
            }
        }

        for ( let row of result.rows) {
            report.caregivers.push({
                name: row.caregiver_name,
                patients: [row.patient_name]
            })
        }
        res.status(200).json(report);
    } catch (error) {
        throw new Error(error.message);
    }

}
