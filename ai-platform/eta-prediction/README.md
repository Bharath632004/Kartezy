# Kartezy AI - eta-prediction

Enterprise eta-prediction module for the Kartezy AI platform.

## Overview

This module is part of the Kartezy AI Platform, providing intelligent
eta-prediction capabilities powered by machine learning.

## Architecture

Standard Spring Boot microservice within the Kartezy ecosystem.

## Building

[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Build Order:
[INFO] 
[INFO] Kartezy Backend                                                    [pom]
[INFO] shared                                                             [jar]
[INFO] config-server                                                      [jar]
[INFO] discovery-server                                                   [jar]
[INFO] api-gateway                                                        [jar]
[INFO] Cart Service                                                       [jar]
[INFO] auth-service                                                       [jar]
[INFO] user-service                                                       [jar]
[INFO] merchant-service                                                   [jar]
[INFO] catalog-service                                                    [jar]
[INFO] inventory-service                                                  [jar]
[INFO] order-service                                                      [jar]
[INFO] payment-service                                                    [jar]
[INFO] delivery-service                                                   [jar]
[INFO] notification-service                                               [jar]
[INFO] wallet-service                                                     [jar]
[INFO] search-service                                                     [jar]
[INFO] pricing-service                                                    [jar]
[INFO] promotion-service                                                  [jar]
[INFO] wishlist-service                                                   [jar]
[INFO] checkout-service                                                   [jar]
[INFO] invoice-service                                                    [jar]
[INFO] tracking-service                                                   [jar]
[INFO] review-service                                                     [jar]
[INFO] recommendation-service                                             [jar]
[INFO] analytics-service                                                  [jar]
[INFO] finance-service                                                    [jar]
[INFO] settlement-service                                                 [jar]
[INFO] support-service                                                    [jar]
[INFO] cms-service                                                        [jar]
[INFO] admin-service                                                      [jar]
[INFO] membership-service                                                 [jar]
[INFO] subscription-service                                               [jar]
[INFO] loyalty-service                                                    [jar]
[INFO] fraud-service                                                      [jar]
[INFO] report-service                                                     [jar]
[INFO] audit-service                                                      [jar]
[INFO] scheduler-service                                                  [jar]
[INFO] Kartezy Parent                                                     [pom]
[INFO] 
[INFO] --------------------< com.kartezy:kartezy-backend >---------------------
[INFO] Building Kartezy Backend 0.0.1-SNAPSHOT                           [1/39]
[INFO]   from backend\pom.xml
[INFO] --------------------------------[ pom ]---------------------------------
[INFO] 
[INFO] --- clean:3.2.0:clean (default-clean) @ kartezy-backend ---
[INFO] 
[INFO] -------------------------< com.kartezy:shared >-------------------------
[INFO] Building shared 0.0.1-SNAPSHOT                                    [2/39]
[INFO]   from backend\shared\pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- clean:3.2.0:clean (default-clean) @ shared ---
[INFO] Deleting C:\Users\chaka\Kartezy\backend\shared\target
[INFO] 
[INFO] --- resources:3.4.0:resources (default-resources) @ shared ---
[INFO] Copying 3 resources from src\main\resources to target\classes
[INFO] 
[INFO] --- compiler:3.11.0:compile (default-compile) @ shared ---
[INFO] Changes detected - recompiling the module! :source
[INFO] Compiling 67 source files with javac [debug target 21] to target\classes
[INFO] 
[INFO] --- resources:3.4.0:testResources (default-testResources) @ shared ---
[INFO] skip non existing resourceDirectory C:\Users\chaka\Kartezy\backend\shared\src\test\resources
[INFO] 
[INFO] --- compiler:3.11.0:testCompile (default-testCompile) @ shared ---
[INFO] No sources to compile
[INFO] 
[INFO] --- surefire:3.2.5:test (default-test) @ shared ---
[INFO] No tests to run.
[INFO] 
[INFO] --- jar:3.5.0:jar (default-jar) @ shared ---
[INFO] Building jar: C:\Users\chaka\Kartezy\backend\shared\target\shared-0.0.1-SNAPSHOT.jar
[INFO] 
[INFO] ---------------------< com.kartezy:config-server >----------------------
[INFO] Building config-server 0.0.1-SNAPSHOT                             [3/39]
[INFO]   from backend\config-server\pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- clean:3.2.0:clean (default-clean) @ config-server ---
[INFO] Deleting C:\Users\chaka\Kartezy\backend\config-server\target
[INFO] 
[INFO] --- resources:3.4.0:resources (default-resources) @ config-server ---
[INFO] Copying 12 resources from src\main\resources to target\classes
[INFO] 
[INFO] --- compiler:3.11.0:compile (default-compile) @ config-server ---
[INFO] Changes detected - recompiling the module! :dependency
[INFO] Compiling 2 source files with javac [debug target 21] to target\classes
[INFO] 
[INFO] --- resources:3.4.0:testResources (default-testResources) @ config-server ---
[INFO] skip non existing resourceDirectory C:\Users\chaka\Kartezy\backend\config-server\src\test\resources
[INFO] 
[INFO] --- compiler:3.11.0:testCompile (default-testCompile) @ config-server ---
[INFO] Changes detected - recompiling the module! :dependency
[INFO] Compiling 1 source file with javac [debug target 21] to target\test-classes
[INFO] 
[INFO] --- surefire:3.2.5:test (default-test) @ config-server ---
[INFO] Using auto detected provider org.apache.maven.surefire.junitplatform.JUnitPlatformProvider
[INFO] 
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.kartezy.configserver.ConfigServerApplicationTest
13:06:27.208 [main] INFO org.springframework.test.context.support.AnnotationConfigContextLoaderUtils -- Could not detect default configuration classes for test class [com.kartezy.configserver.ConfigServerApplicationTest]: ConfigServerApplicationTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
13:06:27.360 [main] INFO org.springframework.boot.test.context.SpringBootTestContextBootstrapper -- Found @SpringBootConfiguration com.kartezy.configserver.ConfigServerApplication for test class com.kartezy.configserver.ConfigServerApplicationTest
13:06:27.958 [main] ERROR org.springframework.boot.SpringApplication -- Application run failed
org.springframework.boot.context.config.InvalidConfigDataPropertyException: Property 'spring.profiles' is invalid and should be replaced with 'spring.config.activate.on-profile' [origin: System Environment Property "SPRING_PROFILES"]
	at org.springframework.boot.context.config.InvalidConfigDataPropertyException.lambda$throwIfPropertyFound$0(InvalidConfigDataPropertyException.java:113)
	at java.base/java.util.LinkedHashMap.forEach(LinkedHashMap.java:986)
	at java.base/java.util.Collections$UnmodifiableMap.forEach(Collections.java:1707)
	at org.springframework.boot.context.config.InvalidConfigDataPropertyException.throwIfPropertyFound(InvalidConfigDataPropertyException.java:109)
	at org.springframework.boot.context.config.ConfigDataEnvironment.checkForInvalidProperties(ConfigDataEnvironment.java:364)
	at org.springframework.boot.context.config.ConfigDataEnvironment.applyToEnvironment(ConfigDataEnvironment.java:328)
	at org.springframework.boot.context.config.ConfigDataEnvironment.processAndApply(ConfigDataEnvironment.java:235)
	at org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor.postProcessEnvironment(ConfigDataEnvironmentPostProcessor.java:96)
	at org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor.postProcessEnvironment(ConfigDataEnvironmentPostProcessor.java:89)
	at org.springframework.boot.env.EnvironmentPostProcessorApplicationListener.onApplicationEnvironmentPreparedEvent(EnvironmentPostProcessorApplicationListener.java:109)
	at org.springframework.boot.env.EnvironmentPostProcessorApplicationListener.onApplicationEvent(EnvironmentPostProcessorApplicationListener.java:94)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.doInvokeListener(SimpleApplicationEventMulticaster.java:185)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.invokeListener(SimpleApplicationEventMulticaster.java:178)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:156)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:138)
	at org.springframework.boot.context.event.EventPublishingRunListener.multicastInitialEvent(EventPublishingRunListener.java:136)
	at org.springframework.boot.context.event.EventPublishingRunListener.environmentPrepared(EventPublishingRunListener.java:81)
	at org.springframework.boot.SpringApplicationRunListeners.lambda$environmentPrepared$2(SpringApplicationRunListeners.java:64)
	at java.base/java.lang.Iterable.forEach(Iterable.java:75)
	at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:118)
	at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:112)
	at org.springframework.boot.SpringApplicationRunListeners.environmentPrepared(SpringApplicationRunListeners.java:63)
	at org.springframework.boot.SpringApplication.prepareEnvironment(SpringApplication.java:370)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:330)
	at org.springframework.boot.test.context.SpringBootContextLoader.lambda$loadContext$3(SpringBootContextLoader.java:137)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:58)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:46)
	at org.springframework.boot.SpringApplication.withHook(SpringApplication.java:1463)
	at org.springframework.boot.test.context.SpringBootContextLoader$ContextLoaderHook.run(SpringBootContextLoader.java:553)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:137)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:108)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:225)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:152)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:191)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:130)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:163)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$10(ClassBasedTestDescriptor.java:378)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.executeAndMaskThrowable(ClassBasedTestDescriptor.java:383)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$11(ClassBasedTestDescriptor.java:378)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.StreamSpliterators$WrappingSpliterator.forEachRemaining(StreamSpliterators.java:310)
	at java.base/java.util.stream.Streams$ConcatSpliterator.forEachRemaining(Streams.java:735)
	at java.base/java.util.stream.Streams$ConcatSpliterator.forEachRemaining(Streams.java:734)
	at java.base/java.util.stream.ReferencePipeline$Head.forEach(ReferencePipeline.java:762)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.invokeTestInstancePostProcessors(ClassBasedTestDescriptor.java:377)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$instantiateAndPostProcessTestInstance$6(ClassBasedTestDescriptor.java:290)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.instantiateAndPostProcessTestInstance(ClassBasedTestDescriptor.java:289)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$4(ClassBasedTestDescriptor.java:279)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$5(ClassBasedTestDescriptor.java:278)
	at org.junit.jupiter.engine.execution.TestInstancesProvider.getTestInstances(TestInstancesProvider.java:31)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$prepare$0(TestMethodTestDescriptor.java:106)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:105)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:69)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$prepare$2(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.prepare(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:198)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:169)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:93)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:58)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:141)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:57)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:103)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:85)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.apache.maven.surefire.junitplatform.LazyLauncher.execute(LazyLauncher.java:56)
	at org.apache.maven.surefire.junitplatform.JUnitPlatformProvider.execute(JUnitPlatformProvider.java:184)
	at org.apache.maven.surefire.junitplatform.JUnitPlatformProvider.invokeAllTests(JUnitPlatformProvider.java:148)
	at org.apache.maven.surefire.junitplatform.JUnitPlatformProvider.invoke(JUnitPlatformProvider.java:120)
	at org.apache.maven.surefire.booter.ForkedBooter.runSuitesInProcess(ForkedBooter.java:385)
	at org.apache.maven.surefire.booter.ForkedBooter.execute(ForkedBooter.java:162)
	at org.apache.maven.surefire.booter.ForkedBooter.run(ForkedBooter.java:507)
	at org.apache.maven.surefire.booter.ForkedBooter.main(ForkedBooter.java:495)
