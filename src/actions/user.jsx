import { axiosHandler } from "./config";

// userId, name, email, parent

export const createUser = (param, callback) => {
  axiosHandler("/user/create", param, callback);
}

export const updateUser = (param, callback) => {
  axiosHandler("/user/update", param, callback);
}

export const infoUser = (param, callback) => {
  axiosHandler("/user/info", param, callback);
}

export const lookupUser = (param, callback) => {
  axiosHandler("user/lookup", param, callback);
}

export const deleteUser = (param, callback) => {
  axiosHandler("user/delete", param, callback);
}