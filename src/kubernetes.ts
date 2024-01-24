import { exec } from '@actions/exec';

export const createSecret = async (
  name: string,
  fileName: string,
  namespace?: string
) => {
  await exec('kubectl', [
    'create',
    'secret',
    'generic',
    name,
    ...(namespace ? [`--namespace=${namespace}`] : []),
    `--from-env-file=${fileName}`,
  ]);
};
