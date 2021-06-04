"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const axios_1 = __importDefault(require("axios"));
const common_1 = require("../../lib/common");
const const_1 = require("../../lib/const");
const ErrorObject_1 = require("../../error/ErrorObject");
const dataLoader_1 = require("../../apollo/dataLoader");
const Room_model_1 = __importDefault(require("../../models/Room.model"));
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
            const { email, password, fcmToken } = args.signInInput;
            const user = await User_model_1.default.findOne({ email: email });
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
                const roomList = await Room_model_1.default.find({ _id: { $in: user.roomIdList } });
                roomList.forEach((room) => {
                    if (room.fcmTokenList.indexOf(fcmToken) === -1) {
                        room.fcmTokenList.push(fcmToken);
                        promiseList.push(room.save());
                    }
                });
                await Promise.all(promiseList);
            }
            await user.save();
            // access token 생성함.
            const accessToken = common_1.generateJWT({
                access: true,
                my: {
                    userId: user._id,
                },
            });
            // 유저 정보 쿠키에 저장함.
            const isNodeEnvDevelopment = process.env.NODE_ENV === 'development';
            if (isNodeEnvDevelopment) {
                ctx.res.cookie('accessToken', accessToken, {
                    maxAge: const_1.COOKIE_DURATION_MILLISECONDS,
                    httpOnly: true,
                });
                ctx.res.cookie('_id', user._id.toString(), {
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
                ctx.res.cookie('_id', user._id.toString(), {
                    maxAge: const_1.COOKIE_DURATION_MILLISECONDS,
                    httpOnly: false,
                    domain: '.jongbeom.com',
                });
            }
            return user;
        },
        signInWithKakao: async (_, args, ctx) => {
            const { accessToken: kakaoAccessToken, fcmToken } = args.signInWithKakaoInput;
            // accessToken으로 kakao user 정보 가져옴.
            const { data } = await axios_1.default.get(`https://kapi.kakao.com/v2/user/me`, {
                headers: { Authorization: `Bearer ${kakaoAccessToken}` },
            });
            let user = await User_model_1.default.findOne({ kakaoId: data.id });
            if (user === null) {
                user = await new User_model_1.default({
                    nickname: data.kakao_account.profile.nickname,
                    kakaoId: data.id,
                    profileImageURL: data.kakao_account.profile.profile_image_url,
                    profileThumbnailImageURL: data.kakao_account.profile.thumbnail_image_url,
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
                const roomList = await Room_model_1.default.find({ _id: { $in: user.roomIdList } });
                roomList.forEach((room) => {
                    if (room.fcmTokenList.indexOf(fcmToken) === -1) {
                        room.fcmTokenList.push(fcmToken);
                        promiseList.push(room.save());
                    }
                });
                await Promise.all(promiseList);
            }
            await user.save();
            // access token 생성함.
            const accessToken = common_1.generateJWT({
                access: true,
                my: {
                    userId: user._id,
                },
            });
            // 유저 정보 쿠키에 저장함.
            const isNodeEnvDevelopment = process.env.NODE_ENV === 'development';
            if (isNodeEnvDevelopment) {
                ctx.res.cookie('accessToken', accessToken, {
                    maxAge: const_1.COOKIE_DURATION_MILLISECONDS,
                    httpOnly: true,
                });
                ctx.res.cookie('_id', user._id.toString(), {
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
                ctx.res.cookie('_id', user._id.toString(), {
                    maxAge: const_1.COOKIE_DURATION_MILLISECONDS,
                    httpOnly: false,
                    domain: '.jongbeom.com',
                });
            }
            return user;
        },
        signOut: async (_, args, ctx) => {
            const { _id, fcmToken } = args.signOutInput;
            ctx.res.clearCookie('accessToken');
            ctx.res.clearCookie('_id');
            const user = await User_model_1.default.findById(_id);
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
                const roomList = await Room_model_1.default.find({ _id: { $in: user.roomIdList } });
                roomList.forEach((room) => {
                    room.fcmTokenList = room.fcmTokenList.filter((ele) => ele !== fcmToken);
                    promiseList.push(room.save());
                });
                await Promise.all(promiseList);
            }
            await user.save();
            return user;
        },
        createUser: async (_, args, ctx) => {
            const { nickname, email, password } = args.createUserInput;
            const preUser = await User_model_1.default.findOne({ email });
            // 이미 존재하는 user email
            if (preUser !== null) {
                throw ErrorObject_1.existUserEmailError;
            }
            const hash = await bcrypt_1.default.hash(password, 10);
            const user = await new User_model_1.default({
                nickname,
                email,
                password: hash,
                loginType: 'host',
            }).save();
            return user;
        },
        updateUser: async (_, args, ctx) => {
            const { _id, nickname, profileImageURL, profileThumbnailImageURL } = args.updateUserInput;
            const user = await User_model_1.default.findByIdAndUpdate(_id, {
                nickname,
                profileImageURL: profileImageURL || const_1.DEFAULT_PROFILE_URL,
                profileThumbnailImageURL: profileThumbnailImageURL || const_1.DEFAULT_PROFILE_URL,
            }, { new: true });
            // 존재하지 않는 user _id임.
            if (user === null) {
                throw ErrorObject_1.invalidUserIdError;
            }
            return user;
        },
    },
};
exports.default = resolvers;
