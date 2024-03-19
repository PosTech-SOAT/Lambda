import { Injectable } from '@nestjs/common';
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import * as jwt from 'jsonwebtoken';
import { generateSecretKey } from '../utils/StringUtils';

@Injectable()
export class AuthService {
  private readonly region = process.env.AWS_REGION;
  private readonly userPoolId = process.env.AWS_USER_POOL_ID;
  private readonly clientId = process.env.AWS_CLIENT_ID;

  private readonly userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
    });
  }

  async authenticate(
    cpf: string,
    password: string,
  ): Promise<Record<string, string>> {
    const authenticationData = {
      Username: cpf,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: cpf,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise<Record<string, string>>((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({ token: result.getIdToken().getJwtToken() });
        },
        onFailure: (error) => {
          console.log(error);
          reject(new Error('Unauthorized'));
        },
      });
    });
  }
}
