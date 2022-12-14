/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import mongooseModels from '../database/models';
import uploadImage from '../utils/cloudinary';
import Response from '../utils/response';

const { responseModel, fieldResponseModel } = mongooseModels;

/** class representing response controller functions */
class ResponseController {
  /**
   * @description Creates a new response
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {Function} next Express Next Function
   * @returns {object} Response from create response
   */
  static async createResponse(req, res, next) {
    try {
      // TODO: FORMAT USER RESPONSE AND UPLOAD IMAGES TO CLOUDINARY
      const { answers } = req.body;
      console.log(answers);
      // for (let i = 0; i < answers.length; i += 1) {
      //   for (let j = 0; j < answers[i].components.length; j += 1) {
      //     if (answers[i].components[j].type === 'image' && answers[i].components[j].value) {
      //       answers[i].components[j].value = await uploadImage(answers[i].components[j].value, 'aicollect_responses').url;
      //       console.log('Image uploaded ', answers[i].components[j].value);
      //     }
      //     if (answers[i].components[j].type === 'sub-section') {
      //       for (let z = 0; z < answers[i].components[j].components.length; z += 1) {
      //         if (answers[i].components[j].components[z].type === 'image' && answers[i].components[j].components[z].value) {
      //           const uploadResponse = await uploadImage(answers[i].components[j].components[z].value, 'aicollect_responses');
      //           answers[i].components[j].components[z].value = uploadResponse.url;
      //         }
      //       }
      //     }
      //   }
      // }
      // UPLOAD PRESET ==> aicollect_field_responses
      const { fields } = req.body;
      delete req.body.fields;
      responseModel
        .findOne({ form: req.body.form })
        .sort('-prefix_id') // give me the max
        .exec(async (err, maxField) => {
          if (err) {
            console.log('Error Fetching Max Field: ', err);
          }
          const response = new responseModel({
            _id: mongoose.Types.ObjectId(),
            ...req.body,
            prefix_id: maxField ? maxField.prefix_id + 1 : 1
          });
          response.save(async (err, saved) => {
            if (err) {
              return Response.badRequestError(res, 'Please check that all the fields are right');
            }
            const formattedFields = fields.map((field, index) => {
              field.code = `${field.region.prefix.toUpperCase()}-${String(maxField ? maxField.prefix_id + 1 : 1).padStart(5, '0')}`;
              field.response = saved._id;
              field.name = `Field ${index + 1}`;
              field._id = mongoose.Types.ObjectId();
              console.log('Logging Request Body => ', field);
              return field;
            });

            fieldResponseModel.insertMany(formattedFields, (err, docs) => {
              if (err) {
                console.log('Field Record Response Logger => ', err);
              }
              console.log('Field Record Response Logger => ', docs);
            });
            return Response.customResponse(res, 201, 'Response submited successfully', saved);
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Gets User Responses
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {Function} next Express Next Function
   * @returns {object} Response from get responses
   */
  static async getUserResponses(req, res, next) {
    try {
      const { formId } = req.params;
      const { roles, id, } = req.user;
      let responses = [];
      if (roles === 'Supervisor') { 
        console.log('User Request is From Supervisor');
        responses = await responseModel.find({ form: formId, submittedBy:{supervisor:id} }).exec();
        console.log('Supervisor Data: ', responses);
      }
      else {
        responses = await responseModel.find({ form: formId }).exec();
      }
      return Response.customResponse(res, 200, 'Responses retreived', responses);
    } catch (error) {
      return next(error);
    }
  }
}

export default ResponseController;
