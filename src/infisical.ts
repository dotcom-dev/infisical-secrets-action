import * as util from 'util';

import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as tc from '@actions/tool-cache';

import { SystemArch, SystemMap, SystemType } from './utils/SystemMap';
import { execCommand } from './utils/fs';
import { getSystemInfo } from './utils/system';

const toolName = 'infisical';
const defaultVersion = '0.16.10';
const downloadLinks = new SystemMap({
  [SystemType.Linux]: {
    [SystemArch.X64]:
      // 'https://dl.cloudsmith.io/public/infisical/infisical-cli/deb/any-distro/pool/any-version/main/i/in/infisical_%s/infisical_%s_linux_amd64.deb',
      // 'https://dl.cloudsmith.io/public/infisical/infisical-cli/deb/any-distro/pool/any-version/main/i/in/infisical_0.22.2/infisical_0.22.2_linux_arm64.deb',
      'https://github.com/Infisical/infisical/releases/download/infisical-cli v0.16.10/infisical_0.16.10_linux_amd64.deb',
  },
});

const getDownloadUrl = (version: string) => {
  const { type, arch } = getSystemInfo();

  const url = downloadLinks.get(type, arch, (url) =>
    url ? util.format(url, version, version) : undefined
  );

  if (!url) {
    throw new Error(
      `No Infisical download link found for this system (${type} ${arch})`
    );
  }

  return url;
};

/**
 * Obtain the path to the Infisical executable from cache.
 * If not found in cache, download it, install it, cache it and then return it
 *
 * @param version
 */
export const obtainInfisicalCLI = async (
  version: string = defaultVersion
): Promise<string> => {
  let cachedExecutableDirPath = tc.find(toolName, version);

  // If not found in cache, download it, install it and cache it
  if (!cachedExecutableDirPath) {
    const downloadUrl = getDownloadUrl(version);

    try {
      // Download the .deb package
      const filePath = await tc.downloadTool(downloadUrl);

      // Install the .deb package
      await exec('sudo', ['dpkg', '-i', filePath]);

      // Get the path to the executable
      const executablePath = await execCommand('which', [toolName]).then(
        (output) => output.replace(/\n$/, '')
      );

      cachedExecutableDirPath = await tc.cacheFile(
        executablePath,
        toolName,
        toolName,
        version
      );
    } catch (error) {
      console.error(`Download url is: ${downloadUrl}`);
      throw new Error(
        `Failed to download and install Infisical: "${JSON.stringify(error)}"`
      );
    }
  }

  // Add the cached executable directory to the PATH so that it can be found
  core.addPath(cachedExecutableDirPath);

  return toolName;
};

export class Infisical {
  private readonly executablePath: string;

  private constructor(executablePath: string) {
    this.executablePath = executablePath;
  }

  public static async create(
    version: string = defaultVersion
  ): Promise<Infisical> {
    const executablePath = await obtainInfisicalCLI(version);
    return new Infisical(executablePath);
  }

  public async exec(args: string[]): Promise<string> {
    return execCommand(this.executablePath, args);
  }
}
