
import axios from 'axios';

const Authconnector = axios.create({
    baseURL: `${process.env.AUTH_SERVICE_URL}/`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

Authconnector.interceptors.request.use(
    (request) => {
      console.log('=======> Sending Request to API');
      return request;
    },
    (error) => {
      console.log('=========> Error Occured pushing Request:');
      console.log(error);
      return Promise.reject(error);
    },
  );
  
  Authconnector.interceptors.response.use(
    (response) => {
      console.log('===> Response from API');
      console.log(response);
      return response;
    },
    (error) => {
      console.log(' ===> Error occured on Response from API');
      console.log(error);
      return Promise.reject(error);
    },
  );
  export default Authconnector;
