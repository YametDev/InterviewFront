import { axiosHandler } from "./config";

export const createSkill = (param, callback) => {
  axiosHandler("/skill/create", param, callback);
};

export const updateSkill = (param, callback) => {
  axiosHandler("/skill/update", param, callback);
};

export const lookupSkill = (param, callback) => {
  axiosHandler("/skill/lookup", param, callback);
};

export const deleteSkill = (param, callback) => {
  axiosHandler("/skill/delete", param, callback);
};