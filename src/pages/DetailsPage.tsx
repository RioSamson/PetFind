import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimalType, ReportStatus, type AnimalReport } from "../models";
import { readReports, updateReportStatus } from "../services/JSONbinService";
import { hashPassword } from "../services/hashService";

function DetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<AnimalReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [passwordInput, setPasswordInput] = useState("");
    const [markingFound, setMarkingFound] = useState(false);
    const [markFoundError, setMarkFoundError] = useState<string | null>(null);


    useEffect(() => {
        async function loadReport() {
            try {
                const allReports = await readReports();
                const foundReport = allReports.find((report) => report.id === id);
                if (!foundReport) {
                    setError("Rewport not found");
                     return;
                }
                setReport(foundReport);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }else {
                    setError("unknown error loading report");
                }
            } finally {
                setLoading(false);
            }
        }
        loadReport();
    }, [id]);

    if (loading) {
        return <p>Loading report details...</p>;
    }
    if (error) {
        return (
            <main>
                <p>Error: {error}</p>
                <Link to="/">Back to Home</Link>
            </main>
        );
    }
    if (!report) {
        return (
            <main>
                <p>Report not found.</p>
                <Link to="/">Back to Home</Link>
            </main>
        );
    }

    async function handleMarkAsFound() {
        if (!report) {
            return;
        }
        try {
            setMarkingFound(true);
            setMarkFoundError(null);
            const enteredPasswordHash = await hashPassword(passwordInput);
            if (enteredPasswordHash !== report.passwordHash) {
                throw new Error("Incorrect password.");
            }
            await updateReportStatus(report.id, ReportStatus.Found);
            setReport({
                ...report,
                status: ReportStatus.Found,
            });
            navigate("/");
        } catch (error) {
            if (error instanceof Error) {
                setMarkFoundError(error.message);
            } else {
                setMarkFoundError("Unknown error while marking report as found.");
            }
        } finally {
            setMarkingFound(false);
        }
    }

    return (
        <main>
            <h1>{report.name}</h1>
            <img
                src={report.photoUrl}
                alt={report.name}
                style={{
                    width: "300px",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                }}
            />

            <p><strong>Type:</strong> {AnimalType[report.type]}</p>
            <p><strong>Description:</strong> {report.description}</p>
            <p><strong>Contact:</strong> {report.contact}</p>
            <p><strong>Address:</strong> {report.address || "No address available"}</p>
            <p><strong>Date Posted:</strong> {new Date(report.datePosted).toLocaleString()}</p>
            <p><strong>Status:</strong> {ReportStatus[report.status]}</p>

            {report.status === ReportStatus.Lost && (
                <div style={{ marginTop: "1rem" }}>
                    <h3>Mark as Found</h3>

                    <label htmlFor="markFoundPassword">Enter password:</label>
                    <input id="markFoundPassword" type="password" value={passwordInput} onChange={(event) => setPasswordInput(event.target.value)}/>

                    <button onClick={handleMarkAsFound} disabled={markingFound} style={{ marginLeft: "0.5rem" }}>
                        {markingFound ? "Updating..." : "Mark as Found"}
                    </button>
                    {markFoundError && (
                        <p style={{ color: "red" }}>{markFoundError}</p>
                    )}
                </div>
            )}

            {report.status === ReportStatus.Found && (
                <p>This pet has already been marked as found.</p>
            )}
            <br /><br />
            <Link to="/">
                <button>Back to Home</button>
            </Link>
        </main>
    );
}

export default DetailsPage;
