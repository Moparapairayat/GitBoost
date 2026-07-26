"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Is GitBoost a star exchange platform?",
    a: "No. GitBoost is strictly a developer community platform for discovering projects and receiving genuine feedback. Every GitHub interaction (starring, following, forking) is always done manually by you. We never automate anything on GitHub.",
  },
  {
    q: "How does the trending algorithm work?",
    a: "Projects trend based on genuine community engagement: views, reviews, helpful votes on reviews, and comments — all weighted and combined with a recency decay factor to keep the feed fresh. GitHub stars are not a primary ranking signal.",
  },
  {
    q: "What does GitBoost access on my GitHub account?",
    a: "We request only read:user and user:email scopes — your public GitHub profile data and email. We never request write permissions, and we never perform any GitHub actions on your behalf.",
  },
  {
    q: "Can I submit private repositories?",
    a: "No. GitBoost is for public, open-source repositories only. The platform is designed to help developers gain visibility for their open-source work.",
  },
  {
    q: "How are reviews moderated?",
    a: "Each developer can leave one review per repository. Community members can flag reviews as helpful or unhelpful. Admins review reported content. All reviews must be genuine — fake or spam reviews are removed and may result in account suspension.",
  },
  {
    q: "What is the XP and level system?",
    a: "XP is earned through genuine community participation: submitting repositories, writing reviews, leaving comments, completing daily missions, and receiving recognition from the community. It's a reputation signal, not a gaming mechanic.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan is genuinely free forever, with no credit card required. You get up to 3 repository submissions, unlimited reviews and comments, and access to all community features.",
  },
  {
    q: "How do I get my repository featured?",
    a: "Repositories can be featured manually by GitBoost admins based on quality, community reception, and originality. Pro users can also request consideration for featuring. There is no way to pay to be featured.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="faq">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "hsl(var(--primary))" }}>
              FAQ
            </p>
            <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          </motion.div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                id={`faq-${i}-btn`}
                className="w-full flex items-center justify-between px-6 py-5 text-left text-sm font-medium transition-colors hover:bg-muted/50"
              >
                <span>{faq.q}</span>
                {open === i
                  ? <Minus className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  : <Plus className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                }
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
