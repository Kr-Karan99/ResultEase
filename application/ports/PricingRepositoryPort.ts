/**
 * Pricing Repository Port
 * Interface for fetching pricing data from external sources
 * Follows Dependency Inversion Principle - application layer depends on abstraction
 */

export type PlanType = 'go' | 'premium'
export type AccountType = 'independent' | 'institute'

export interface PlanPricing {
  monthly: number
  annual: number
}

export interface PricingRepositoryPort {
  /**
   * Get pricing for a specific plan and account type
   * @param planType - The plan type (go or premium)
   * @param accountType - The account type (independent or institute)
   * @returns Promise resolving to plan pricing with monthly and annual prices
   * @throws Error if pricing data cannot be fetched
   */
  getPlanPricing(planType: PlanType, accountType: AccountType): Promise<PlanPricing>

  /**
   * Get all pricing data at once
   * Useful for caching or displaying all plans
   * @returns Promise resolving to all pricing data
   */
  getAllPricing(): Promise<Record<string, PlanPricing>>
}

