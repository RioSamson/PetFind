import { Link } from "react-router-dom";
import HomePageMap from "../components/HomePageMap";
import { AnimalType, ReportStatus, type AnimalReport, type AnimalTypeFilter, type StatusFilter } from "../models";
import { readReports } from "../services/JSONbinService";
import { useEffect, useState } from "react";

function HomePage() {
    const [reports, setReports] = useState<AnimalReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
    const [selectedAnimalType, setSelectedAnimalType] = useState<AnimalTypeFilter>("all");


    useEffect(()=> {
        async function loadReports(){
            try{
                const loadedReports = await readReports();
                setReports(loadedReports);
            } catch (error){
                console.error("Error loading reports", error);
            } finally{
                setLoading(false);
            }
        }
        loadReports();
    }, []);

    const lostReports = reports.filter((report)=> {
        return report.status === ReportStatus.Lost;
    })

    const filteredReports = reports.filter((report) => {
        const statusMatches = selectedStatus === "all" ||
            (selectedStatus === "lost" && report.status === ReportStatus.Lost) ||
            (selectedStatus === "found" && report.status === ReportStatus.Found);

        const animalTypeMatches = selectedAnimalType === "all" ||
            report.type === selectedAnimalType;

        return statusMatches && animalTypeMatches;
    });

    return (
        <main>
            <h1>Pet Finder</h1>
            <HomePageMap reports={lostReports}/>
            <br />
            <Link to="/report">
                <button>Report Lost Pet</button>
            </Link>

            <h2>Browse Reports</h2>
            <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="statusFilter">Status: </label>
                <select id="statusFilter" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as StatusFilter)} style={{ marginRight: "1rem" }}>
                    <option value="all">All</option>
                    <option value="found">Found</option>
                    <option value="lost">Lost</option>
                </select>
                <label>Type: </label>
                <select id="animalTypeFilter" value={selectedAnimalType} onChange={(event) => { const value = event.target.value; setSelectedAnimalType( value === "all" ? "all" : Number(value));}}>
                    <option value="all">All</option>
                    <option value={AnimalType.Bird}>Bird</option>
                    <option value={AnimalType.Cat}>Cat</option>
                    <option value={AnimalType.Dog}>Dog</option>
                    <option value={AnimalType.Rabbit}>Rabbit</option>
                    <option value={AnimalType.Other}>Other</option>
                </select>
            </div>

            {loading && <p>Loading reports...</p>}

            {!loading && filteredReports.length === 0 && (
                <p>No reports match the selected filters.</p>
            )}

            {!loading && filteredReports.length > 0 && (
                <div> {filteredReports.map((report) => (
                        <div
                            key={report.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "1rem",
                                marginBottom: "1rem",
                                borderRadius: "8px",
                            }}>
                            <img src={report.photoUrl} alt={report.name}
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "cover",}}/>
                            <h3>{report.name}</h3>
                            <p>Type: {AnimalType[report.type]}</p>
                            <p>{report.description}</p>
                            <p>Address: {report.address || "No address yet"}</p>
                            <p>Status: {ReportStatus[report.status]}</p>

                            <Link to={`/report/${report.id}`}>
                                <button>View Details</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
      );
}

export default HomePage