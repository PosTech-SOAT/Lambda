// cognito.service.ts

import { Injectable } from '@nestjs/common';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';

@Injectable()
export class CognitoService {
  private readonly userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_USER_POOL_ID,
      ClientId: process.env.AWS_CLIENT_ID,
    });
  }

  async createUser(
    name: string,
    username: string,
    password: string,
    email: string,
  ): Promise<void> {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
    ];

    return new Promise<void>((resolve, reject) => {
      this.userPool.signUp(
        username,
        password,
        attributeList,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(result);
            resolve();
          }
        },
      );
    });
  }

  async confirmEmail(
    username: string,
    confirmationCode: string,
  ): Promise<string> {
    const userData = {
      Username: username,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          reject(new Error('Ocorreu uma falha ao confirmar o email!'));
        }
        console.log(result);
        resolve('Email confirmado');
      });
    });
  }
}
