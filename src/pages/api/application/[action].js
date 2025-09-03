import * as applicationController from "@/lib/controllers/application";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action } = req.query; // e.g. "create", "lookup", etc.

  switch (action) {
    case "create":
      return applicationController.create(req, res);
    case "lookup":
      return applicationController.lookup(req, res);
    case "update":
      return applicationController.update(req, res);
    case "delete":
      return applicationController._delete(req, res);
    case "deletemany":
      return applicationController.deleteMany(req, res);
    default:
      return res.status(404).json({ error: "Not found" });
  }
}