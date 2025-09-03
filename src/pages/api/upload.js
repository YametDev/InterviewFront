import nextConnect from "next-connect";
import { uploadController } from "@/lib/controllers";
import { upload } from "@/lib/config"

// Configure multer (like in your multerConfig.js)
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: "./public/uploads", // or any path
//     filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
//   }),
// });

// Disable Next.js body parser so multer can handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

// Create API route with next-connect
const apiRoute = nextConnect();

apiRoute.use(upload.single("file"));
apiRoute.post(uploadController.uploadFiles);

export default apiRoute;