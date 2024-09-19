const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema(
    {
        username:{ type: String, required: true, unique:true },
        fullname:{type:String},
        email:{ type: String, required: true, unique:true },
        password:{ type: String, required: true },
        isAdmin:{ 
            type: Boolean,
            default: false
        },
        img:{ type: String },
        gender:{type: String},
        phone:{type: String},
        address:{type: String},
        date:{type:String},
        passwordResetToken: {
            type: String
        },
        passwordResetExpires: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);
UserSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}

module.exports = mongoose.model("User", UserSchema)