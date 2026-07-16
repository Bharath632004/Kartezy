import { FraudDetectionModel } from '../../src/models/fraud-detection-model';
import { ModelType, ModelStatus, TrainingConfig } from '../../src/models/base-model';

describe('FraudDetectionModel', () => {
  let model: FraudDetectionModel;

  beforeEach(() => {
    model = new FraudDetectionModel();
  });

  test('should detect fraudulent orders', () => {
    const result = model.predict({
      transactionId: 'TXN-001', amount: 50000, userId: 'user1',
      paymentMethod: 'CRYPTO', ipAddress: '192.168.1.1',
    }, { checkType: 'order' });
    expect(result.prediction.isFraudulent).toBe(true);
    expect(result.prediction.fraudScore).toBeGreaterThan(0.7);
    expect(result.prediction.recommendedAction).toBe('BLOCK');
    expect(result.prediction.reasons.length).toBeGreaterThan(0);
  });

  test('should approve legitimate orders', () => {
    const result = model.predict({
      transactionId: 'TXN-002', amount: 500, userId: 'user2',
      paymentMethod: 'UPI', ipAddress: '10.0.0.1',
    }, { checkType: 'order' });
    expect(result.prediction.isFraudulent).toBe(false);
    expect(result.prediction.recommendedAction).toBe('APPROVE');
  });

  test('should detect account fraud', () => {
    const result = model.predict({
      transactionId: 'ACC-001', amount: 0, userId: 'suspicious_user',
      paymentMethod: '', metadata: { email: 'test12345678@fake.com' },
    }, { checkType: 'account' });
    expect(result.prediction.fraudScore).toBeGreaterThan(0);
  });

  test('should detect payment fraud', () => {
    const result = model.predict({
      transactionId: 'PAY-001', amount: 100000, userId: 'user3',
      paymentMethod: 'GIFT_CARD',
    }, { checkType: 'payment' });
    expect(result.prediction.isFraudulent).toBe(true);
    expect(result.prediction.reasons).toContain('HIGH_VALUE_TRANSACTION');
  });

  test('should detect promotion abuse', () => {
    const result = model.predict({
      transactionId: 'PROMO-001', amount: 5, userId: 'user4',
      paymentMethod: 'UPI', metadata: { couponUsageCount: 10, hasReferral: true },
    }, { checkType: 'promotion' });
    expect(result.prediction.reasons.length).toBeGreaterThan(0);
    expect(result.prediction.recommendedAction).toBe('BLOCK');
  });

  test('should train successfully', async () => {
    const config: TrainingConfig = {
      epochs: 10, learningRate: 0.001, batchSize: 32,
      validationSplit: 0.2, earlyStoppingPatience: 5,
    };
    const metrics = await model.train([], config);
    expect(metrics.accuracy).toBeGreaterThan(0.9);
    expect(metrics.f1Score).toBeGreaterThan(0.9);
  });

  test('should provide feature importance', () => {
    const importance = model.getFeatureImportance();
    expect(importance.orderVelocity).toBe(0.25);
    expect(importance.amountDeviation).toBe(0.20);
    expect(Object.values(importance).reduce((a, b) => a + b, 0)).toBeCloseTo(1.0, 1);
  });
});
