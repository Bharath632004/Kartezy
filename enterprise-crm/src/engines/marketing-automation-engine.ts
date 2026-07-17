/**
 * Kartezy Enterprise CRM — Marketing Automation Engine
 *
 * Event-driven marketing automation: triggers, conditions, actions,
 * multi-step workflows, customer journeys, and engagement scoring.
 */

import { createLogger } from '../utils/logger';
import { generateId, roundTo, sum } from '../utils/helpers';
import type {
  AutomationWorkflow, AutomationTrigger, AutomationCondition,
  AutomationAction, TriggerEvent, AutomationActionType, AutomationStats,
} from '../types';

const logger = createLogger('MarketingAutomationEngine');

export class MarketingAutomationEngine {
  private static instance: MarketingAutomationEngine;
  private workflows: Map<string, AutomationWorkflow> = new Map();
  private executionLog: Map<string, { workflowId: string; customerId: string; timestamp: string; result: string }> = new Map();

  static getInstance(): MarketingAutomationEngine {
    if (!MarketingAutomationEngine.instance) {
      MarketingAutomationEngine.instance = new MarketingAutomationEngine();
    }
    return MarketingAutomationEngine.instance;
  }

  initialize(): void {
    logger.info('Initializing Marketing Automation Engine');
    this.seedDefaultWorkflows();
  }

  private seedDefaultWorkflows(): void {
    // Welcome series
    this.createWorkflow({
      name: 'Welcome Series - Email',
      description: 'Send welcome email sequence to new customers',
      trigger: { event: 'CUSTOMER_SIGNED_UP', delayMinutes: 0 },
      actions: [
        { type: 'SEND_EMAIL', config: { templateId: 'welcome-1', campaignName: 'Welcome Email' }, order: 1 },
        { type: 'SEND_EMAIL', config: { templateId: 'welcome-2', campaignName: 'Follow-up' }, order: 2 },
      ],
      createdBy: 'system',
    });

    // Cart abandonment
    this.createWorkflow({
      name: 'Cart Abandonment Recovery',
      description: 'Recover abandoned carts with reminder sequence',
      trigger: { event: 'CART_ABANDONED', delayMinutes: 60 },
      conditions: [{ field: 'cartValue', operator: 'GREATER_THAN', value: 500 }],
      actions: [
        { type: 'SEND_EMAIL', config: { templateId: 'cart-reminder-1', discount: '10%' }, order: 1 },
        { type: 'SEND_PUSH', config: { title: 'Items waiting!', body: 'Your cart items are still available' }, order: 2 },
      ],
      createdBy: 'system',
    });

    // Re-engagement
    this.createWorkflow({
      name: 'Re-engagement - 30 Days Inactive',
      description: 'Re-engage customers inactive for 30 days',
      trigger: { event: 'INACTIVITY_30_DAYS', delayMinutes: 0 },
      actions: [
        { type: 'SEND_EMAIL', config: { templateId: 're-engage-1', offer: '15% off' }, order: 1 },
        { type: 'SEND_COUPON', config: { value: 15, type: 'PERCENTAGE', code: 'COMEBACK15' }, order: 2 },
      ],
      createdBy: 'system',
    });

    // Birthday
    this.createWorkflow({
      name: 'Birthday Wishes',
      description: 'Send birthday wishes with special offer',
      trigger: { event: 'BIRTHDAY', delayMinutes: 0 },
      actions: [
        { type: 'SEND_EMAIL', config: { templateId: 'birthday', offer: 'Birthday special ₹200 off' }, order: 1 },
        { type: 'SEND_SMS', config: { message: 'Happy Birthday! Enjoy ₹200 off on your next order!' }, order: 2 },
        { type: 'Award_LOYALTY_POINTS', config: { points: 200, reason: 'Birthday bonus' }, order: 3 },
      ],
      createdBy: 'system',
    });

    logger.info('Seeded default automation workflows');
  }

  createWorkflow(data: {
    name: string; description: string; trigger: AutomationTrigger;
    conditions?: AutomationCondition[]; actions: AutomationAction[];
    createdBy: string;
  }): AutomationWorkflow {
    const now = new Date().toISOString();
    const workflow: AutomationWorkflow = {
      id: generateId('AWF'),
      name: data.name,
      description: data.description,
      trigger: data.trigger,
      conditions: data.conditions || [],
      actions: data.actions,
      isActive: true,
      stats: { totalTriggered: 0, totalCompleted: 0, totalFailed: 0, totalConverted: 0 },
      createdBy: data.createdBy,
      createdAt: now,
      updatedAt: now,
    };
    this.workflows.set(workflow.id, workflow);
    logger.info(`Created automation workflow: ${workflow.name}`);
    return workflow;
  }

  getWorkflow(id: string): AutomationWorkflow | undefined {
    return this.workflows.get(id);
  }

  getActiveWorkflows(): AutomationWorkflow[] {
    return Array.from(this.workflows.values()).filter(w => w.isActive);
  }

  updateWorkflow(id: string, updates: Partial<AutomationWorkflow>): AutomationWorkflow {
    const wf = this.workflows.get(id);
    if (!wf) throw new Error(`Workflow ${id} not found`);
    Object.assign(wf, updates, { updatedAt: new Date().toISOString() });
    this.workflows.set(id, wf);
    return wf;
  }

