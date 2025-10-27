/**
 * Feature Grid Component
 * Highlight key features and benefits
 */

'use client';

export interface Feature {
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface FeatureGridProps {
  features: Feature[];
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="py-12 bg-white dark:bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-heading-32 font-semibold tracking-tight font-serif">
            Everything you need to build
          </h2>
          <p className="mt-4 text-copy-16 text-muted-foreground">
            Multi-provider AI, tool integrations, and workflow automation in one platform.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="pt-6">
              <div className="flow-root bg-muted rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="mt-8 text-label-16 font-medium tracking-tight text-foreground">
                    {feature.name}
                  </h3>
                  <p className="mt-5 text-copy-14 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

