import { ModelManager } from '../../src/models/model-manager';
import { SearchModel } from '../../src/models/search-model';
import { ModelType, ModelStatus, TrainingConfig } from '../../src/models/base-model';

describe('SearchModel', () => {
  let model: SearchModel;

  beforeEach(() => {
    model = new SearchModel();
  });

  test('should be created with correct type', () => {
    expect(model.metadata.type).toBe(ModelType.SEARCH);
    expect(model.metadata.name).toBe('SearchAI');
  });

  test('should train successfully', async () => {
    const config: TrainingConfig = {
      epochs: 10, learningRate: 0.001, batchSize: 32,
      validationSplit: 0.2, earlyStoppingPatience: 5,
    };
    const metrics = await model.train([{
      id: '1', name: 'Test Product', description: 'Test description', category: 'Groceries',
      categoryId: '1', brand: 'TestBrand', brandId: '1', price: 100, rating: 4.5,
      popularityScore: 85, tags: ['test', 'grocery'], sku: 'TST001', imageUrl: '/test.jpg', inStock: true,
    }], config);
    expect(metrics.accuracy).toBeGreaterThan(0);
    expect(model.getStatus()).toBe(ModelStatus.TRAINED);
  });

  test('should spell correct queries', () => {
    expect(model.spellCorrect('grocries')).toBe('groceries');
    expect(model.spellCorrect('vegitable')).toBe('vegetable');
    expect(model.spellCorrect('correct word')).toBe('correct word');
  });

  test('should expand with synonyms', () => {
    const expanded = model.expandWithSynonyms('groceries');
    expect(expanded).toContain('groceries');
    expect(expanded).toContain('grocery');
    expect(expanded).toContain('food');
    expect(expanded).toContain('essentials');
  });

  test('should provide autocomplete suggestions', async () => {
    await model.train([{
      id: '1', name: 'Fresh Groceries', description: 'Fresh groceries delivery', category: 'Groceries',
      categoryId: '1', brand: 'Brand1', brandId: '1', price: 500, rating: 4.5,
      popularityScore: 90, tags: ['grocery', 'fresh'], sku: 'SKU001', imageUrl: '/img.jpg', inStock: true,
    }], { epochs: 10, learningRate: 0.001, batchSize: 32, validationSplit: 0.2, earlyStoppingPatience: 5 });
    const suggestions = model.getAutocomplete('fresh');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]).toContain('Fresh');
  });

  test('should get personalized search results', () => {
    const result = model.getPersonalizedSearchResults({
      query: 'test', page: 0, size: 10, userId: 'user1',
    });
    expect(result).toBeDefined();
    expect(result.results).toBeDefined();
  });

  test('should provide feature importance', () => {
    const importance = model.getFeatureImportance();
    expect(importance.tfidf).toBeGreaterThan(0);
    expect(importance.semanticEmbedding).toBeGreaterThan(0);
  });
});
