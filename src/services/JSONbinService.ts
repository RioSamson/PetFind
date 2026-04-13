import type { AnimalReport, JsonBinReportsResponse, ReportStatus } from "../models";

const JSONBIN_KEY = import.meta.env.VITE_JSONBIN_API_KEY as string;
const JSONBIN_BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID as string;
if(!JSONBIN_KEY) throw new Error("JSON BIN API KEY MISSING IN .env");
if(!JSONBIN_BIN_ID) throw new Error("JSON BIN ID MISSING IN .env");
const JSON_BIN_BASE_URL = "https://api.jsonbin.io/v3";

export async function writeReports(reports: AnimalReport[]): Promise<AnimalReport[]> {
    const res = await fetch(`${JSON_BIN_BASE_URL}/b/${JSONBIN_BIN_ID}`, 
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": JSONBIN_KEY
            },
            body: JSON.stringify({reports})
        }
    );

    if(!res.ok){
        throw new Error(`Write to JSONbin failed! Status: ${res.status}`);
    }

    const json:JsonBinReportsResponse = await res.json();

    return json.record.reports ?? [];
}

export async function updateReportStatus(reportId: string,newStatus: ReportStatus): Promise<AnimalReport[]> {
    const currentReports = await readReports();
    const updatedReports = currentReports.map((report) =>
        report.id === reportId ? { ...report, status: newStatus }: report
    );
    return await writeReports(updatedReports);
}

export async function readReports(): Promise<AnimalReport[]>{
    const res = await fetch(
        `${JSON_BIN_BASE_URL}/b/${JSONBIN_BIN_ID}`,
        {
            method: "GET",
            headers: {
                "X-Master-Key": JSONBIN_KEY
            }
        }
    );
    if(!res.ok){
        throw new Error(`Error with reading from JSONbin API! Status: ${res.status}`);
    }

    const json: JsonBinReportsResponse = await res.json();
    return json.record.reports ?? [];
}

export async function addReport(report: AnimalReport): Promise<AnimalReport[]>{
    const currentReports = await readReports();
    const updatedReports = [...currentReports, report];
    return await writeReports(updatedReports);
} 