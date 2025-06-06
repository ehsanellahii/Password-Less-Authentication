import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['approved', 'rejected', 'pending', 'active', 'inactive', 'deleted', 'rollback'],
      default: 'active',
    },

    full_name: { type: String, trim: true },

    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, select: false },
    primary_login_method: {
      type: String,
      enum: ['password', 'passkey'],
      default: 'password',
    },
    password_changed_at: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, id: false },
    toObject: { virtuals: true, id: false },
  }
);

const User = mongoose.model('User', UserSchema);
export default User;
