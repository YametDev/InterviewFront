import * as userController from "@/lib/controllers/user";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { action } = req.query; // "create", "lookup", etc.

  switch (action) {
    case "create":
      return userController.create(req, res);
    case "lookup":
      return userController.lookup(req, res);
    case "update":
      return userController.update(req, res);
    case "delete":
      return userController._delete(req, res);
    default:
      return res.status(404).json({ error: "Not found" });
  }
}
