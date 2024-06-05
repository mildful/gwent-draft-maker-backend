import { ErrorCode, NotFoundError } from '../shared/Errors';

export class ProviderNotFoundError extends NotFoundError {
  constructor(data: { providerName: string }) {
    super('Provider not found', ErrorCode.PROVIDER_NOT_FOUND, data);
  }
}
