
import mongoose from "mongoose";

const subcriptionSchema  = new mongoose.Schema({

    userId: {type: String, required: true},
  amount: {type:Number, require:true},//subscription.plan.amount,
  expiresAt:{type:Date} //subscription.current_period_end,

},{timestamps:true})

export default mongoose.model("Subcription", subcriptionSchema);
