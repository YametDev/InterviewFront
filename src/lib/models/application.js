import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const applicationSchema = new mongoose.Schema(
  {
    id: { type: Number, default: 0 },
    userId: Number,
    email: String,
    link: String,
    company: String,
    role: String,
    salary: String,
    description: String,
    resume: { type: String, default: "" },
    state: { type: Number, default: 0 },
    pin: { type: Boolean, default: false },
    skills: { type: [Number], default: [] },
  },
  { timestamps: true }
);

if (!mongoose.models.Application) {
  applicationSchema.plugin(AutoIncrement, { inc_field: "id" });
}

export default mongoose.models.Application || mongoose.model("Application", applicationSchema);
