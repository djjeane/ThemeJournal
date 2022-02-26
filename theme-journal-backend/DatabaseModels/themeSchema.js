import mongoose from "mongoose";

const Theme = mongoose.Schema(
  {
    user_id: String,
    title: String,
    description: String,
    outcomes: Array,
    goals_descriptions: Array,
    start_date: Date,
    end_date: Date,
  },
  {
    collection: "Themes",
  }
);

//Collection inside the database
export default mongoose.model("Theme", Theme);
