export const LogMe =
  () =>
  (target: object, methodName: string, descriptor: PropertyDescriptor) => {
    const className = target.constructor.name;
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const logger = this.logger;

      if (logger) {
        logger.debug(`[${className}] ${methodName}`, `${JSON.stringify(args)}`);
      } else {
        console.debug(
          `[${className}] ${methodName}`,
          `${JSON.stringify(args)}`
        );
      }

      return await originalMethod.apply(this, args);
    };
  };
