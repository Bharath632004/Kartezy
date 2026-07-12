package com.kartezy.shared.ai;

/**
 * Generic interface for AI models.
 * @param <T> input type
 * @param <R> output type
 */
public interface AIModel<T, R> {
    /**
     * Predicts the output for the given input.
     * @param input the input data
     * @return the prediction result
     * @throws Exception if prediction fails
     */
    R predict(T input) throws Exception;
}