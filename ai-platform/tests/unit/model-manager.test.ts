import { ModelManager } from '../../src/models/model-manager';
import { BaseModel, ModelType, ModelStatus, TrainingConfig, PredictionResult, ModelMetrics } from '../../src/models/base-model';

class TestModel extends BaseModel<string, string> {
  constructor() {
    super('TestModel', ModelType.NLP, 'A test model for unit testing');
  }

  predict(input: string): PredictionResult<string> {
    return {
      prediction: `processed: ${input}`,
      confidence: 0.95,
      modelVersion: this.metadata.currentVersion,
      latencyMs: 10,
    };
  }

  async train(data: string[], config: TrainingConfig): Promise<ModelMetrics> {
    return { accuracy: 0.95, precision: 0.94, recall: 0.93, f1Score: 0.935 };
  }

  async validate(data: string[]): Promise<ModelMetrics> {
    return { accuracy: 0.90, precision: 0.89, recall: 0.88, f1Score: 0.885 };
  }

  getFeatureImportance(): Record<string, number> {
    return { feature1: 0.5, feature2: 0.3, feature3: 0.2 };
  }
}

describe('ModelManager', () => {
  let modelManager: ModelManager;
  let testModel: TestModel;

  beforeEach(() => {
    modelManager = ModelManager.getInstance();
    // Clear existing models
    modelManager.clear();
    testModel = new TestModel();
  });

  test('should register and retrieve a model', () => {
    modelManager.register(testModel);
    const retrieved = modelManager.getModel<string, string>(testModel.metadata.id);
    expect(retrieved).toBeDefined();
    expect(retrieved!.metadata.name).toBe('TestModel');
    expect(retrieved!.metadata.type).toBe(ModelType.NLP);
  });

  test('should get models by type', () => {
    modelManager.register(testModel);
    const nlpModels = modelManager.getModelsByType(ModelType.NLP);
    expect(nlpModels).toHaveLength(1);
    const recModels = modelManager.getModelsByType(ModelType.RECOMMENDATION);
    expect(recModels).toHaveLength(0);
  });

  test('should list all models', () => {
    modelManager.register(testModel);
    const models = modelManager.listModels();
    expect(models).toHaveLength(1);
    expect(models[0].name).toBe('TestModel');
  });

  test('should deploy a trained model', () => {
    modelManager.register(testModel);
    testModel.setStatus(ModelStatus.TRAINED);
    const deployed = modelManager.deployModel(testModel.metadata.id);
    expect(deployed).toBe(true);
    expect(testModel.getStatus()).toBe(ModelStatus.DEPLOYED);
  });

  test('should not deploy a non-trained model', () => {
    modelManager.register(testModel);
    // Model is CREATED, not TRAINED
    const deployed = modelManager.deployModel(testModel.metadata.id);
    expect(deployed).toBe(false);
    expect(testModel.getStatus()).not.toBe(ModelStatus.DEPLOYED);
  });

  test('should rollback model version', () => {
    modelManager.register(testModel);
    testModel.addVersion('2.0.0', { accuracy: 0.96 }, 'Improved version');
    const rolledBack = modelManager.rollbackModel(testModel.metadata.id, '0.0.1');
    expect(rolledBack).toBe(true);
    expect(testModel.metadata.currentVersion).toBe('0.0.1');
  });

  test('should unregister a model', () => {
    modelManager.register(testModel);
    const unregistered = modelManager.unregister(testModel.metadata.id);
    expect(unregistered).toBe(true);
    const models = modelManager.listModels();
    expect(models).toHaveLength(0);
  });

  test('should evaluate model', async () => {
    modelManager.register(testModel);
    const metrics = await modelManager.evaluateModel(testModel.metadata.id, ['test1', 'test2']);
    expect(metrics.accuracy).toBe(0.90);
  });

  test('should get feature importance', async () => {
    modelManager.register(testModel);
    const importance = await modelManager.getFeatureImportance(testModel.metadata.id);
    expect(importance.feature1).toBe(0.5);
    expect(importance.feature3).toBe(0.2);
  });

  test('should get status counts', () => {
    modelManager.register(testModel);
    const status = modelManager.getStatus();
    expect(status.modelCount).toBe(1);
    expect(status.deployedCount).toBe(0);
    expect(status.failedCount).toBe(0);
  });

  test('should get model by name', () => {
    modelManager.register(testModel);
    const found = modelManager.getModelByName<string, string>('TestModel');
    expect(found).toBeDefined();
    expect(found!.metadata.id).toBe(testModel.metadata.id);
  });

  test('should get model metadata', () => {
    modelManager.register(testModel);
    const metadata = modelManager.getModelMetadata(testModel.metadata.id);
    expect(metadata).toBeDefined();
    expect(metadata!.name).toBe('TestModel');
  });

  test('should clear all models', async () => {
    modelManager.register(testModel);
    await modelManager.clear();
    expect(modelManager.listModels()).toHaveLength(0);
  });
});
