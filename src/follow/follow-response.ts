import express from 'express';
import followDao from './follow-dao';
import userDao from '../user/user-dao';
import utility from '../utility';

/*
Get user's following list.

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : User does not exist
*/
const getFollowing = async (response: express.Response, access: string) => {

    // print log
    utility.print(`GET /user/follow/ing | access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) {
        utility.sendResponse(response, 201, 'User does not exist', undefined);
        return;
    }

    const id = accessResult.id;

    const followingResult: string[] = await followDao.getFollowingList(id);

    const result = {
        user: followingResult
    };

    utility.sendResponse(response, 101, 'OK', result);

};

/*
Get user's follower list.

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : User does not exist
*/
const getFollower = async (response: express.Response, access: string) => {

    // print log
    utility.print(`GET /user/follow/er | access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) {
        utility.sendResponse(response, 201, 'User does not exist', undefined);
        return;
    }

    const id = accessResult.id;

    const followerResult: string[] = await followDao.getFollowerList(id);

    const result = {
        user: followerResult
    };

    utility.sendResponse(response, 101, 'OK', result);

};

/*
Check if following.

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{following: boolean}

Response Code
101 : OK
201 : User does not exist
*/
const getCheck = async (response: express.Response, follower: string, following: string) => {

    // print log
    utility.print(`GET /check | follower: ${follower} following: ${following}`);

    const followerAccessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(follower);
    const followingAccessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(following);

    // user exist check
    if(!followerAccessResult.result || followerAccessResult.id === undefined || !followingAccessResult.result || followingAccessResult.id === undefined) {
        utility.sendResponse(response, 201, 'User does not exist', undefined);
        return;
    }

    const followerId = followerAccessResult.id;
    const followingId = followingAccessResult.id;

    const checkResult: boolean = await followDao.checkFollowing(followerId, followingId);

    const result = {
        following: checkResult
    };

    utility.sendResponse(response, 101, 'OK', result);

};

/*
Follow other user.

Response JSON
{code: number, message: string}

Response Code
101 : OK
201 : User does not exist
*/
const post = async (response: express.Response, user: number, access: string, type: boolean) => {

    // print log
    utility.print(`POST /user/follow | user: ${user} access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) {
        utility.sendResponse(response, 201, 'User does not exist', undefined);
        return;
    }

    const id = accessResult.id;

    if(type) await followDao.follow(user, id);
    else await followDao.unFollow(user, id);

    utility.sendResponse(response, 101, 'OK', undefined);

};

export default {
    getFollowing,
    getFollower,
    getCheck,
    post
};
