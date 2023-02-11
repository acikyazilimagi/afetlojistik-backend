import { IntegrationDocument } from "src/integration/schemas/integration.schema";
import { DispatchDto } from "../dtos/dispatch.dto";
import { IDispatchable } from "../types/dispatch.types";

export class DispatchFormatter {
  static formatDispatch(integration: IntegrationDocument, data: IDispatchable): DispatchDto {
    
    return {} as DispatchDto;
  }
}