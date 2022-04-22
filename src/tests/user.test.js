import chai from 'chai';
import chaiHttp from 'chai-http';
// import passport from 'passport';
import '../config/passport';

import app from '../index';

const server = app;
const { expect } = chai;

const signupUrl = '/api/v1/authService/signup';
const signinUrl = '/api/v1/authService/login';

chai.use(chaiHttp);

const registrationData = {
  firstname: 'Dambi',
  lastname: 'Stuart',
  email: 'stuartdambi@gmail.com',
  roles: 'Admin',
  profileImage: 'https://aicollect.com/profileimage.png',
  phone: '0755710958',
  password: 'Mbulambago1.'
};

const loginCredentials = {
  email: 'stuartdambi@gmail.com',
  password: 'Mbulambago1.',
  deviceToken: 'Iphone13_IOSv13'
};

let token;
let user;

describe('Create a new User account', () => {
  it('with valid properties and send a verification email with verification link', (done) => {
    chai
      .request(server)
      .post(signupUrl)
      .send(registrationData)
      .end((_err, res) => {
        const { link } = res.body.data.verification;
        token = link.replace(`${process.env.FRONTEND_URL}/authentication/verify-email/?token=`, '');
        user = res.body.data;
        // url.parse(link);
        // console.log(token);
        expect(res.body.message).to.eq('Account has been created successfully');
        expect(res.status).to.eq(201);
        expect(res.body.data.verification.message).to.eq('Verification link sent successfully');
        done();
      });
  });

  it('should throw error if user email already exists in the database', (done) => {
    chai
      .request(server)
      .post(signupUrl)
      .send(registrationData)
      .end((_err, res) => {
        expect(res.status).to.eq(409);
        expect(res.body.message).to.eq('User Already Exists');
        done();
      });
  });

  it('should throw error if user phone number already exists in the database', (done) => {
    chai
      .request(server)
      .post(signupUrl)
      .send({ ...registrationData, email: 'stuart@wild.coffee' })
      .end((_err, res) => {
        expect(res.status).to.eq(409);
        expect(res.body.message).to.eq('Phone number was already used by someone');
        done();
      });
  });

  it('should verify an email via verification link', (done) => {
    chai
      .request(server)
      .post(`/api/v1/authService/verifyEmail/?token=${token}`)
      .end((_err, res) => {
        expect(res.status).to.eq(201);
        done();
      });
  });

  it('should not verify email twice', (done) => {
    chai
      .request(server)
      .post(`/api/v1/authService/verifyEmail/?token=${token}`)
      .end((_err, res) => {
        expect(res.status).to.eq(409);
        expect(res.body.message).to.eq('Email is already verified');
        done();
      });
  });
});

describe('Login Users', () => {
  it('should login a user with the provided the credentials are right', (done) => {
    chai
      .request(server)
      .post(signinUrl)
      .send(loginCredentials)
      .end((_err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('User logged in successfully');
        token = res.body.data;
        done();
      });
  });
  it('should throw an error if email provided is wrong', (done) => {
    chai
      .request(server)
      .post(signinUrl)
      .send({ ...loginCredentials, email: 'stuart@wild.coffee' })
      .end((_err, res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('Invalid email or password');
        done();
      });
  });
  it('should throw an error if password provided is wrong', (done) => {
    chai
      .request(server)
      .post(signinUrl)
      .send({ ...loginCredentials, password: 'wrongpassword' })
      .end((_err, res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('Invalid email or password');
        done();
      });
  });
});

// describe('Login With Google', () => {
//   it('redirects to google', (done) => {
//     chai
//       .request(server)
//       .get('/api/v1/authService/google')
//       .end((_err, res) => {
//         // console.log('REDIRECTS', res);
//         res.redirects[0].should.contain('api/v1/authService/google/redirect?');
//         done();
//       });
//   });
// });

describe('User operations', () => {
  it('should throw error of user is not authenticated', (done) => {
    chai
      .request(server)
      .get('/api/v1/authService/users')
      .end((_err, res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('Invalid or expired token used');
        done();
      });
  });
  it('should get list of all users if user is authenticated', (done) => {
    chai
      .request(server)
      .get('/api/v1/authService/users')
      .set('Authorization', `Bearer ${token}`)
      .end((_err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.data).to.length(1);
        done();
      });
  });
  it('should update user details', (done) => {
    chai
      .request(server)
      .post('/api/v1/authService/update')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...user, userId: user.id, firstname: 'Arthen' })
      .end((_err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('User updated successfully');
        // expect(res.body.data.firstname).to.eq('Arthen');
        done();
      });
  });
  it('should throw an error if user token is expired or wrong', (done) => {
    chai
      .request(server)
      .get('/api/v1/authService/users')
      .set('Authorization', `Bearer ${token}jdun`)
      .end((_err, res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq('Invalid or expired token used');
        done();
      });
  });
  it('should return single user details', (done) => {
    chai
      .request(server)
      .get('/api/v1/authService/users/1')
      .set('Authorization', `Bearer ${token}`)
      .end((_err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('User retrieved successfully');
        done();
      });
  });
  it('should throw if userId provided to get single user details does not exist in database', (done) => {
    chai
      .request(server)
      .get('/api/v1/authService/users/2')
      .set('Authorization', `Bearer ${token}`)
      .end((_err, res) => {
        expect(res.status).to.eq(404);
        expect(res.body.message).to.eq('User with provided ID does not exist');
        done();
      });
  });
  it('should return current user signed in', (done) => {
    chai
      .request(server)
      .get('/api/v1/authService/check-user')
      .set('Authorization', `Bearer ${token}`)
      .end((_err, res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq('Current user');
        done();
      });
  });
});