  toggleWorkflow(id: string): AutomationWorkflow {
    const wf = this.workflows.get(id);
    if (!wf) throw new Error(`Workflow ${id} not found`);
    wf.isActive = !wf.isActive;
    wf.updatedAt = new Date().toISOString();
    this.workflows.set(id, wf);
    return wf;
  }

  // ── Execution ──

  evaluateTrigger(event: TriggerEvent, customerData: Record<string, unknown>): AutomationWorkflow[] {
    const matched: AutomationWorkflow[] = [];
    for (const wf of this.workflows.values()) {
      if (!wf.isActive) continue;
      if (wf.trigger.event !== event) continue;

      // Evaluate conditions
      const conditionsMet = wf.conditions.every(cond => {
        const fieldValue = customerData[cond.field];
        switch (cond.operator) {
          case 'EQUALS': return fieldValue === cond.value;
          case 'NOT_EQUALS': return fieldValue !== cond.value;
          case 'GREATER_THAN': return Number(fieldValue) > Number(cond.value);
          case 'LESS_THAN': return Number(fieldValue) < Number(cond.value);
          case 'CONTAINS': return String(fieldValue).includes(String(cond.value));
          case 'IN': return Array.isArray(cond.value) && cond.value.includes(fieldValue);
          case 'NOT_IN': return Array.isArray(cond.value) && !cond.value.includes(fieldValue);
      case 'BETWEEN': return cond.value &&
        Number(fieldValue) >= Number(cond.value) && Number(fieldValue) <= (Number(cond.value) * 2);
          default: return true;
        }
      });

      if (conditionsMet) {
        wf.stats.totalTriggered++;
        this.workflows.set(wf.id, wf);
        matched.push(wf);
      }
    }
    return matched;
  }

  executeWorkflow(workflowId: string, customerId: string, context: Record<string, unknown>): AutomationAction[] {
    const wf = this.workflows.get(workflowId);
    if (!wf) throw new Error(`Workflow ${workflowId} not found`);

    const executed: AutomationAction[] = [];
    for (const action of wf.actions) {
      try {
        this.executeAction(action, customerId, context);
        executed.push(action);
        wf.stats.totalCompleted++;
      } catch (error) {
        wf.stats.totalFailed++;
        logger.error(`Action ${action.type} failed for workflow ${workflowId}: ${error}`);
      }
    }

    this.executionLog.set(generateId(), {
      workflowId, customerId, timestamp: new Date().toISOString(),
      result: executed.length === wf.actions.length ? 'COMPLETED' : 'PARTIAL',
    });

    this.workflows.set(workflowId, wf);
    return executed;
  }

  private executeAction(action: AutomationAction, customerId: string, context: Record<string, unknown>): void {
    switch (action.type) {
      case 'SEND_EMAIL':
        logger.info(`[AUTOMATION] Sending email to ${customerId}: ${JSON.stringify(action.config)}`);
        break;
      case 'SEND_SMS':
        logger.info(`[AUTOMATION] Sending SMS to ${customerId}: ${JSON.stringify(action.config)}`);
        break;
      case 'SEND_WHATSAPP':
        logger.info(`[AUTOMATION] Sending WhatsApp to ${customerId}: ${JSON.stringify(action.config)}`);
        break;
      case 'SEND_PUSH':
        logger.info(`[AUTOMATION] Sending push to ${customerId}: ${JSON.stringify(action.config)}`);
        break;
      case 'SEND_COUPON':
      case 'SEND_COUPON':
        logger.info(`[AUTOMATION] Sending coupon to ${customerId}: ${JSON.stringify(action.config)}`);
        break;
      case 'Award_LOYALTY_POINTS':
        logger.info(`[AUTOMATION] Awarding points to ${customerId}: ${JSON.stringify(action.config)}`);
        break;
      case 'UPDATE_SEGMENT':
        logger.info(`[AUTOMATION] Updating segment for ${customerId}: ${JSON.stringify(action.config)}`);
        break;
      case 'ADD_TAG':
        logger.info(`[AUTOMATION] Adding tag to ${customerId}: ${JSON.stringify(action.config)}`);
        break;
      default:
        logger.info(`[AUTOMATION] Executing ${action.type} for ${customerId}`);
    }
  }

  getAutomationSummary(): {
    totalWorkflows: number; activeWorkflows: number;
    totalTriggered: number; totalCompleted: number;
    totalFailed: number; totalConverted: number;
  } {
    const all = Array.from(this.workflows.values());
    return {
      totalWorkflows: all.length,
      activeWorkflows: all.filter(w => w.isActive).length,
      totalTriggered: sum(all.map(w => w.stats.totalTriggered)),
      totalCompleted: sum(all.map(w => w.stats.totalCompleted)),
      totalFailed: sum(all.map(w => w.stats.totalFailed)),
      totalConverted: sum(all.map(w => w.stats.totalConverted)),
    };
  }

  reset(): void {
    this.workflows.clear();
    this.executionLog.clear();
  }
}

export default MarketingAutomationEngine.getInstance();
