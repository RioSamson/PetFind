import { useState } from "react";
import { AnimalType, type ReportDraft, type AnimalReport, ReportStatus } from "../models";
import { imageUpload } from "../services/ImgBBService";
import { hashPassword } from "../services/hashService";
import { addReport } from "../services/JSONbinService";
import BasicMap from "../components/BasicMap";
import { useNavigate } from "react-router-dom";

// export interface AnimalReport{
//     name: string;
//     type: AnimalType;
//     photoUrl: string;
//     description: string;
//     contact: string;
//     location: Location;
//     address: string;
//     passwordHash: string;
//     status: ReportStatus;
//     datePosted: string;
// }


function FormField() {
    const [formData, setFormData] = useState<ReportDraft>({
        name: "",
        type: AnimalType.Cat,
        photo: null,
        description: "",
        contact: "",
        location: null,
        address: "",
        password: ""
    });
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    async function submitForm(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        try{
            setSubmitting(true);
            if(!formData.photo){
                throw new Error("Error with uploaded photo, It is empty");
            }
            if (!formData.location) {
                throw new Error("please select a location on the map");
            }
            const uploadedImageUrl = await imageUpload(formData.photo);
            const passwordHash = await hashPassword(formData.password);

            const finalReport: AnimalReport = {
                id: crypto.randomUUID(),
                name: formData.name,
                type: formData.type,
                photoUrl: uploadedImageUrl,
                description: formData.description,
                contact: formData.contact,
                location: formData.location,
                address: formData.address,
                passwordHash: passwordHash,
                status: ReportStatus.Lost,
                datePosted: new Date().toISOString()
            };
            const savedReports = await addReport(finalReport);

            console.log(`This is the final report data after adding to saved reports and uploadeing to JSONbin`);
            console.log(savedReports); 
            navigate("/");
        } catch(error){
            console.error("Error submitting report", error);
        }
        finally{
            setSubmitting(false);
        }

    }

    function handleNewInput(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
        const {id, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData, [id]: id === "type" ? Number(value) : value,
        }))
    }

    function handleFileInput(event: React.ChangeEvent<HTMLInputElement>){
        const selectedFile = event.target.files?.[0] ?? null;
        setFormData((prevFormData) => ({
            ...prevFormData,photo: selectedFile,
        }));
    }

    return (
        <main>
            <form onSubmit={submitForm}>
                <div>
                    <label htmlFor="name">Animal Name</label>
                    <input 
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={handleNewInput}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="type">Animal Type</label>
                    <select
                        id="type"
                        value={formData.type}
                        onChange={handleNewInput}
                        required
                    >
                        <option value={AnimalType.Bird}>Bird</option>
                        <option value={AnimalType.Cat}>Cat</option>
                        <option value={AnimalType.Dog}>Dog</option>
                        <option value={AnimalType.Rabbit}>Rabbit</option>
                        <option value={AnimalType.Other}>Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="photo">Photo</label>
                    <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={handleNewInput}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="contact">Contact</label>
                    <input
                        id="contact"
                        type="text"
                        value={formData.contact}
                        onChange={handleNewInput}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={handleNewInput}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        value={formData.password}
                        type="password"
                        onChange={handleNewInput}
                        required
                    />
                </div>
                <div>
                    <BasicMap
                        selectedLocation={formData.location}
                        onLocationSelect={(location) => setFormData((prevFormData)=>({
                            ...prevFormData, location: location, 
                        }))}
                    />
                </div>
                <div>
                    <p>
                        Selected location:{" "}
                        {formData.location
                            ? `${formData.location.latitude.toFixed(5)}, ${formData.location.longitude.toFixed(5)}`
                            : "No location selected yet"}
                    </p>
                </div>

                <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</button>
            </form>
        </main>
    )
}

export function ReportSubmissionPage() {
    return (
        <>
            <h1>Report Submission Page</h1>
            <FormField/>
        </>
    )
}

export default ReportSubmissionPage 