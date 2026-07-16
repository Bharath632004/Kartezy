import { ModelManager } from '../../src/models/model-manager';
import { RecommendationModel } from '../../src/models/recommendation-model';
import { ModelType, ModelStatus, TrainingConfig } from '../../src/models/base-model';

describe('RecommendationModel', () => {
  let modelManager: ModelManager;
  let model: RecommendationModel;

  beforeEach(() => {
    modelManager = ModelManager.getInstance();
    modelManager.clear();
    model = new RecommendationModel();
    modelManager.register(model);
  });

  test('should be created with correct type', () => {
    expect(model.metadata.type).toBe(ModelType.RECOMMENDATION);
    expect(model.metadata.name).toBe('RecommendationEngine');
    expect(model.metadata.status).toBe(ModelStatus.CREATED);
  });

  test('should train successfully', async () => {
    const config: TrainingConfig = {
      epochs: 10, learningRate: 0.001, batchSize: 32,
      validationSplit: 0.2, earlyStoppingPatience: 5,
    };
    const metrics = await model.train([], config);
    expect(metrics.accuracy).toBeGreaterThan(0);
    expect(metrics.precision).toBeGreaterThan(0);
    expect(metrics.f1Score).toBeGreaterThan(0);
    expect(model.getStatus()).toBe(ModelStatus.TRAINED);
  });

  test('should predict personalized recommendations', async () => {
    await model.train([
      { userId: 'user1', productId: 1, interactionType: 'purchase', timestamp: new Date(), weight: 1.0 },
      { userId: 'user1', productId: 2, interactionType: 'purchase', timestamp: new Date(), weight: 1.0 },
      { userId: 'user2', productId: 3, interactionType: 'purchase', timestamp: new Date(), weight: 1.0 },
    ], { epochs: 10, learningRate: 0.001, batchSize: 32, validationSplit: 0.2, earlyStoppingPatience: 5 });

    const result = model.predict(
      { userId: 'user1', interactedProductIds: [1, 2], categoryAffinities: {}, brandAffinities: {},
        priceRange: { min: 0, max: 1000 }, avgOrderValue: 0, purchaseFrequency: 0,
        favoriteCategories: [], favoriteBrands: [] },
      { limit: 5, context: 'personalized' }
    );
    expect(result.prediction).toBeDefined();
    expect(Array.isArray(result.prediction)).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.modelVersion).toBe('0.0.1');
  });

  test('should get trending products', async () => {
    await model.train([
      { userId: 'user1', productId: 1, interactionType: 'purchase', timestamp: new Date(), weight: 1.0 },
    ], { epochs: 10, learningRate: 0.001, batchSize: 32, validationSplit: 0.2, earlyStoppingPatience: 5 });

    const result = model.predict(
      { userId: 'user1', interactedProductIds: [1], categoryAffinities: {}, brandAffinities: {},
        priceRange: { min: 0, max: 1000 }, avgOrderValue: 0, purchaseFrequency: 0,
        favoriteCategories: [], favoriteBrands: [] },
      { limit: 10, context: 'trending' }
    );
    expect(result.prediction.length).toBeLessThanOrEqual(10);
    expect(result.confidence).toBeGreaterThan(0.85);
  });

  test('should handle empty interactions gracefully', async () => {
    await model.train([], { epochs: 10, learningRate: 0.001, batchSize: 32, validationSplit: 0.2, earlyStoppingPatience: 5 });

    const result = model.predict(
      { userId: 'new_user', interactedProductIds: [], categoryAffinities: {}, brandAffinities: {},
        priceRange: { min: 0, max: 0 }, avgOrderValue: 0, purchaseFrequency: 0,
        favoriteCategories: [], favoriteBrands: [] },
      { limit: 5 }
    );
    expect(Array.isArray(result.prediction)).toBe(true);
  });

  test('should get feature importance', () => {
    const importance = model.getFeatureImportance();
    expect(importance.collaborativeFiltering).toBe(0.35);
    expect(importance.contentBased).toBe(0.25);
    expect(Object.values(importance).reduce((a, b) => a + b, 0)).toBeCloseTo(1.0, 1);
  });

  test('should be deployable after training', async () => {
    await model.train([], { epochs: 10, learningRate: 0.001, batchSize: 32, validationSplit: 0.2, earlyStoppingPatience: 5 });
    const deployed = modelManager.deployModel(model.metadata.id);
    expect(deployed).toBe(true);
    expect(model.getStatus()).toBe(ModelStatus.DEPLOYED);
  });

  test('should support multiple recommendation contexts', () => {
    const contexts = ['personalized', 'similar', 'trending', 'cross_sell', 'upsell', 'festival', 'seasonal', 'continue_shopping'];
    contexts.forEach(context => {
      const result = model.predict(
        { userId: 'user1', interactedProductIds: [1, 2], categoryAffinities: {}, brandAffinities: {},
          priceRange: { min: 0, max: 1000 }, avgOrderValue: 0, purchaseFrequency: 0,
          favoriteCategories: [], favoriteBrands: [] },
        { limit: 5, context }
      );
      expect(Array.isArray(result.prediction)).toBe(true);
    });
  });
});
