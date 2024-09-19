const mongoose = require("mongoose");

const OrderSchema= new mongoose.Schema(
    {
        userId:{ type: String, required: true },
        products:[
            {
                productId:{
                    type: String
                },
                quantityOrder:{
                    type: Number,
                    default: 1,
                },
                colorOrder:{
                    type: String,
                },
                sizeOrder:{
                    type: String,
                }
            }
        ],
        amount:{ type:Number, required: true },
        address:{type: Object, required: true},
        name:{type: Object, required: true},
        note: { type: String },
        phone: { type: String,required: true },
        status: { type: String, default:"0" }
        
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Order", OrderSchema)