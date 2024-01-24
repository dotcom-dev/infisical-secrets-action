import { exec } from "@actions/exec";

export const createSecret = async (name: string, fileName: string, namespace?: string) => {
  await exec("kubectl", [
    "create",
    "secret",
    "generic",
    name,
    ...(namespace ? [`-n ${namespace}`] : []),
    `--from-env-file=${fileName}`,
  ]);
}
