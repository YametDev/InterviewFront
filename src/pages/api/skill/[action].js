import * as skillController from "@/lib/controllers/skill";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { action } = req.query; // "create", "lookup", etc.

  switch (action) {
    case "create":
      return skillController.create(req, res);
    case "lookup":
      return skillController.lookup(req, res);
    case "update":
      return skillController.update(req, res);
    case "delete":
      return skillController._delete(req, res);
    default:
      return res.status(404).json({ error: "Not found" });
  }
}