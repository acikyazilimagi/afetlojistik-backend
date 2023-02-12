import * as util from 'util';

export const LogMe =
  () =>
  (target: object, methodName: string, descriptor: PropertyDescriptor) => {
    const className = target.constructor.name;
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const logger = this.logger;

      const log = `[${className}] ${methodName} ${util.inspect(args)}`;

      if (logger) {
        logger.debug(log);
      } else {
        // eslint-disable-next-line no-console
        console.debug(log);
      }

      return await originalMethod.apply(this, args);
    };
  };
