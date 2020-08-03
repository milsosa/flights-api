import Dotenv from 'dotenv';
import type { DotenvParseOutput } from 'dotenv';

import ConfigError from './errors/config.error';

class Config {
  private config: DotenvParseOutput;

  constructor(configFilePath = './.env') {
    this.config = Config.loadConfig(configFilePath);
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
