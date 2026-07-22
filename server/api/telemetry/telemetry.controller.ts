import { Request, Response } from 'express';
import { TelemetryService } from './telemetry.service';
import { catchAsync } from '../../middleware/error_handling';

export class TelemetryController {
  static getTelemetry = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const data = TelemetryService.getTelemetry();
    res.json({ success: true, data });
  });
}
