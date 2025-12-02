const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      // ⚠️ Not required for OAuth users
      required: function () {
        return !this.googleId && !this.githubId && !this.linkedinId && !this.appleId;
      },        
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    // ✅ OAuth Provider IDs
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    linkedinId: {
      type: String,
      unique: true,
      sparse: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
