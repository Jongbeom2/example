"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLoadMany = exports.keyMapOneToMany = exports.keyMapOneToOne = exports.Loader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
exports.Loader = ({ model, queryField, keyMap }) => () => {
    return new dataloader_1.default(async (keyList) => {
        const uniqKeyList = [...new Set(keyList.map(String))];
        const docList = await model.find({ [queryField]: { $in: uniqKeyList } });
        return keyMap(keyList, docList, queryField);
    });
};
exports.keyMapOneToOne = (keyList, resultList, queryField = '_id') => {
    const resultListMap = {};
    resultList.forEach((result) => {
        resultListMap[result[queryField]] = result;
    });
    return keyList.map((key) => resultListMap[key]);
};
exports.keyMapOneToMany = (keyList, resultList, queryField = '_id') => {
    const resultListMap = {};
    resultList.forEach((result) => {
        if (!resultListMap[result[queryField]]) {
            resultListMap[result[queryField]] = [result];
        }
        else {
            resultListMap[result[queryField]].push(result);
        }
    });
    return keyList.map((key) => resultListMap[key] || []);
};
exports.processLoadMany = (loadManyResult) => {
    const noUndefinedResult = loadManyResult.filter((el) => el);
    const errorResultList = noUndefinedResult.flatMap((el) => (el instanceof Error ? el : []));
    const nonErrorResultList = noUndefinedResult.flatMap((el) => (el instanceof Error ? [] : el));
    if (errorResultList.length !== 0) {
        throw new Error('Error in dataLoader loadMany');
    }
    return nonErrorResultList;
};
