import path from 'path';
import userDao from './user-dao';
import userUtility from './user-utility';
import utility from '../utility';
import dataConfig from '../../config/data.json';

/*
Check login and create token.

Response JSON Result
{token: string}

Response Code
101 : OK
201 : Wrong email
202 : Wrong password
*/
const postToken = async (email: string, pw: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`POST /user/token | email: ${email}`);

        const loginResultCode: number = await userDao.checkLogin(email, pw);

        switch(loginResultCode) {

            case 101:
                const token: string = userUtility.createToken(email, pw);

                const result = {
                    token: token
                };

                resolve(utility.result(101, 'OK', result));
                break;

            case 201:
                resolve(utility.result(201, 'Wrong email', undefined));
                break;

            case 202:
                resolve(utility.result(202, 'Wrong password', undefined));
                break;

        }

    });
};

/*
Login using token.

Response JSON Result
{access: string, email: string, name: string}

Response Code
101 : OK
*/
const get = async (user: number): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /user | user: ${user}`);

        const userDataResult: {result: boolean, access? :string, email? :string, name?: string} = await userDao.getUserData(user);

        const result = {
            access: userDataResult.access,
            email: userDataResult.email,
            name: userDataResult.name
        };

        resolve(utility.result(101, 'OK', result));

    });
};

/*
Sign up.

Response Code
101 : OK
201 : Email exists
*/
const post = async (email: string, pw: string, name: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`POST /user | email: ${email}`);

        const addUserResultCode: number = await userDao.createUser(email, pw, name);

        switch(addUserResultCode) {

            case 101:
                resolve(utility.result(101, 'OK', undefined));
                break;

            case 201:
                resolve(utility.result(101, 'Email exists', undefined));
                break;

        }

    });
};

/*
Get user data.

Response JSON Result
{name: string, image: string}

Response Code
101 : OK
201 : User does not exist
*/
const getData = async (access: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /user/data | access: ${access}`);

        const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

        // user exist check
        if(!accessResult.result || accessResult.id === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        const id = accessResult.id;

        const userDataResult: {result: boolean, email? :string, name?: string, image?: string} = await userDao.getUserData(id);

        const result = {
            name: userDataResult.name,
            image: userDataResult.image
        };

        resolve(utility.result(101, 'OK', result));

    });
};

/*
Get profile image.

Response
image file

Response Code
101 : OK
201 : User does not exist
202 : No profile image
*/
const getImage = async (access: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /user/image | access: ${access}`);

        const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

        // user exist check
        if(!accessResult.result || accessResult.id === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        const id = accessResult.id;

        const userDataResult: {result: boolean, email? :string, name?: string, image?: string} = await userDao.getUserData(id);

        const image = userDataResult.image;

        // no profile image
        if(image === null) {
            resolve(utility.result(202, 'No profile image', undefined));
            return;
        }

        resolve(utility.result(101, 'OK', path.join(__dirname, '../../../', dataConfig.imageDir, image!)));

    });
};

/*
Add profile image.

Response Code
101 : OK
*/
const postImage = async (user: number, formData: {image: object}): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`POST /user/image | user: ${user}`);

        await userDao.addProfileImage(user, formData.image);

        resolve(utility.result(101, 'OK', undefined));

    });
};

export default {
    postToken,
    get,
    post,
    getData,
    getImage,
    postImage
};
