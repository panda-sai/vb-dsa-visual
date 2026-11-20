import { TOPICS_CONFIG, SUBJECTS_CONFIG, TopicConfig } from '@/config/topics';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './subject.module.css';

function TopicCard({ topic, index }: { topic: TopicConfig; index: number }) {
    const isAvailable = topic.status === 'active';
    const diffClass = `badge badge-${topic.difficulty.toLowerCase()}`;

    const getIcon = (slug: string) => {
        const icons: Record<string, string> = {
            'arrays': '📊', 'strings': '🔤', 'hashing': '🔑', 'linked-lists': '🔗',
            'stacks': '📚', 'queues': '🚶‍♂️', 'trees': '🌳', 'graphs': '🕸️', 'heaps': '🏔️', 'process-scheduling': '🖥️',
            'conditionals': '🔀', 'loops': '🔄', 'functions': '⚙️', 'recursion': '🔁',
        };
        return icons[slug] || '📁';
    };

    const content = (
        <div
            className={`glass-card ${styles.topicCard} ${!isAvailable ? styles.disabled : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>{getIcon(topic.slug)}</div>
            </div>
            <h3 className={styles.cardTitle}>{topic.title}</h3>
            <div className={styles.cardFooter}>
                <span className={diffClass}>{topic.difficulty}</span>
            </div>
        </div>
    );

    return <Link href={`/${topic.slug}`} className={styles.cardLink} prefetch={false}>{content}</Link>;
}

export const dynamic = 'force-static';

export async function generateStaticParams() {
    return SUBJECTS_CONFIG.map((subject) => ({
        id: subject.id,
    }));
}

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const subject = SUBJECTS_CONFIG.find(s => s.id === id);

    if (!subject) {
        notFound();
    }

    const topics = TOPICS_CONFIG.filter(t => t.category === id && t.status === 'active');

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <Link href="/" className={styles.backLink}>← Back to Subjects</Link>
                    <div className={styles.titleRow}>
                        <span className={styles.icon}>{subject.icon}</span>
                        <h1 className={styles.title}>{subject.title}</h1>
                    </div>
                    <p className={styles.description}>{subject.description}</p>
                </div>
            </header>

            <section className={styles.topicsSection}>
                <div className="container">
                    <div className={styles.topicsGrid}>
                        {topics.map((topic, index) => (
                            <TopicCard key={topic.id} topic={topic} index={index} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
