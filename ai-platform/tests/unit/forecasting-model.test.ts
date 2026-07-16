import { ModelManager } from '../../src/models/model-manager';
import { ForecastingModel } from '../../src/models/forecasting-model';
import { ModelType, ModelStatus, TrainingConfig } from '../../src/models/base-model';

describe('ForecastingModel', () => {
  let model: ForecastingModel;

  beforeEach(() => {
    model = new ForecastingModel();
  });

  test('should be created with correct type', () => {
    expect(model.metadata.type).toBe(ModelType.FORECASTING);
    expect(model.metadata.name).toBe('ForecastingAI');
  });

  test('should predict demand forecast', () => {
    const result = model.predict(
      { productId: 'PROD-001', storeId: 'STR-001', daysAhead: 7, includeConfidence: true }
    );
    const prediction = result.prediction as Record<string, unknown>;
    expect(prediction.forecast).toBeDefined();
    expect((prediction.forecast as unknown[]).length).toBe(7);
    expect(prediction.totalForecast).toBeGreaterThan(0);
    expect(prediction.confidence).toBeGreaterThan(0);
  });

  test('should predict inventory forecast', () => {
    const result = model.predict(
      { productId: 'PROD-001', daysAhead: 7 },
      { forecastType: 'inventory' }
    );
    const prediction = result.prediction as Record<string, unknown>;
    expect(prediction.currentStock).toBeDefined();
    expect(prediction.reorderPoint).toBeGreaterThan(0);
    expect(prediction.recommendedOrderQuantity).toBeGreaterThanOrEqual(0);
  });

  test('should predict sales forecast', () => {
    const result = model.predict(
      { productId: 'PROD-001', storeId: 'STR-001', daysAhead: 14 },
      { forecastType: 'sales' }
    );
    const prediction = result.prediction as Record<string, unknown>;
    expect(prediction.forecast).toBeDefined();
    expect((prediction.forecast as unknown[]).length).toBe(14);
    expect(prediction.trend).toBeDefined();
  });

  test('should train successfully', async () => {
    const config: TrainingConfig = {
      epochs: 10, learningRate: 0.001, batchSize: 32,
      validationSplit: 0.2, earlyStoppingPatience: 5,
    };
    const metrics = await model.train([], config);
    expect(metrics.mae).toBeGreaterThan(0);
    expect(metrics.rmse).toBeGreaterThan(0);
    expect(model.getStatus()).toBe(ModelStatus.TRAINED);
  });

  test('should provide feature importance', () => {
    const importance = model.getFeatureImportance();
    expect(importance.historicalDemand).toBe(0.35);
    expect(importance.seasonality).toBe(0.25);
  });
});