13:06:27.972 [main] WARN org.springframework.test.context.TestContextManager -- Caught exception while allowing TestExecutionListener [org.springframework.test.context.web.ServletTestExecutionListener] to prepare test instance [com.kartezy.configserver.ConfigServerApplicationTest@e8fadb0]
java.lang.IllegalStateException: Failed to load ApplicationContext for [WebMergedContextConfiguration@203dd56b testClass = com.kartezy.configserver.ConfigServerApplicationTest, locations = [], classes = [com.kartezy.configserver.ConfigServerApplication], contextInitializerClasses = [], activeProfiles = ["test"], propertySourceDescriptors = [], propertySourceProperties = ["spring.cloud.bootstrap.enabled=false", "spring.cloud.config.enabled=false", "spring.cloud.config.import-check.enabled=false", "eureka.client.enabled=false", "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration", "org.springframework.boot.test.context.SpringBootTestContextBootstrapper=true"], contextCustomizers = [org.springframework.boot.test.context.filter.ExcludeFilterContextCustomizer@5f0fd5a0, org.springframework.boot.test.json.DuplicateJsonObjectContextCustomizerFactory$DuplicateJsonObjectContextCustomizer@3116c353, org.springframework.boot.test.mock.mockito.MockitoContextCustomizer@0, org.springframework.boot.test.web.client.TestRestTemplateContextCustomizer@4c012563, org.springframework.boot.test.web.reactor.netty.DisableReactorResourceFactoryGlobalResourcesContextCustomizerFactory$DisableReactorResourceFactoryGlobalResourcesContextCustomizerCustomizer@5d99c6b5, org.springframework.boot.test.autoconfigure.OnFailureConditionReportContextCustomizerFactory$OnFailureConditionReportContextCustomizer@24c4ddae, org.springframework.boot.test.autoconfigure.actuate.observability.ObservabilityContextCustomizerFactory$DisableObservabilityContextCustomizer@1f, org.springframework.boot.test.autoconfigure.properties.PropertyMappingContextCustomizer@0, org.springframework.boot.test.autoconfigure.web.servlet.WebDriverContextCustomizer@658c5a19, org.springframework.boot.test.context.SpringBootTestAnnotation@cc32a84], resourceBasePath = "src/main/webapp", contextLoader = org.springframework.boot.test.context.SpringBootContextLoader, parent = null]
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:180)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:191)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:130)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:163)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$10(ClassBasedTestDescriptor.java:378)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.executeAndMaskThrowable(ClassBasedTestDescriptor.java:383)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$invokeTestInstancePostProcessors$11(ClassBasedTestDescriptor.java:378)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.StreamSpliterators$WrappingSpliterator.forEachRemaining(StreamSpliterators.java:310)
	at java.base/java.util.stream.Streams$ConcatSpliterator.forEachRemaining(Streams.java:735)
	at java.base/java.util.stream.Streams$ConcatSpliterator.forEachRemaining(Streams.java:734)
	at java.base/java.util.stream.ReferencePipeline$Head.forEach(ReferencePipeline.java:762)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.invokeTestInstancePostProcessors(ClassBasedTestDescriptor.java:377)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$instantiateAndPostProcessTestInstance$6(ClassBasedTestDescriptor.java:290)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.instantiateAndPostProcessTestInstance(ClassBasedTestDescriptor.java:289)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$4(ClassBasedTestDescriptor.java:279)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at org.junit.jupiter.engine.descriptor.ClassBasedTestDescriptor.lambda$testInstancesProvider$5(ClassBasedTestDescriptor.java:278)
	at org.junit.jupiter.engine.execution.TestInstancesProvider.getTestInstances(TestInstancesProvider.java:31)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.lambda$prepare$0(TestMethodTestDescriptor.java:106)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:105)
	at org.junit.jupiter.engine.descriptor.TestMethodTestDescriptor.prepare(TestMethodTestDescriptor.java:69)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$prepare$2(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.prepare(NodeTestTask.java:128)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:95)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.invokeAll(SameThreadHierarchicalTestExecutorService.java:41)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$6(NodeTestTask.java:160)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$8(NodeTestTask.java:146)
	at org.junit.platform.engine.support.hierarchical.Node.around(Node.java:137)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.lambda$executeRecursively$9(NodeTestTask.java:144)
	at org.junit.platform.engine.support.hierarchical.ThrowableCollector.execute(ThrowableCollector.java:73)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.executeRecursively(NodeTestTask.java:143)
	at org.junit.platform.engine.support.hierarchical.NodeTestTask.execute(NodeTestTask.java:100)
	at org.junit.platform.engine.support.hierarchical.SameThreadHierarchicalTestExecutorService.submit(SameThreadHierarchicalTestExecutorService.java:35)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestExecutor.execute(HierarchicalTestExecutor.java:57)
	at org.junit.platform.engine.support.hierarchical.HierarchicalTestEngine.execute(HierarchicalTestEngine.java:54)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:198)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:169)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:93)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.lambda$execute$0(EngineExecutionOrchestrator.java:58)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.withInterceptedStreams(EngineExecutionOrchestrator.java:141)
	at org.junit.platform.launcher.core.EngineExecutionOrchestrator.execute(EngineExecutionOrchestrator.java:57)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:103)
	at org.junit.platform.launcher.core.DefaultLauncher.execute(DefaultLauncher.java:85)
	at org.junit.platform.launcher.core.DelegatingLauncher.execute(DelegatingLauncher.java:47)
	at org.apache.maven.surefire.junitplatform.LazyLauncher.execute(LazyLauncher.java:56)
	at org.apache.maven.surefire.junitplatform.JUnitPlatformProvider.execute(JUnitPlatformProvider.java:184)
	at org.apache.maven.surefire.junitplatform.JUnitPlatformProvider.invokeAllTests(JUnitPlatformProvider.java:148)
	at org.apache.maven.surefire.junitplatform.JUnitPlatformProvider.invoke(JUnitPlatformProvider.java:120)
	at org.apache.maven.surefire.booter.ForkedBooter.runSuitesInProcess(ForkedBooter.java:385)
	at org.apache.maven.surefire.booter.ForkedBooter.execute(ForkedBooter.java:162)
	at org.apache.maven.surefire.booter.ForkedBooter.run(ForkedBooter.java:507)
	at org.apache.maven.surefire.booter.ForkedBooter.main(ForkedBooter.java:495)
