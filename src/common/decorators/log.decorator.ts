export const LogMe =
  () =>
  (target: any, methodName: string, descriptor: any): void => {
    const className = target.constructor.name;
    const original = descriptor.value;

    descriptor.value = new Proxy(original, {
      async apply(target, thisArg, args) {
        if (thisArg.logger !== undefined) {
          thisArg.logger.debug(
            `[${className}] ${methodName}`,
            `${JSON.stringify(args)}`,
          );
        }

        console.log(`[${className}] ${methodName}`, `${JSON.stringify(args)}`);

        return await target.apply(thisArg, args);
      },
    });
  };
