import mongoose from "mongoose";

const journalSchema = mongoose.Schema(
  {
    user_id: String,
    body: String,
    goals: Array,
    date: Date,
  },
  {
    collection: "Journals",
  }
);

//Collection inside the database
export default mongoose.model("Journals", journalSchema);
