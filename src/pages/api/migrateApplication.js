import dbConnect from "@/lib/mongodb";
import { User, Application } from "@/lib/models";

const DRY_RUN = false; // set to true for testing first

export default async function handler(req, res) {
  try {
    await dbConnect();
    let updated = 0;
    let removed = 0;
    
    const updatedApplications = await Application.updateMany({state: 5}, {state: DRY_RUN ? 5 : 6});
    updated += updatedApplications.modifiedCount;

    return res.status(200).json({
      message: "Migration completed",
      updated,
      removed,
      dryRun: DRY_RUN,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
