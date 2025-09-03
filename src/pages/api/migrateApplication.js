import dbConnect from "@/lib/mongodb";
import { User, Application } from "@/lib/models";

const DRY_RUN = true; // set to true for testing first

export default async function handler(req, res) {
  try {
    await dbConnect();
    
    const users = await User.find({}, { email: 1, userId: 1 }).lean();
    const userMap = {};
    for (const user of users) {
      userMap[user.email] = user.userId;
    }
    
    const apps = await Application.find({});
    let updated = 0;
    let removed = 0;

    for (const app of apps) {
      const uid = userMap[app.email];
      if (uid) {
        if (!DRY_RUN) {
          app.userId = uid;
          app.email = undefined; // drop email field
          await app.save();
        }
        updated++;
      } else {
        if (!DRY_RUN) {
          await Application.deleteOne({ _id: app._id });
        }
        removed++;
      }
    }

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
