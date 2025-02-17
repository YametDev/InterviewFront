import { axiosHandler } from "./config";

// Category, Question, Answer, Views, Votes

export const createQuestion = (param, callback) => {
  axiosHandler("/question/create", param, callback);
}

export const updateQuestion = (param, callback) => {
  axiosHandler("/question/update", param, callback);
}

export const infoQuestion = (param, callback) => {
  axiosHandler("/question/info", param, callback);
}

export const lookupQuestion = (param, callback) => {
  axiosHandler("question/lookup", param, callback);
}

export const deleteQuestion = (param, callback) => {
  axiosHandler("question/delete", param, callback);
}