import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, default: 0 },
    parent: String,
    name: String,
    email: String,
  },
  { timestamps: true }
);

if (!mongoose.models.User) {
  userSchema.plugin(AutoIncrement, { inc_field: "userId" });
}

export default mongoose.models.User || mongoose.model("User", userSchema);
