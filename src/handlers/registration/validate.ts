import { Schema, checkSchema } from 'express-validator';

const schema: Schema = {
  email: {
    isEmail: {
      errorMessage: 'Invalid email',
    },
  },
  password: {
    isLength: {
      errorMessage:
        'Minimum eight characters and maximum 253. At least one letter, one number and one special character',
      options: { min: 8, max: 253 },
    },
    matches: {
      options:
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/,
    },
  },
};

export const validate = checkSchema(schema);
