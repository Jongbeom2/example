"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const axios_1 = __importDefault(require("axios"));
const common_1 = require("../../lib/common");
const apple_signin_auth_1 = __importDefault(require("apple-signin-auth"));
const const_1 = require("../../lib/const");
const ErrorObject_1 = require("../../error/ErrorObject");
const dataLoader_1 = require("../../apollo/dataLoader");
const Room_model_1 = __importDefault(require("../../models/Room.model"));
const mongoose_1 = require("mongoose");
const resolvers = {
    Query: {
        getUser: async (_, args, ctx) => {
            const user = await User_model_1.default.findById(args._id);
            // _id에 해당하는 user 없음.
            if (user === null) {
                throw ErrorObject_1.invalidUserIdError;
            }
            return user;
        },
        getUserList: async (_, args, ctx) => {
            const userList = await User_model_1.default.find();
            const filteredUserList = userList.filter((user) => user._id.toString() !== args._id.toString());
            return filteredUserList;
        },
    },
    User: {
        roomList: async (parent, args, ctx) => {
            const roomList = dataLoader_1.processLoadMany(await ctx.loaders.room.byId.loadMany(parent.roomIdList));
            return roomList;
        },
    },
    Mutation: {
        signIn: async (_, args, ctx) => {
            const session = await mongoose_1.startSession();
            let user;
            try {
                await session.withTransaction(async () => {
                    const { email, password, fcmToken } = args.signInInput;
                    user = await User_model_1.default.findOne({ email: email }, {}, { session });
                    // 존재하지 않는 user email임.
                    if (user === null) {
                        throw ErrorObject_1.invalidUserEmailError;
                    }
                    const isValidPassword = await bcrypt_1.default.compare(password, user.password || '');
                    if (!isValidPassword) {
                        throw ErrorObject_1.invalidUserPasswordError;
                    }
                    // notification을 위해 fcmToken 저장함.
                    if (fcmToken) {
                        // user fcmToken
                        if (user.fcmTokenList.indexOf(fcmToken) === -1) {
                            user.fcmTokenList.push(fcmToken);
                        }
                        // room fcmToken
                        const promiseList = [];
                        const roomList = await Room_model_1.default.find({ _id: { $in: user.roomIdList } }, {}, { session });
                        roomList.forEach((room) => {
                            if (room.fcmTokenList.indexOf(fcmToken) === -1) {
                                room.fcmTokenList.push(fcmToken);
                                promiseList.push(room.save({ session }));
                            }
                        });
                        Promise.all(promiseList);
                    }
                    // 유저 정보 저장함.
                    await user.save({ session });
                    // access token 생성함.
                    const accessToken = common_1.generateJWT({
                        access: true,
                        my: {
                            userId: user._id,
                        },
                    });
                    // 유저 정보 쿠키에 저장함.
                    saveCookie(process.env.NODE_ENV === 'development', ctx, accessToken, user._id.toString());
                });
                return user;
            }
            catch (err) {
                throw err;
            }
            finally {
                await session.endSession();
            }
        },
        signInWithKakao: async (_, args, ctx) => {
            const session = await mongoose_1.startSession();
            let user;
            try {
                await session.withTransaction(async () => {
                    const { accessToken: kakaoAccessToken, fcmToken } = args.signInWithKakaoInput;
                    // accessToken으로 kakao user 정보 가져옴.
                    const { data } = await axios_1.default.get(`https://kapi.kakao.com/v2/user/me`, {
                        headers: { Authorization: `Bearer ${kakaoAccessToken}` },
                    });
                    let user = await User_model_1.default.findOne({ kakaoId: data.id }, {}, { session });
                    if (user === null) {
                        user = await new User_model_1.default({
                            // data.kakao_account를 이용하면 다양한 정보를 가져올 수 있음
                            // ex) data.kakao_account.profile.nickname
                            //     data.kakao_account.profile.profile_image_url
                            //     data.kakao_account.profile.thumbnail_image_url
                            kakaoId: data.id,
                            loginType: 'kakao',
                        });
                    }
                    // notification을 위해 fcmToken 저장함.
                    if (fcmToken) {
                        // user fcmToken
                        if (user.fcmTokenList.indexOf(fcmToken) === -1) {
                            user.fcmTokenList.push(fcmToken);
                        }
                        // room fcmToken
                        const promiseList = [];
                        const roomList = await Room_model_1.default.find({ _id: { $in: user.roomIdList } }, {}, { session });
                        roomList.forEach((room) => {
                            if (room.fcmTokenList.indexOf(fcmToken) === -1) {
                                room.fcmTokenList.push(fcmToken);
                                promiseList.push(room.save({ session }));
                            }
                        });
                        await Promise.all(promiseList);
                    }
                    await user.save({ session });
                    // access token 생성함.
                    const accessToken = common_1.generateJWT({
                        access: true,
                        my: {
                            userId: user._id,
                        },
                    });
                    // 쿠키에 유저 정보 저장함.
                    saveCookie(process.env.NODE_ENV === 'development', ctx, accessToken, user._id.toString());
                });
                return user;
            }
            catch (err) {
                await session.abortTransaction();
                throw err;
            }
            finally {
                await session.endSession();
            }
        },
        signInWithApple: async (_, args, ctx) => {
            const session = await mongoose_1.startSession();
            let user;
            try {
                await session.withTransaction(async () => {
                    const { identityToken, fcmToken } = args.signInWithAppleInput;
                    // identityToken apple user 정보 가져옴.
                    const appleIdTokenClaims = await apple_signin_auth_1.default.verifyIdToken(identityToken);
                    let user = await User_model_1.default.findOne({ appleId: appleIdTokenClaims.sub }, {}, { session });
                    if (user === null) {
                        user = await new User_model_1.default({
                            // appleIdTokenClaims을 이용하면 다양한 정보를 가져올 수 있음
                            // ex) appleIdTokenClaims.email
                            appleId: appleIdTokenClaims.sub,
                            loginType: 'apple',
                        });
                    }
                    // notification을 위해 fcmToken 저장함.
                    if (fcmToken) {
                        // user fcmToken
                        if (user.fcmTokenList.indexOf(fcmToken) === -1) {
                            user.fcmTokenList.push(fcmToken);
                        }
                        // room fcmToken
                        const promiseList = [];
                        const roomList = await Room_model_1.default.find({ _id: { $in: user.roomIdList } }, {}, { session });
                        roomList.forEach((room) => {
                            if (room.fcmTokenList.indexOf(fcmToken) === -1) {
                                room.fcmTokenList.push(fcmToken);
                                promiseList.push(room.save({ session }));
                            }
                        });
                        await Promise.all(promiseList);
                    }
                    await user.save({ session });
                    // access token 생성함.
                    const accessToken = common_1.generateJWT({
                        access: true,
                        my: {
                            userId: user._id,
                        },
                    });
                    // 쿠키에 유저 정보 저장함.
                    saveCookie(process.env.NODE_ENV === 'development', ctx, accessToken, user._id.toString());
                });
                return user;
            }
            catch (err) {
                await session.abortTransaction();
                throw err;
            }
            finally {
                await session.endSession();
            }
        },
        signOut: async (_, args, ctx) => {
            const session = await mongoose_1.startSession();
            let user;
            try {
                await session.withTransaction(async () => {
                    const { _id, fcmToken } = args.signOutInput;
                    user = await User_model_1.default.findById(_id, {}, { session });
                    // _id에 해당하는 user 없음.
                    if (user === null) {
                        throw ErrorObject_1.invalidUserIdError;
                    }
                    // notification 끄기 위해 fcmToken 삭제함.
                    if (fcmToken) {
                        // user fcmToken
                        user.fcmTokenList = user.fcmTokenList.filter((ele) => ele !== fcmToken);
                        // room fcmToken
                        const promiseList = [];
                        const roomList = await Room_model_1.default.find({ _id: { $in: user.roomIdList } }, {}, { session });
                        roomList.forEach((room) => {
                            room.fcmTokenList = room.fcmTokenList.filter((ele) => ele !== fcmToken);
                            promiseList.push(room.save({ session }));
                        });
                        Promise.all(promiseList);
                    }
                    await user.save({ session });
                    // 유저 정보 쿠키에서 삭제함.
                    ctx.res.clearCookie('accessToken');
                    ctx.res.clearCookie('_id');
                });
                return user;
            }
            catch (err) {
                throw err;
            }
            finally {
                await session.endSession();
            }
        },
        createUser: async (_, args, ctx) => {
            const { email, password } = args.createUserInput;
            const preUser = await User_model_1.default.findOne({ email });
            // 이미 존재하는 user email
            if (preUser !== null) {
                throw ErrorObject_1.existUserEmailError;
            }
            const hash = await bcrypt_1.default.hash(password, 10);
            const user = await new User_model_1.default({
                email,
                password: hash,
                loginType: 'host',
            }).save();
            return user;
        },
        updateUser: async (_, args, ctx) => {
            const session = await mongoose_1.startSession();
            let user;
            try {
                await session.withTransaction(async () => {
                    const ranNum = Math.floor(Math.random() * 6);
                    const DEFAULT_PROFILE_URL = `https://example-jb-dummy.s3.ap-northeast-2.amazonaws.com/profiles/${ranNum}.png`;
                    const { _id, nickname, profileImageURL, profileThumbnailImageURL } = args.updateUserInput;
                    user = await User_model_1.default.findByIdAndUpdate(_id, {
                        nickname,
                        profileImageURL: profileImageURL || DEFAULT_PROFILE_URL,
                        profileThumbnailImageURL: profileThumbnailImageURL || DEFAULT_PROFILE_URL,
                    }, { new: true, session });
                    // 존재하지 않는 user _id임.
                    if (user === null) {
                        throw ErrorObject_1.invalidUserIdError;
                    }
                });
                return user;
            }
            catch (err) {
                throw err;
            }
            finally {
                await session.endSession();
            }
        },
    },
};
exports.default = resolvers;
const saveCookie = (isNodeEnvDevelopment, ctx, accessToken, userId) => {
    if (isNodeEnvDevelopment) {
        ctx.res.cookie('accessToken', accessToken, {
            maxAge: const_1.COOKIE_DURATION_MILLISECONDS,
            httpOnly: true,
        });
        ctx.res.cookie('_id', userId, {
            maxAge: const_1.COOKIE_DURATION_MILLISECONDS,
            httpOnly: false,
        });
    }
    else {
        ctx.res.cookie('accessToken', accessToken, {
            maxAge: const_1.COOKIE_DURATION_MILLISECONDS,
            httpOnly: true,
            domain: '.jongbeom.com',
        });
        ctx.res.cookie('_id', userId, {
            maxAge: const_1.COOKIE_DURATION_MILLISECONDS,
            httpOnly: false,
            domain: '.jongbeom.com',
        });
    }
};
