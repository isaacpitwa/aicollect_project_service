// import Joi from '@hapi/joi';

// export default {
//   firstname: Joi.string()
//     .trim()
//     .required()
//     .min(3)
//     .max(30),
//   lastname: Joi.string()
//     .trim()
//     .required()
//     .min(3)
//     .max(30),
//   roles: Joi.string()
//     .valid('Owner', 'Admin', 'Data Manager', 'Supervisor', 'Standard user')
//     .required(),
//   email: Joi.string()
//     .email()
//     .trim()
//     .required()
//     .min(5),
//   phone: Joi.string()
//     .required()
//     .regex(/^[0-9]{10}$/)
//     .error(() => 'phone field needs to have a 10 chars and they must all be numbers'),
//   firstTimeProcessor: Joi.string()
//     .optional(),
//   password: Joi.string()
//     .required()
//     .min(6)
//     .error(() => 'Password needs to be 6 or more characters'),
//   processor: Joi.string()
//     .optional(),
//   isActive: Joi.boolean()
//     .required(),
//   isDeleted: Joi.boolean()
//     .required(),
//   addedBy: Joi.number()
//     .required()
// };
