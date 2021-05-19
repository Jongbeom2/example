import DataLoader from 'dataloader';

export const Loader = <V>({ model, queryField, keyMap }: any) => () => {
  return new DataLoader<string, V>(async (keyList: string[]) => {
    const uniqKeyList = [...new Set(keyList.map(String))];
    const docList: V[] = await model.find({ [queryField]: { $in: uniqKeyList } });
    return keyMap(keyList, docList, queryField);
  });
};

export const keyMapOneToOne = <T>(
  keyList: string[],
  resultList: T[],
  queryField: string = '_id',
): T[] => {
  const resultListMap: { key?: string; map?: T } = {};
  resultList.forEach((result) => {
    resultListMap[result[queryField]] = result;
  });
  return keyList.map((key) => resultListMap[key]);
};

export const keyMapOneToMany = <T>(
  keyList: string[],
  resultList: T[],
  queryField: string = '_id',
): T[][] => {
  const resultListMap: { key?: string; map?: T[] } = {};

  resultList.forEach((result) => {
    if (!resultListMap[result[queryField]]) {
      resultListMap[result[queryField]] = [result];
    } else {
      resultListMap[result[queryField]].push(result);
    }
  });

  return keyList.map((key) => resultListMap[key] || []);
};

export const processLoadMany = <T>(loadManyResult: (T | Error)[]) => {
  const noUndefinedResult = loadManyResult.filter((el) => el);
  const errorResultList = noUndefinedResult.flatMap((el) => (el instanceof Error ? el : []));
  const nonErrorResultList = noUndefinedResult.flatMap((el) => (el instanceof Error ? [] : el));
  if (errorResultList.length !== 0) {
    throw new Error('Error in dataLoader loadMany');
  }
  return nonErrorResultList;
};
