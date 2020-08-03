import Dotenv from 'dotenv';
import type { DotenvParseOutput } from 'dotenv';
import * as readPkg from 'read-pkg';

import ConfigError from './errors/config.error';

const { version } = readPkg.sync();

class Config {
  private config: DotenvParseOutput;

  constructor(configFilePath = './.env') {
    const loadedConfig = Config.loadConfig(configFilePath);
    this.config = { ...loadedConfig, app_version: version };
  }

  public get(property: string): string {
    return this.config[property.toUpperCase()] || this.config[property.toLowerCase()];
  }

  private static loadConfig(configFilePath: string): DotenvParseOutput {
    const loadedConfig = Dotenv.config({ path: configFilePath });

    if (loadedConfig.error) {
      throw new ConfigError(`Unable to resolve configuation. Cause: ${loadedConfig.error.message}`);
    }

    if (!loadedConfig.parsed || Object.keys(loadedConfig.parsed).length === 0) {
      throw new ConfigError('Resolved configuration is empty.');
    }

    return loadedConfig.parsed;
  }
}

export { Config };
export default new Config();
