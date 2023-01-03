const mapToJSON = (map: Map<any, any>): string => {
  return JSON.stringify(map, replacer);
};

const JSONtoMap = (json: string): Map<any, any> => {
  return JSON.parse(json, reviver);
};

const replacer = (_key: string, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
};

const reviver = (_key: string, value: any) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
};

export { mapToJSON, JSONtoMap };
