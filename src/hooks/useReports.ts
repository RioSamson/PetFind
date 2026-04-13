import { useEffect, useState } from "react";
import type { AnimalReport, UseReportsResult } from "../models";
import { readReports } from "../services/JSONbinService";

function useReports(): UseReportsResult{
    const [reports, setReports] = useState<AnimalReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function loadReports(){
            try {
                const loadedReports = await readReports();
                setReports(loadedReports);
            } catch (error) {
                console.error("Error with report hook", error);
            } finally {
                setLoading(false);
            }
        }
        loadReports();
    }, []);
    return {reports, loading};
}

export default useReports;