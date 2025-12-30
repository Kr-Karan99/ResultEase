/**
 * Firebase Pricing Repository
 * Implements PricingRepositoryPort for fetching pricing data from Firestore
 * Follows Single Responsibility Principle - only handles pricing data retrieval
 */

import { getFirestore, doc, getDoc } from 'firebase/firestore'
import firebaseApp from '@/lib/firebase'
import {
  PricingRepositoryPort,
  PlanType,
  AccountType,
  PlanPricing,
} from '@/application/ports/PricingRepositoryPort'

export class FirebasePricingRepository implements PricingRepositoryPort {
  private db = getFirestore(firebaseApp)
  private plansCollection = 'plans'

  /**
   * Generate document ID from plan type and account type
   * Format: {planType}-{accountType}
   * Example: go-independent, premium-institute
   */
  private getDocumentId(planType: PlanType, accountType: AccountType): string {
    return `${planType}-${accountType}`
  }

  /**
   * Get pricing for a specific plan and account type
   */
  async getPlanPricing(planType: PlanType, accountType: AccountType): Promise<PlanPricing> {
    try {
      const docId = this.getDocumentId(planType, accountType)
      const planDocRef = doc(this.db, this.plansCollection, docId)
      const planDoc = await getDoc(planDocRef)

      if (!planDoc.exists()) {
        throw new Error(`Pricing data not found for ${planType} ${accountType} plan`)
      }

      const data = planDoc.data()
      
      // Validate data structure
      if (typeof data.monthly !== 'number' || typeof data.annual !== 'number') {
        throw new Error(`Invalid pricing data format for ${planType} ${accountType} plan`)
      }

      return {
        monthly: data.monthly,
        annual: data.annual,
      }
    } catch (error) {
      console.error(`Error fetching pricing for ${planType} ${accountType}:`, error)
      throw new Error(
        `Failed to fetch pricing data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Get all pricing data at once
   * Fetches all plan documents from Firestore
   */
  async getAllPricing(): Promise<Record<string, PlanPricing>> {
    try {
      const planTypes: PlanType[] = ['go', 'premium']
      const accountTypes: AccountType[] = ['independent', 'institute']
      
      const pricingData: Record<string, PlanPricing> = {}

      // Fetch all combinations
      const fetchPromises = planTypes.flatMap((planType) =>
        accountTypes.map(async (accountType) => {
          const docId = this.getDocumentId(planType, accountType)
          const pricing = await this.getPlanPricing(planType, accountType)
          pricingData[docId] = pricing
        })
      )

      await Promise.all(fetchPromises)

      return pricingData
    } catch (error) {
      console.error('Error fetching all pricing data:', error)
      throw new Error(
        `Failed to fetch all pricing data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}

// Export singleton instance
export const firebasePricingRepository = new FirebasePricingRepository()

