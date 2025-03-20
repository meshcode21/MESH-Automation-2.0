let usersData = null; // Global variable
export function getData(){
    return usersData;
}
export function setData(data){
    usersData = data;
}

let isAutomationRunning = false;
export function setIsRunning(bool){
    isAutomationRunning = bool;
}
export function getIsRunning(){
    return isAutomationRunning;
}
