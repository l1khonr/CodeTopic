/**
 * Pricing Table Component
 * Beautiful pricing plans with feature comparison
 */

'use client';

import * as icons from '@radix-ui/react-icons';

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

interface PricingTableProps {
  plans: PricingPlan[];
}

export function PricingTable({ plans }: PricingTableProps) {
  return (
    <div className="py-12 bg-white dark:bg-brand-black sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-heading-32 font-bold tracking-tight font-serif">
            Pricing plans
          </h2>
          <p className="mt-4 text-copy-16 text-muted-foreground">
            Start free and scale as you grow. All plans include core features.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-x-6 lg:gap-y-0">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-lg border-2 p-8 ${
              plan.popular
                ? 'border-primary bg-muted shadow-lg'
                : 'border-border bg-white dark:bg-gray-900'
            }`}
          >
            <h3 className="text-label-18 font-semibold text-foreground">
              {plan.name}
            </h3>
            {plan.popular && (
              <span className="mt-4 inline-block rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                Popular
              </span>
            )}
            <div className="mt-4 flex items-baseline">
              <span className="text-heading-48 font-bold tracking-tight text-foreground">
                {plan.price}
              </span>
              <span className="ml-1 text-label-16 text-muted-foreground">
                /month
              </span>
            </div>
            <p className="mt-4 text-copy-14 text-muted-foreground">
              {plan.description}
            </p>

            <ul className="mt-6 flex-1 space-y-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <icons.CheckIcon className="h-6 w-6 flex-shrink-0 text-primary" />
                  <span className="ml-3 text-copy-14">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`mt-8 block w-full rounded-md border px-3 py-2 text-center text-copy-14 font-semibold ${
                plan.popular
                  ? 'border-primary-foreground bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-border bg-white text-foreground hover:bg-muted dark:bg-gray-900'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

