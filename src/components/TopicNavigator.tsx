'use client';

import React from 'react';
import Link from 'next/link';
import { TOPICS_CONFIG } from '@/config/topics';
import styles from './TopicNavigator.module.css';

interface TopicNavigatorProps {
    currentSlug: string;
}

const TopicNavigator: React.FC<TopicNavigatorProps> = ({ currentSlug }) => {
    // Only consider active topics for navigation
    const activeTopics = TOPICS_CONFIG.filter(t => t.status === 'active');
    const currentIndex = activeTopics.findIndex(t => t.slug === currentSlug);

    if (currentIndex === -1) return null;

    const prevTopic = currentIndex > 0 ? activeTopics[currentIndex - 1] : null;
    const nextTopic = currentIndex < activeTopics.length - 1 ? activeTopics[currentIndex + 1] : null;

    return (
        <div className={styles.navigatorContainer}>
            <div className={styles.navigatorInner}>
                {prevTopic ? (
                    <Link href={`/${prevTopic.slug}`} className={styles.navButton} prefetch={false}>
                        <span className={styles.navLabel}>← Previous Topic</span>
                        <span className={styles.navTitle}>{prevTopic.title}</span>
                    </Link>
                ) : (
                    <div className={styles.disabledSpacer} />
                )}

                {nextTopic ? (
                    <Link href={`/${nextTopic.slug}`} className={`${styles.navButton} ${styles.next}`} prefetch={false}>
                        <span className={styles.navLabel}>Next Topic →</span>
                        <span className={styles.navTitle}>{nextTopic.title}</span>
                    </Link>
                ) : (
                    <div className={styles.disabledSpacer} />
                )}
            </div>
        </div>
    );
};

export default TopicNavigator;
