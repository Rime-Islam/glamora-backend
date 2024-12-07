export const pickField = <T extends Record<string, unknown>, k extends keyof T>(
    obj: T,
    arr: k[]
  ): Partial<T> => {
    const finalObject: Partial<T> = {};
    for (const key of arr) {
      if (Object.hasOwnProperty.call(obj, key)) {
        finalObject[key] = obj[key];
      }
    }
    return finalObject;
  };