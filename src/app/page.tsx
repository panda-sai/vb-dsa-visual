'use client';

import Link from 'next/link';
import styles from './page.module.css';

import { TOPICS_CONFIG, SUBJECTS_CONFIG } from '@/config/topics';

interface SubjectCardProps {
  subject: {
    id: string;
    title: string;
    icon: string;
    description: string;
  };
  index: number;
}

function SubjectCard({ subject, index }: SubjectCardProps) {
  const subjectTopics = TOPICS_CONFIG.filter(t => t.category === subject.id);
  const isActive = subjectTopics.some(t => t.status === 'active');

  const content = (
    <div
      className={`glass-card ${styles.subjectCard} ${!isActive ? styles.disabled : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.subjectCardHeader}>
        <div className={styles.subjectCardIcon}>{subject.icon}</div>
        {!isActive && <span className={styles.comingSoonBadge}>Coming Soon</span>}
      </div>
      <div className={styles.subjectCardContent}>
        <h3 className={styles.subjectCardTitle}>{subject.title}</h3>
        <p className={styles.subjectCardDescription}>{subject.description}</p>
      </div>
      <div className={styles.subjectCardFooter}>
        {isActive ? (
          <span className={styles.activePill}>Explore Topics →</span>
        ) : (
          <span className={styles.inactivePill}>Under Development</span>
        )}
      </div>
    </div>
  );

  if (isActive) {
    return <Link href={`/subjects/${subject.id}`} className={styles.cardLink} prefetch={false}>{content}</Link>;
  }

  return <div className={styles.cardLink}>{content}</div>;
}

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Master <span className="gradient-text">Computer Science</span>
              <br />
              Through Visual Learning
            </h1>
            <p className={styles.heroSubtitle}>
              Interactive, step-by-step visualizations designed to make complex
              concepts intuitive.
            </p>
            <div className={styles.heroActions}>
              <Link href="/subjects/logic-building" className="btn btn-primary">
                Get Started →
              </Link>
            </div>
          </div>

          <div className={styles.floatingElements}>
            <div className={`${styles.floatingBox} ${styles.box1}`}>01</div>
            <div className={`${styles.floatingBox} ${styles.box2}`}>if</div>
            <div className={`${styles.floatingBox} ${styles.box3}`}>for</div>
            <div className={`${styles.floatingBox} ${styles.box4}`}>ptr</div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className={styles.subjectsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="gradient-text">Select a Subject</h2>
            <p>Dive deep into core CS subjects with high-quality visualizations</p>
          </div>
          <div className={styles.subjectGrid}>
            {SUBJECTS_CONFIG.map((subject, index) => (
              <SubjectCard key={subject.id} subject={subject} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Step-by-Step</h3>
              <p>Watch every operation unfold with precise animations</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💡</div>
              <h3>Interactive</h3>
              <p>Control the visualization speed and input values</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🚀</div>
              <h3>Free &amp; Open Source</h3>
              <p>Every topic is free. Contribute new visualizations on GitHub</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
