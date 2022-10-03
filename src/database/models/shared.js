/** Users, cloned from the Authentication Service */
const userschema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, trim: true },
    roles: { type: String, required: true },
    supervisor: { type: Number, default:null},
  });

export { userschema };