import { axiosHandler } from "./config";

// Category, Application, Answer, Views, Votes

export const createApplication = (param, callback) => {
  axiosHandler("/application/create", param, callback);
}

export const updateApplication = (param, callback) => {
  axiosHandler("/application/update", param, callback);
}

export const infoApplication = (param, callback) => {
  axiosHandler("/application/info", param, callback);
}

export const lookupApplication = (param, callback) => {
  axiosHandler("application/lookup", param, callback);
}

export const deleteApplication = (param, callback) => {
  axiosHandler("application/delete", param, callback);
}

export const deleteManyApplication = (param, callback) => {
  axiosHandler("application/deletemany", param, callback);
}