/* eslint-disable @typescript-eslint/ban-ts-comment */
import Axios, {
  AxiosInstance, Method, AxiosResponse, RawAxiosRequestHeaders,
} from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';
import { ServiceClientException } from './exceptions/service-client.exception';
import { ERROR_MESSAGES } from 'src/constants';

export abstract class AbstractServiceClient {
  private readonly axiosClient: AxiosInstance;

  protected constructor(
    protected readonly microservice: string,
    protected readonly baseUrl: string,
    protected readonly logger: PinoLogger,
  ) {
    this.axiosClient = Axios.create({
      baseURL: this.baseUrl,
      timeout: parseInt(process.env.SERVICE_TIMEOUT, 10) || 5000,
    });
  }

  throwError(message: string, code: number, data?: unknown, isMicroservice?: boolean, payload?: unknown): ServiceClientException {
    const error = new ServiceClientException(
      this.microservice,
      message,
      code,
      data,
      isMicroservice,
      payload,
    );
    throw error;
  }

  private async getRequestId() {
    return uuidv4();
  }

  private getElapsed(start: Date): number {
    return (+new Date()) - (+start);
  }

  private async addRequestIdToHeader(headers: RawAxiosRequestHeaders): Promise<Partial<RawAxiosRequestHeaders>> {
    const requestId = await this.getRequestId();
    return {
      ...headers,
      requestId,
    };
  }

  async request(method: Method, path: string, data = {}, params = {}, headers: Partial<RawAxiosRequestHeaders> = {}): Promise<unknown> {
    const url = `${this.baseUrl}${path}`;

    const start: Date = new Date();

    headers = await this.addRequestIdToHeader(headers);

    this.logger.debug('[ServiceClientRequest]', { method, path, url, data, params, start });

    try {
      const response: AxiosResponse = await this.axiosClient({
        url,
        method,
        data,
        params,
        headers,
        validateStatus: () => true,
      });

      const elapsed: number = this.getElapsed(start);

      this.logger.info('[ServiceClientResponse]', {
        method,
        url,
        start,
        elapsed,
        response: response.data,
      });

      if (response.status >= 200 && response.status <= 299) {
        return response.data;
      }

      // @ts-ignore
      if (response.data?.code) {
        // @ts-ignore
        return this.throwError(response.data?.message, response.data.code, response.data);
      }

      const { message, code } = ERROR_MESSAGES.MICROSERVICE;
      return this.throwError(message, code, data = { ...response.data, status: response.status, statusText: response.statusText });
    }
    catch (requestError: any) {
      const elapsed: number = this.getElapsed(start);

      this.logger.error('[ServiceClientException]', {
        method,
        url,
        path,
        data,
        start,
        elapsed,
        error: requestError?.message,
      });

      return this.throwError(
        requestError.message,
        requestError.isMicroservice ? requestError.code : ERROR_MESSAGES.MICROSERVICE.code,
        requestError.data,
        false,
        { method, url, path, data },
      );
    }
  }
}
