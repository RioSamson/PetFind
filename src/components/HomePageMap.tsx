import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";
import type { AnimalReport } from "../models";
import { Link } from "react-router-dom";

function UserLocationMarker() { //from the leaflet tutorial page
    const [position, setPosition] = useState<LatLngLiteral | null>(null);
    const map = useMapEvents({
        locationfound(event) {
            const userLocation = event.latlng;
            setPosition(userLocation);
            map.flyTo(userLocation, 13);
        },
        locationerror() {
            console.log("Could not get user location. Using default map center.");
        },
    });

    useEffect(() => {
        map.locate();
    }, [map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

function HomePageMap({reports}: {reports: AnimalReport[]}) {
    return (
        <MapContainer center={[49.2827, -123.1207]} zoom={13} scrollWheelZoom={true} style={{ height: "60vh", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <UserLocationMarker />
            {
                reports.map((report)=> (
                    <Marker key={report.id} position={[report.location.latitude, report.location.longitude]}>
                        <Popup>
                            <div>
                                <h3>{report.name}</h3>
                                <p>{report.description}</p>
                                <Link to={`/report/${report.id}`}>
                                    <button>View Details</button>
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))
            }

        </MapContainer>
    );
}

export default HomePageMap;