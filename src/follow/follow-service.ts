import { User, userDAO } from '../user';
import { followDAO } from '../follow';
import * as utility from '../utility';

/*
Get user's following list.

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : User does not exist
*/
export const getFollowing = async (access: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /user/follow/ing | access: ${access}`);

            const user: User|null = await userDAO.getByAccess(access);

            // user exist check
            if(user === null) {
                resolve(utility.result(201, 'User does not exist', undefined));
                return;
            }

            const followingList: string[] = await followDAO.getFollowingList(user.id);

            const result = {
                user: followingList
            };

            resolve(utility.result(101, 'OK', result));

        } catch(error) { reject(error); }

    });
};

/*
Get user's follower list.

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : User does not exist
*/
export const getFollower = async (access: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /user/follow/er | access: ${access}`);

            const user: User|null = await userDAO.getByAccess(access);

            // user exist check
            if(user === null) {
                resolve(utility.result(201, 'User does not exist', undefined));
                return;
            }

            const followerList: string[] = await followDAO.getFollowerList(user.id);

            const result = {
                user: followerList
            };

            resolve(utility.result(101, 'OK', result));

        } catch(error) { reject(error); }

    });
};

/*
Check if following.

Response JSON Result
{following: boolean}

Response Code
101 : OK
201 : User does not exist
*/
export const getCheck = async (followerAccess: string, followingAccess: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /check | follower: ${followerAccess} following: ${followingAccess}`);

            const follower: User|null = await userDAO.getByAccess(followerAccess);
            const following: User|null = await userDAO.getByAccess(followingAccess);

            // user exist check
            if(follower === null || following === null) {
                resolve(utility.result(201, 'User does not exist', undefined));
                return;
            }

            const isFollowing: boolean = await followDAO.checkFollowing(follower.id, following.id);

            const result = {
                following: isFollowing
            };

            resolve(utility.result(101, 'OK', result));

        } catch(error) { reject(error); }

    });
};

/*
Follow other user.

Response Code
101 : OK
201 : User does not exist
*/
export const post = async (userId: number, access: string, type: boolean): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`POST /user/follow | user: ${userId} access: ${access}`);

            const user: User|null = await userDAO.getByAccess(access);

            // user exist check
            if(user === null) {
                resolve(utility.result(201, 'User does not exist', undefined));
                return;
            }

            if(type) await followDAO.follow(userId, user.id);
            else await followDAO.unFollow(userId, user.id);

            resolve(utility.result(101, 'OK', undefined));

        } catch(error) { reject(error); }

    });
};
