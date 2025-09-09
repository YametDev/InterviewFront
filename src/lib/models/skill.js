import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const skillSchema = new mongoose.Schema(
  {
    sid: { type: Number, default: 0 },
    name: { type: String, default: "" },
  },
  { timestamps: true }
);

if (!mongoose.models.Skill) {
  skillSchema.plugin(AutoIncrement, { inc_field: "sid" });
}

export default mongoose.models.Skill || mongoose.model("Skill", skillSchema);