Caused by: org.springframework.boot.context.config.InvalidConfigDataPropertyException: Property 'spring.profiles' is invalid and should be replaced with 'spring.config.activate.on-profile' [origin: System Environment Property "SPRING_PROFILES"]
	at org.springframework.boot.context.config.InvalidConfigDataPropertyException.lambda$throwIfPropertyFound$0(InvalidConfigDataPropertyException.java:113)
	at java.base/java.util.LinkedHashMap.forEach(LinkedHashMap.java:986)
	at java.base/java.util.Collections$UnmodifiableMap.forEach(Collections.java:1707)
	at org.springframework.boot.context.config.InvalidConfigDataPropertyException.throwIfPropertyFound(InvalidConfigDataPropertyException.java:109)
	at org.springframework.boot.context.config.ConfigDataEnvironment.checkForInvalidProperties(ConfigDataEnvironment.java:364)
	at org.springframework.boot.context.config.ConfigDataEnvironment.applyToEnvironment(ConfigDataEnvironment.java:328)
	at org.springframework.boot.context.config.ConfigDataEnvironment.processAndApply(ConfigDataEnvironment.java:235)
	at org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor.postProcessEnvironment(ConfigDataEnvironmentPostProcessor.java:96)
	at org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor.postProcessEnvironment(ConfigDataEnvironmentPostProcessor.java:89)
	at org.springframework.boot.env.EnvironmentPostProcessorApplicationListener.onApplicationEnvironmentPreparedEvent(EnvironmentPostProcessorApplicationListener.java:109)
	at org.springframework.boot.env.EnvironmentPostProcessorApplicationListener.onApplicationEvent(EnvironmentPostProcessorApplicationListener.java:94)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.doInvokeListener(SimpleApplicationEventMulticaster.java:185)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.invokeListener(SimpleApplicationEventMulticaster.java:178)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:156)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:138)
	at org.springframework.boot.context.event.EventPublishingRunListener.multicastInitialEvent(EventPublishingRunListener.java:136)
	at org.springframework.boot.context.event.EventPublishingRunListener.environmentPrepared(EventPublishingRunListener.java:81)
	at org.springframework.boot.SpringApplicationRunListeners.lambda$environmentPrepared$2(SpringApplicationRunListeners.java:64)
	at java.base/java.lang.Iterable.forEach(Iterable.java:75)
	at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:118)
	at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:112)
	at org.springframework.boot.SpringApplicationRunListeners.environmentPrepared(SpringApplicationRunListeners.java:63)
	at org.springframework.boot.SpringApplication.prepareEnvironment(SpringApplication.java:370)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:330)
	at org.springframework.boot.test.context.SpringBootContextLoader.lambda$loadContext$3(SpringBootContextLoader.java:137)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:58)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:46)
	at org.springframework.boot.SpringApplication.withHook(SpringApplication.java:1463)
	at org.springframework.boot.test.context.SpringBootContextLoader$ContextLoaderHook.run(SpringBootContextLoader.java:553)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:137)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:108)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:225)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:152)
	... 73 common frames omitted
