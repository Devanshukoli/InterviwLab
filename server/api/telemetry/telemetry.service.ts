import { localTelemetryStore } from '../../observability';

export class TelemetryService {
  static getTelemetry() {
    return localTelemetryStore;
  }
}
