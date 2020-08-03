class ConfigError extends Error {
  constructor(cause: Error | string) {
    super(cause instanceof Error ? cause.message : cause);
  }
}

export default ConfigError;