[ERROR] Tests run: 1, Failures: 0, Errors: 1, Skipped: 0, Time elapsed: 0.999 s <<< FAILURE! -- in com.kartezy.configserver.ConfigServerApplicationTest
[ERROR] com.kartezy.configserver.ConfigServerApplicationTest.contextLoads -- Time elapsed: 0.011 s <<< ERROR!
java.lang.IllegalStateException: Failed to load ApplicationContext for [WebMergedContextConfiguration@203dd56b testClass = com.kartezy.configserver.ConfigServerApplicationTest, locations = [], classes = [com.kartezy.configserver.ConfigServerApplication], contextInitializerClasses = [], activeProfiles = ["test"], propertySourceDescriptors = [], propertySourceProperties = ["spring.cloud.bootstrap.enabled=false", "spring.cloud.config.enabled=false", "spring.cloud.config.import-check.enabled=false", "eureka.client.enabled=false", "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration", "org.springframework.boot.test.context.SpringBootTestContextBootstrapper=true"], contextCustomizers = [org.springframework.boot.test.context.filter.ExcludeFilterContextCustomizer@5f0fd5a0, org.springframework.boot.test.json.DuplicateJsonObjectContextCustomizerFactory$DuplicateJsonObjectContextCustomizer@3116c353, org.springframework.boot.test.mock.mockito.MockitoContextCustomizer@0, org.springframework.boot.test.web.client.TestRestTemplateContextCustomizer@4c012563, org.springframework.boot.test.web.reactor.netty.DisableReactorResourceFactoryGlobalResourcesContextCustomizerFactory$DisableReactorResourceFactoryGlobalResourcesContextCustomizerCustomizer@5d99c6b5, org.springframework.boot.test.autoconfigure.OnFailureConditionReportContextCustomizerFactory$OnFailureConditionReportContextCustomizer@24c4ddae, org.springframework.boot.test.autoconfigure.actuate.observability.ObservabilityContextCustomizerFactory$DisableObservabilityContextCustomizer@1f, org.springframework.boot.test.autoconfigure.properties.PropertyMappingContextCustomizer@0, org.springframework.boot.test.autoconfigure.web.servlet.WebDriverContextCustomizer@658c5a19, org.springframework.boot.test.context.SpringBootTestAnnotation@cc32a84], resourceBasePath = "src/main/webapp", contextLoader = org.springframework.boot.test.context.SpringBootContextLoader, parent = null]
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:180)
	at org.springframework.test.context.support.DefaultTestContext.getApplicationContext(DefaultTestContext.java:130)
	at org.springframework.test.context.web.ServletTestExecutionListener.setUpRequestContextIfNecessary(ServletTestExecutionListener.java:191)
	at org.springframework.test.context.web.ServletTestExecutionListener.prepareTestInstance(ServletTestExecutionListener.java:130)
	at org.springframework.test.context.TestContextManager.prepareTestInstance(TestContextManager.java:260)
	at org.springframework.test.context.junit.jupiter.SpringExtension.postProcessTestInstance(SpringExtension.java:163)
	at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
	at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
	at java.base/java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1708)
	at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
	at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
	at java.base/java.util.stream.StreamSpliterators$WrappingSpliterator.forEachRemaining(StreamSpliterators.java:310)
	at java.base/java.util.stream.Streams$ConcatSpliterator.forEachRemaining(Streams.java:735)
	at java.base/java.util.stream.Streams$ConcatSpliterator.forEachRemaining(Streams.java:734)
	at java.base/java.util.stream.ReferencePipeline$Head.forEach(ReferencePipeline.java:762)
	at java.base/java.util.Optional.orElseGet(Optional.java:364)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
