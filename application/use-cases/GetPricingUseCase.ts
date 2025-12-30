/**
 * Get Pricing Use Case
 * Business logic for retrieving pricing information
 * Follows Single Responsibility Principle - handles pricing retrieval logic
 */

import {
  PricingRepositoryPort,
  PlanType,
  AccountType,
  PlanPricing,
} from '../ports/PricingRepositoryPort'

export interface PricingPlan {
  name: string
  monthlyPrice: number
  annualPrice: number
}

export class GetPricingUseCase {
  constructor(private pricingRepository: PricingRepositoryPort) {}

  /**
   * Get pricing for a specific plan
   */
  async execute(planType: PlanType, accountType: AccountType): Promise<PlanPricing> {
    return this.pricingRepository.getPlanPricing(planType, accountType)
  }

  /**
   * Get all pricing data
   */
  async getAllPricing(): Promise<Record<string, PlanPricing>> {
    return this.pricingRepository.getAllPricing()
  }
}

