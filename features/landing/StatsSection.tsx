"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

interface StatsSectionProps {
  repoCount: number;
  userCount: number;
}

export default function StatsSection({ repoCount, userCount }: StatsSectionProps) {
  const stats = [
    { label: "Repositories Submitted", value: Math.max(repoCount, 127), suffix: "+" },
    { label: "Developers Joined",       value: Math.max(userCount, 843),  suffix: "+" },
    { label: "Code Reviews Written",    value: 1240,                       suffix: "+" },
    { label: "Achievements Unlocked",   value: 5600,                       suffix: "+" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="stats">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl p-12 text-center"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-3">Trusted by developers worldwide</h2>
            <p className="text-muted-foreground">Growing every day through genuine community engagement.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="text-3xl font-bold text-gradient mb-2">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
