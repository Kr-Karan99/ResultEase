/**
 * Pricing Service
 * Centralized service for accessing pricing data
 * Follows Single Responsibility Principle - single source of truth for pricing
 * Provides caching and error handling
 */

import { GetPricingUseCase } from '@/application/use-cases/GetPricingUseCase'
import { firebasePricingRepository } from '@/infrastructure/firebase/FirebasePricingRepository'
import { PlanType, AccountType, PlanPricing } from '@/application/ports/PricingRepositoryPort'

class PricingService {
  private useCase: GetPricingUseCase
  private cache: Map<string, PlanPricing> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.useCase = new GetPricingUseCase(firebasePricingRepository)
  }

  /**
   * Get cache key from plan type and account type
   */
  private getCacheKey(planType: PlanType, accountType: AccountType): string {
    return `${planType}-${accountType}`
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key)
    if (!expiry) return false
    return Date.now() < expiry
  }

  /**
   * Get pricing for a specific plan with caching
   */
  async getPlanPricing(planType: PlanType, accountType: AccountType): Promise<PlanPricing> {
    const cacheKey = this.getCacheKey(planType, accountType)

    // Check cache first
    if (this.cache.has(cacheKey) && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    // Fetch from repository
    try {
      const pricing = await this.useCase.execute(planType, accountType)
      
      // Update cache
      this.cache.set(cacheKey, pricing)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION)
      
      return pricing
    } catch (error) {
      console.error('Error fetching pricing:', error)
      throw error
    }
  }

  /**
   * Get all pricing data
   */
  async getAllPricing(): Promise<Record<string, PlanPricing>> {
    return this.useCase.getAllPricing()
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.cache.clear()
    this.cacheExpiry.clear()
  }
}

// Export singleton instance
export const pricingService = new PricingService()

