import axios from "./axiosConfig";

const errorHandler = (handler) => (error) => {
  if (handler)
    handler({
      result: false,
      message: "Error occured : " + error,
    });
};

const successHandler = (handler) => (response) => {
  if (handler) handler(response.data);
};

export const axiosHandler = (path, param, callback, option = undefined) => {
  axios
    .post(path, param, option)
    .then(successHandler(callback))
    .catch(errorHandler(callback));
};

export const fullLink = (filename) =>
  `${axios.defaults.baseURL}/image/${filename}`;

export const regularWebsiteLink = (website) =>
  (website.slice(0, 8) !== "https://" && website.slice(0, 7) !== "http://"
    ? "https://"
    : "") + website;

export const displayWebsiteLink = (website) =>
  website.indexOf("//") !== -1
    ? website.slice(website.indexOf("//") + 2)
    : website;

export const uploadResume = async (params) => {
  const response = await axios
    .post("/upload_files", params, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  return response.data;
};

export const ipAddress = (callback) => {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      callback(data.ip);
    })
    .catch((error) => {
      return "";
    });
};

export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

export const getCookie = (cname) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const specialtyItems = [
  { label: "Beauty", value: "beauty" },
  { label: "Cars", value: "cars" },
  { label: "Comedy", value: "comedy" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Education", value: "education" },
  { label: "Family", value: "family" },
  { label: "Fashion", value: "fashion" },
  { label: "Fitness/Sports", value: "fitness" },
  { label: "Financial", value: "financial" },
  { label: "Food", value: "food" },
  { label: "Fun", value: "fun" },
  { label: "Gaming", value: "game" },
  { label: "Lifestyle", value: "lifestyle" },
  { label: "Health/Wellness", value: "health" },
  { label: "Pet", value: "pet" },
  { label: "Travel", value: "travel" },
  { label: "Technology", value: "tech" },
  { label: "Other", value: "other" },
];
