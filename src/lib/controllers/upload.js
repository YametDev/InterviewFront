import { google } from "googleapis";
import fs from "fs";
import { DateTime } from "luxon";

const drive = google.drive({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
      keyFile: '@/lib/config/jobtracker-456908-932c5b52667c.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
  }),
});

export const uploadFiles = async (req, res) => {
  try {
    const fileMetadata = {
      name: DateTime.now() + "-" + req.file.originalname,
      parents: ['1PALAur0gGHgrsfcwnQys_oVg0aWp9AjU'],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    fs.unlinkSync(req.file.path);
    
    console.log(response.data.webViewLink);
    res.send({ result: true, data: response.data });
  } catch (error) {
    res.send({ result: false, message: "Error: " + error });
  }
}