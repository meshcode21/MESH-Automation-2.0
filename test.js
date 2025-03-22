import { getData, storeResult } from "./src/data/dataProvider.js";
import { AutoEngine } from "./src/utils/AutoEngine.js";

const data = getData();

// console.log(data[0])

AutoEngine(
    0,
    data,
    (statusData) => {
      console.log(statusData);
    //   ws.send(JSON.stringify(statusData));

      if (statusData.status != "running") {
        const userData = data.find((item, index) => index == statusData.index);

        if (statusData.status == "selected") storeResult({ ...userData, status: statusData.status, userInfo: statusData.userInfo });
        else storeResult({ ...userData, status: statusData.status });
      }
    },
    () => {
    //   ws.send(JSON.stringify({ message: "automation terminated" }));
    console.log("automtion terminated");
    }
  );