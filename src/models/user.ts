import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  user_name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

UserSchema.pre("save", function save(next) {
  if (!this.isModified("password")) { return next(); }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(this.password, salt, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      this.password = hash;
      next();
    });
  });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

// Add any new methods to the assign object
Object.assign(UserSchema.methods, {
  comparePassword
});

mongoose.model('User', UserSchema);