Caused by: org.springframework.boot.context.config.InvalidConfigDataPropertyException: Property 'spring.profiles' is invalid and should be replaced with 'spring.config.activate.on-profile' [origin: System Environment Property "SPRING_PROFILES"]
	at org.springframework.boot.context.config.InvalidConfigDataPropertyException.lambda$throwIfPropertyFound$0(InvalidConfigDataPropertyException.java:113)
	at java.base/java.util.LinkedHashMap.forEach(LinkedHashMap.java:986)
	at java.base/java.util.Collections$UnmodifiableMap.forEach(Collections.java:1707)
	at org.springframework.boot.context.config.InvalidConfigDataPropertyException.throwIfPropertyFound(InvalidConfigDataPropertyException.java:109)
	at org.springframework.boot.context.config.ConfigDataEnvironment.checkForInvalidProperties(ConfigDataEnvironment.java:364)
	at org.springframework.boot.context.config.ConfigDataEnvironment.applyToEnvironment(ConfigDataEnvironment.java:328)
	at org.springframework.boot.context.config.ConfigDataEnvironment.processAndApply(ConfigDataEnvironment.java:235)
	at org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor.postProcessEnvironment(ConfigDataEnvironmentPostProcessor.java:96)
	at org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor.postProcessEnvironment(ConfigDataEnvironmentPostProcessor.java:89)
	at org.springframework.boot.env.EnvironmentPostProcessorApplicationListener.onApplicationEnvironmentPreparedEvent(EnvironmentPostProcessorApplicationListener.java:109)
	at org.springframework.boot.env.EnvironmentPostProcessorApplicationListener.onApplicationEvent(EnvironmentPostProcessorApplicationListener.java:94)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.doInvokeListener(SimpleApplicationEventMulticaster.java:185)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.invokeListener(SimpleApplicationEventMulticaster.java:178)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:156)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:138)
	at org.springframework.boot.context.event.EventPublishingRunListener.multicastInitialEvent(EventPublishingRunListener.java:136)
	at org.springframework.boot.context.event.EventPublishingRunListener.environmentPrepared(EventPublishingRunListener.java:81)
	at org.springframework.boot.SpringApplicationRunListeners.lambda$environmentPrepared$2(SpringApplicationRunListeners.java:64)
	at java.base/java.lang.Iterable.forEach(Iterable.java:75)
	at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:118)
	at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:112)
	at org.springframework.boot.SpringApplicationRunListeners.environmentPrepared(SpringApplicationRunListeners.java:63)
	at org.springframework.boot.SpringApplication.prepareEnvironment(SpringApplication.java:370)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:330)
	at org.springframework.boot.test.context.SpringBootContextLoader.lambda$loadContext$3(SpringBootContextLoader.java:137)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:58)
	at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:46)
	at org.springframework.boot.SpringApplication.withHook(SpringApplication.java:1463)
	at org.springframework.boot.test.context.SpringBootContextLoader$ContextLoaderHook.run(SpringBootContextLoader.java:553)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:137)
	at org.springframework.boot.test.context.SpringBootContextLoader.loadContext(SpringBootContextLoader.java:108)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContextInternal(DefaultCacheAwareContextLoaderDelegate.java:225)
	at org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate.loadContext(DefaultCacheAwareContextLoaderDelegate.java:152)
	... 17 more

