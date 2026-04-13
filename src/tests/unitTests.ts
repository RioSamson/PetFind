// import { type AnimalReport, AnimalType, ReportStatus } from "../models";
// import { readReports, writeReports } from "../services/JSONbinService";

// // test writing to JSONbin
// export async function handleTestWrite(){
//     const mockData: AnimalReport[] = [
//       {
//         name: "Milo",
//         type: AnimalType.Cat,
//         photoUrl: "https://example.com/milo.jpg",
//         description: "Orange cat with a white patch on the chest.",
//         contact: "riosamson@example.com",
//         location: {
//           latitude: 49.2827,
//           longitude: -123.1207
//         },
//         address: "Vancouver, BC",
//         passwordHash: "test-password",
//         status: ReportStatus.Lost,

//         datePosted: new Date().toISOString()
//       }
//     ];

//     try{
//       const res = await writeReports(mockData);
//       console.log("write successful");
//       console.log(res);

//     } catch (error){
//       console.error("Error writing", error);
//       alert("write failed check console");
//     }
//   }

//   //test reading from JSONbin
//   export async function handleTestJsonBinRead(){
//     try{
//         const res = await readReports();
//         console.log("Read from JSONbin successfully");
//         console.log(res);
//     } catch (error){
//         console.error("Error with reading from JSON bin", error);
//     }
//   }