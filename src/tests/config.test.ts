import { Config } from '../config';
import ConfigError from '../errors/config.error';

test('throws ConfigError when failed to load config', () => {
  expect(() => {
    // eslint-disable-next-line no-new
    new Config('../wrong-config-path');
  }).toThrow(ConfigError);
});

test('throws ConfigError when resolved config is empty', () => {
  expect(() => {
    // eslint-disable-next-line no-new
    new Config(`${__dirname}/fixtures/.empty-env`);
  }).toThrow(ConfigError);
});