[INFO] 
[INFO] Results:
[INFO] 
[ERROR] Errors: 
[ERROR]   ConfigServerApplicationTest.contextLoads » IllegalState Failed to load ApplicationContext for [WebMergedContextConfiguration@203dd56b testClass = com.kartezy.configserver.ConfigServerApplicationTest, locations = [], classes = [com.kartezy.configserver.ConfigServerApplication], contextInitializerClasses = [], activeProfiles = ["test"], propertySourceDescriptors = [], propertySourceProperties = ["spring.cloud.bootstrap.enabled=false", "spring.cloud.config.enabled=false", "spring.cloud.config.import-check.enabled=false", "eureka.client.enabled=false", "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration", "org.springframework.boot.test.context.SpringBootTestContextBootstrapper=true"], contextCustomizers = [org.springframework.boot.test.context.filter.ExcludeFilterContextCustomizer@5f0fd5a0, org.springframework.boot.test.json.DuplicateJsonObjectContextCustomizerFactory$DuplicateJsonObjectContextCustomizer@3116c353, org.springframework.boot.test.mock.mockito.MockitoContextCustomizer@0, org.springframework.boot.test.web.client.TestRestTemplateContextCustomizer@4c012563, org.springframework.boot.test.web.reactor.netty.DisableReactorResourceFactoryGlobalResourcesContextCustomizerFactory$DisableReactorResourceFactoryGlobalResourcesContextCustomizerCustomizer@5d99c6b5, org.springframework.boot.test.autoconfigure.OnFailureConditionReportContextCustomizerFactory$OnFailureConditionReportContextCustomizer@24c4ddae, org.springframework.boot.test.autoconfigure.actuate.observability.ObservabilityContextCustomizerFactory$DisableObservabilityContextCustomizer@1f, org.springframework.boot.test.autoconfigure.properties.PropertyMappingContextCustomizer@0, org.springframework.boot.test.autoconfigure.web.servlet.WebDriverContextCustomizer@658c5a19, org.springframework.boot.test.context.SpringBootTestAnnotation@cc32a84], resourceBasePath = "src/main/webapp", contextLoader = org.springframework.boot.test.context.SpringBootContextLoader, parent = null]
[INFO] 
[ERROR] Tests run: 1, Failures: 0, Errors: 1, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary:
[INFO] 
[INFO] Kartezy Backend 0.0.1-SNAPSHOT ..................... SUCCESS [  0.202 s]
[INFO] shared 0.0.1-SNAPSHOT .............................. SUCCESS [  9.980 s]
[INFO] config-server 0.0.1-SNAPSHOT ....................... FAILURE [  7.307 s]
[INFO] discovery-server 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] api-gateway 0.0.1-SNAPSHOT ......................... SKIPPED
[INFO] Cart Service 0.0.1-SNAPSHOT ........................ SKIPPED
[INFO] auth-service 0.0.1-SNAPSHOT ........................ SKIPPED
[INFO] user-service 0.0.1-SNAPSHOT ........................ SKIPPED
[INFO] merchant-service 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] catalog-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] inventory-service 0.0.1-SNAPSHOT ................... SKIPPED
[INFO] order-service 0.0.1-SNAPSHOT ....................... SKIPPED
[INFO] payment-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] delivery-service 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] notification-service 0.0.1-SNAPSHOT ................ SKIPPED
[INFO] wallet-service 0.0.1-SNAPSHOT ...................... SKIPPED
[INFO] search-service 0.0.1-SNAPSHOT ...................... SKIPPED
[INFO] pricing-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] promotion-service 0.0.1-SNAPSHOT ................... SKIPPED
[INFO] wishlist-service 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] checkout-service 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] invoice-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] tracking-service 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] review-service 0.0.1-SNAPSHOT ...................... SKIPPED
[INFO] recommendation-service 0.0.1-SNAPSHOT .............. SKIPPED
[INFO] analytics-service 0.0.1-SNAPSHOT ................... SKIPPED
[INFO] finance-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] settlement-service 0.0.1-SNAPSHOT .................. SKIPPED
[INFO] support-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] cms-service 0.0.1-SNAPSHOT ......................... SKIPPED
[INFO] admin-service 0.0.1-SNAPSHOT ....................... SKIPPED
[INFO] membership-service 0.0.1-SNAPSHOT .................. SKIPPED
[INFO] subscription-service 0.0.1-SNAPSHOT ................ SKIPPED
[INFO] loyalty-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] fraud-service 0.0.1-SNAPSHOT ....................... SKIPPED
[INFO] report-service 0.0.1-SNAPSHOT ...................... SKIPPED
[INFO] audit-service 0.0.1-SNAPSHOT ....................... SKIPPED
[INFO] scheduler-service 0.0.1-SNAPSHOT ................... SKIPPED
[INFO] Kartezy Parent 1.0.0 ............................... SKIPPED
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  18.335 s
[INFO] Finished at: 2026-07-24T13:06:28+05:30
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-surefire-plugin:3.2.5:test (default-test) on project config-server: 
[ERROR] 
[ERROR] Please refer to C:\Users\chaka\Kartezy\backend\config-server\target\surefire-reports for the individual test results.
[ERROR] Please refer to dump files (if any exist) [date].dump, [date]-jvmRun[N].dump and [date].dumpstream.
[ERROR] -> [Help 1]
[ERROR] 
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR] 
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoFailureException
[ERROR] 
[ERROR] After correcting the problems, you can resume the build with the command
[ERROR]   mvn <args> -rf :config-server

