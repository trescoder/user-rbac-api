import * as bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);

export const hashPassword = (password) => bcrypt.hashSync(password, salt);
export const comparePasswords = (incomingPass, hashedPass) =>
  bcrypt.compareSync(incomingPass, hashedPass);
