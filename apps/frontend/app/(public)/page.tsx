"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Users,
  MessageSquare,
  Shield,
  Briefcase,
  GraduationCap,
  Globe,
  Zap,
  Linkedin,
  Github,
  Twitter,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import DotField from "@/components/DotField";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease },
  },
});

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-label text-accent mb-5">
      {children}
    </span>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: any;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp(index * 0.06)}
      className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-border-hover hover:bg-card-hover hover:shadow-md"
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card-hover text-accent shadow-xs transition-all duration-200 group-hover:bg-accent-subtle group-hover:border-accent/20 group-hover:shadow-sm">
        <Icon size={17} />
      </div>
      <h3 className="text-h4 font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-body-sm text-text-secondary leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export default function LandingPage() {
  const featuresRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div className="absolute inset-0 w-full h-full">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#3B82F6"
          gradientTo="#93C5FD"
          glowColor="#0F172A"
        />
      </div>

        {/* ═══ HERO ═══ */}
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-24 pb-20 overflow-hidden">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease }}
          >
            <Badge variant="accent" className="mb-8 shadow-sm">
              Built for meaningful professional connections
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease }}
            className="max-w-6xl text-center text-5xl sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6rem] font-bold tracking-[-0.03em] leading-[1.04] text-text-primary"
          >
            Connect with professionals{" "}
            <span className="text-accent">without exaggeration</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35, ease }}
            className="mt-6 max-w-xl text-center text-body text-text-secondary leading-relaxed"
          >
            A professional networking platform built for meaningful connections.
            Showcase your experience, share insights, and grow your network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45, ease }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/signup">
              <Button size="xl">
                Get started free
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="xl">
                Sign in
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease }}
            className="mt-20 flex flex-wrap justify-center gap-12 sm:gap-20"
          >
            {[
              { value: "10K+", label: "Active Users" },
              { value: "50K+", label: "Connections Made" },
              { value: "100K+", label: "Posts Shared" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-caption text-text-tertiary tracking-wide">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section
          ref={featuresRef}
          className="relative px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp()}
              className="mx-auto max-w-2xl text-center"
            >
              <SectionLabel>Features</SectionLabel>
              <h2 className="text-h1 text-text-primary">
                Everything you need to{" "}
                <span className="text-accent">grow professionally</span>
              </h2>
              <p className="mt-5 text-body text-text-secondary leading-relaxed">
                Powerful tools to build your professional identity and connect
                with the right people.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              <FeatureCard
                icon={Briefcase}
                title="Rich Profiles"
                description="Showcase your experience, education, skills, and accomplishments with beautiful profile pages."
                index={0}
              />
              <FeatureCard
                icon={MessageSquare}
                title="Engaging Posts"
                description="Share insights, articles, and media with your network. Like, comment, and engage."
                index={1}
              />
              <FeatureCard
                icon={Users}
                title="Smart Networking"
                description="Discover and connect with professionals in your field. Build relationships that matter."
                index={2}
              />
              <FeatureCard
                icon={GraduationCap}
                title="Career Timeline"
                description="Visualize your career journey with an elegant timeline of your work and education."
                index={3}
              />
              <FeatureCard
                icon={Shield}
                title="Privacy First"
                description="Full control over your profile visibility and connection preferences."
                index={4}
              />
              <FeatureCard
                icon={Globe}
                title="Global Community"
                description="Connect with professionals from around the world. Expand your horizons."
                index={5}
              />
            </motion.div>
          </div>
        </section>

        {/* ═══ WHY CHOOSE ═══ */}
        <section className="relative px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp()}
              >
                <SectionLabel>Why LinkedOut</SectionLabel>
                <h2 className="text-h1 text-text-primary">
                  Built different.
                </h2>
                <p className="mt-5 text-body text-text-secondary leading-relaxed">
                  Unlike traditional professional networks cluttered with noise
                  and distractions, LinkedOut focuses on what matters —
                  authentic connections and meaningful professional growth.
                </p>
                <ul className="mt-10 space-y-4">
                  {[
                    "Clean, distraction-free interface designed for focus",
                    "Direct connections — no algorithm manipulation",
                    "Privacy-respecting by design",
                    "Open source and community-driven",
                  ].map((item, i) => (
                    <motion.li
                      key={item}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp(i * 0.06)}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-subtle">
                        <Zap size={11} className="text-accent" />
                      </div>
                      <span className="text-body-sm text-text-secondary">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp(0.15)}
              >
                <div className="relative rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-lg">
                  <Quote
                    size={24}
                    className="absolute top-6 right-6 text-text-tertiary"
                  />
                    <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent-subtle ring-2 ring-border" />
                      <div>
                        <p className="text-body-sm font-semibold text-text-primary">
                          Sarah Chen
                        </p>
                        <p className="text-caption text-text-tertiary">
                          Software Engineer at Stripe
                        </p>
                      </div>
                    </div>
                    <p className="text-body text-text-secondary leading-relaxed">
                      &ldquo;LinkedOut completely changed how I think about
                      professional networking. No noise, no spam — just
                      genuine connections with people who share my
                      interests.&rdquo;
                    </p>
                    <div className="flex gap-4 text-caption text-text-tertiary border-t border-border pt-4">
                      <span>128 likes</span>
                      <span>24 comments</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp()}
            className="relative mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 sm:p-14 text-center shadow-xl"
          >
            <SectionLabel>Get started</SectionLabel>
            <h2 className="text-h1 text-text-primary">
              Ready to build your{" "}
              <span className="text-accent">professional network?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-body text-text-secondary leading-relaxed">
              Join thousands of professionals already using LinkedOut to make
              meaningful connections and advance their careers.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="xl">
                  Get started free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" size="xl">
                  Sign in
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
              <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-text">
                    <Linkedin size={15} />
                  </div>
                  <span className="text-body font-semibold text-text-primary">
                    LinkedOut
                  </span>
                </div>
                <p className="mt-3 max-w-sm text-body-sm text-text-tertiary leading-relaxed">
                  Connect with professionals without exaggeration. A modern,
                  open-source professional networking platform built for
                  meaningful connections.
                </p>
              </div>

              {[
                {
                  title: "Platform",
                  links: ["Features", "Pricing", "Community", "Documentation"],
                },
                { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                { title: "Legal", links: ["Privacy", "Terms", "Cookie Policy", "GDPR"] },
              ].map((group) => (
                <div key={group.title}>
                  <h3 className="text-label text-text-tertiary">{group.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-body-sm text-text-secondary hover:text-text-primary transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
              <p className="text-caption text-text-tertiary">
                &copy; {new Date().getFullYear()} LinkedOut. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                {[
                  { icon: Github, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Linkedin, href: "#", custom: true },
                ].map(({ icon: Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-tertiary transition-all duration-200 hover:border-accent/30 hover:text-accent hover:bg-accent-subtle"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}