## Running

[INFO] Scanning for projects...
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Build Order:
[INFO] 
[INFO] Kartezy Backend                                                    [pom]
[INFO] shared                                                             [jar]
[INFO] config-server                                                      [jar]
[INFO] discovery-server                                                   [jar]
[INFO] api-gateway                                                        [jar]
[INFO] Cart Service                                                       [jar]
[INFO] auth-service                                                       [jar]
[INFO] user-service                                                       [jar]
[INFO] merchant-service                                                   [jar]
[INFO] catalog-service                                                    [jar]
[INFO] inventory-service                                                  [jar]
[INFO] order-service                                                      [jar]
[INFO] payment-service                                                    [jar]
[INFO] delivery-service                                                   [jar]
[INFO] notification-service                                               [jar]
[INFO] wallet-service                                                     [jar]
[INFO] search-service                                                     [jar]
[INFO] pricing-service                                                    [jar]
[INFO] promotion-service                                                  [jar]
[INFO] wishlist-service                                                   [jar]
[INFO] checkout-service                                                   [jar]
[INFO] invoice-service                                                    [jar]
[INFO] tracking-service                                                   [jar]
[INFO] review-service                                                     [jar]
[INFO] recommendation-service                                             [jar]
[INFO] analytics-service                                                  [jar]
[INFO] finance-service                                                    [jar]
[INFO] settlement-service                                                 [jar]
[INFO] support-service                                                    [jar]
[INFO] cms-service                                                        [jar]
[INFO] admin-service                                                      [jar]
[INFO] membership-service                                                 [jar]
[INFO] subscription-service                                               [jar]
[INFO] loyalty-service                                                    [jar]
[INFO] fraud-service                                                      [jar]
[INFO] report-service                                                     [jar]
[INFO] audit-service                                                      [jar]
[INFO] scheduler-service                                                  [jar]
[INFO] Kartezy Parent                                                     [pom]
[INFO] 
[INFO] --------------------< com.kartezy:kartezy-backend >---------------------
[INFO] Building Kartezy Backend 0.0.1-SNAPSHOT                           [1/39]
[INFO]   from backend\pom.xml
[INFO] --------------------------------[ pom ]---------------------------------
[INFO] 
[INFO] >>> spring-boot:3.2.12:run (default-cli) > test-compile @ kartezy-backend >>>
[INFO] 
[INFO] <<< spring-boot:3.2.12:run (default-cli) < test-compile @ kartezy-backend <<<
[INFO] 
[INFO] 
[INFO] --- spring-boot:3.2.12:run (default-cli) @ kartezy-backend ---
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary:
[INFO] 
[INFO] Kartezy Backend 0.0.1-SNAPSHOT ..................... FAILURE [  0.923 s]
[INFO] shared 0.0.1-SNAPSHOT .............................. SKIPPED
[INFO] config-server 0.0.1-SNAPSHOT ....................... SKIPPED
[INFO] discovery-server 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] api-gateway 0.0.1-SNAPSHOT ......................... SKIPPED
[INFO] Cart Service 0.0.1-SNAPSHOT ........................ SKIPPED
[INFO] auth-service 0.0.1-SNAPSHOT ........................ SKIPPED
[INFO] user-service 0.0.1-SNAPSHOT ........................ SKIPPED
[INFO] merchant-service 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] catalog-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] inventory-service 0.0.1-SNAPSHOT ................... SKIPPED
[INFO] order-service 0.0.1-SNAPSHOT ....................... SKIPPED
[INFO] payment-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] delivery-service 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] notification-service 0.0.1-SNAPSHOT ................ SKIPPED
[INFO] wallet-service 0.0.1-SNAPSHOT ...................... SKIPPED
[INFO] search-service 0.0.1-SNAPSHOT ...................... SKIPPED
[INFO] pricing-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] promotion-service 0.0.1-SNAPSHOT ................... SKIPPED
[INFO] wishlist-service 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] checkout-service 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] invoice-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] tracking-service 0.0.1-SNAPSHOT .................... SKIPPED
[INFO] review-service 0.0.1-SNAPSHOT ...................... SKIPPED
[INFO] recommendation-service 0.0.1-SNAPSHOT .............. SKIPPED
[INFO] analytics-service 0.0.1-SNAPSHOT ................... SKIPPED
[INFO] finance-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] settlement-service 0.0.1-SNAPSHOT .................. SKIPPED
[INFO] support-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] cms-service 0.0.1-SNAPSHOT ......................... SKIPPED
[INFO] admin-service 0.0.1-SNAPSHOT ....................... SKIPPED
[INFO] membership-service 0.0.1-SNAPSHOT .................. SKIPPED
[INFO] subscription-service 0.0.1-SNAPSHOT ................ SKIPPED
[INFO] loyalty-service 0.0.1-SNAPSHOT ..................... SKIPPED
[INFO] fraud-service 0.0.1-SNAPSHOT ....................... SKIPPED
[INFO] report-service 0.0.1-SNAPSHOT ...................... SKIPPED
[INFO] audit-service 0.0.1-SNAPSHOT ....................... SKIPPED
[INFO] scheduler-service 0.0.1-SNAPSHOT ................... SKIPPED
[INFO] Kartezy Parent 1.0.0 ............................... SKIPPED
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  1.936 s
[INFO] Finished at: 2026-07-24T13:06:32+05:30
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal org.springframework.boot:spring-boot-maven-plugin:3.2.12:run (default-cli) on project kartezy-backend: Unable to find a suitable main class, please add a 'mainClass' property -> [Help 1]
[ERROR] 
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR] 
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoExecutionException
