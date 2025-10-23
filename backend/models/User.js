const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },

    // 🔹 Nuevo campo de rol
    role: {
      type: String,
      enum: ["admin", "estudiante"],
      default: "estudiante",
    },

    // 🔹 Ramos seleccionados
    misRamos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curso",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.statics.hashPassword = async function (plain, pepper, saltRounds = 12) {
  return bcrypt.hash(String(plain || "") + String(pepper || ""), saltRounds);
};

UserSchema.methods.verifyPassword = async function (plain, pepper) {
  return bcrypt.compare(String(plain || "") + String(pepper || ""), this.passwordHash);
};

module.exports = mongoose.model("User", UserSchema);
