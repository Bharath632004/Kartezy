package com.kartezy.secretservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Factory for obtaining SecretsManager instances.
 * Allows for dynamic selection of secret store implementations
 * based on configuration or environment.
 */
@Component
public class SecretsManagerFactory {

    private final ApplicationContext applicationContext;

    @Autowired
    public SecretsManagerFactory(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    /**
     * Gets a SecretsManager by bean name.
     *
     * @param beanName the name of the SecretsManager bean
     * @return         the SecretsManager instance, or null if not found
     */
    public SecretsManager getSecretsManager(String beanName) {
        String[] beanNames = applicationContext.getBeanNamesForType(SecretsManager.class);
        for (String name : beanNames) {
            if (name.equals(beanName)) {
                return applicationContext.getBean(name, SecretsManager.class);
            }
        }
        return null;
    }

    /**
     * Gets all available SecretsManager beans.
     *
     * @return a map of bean names to SecretsManager instances
     */
    public Map<String, SecretsManager> getAllSecretsManagers() {
        return applicationContext.getBeansOfType(SecretsManager.class);
    }

    /**
     * Gets the primary SecretsManager bean.
     * If multiple beans exist, returns the one marked as @Primary
     * or the first one found if none is marked as primary.
     *
     * @return the primary SecretsManager instance
     */
    public SecretsManager getPrimarySecretsManager() {
        return applicationContext.getBean(SecretsManager.class);
    }
}