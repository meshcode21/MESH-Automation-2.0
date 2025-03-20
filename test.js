import { setIsRunning } from "./src/dataStore.js";
import { AutoEngine } from "./src/utils/AutoEngine.js";

const data = [
  {
    name: "SAH, SHRESTHA KUMAR",
    confirmationNumber: "20257DSE9X6VGULT",
    DOB: "2006",
    progress: "...",
    status: "...",
  },
  {
    name: "BHUJEL, SUJITA",
    confirmationNumber: "20257EBY8NH54EN6",
    DOB: "2002",
    progress: "...",
    status: "...",
  },
  {
    name: "SINGH, SANJEEV KUMAR",
    confirmationNumber: "20257DNZQF9HZ4H2",
    DOB: "1977",
    progress: "...",
    status: "...",
  },
  {
    name: "KUMARI, SAPNA",
    confirmationNumber: "20257DODVLI46WWQ",
    DOB: "1988",
    progress: "...",
    status: "...",
  },
  {
    name: "SAH, ANISHA KUMARI",
    confirmationNumber: "20257E3D5Z58W5BK",
    DOB: "2004",
    progress: "...",
    status: "...",
  },
  {
    name: "SHEIKH, MOHAMMAD SHABIR",
    confirmationNumber: "20257AD2VJ6ZS2MV",
    DOB: "1989",
    progress: "...",
    status: "...",
  },
  {
    name: "CHAUHAN, DHIRENDRA",
    confirmationNumber: "20257DNOL3EVWLGR",
    DOB: "1995",
    progress: "...",
    status: "...",
  },
];

(async () => {
  setIsRunning(true);
  AutoEngine(
    data,
    (processData) => {
      console.log(processData);
    },
    (statusData) => {
      console.log(statusData);
    }
  );
})();
