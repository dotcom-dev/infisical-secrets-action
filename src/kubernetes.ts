import * as fs from 'fs';

import { exec } from '@actions/exec';

const getObjectFromJsonFile = (
  fileName: string
): { key: string; value: string }[] => {
  const jsonString = fs.readFileSync(fileName, 'utf8');
  return JSON.parse(jsonString);
};

/**
 * Create a Kubernetes secret from a JSON file
 *
 * @param name
 * @param fileName
 * @param namespace
 */
export const createSecret = async (
  name: string,
  fileName: string,
  namespace?: string
) => {
  const jsObject = getObjectFromJsonFile(fileName);

  await exec('kubectl', [
    'create',
    'secret',
    'generic',
    name,
    ...(namespace ? [`--namespace=${namespace}`] : []),
    ...jsObject.map((item) => `--from-literal=${item.key}=${item.value}`),
  ]);
};
