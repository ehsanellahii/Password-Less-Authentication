// models/PasskeyCredential.js
import mongoose from 'mongoose';

const PasskeyCredentialSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    credentialID: { type: String, required: true },
    displayName: { type: String },
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
    },
    publicKey: { type: String, required: true },
    transports: [String],
    counter: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PasskeyCredentialList = mongoose.model('PasskeyCredential', PasskeyCredentialSchema);

export default PasskeyCredentialList;
