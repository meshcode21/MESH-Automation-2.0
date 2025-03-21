import { writeFileSync, readFileSync } from "fs";

const dataPath = "./src/data/data.json";
export function getData() {
  const usersData = JSON.parse(readFileSync(dataPath, "utf-8"));
  return usersData;
}
export function setData(usersData) {
  try {
    writeFileSync(dataPath, JSON.stringify(usersData, null, 2));
    console.log("Data written to file");
  } catch (error) {
    console.error("Error while writing data:\n", error);
  }
}

const resultPath = "./src/data/result.json";
export function storeResult(result) {
  if (result) {
    const results = JSON.parse(readFileSync(resultPath, "utf-8"));
    results.push(result);
    writeFileSync(resultPath, JSON.stringify(results, null, 2));
    console.log("Result updated");
  } else {
    writeFileSync(resultPath, JSON.stringify([], null, 2));
  }
}

export function getResult(){
  const results = JSON.parse(readFileSync(resultPath, "utf-8"));
  return results;
}

let isAutomationRunning = false;
export function setIsRunning(bool) {
  isAutomationRunning = bool;
}
export function getIsRunning() {
  return isAutomationRunning;
}
