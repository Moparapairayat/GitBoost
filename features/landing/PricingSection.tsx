"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Zap, ArrowRight } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to get started in the open-source community.",
    features: [
      "3 repository submissions",
      "Unlimited reviews & comments",
      "Community access",
      "7-day analytics",
      "Basic profile",
      "Achievements & XP system",
    ],
    cta: "Get Started Free",
    href: "/auth/signin",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For serious developers who want to maximize their visibility and growth.",
    features: [
      "Unlimited repositories",
      "Advanced analytics (90 days)",
      "Featured profile badge",
      "Featured repository option",
      "AI-powered tools",
      "Priority support",
      "Early access to features",
    ],
    cta: "Start Pro",
    href: "/auth/signin?plan=pro",
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$29",
    period: "per month",
    description: "For agencies, startups, and organizations with multiple developers.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared analytics dashboard",
      "Organization profile page",
      "Team achievements",
      "Dedicated support",
    ],
    cta: "Start Team",
    href: "/auth/signin?plan=team",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="pricing">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "hsl(var(--primary))" }}>
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start free and upgrade as your projects and community grow.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl p-8 flex flex-col"
              style={{
                background: plan.highlighted ? "hsl(var(--primary) / 0.05)" : "hsl(var(--card))",
                border: plan.highlighted ? "2px solid hsl(var(--primary) / 0.5)" : "1px solid hsl(var(--border))",
              }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ background: "var(--gradient-brand)" }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {plan.highlighted && <Zap className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                id={`pricing-${plan.id}-btn`}
                className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                style={plan.highlighted ? {
                  background: "var(--gradient-brand)",
                  color: "white",
                } : {
                  background: "hsl(var(--muted))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
