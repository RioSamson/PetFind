import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import type { BasicMapProps, MapClickHandlerProps } from '../models'
import type { LatLngLiteral } from 'leaflet';
import { useState, useEffect } from 'react';

function MapClickHandler({onLocationSelect}: MapClickHandlerProps){
    useMapEvents({
        click(event) {
            onLocationSelect({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
            });
        },
    });
    return null;
}

function UserLocationCenter(){
    const [position, setPosition] = useState<LatLngLiteral | null>(null);
    const map = useMapEvents({
        locationfound(event){ const userLocation = event.latlng;
            setPosition(userLocation); 
            map.flyTo(userLocation, 13);
        },
        locationerror(){
            console.log("Could not get user location. Using default map center.");
        },
    });
    useEffect(() => {
        map.locate();
    }, [map]);
    return position === null ? null : 
    (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

function BasicMap({selectedLocation, onLocationSelect}: BasicMapProps){
    return(
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <UserLocationCenter />
            <MapClickHandler onLocationSelect={onLocationSelect}/>; {/* set the listener */}

            {selectedLocation && (
                <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
                    <Popup>
                        Selected location:
                        <br />
                        {selectedLocation.latitude.toFixed(5)}, {selectedLocation.longitude.toFixed(5)}
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    )
}

export default BasicMap