import styles from "@/app/legal.module.css";
import { SITE_CONFIG } from "@/config/site";

export const dynamic = 'force-static';

export default function ContactUs() {
    return (
        <div className={styles.legalPage}>
            <div className="container">
                <article className={styles.legalContent}>
                    <h1 className={`${styles.legalTitle} gradient-text`}>Contact Us</h1>

                    <div className={styles.legalText}>
                        <p>We&apos;re here to help! If you have any questions, feedback, or technical issues, please reach out to us.</p>

                        <h2>Bugs, Ideas &amp; Contributions</h2>
                        <p>
                            VB Visual is open source. Found a bug or want a new visualization? Please{" "}
                            <a href={`${SITE_CONFIG.repoUrl}/issues`} target="_blank" rel="noopener noreferrer">open an issue on GitHub</a>.
                            Pull requests are welcome too, see the{" "}
                            <a href={`${SITE_CONFIG.repoUrl}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">contributing guide</a>.
                        </p>

                        <h2>Get in Touch</h2>
                        <p>For anything else, reach out via email.</p>

                        <div style={{
                            background: "rgba(139, 92, 246, 0.1)",
                            padding: "var(--spacing-lg)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid rgba(139, 92, 246, 0.2)",
                            marginTop: "var(--spacing-xl)",
                            marginBottom: "var(--spacing-xl)"
                        }}>
                            <h3 style={{ margin: 0, color: "var(--accent-purple)" }}>Support Email</h3>
                            <p style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--text-primary)", marginTop: "var(--spacing-sm)" }}>
                                <a href={`mailto:${SITE_CONFIG.contactEmail}`}>{SITE_CONFIG.contactEmail}</a>
                            </p>
                        </div>

                        <h2>Social Media</h2>
                        <p>You can also follow us and reach out on our social channels for updates and tips:</p>
                        <ul>
                            <li><strong>YouTube:</strong> <a href="https://youtube.com/@vamsibhavani" target="_blank" rel="noopener noreferrer">Vamsi Bhavani</a></li>
                            <li><strong>Instagram:</strong> <a href="https://instagram.com/vamsi_bhavani" target="_blank" rel="noopener noreferrer">vamsi_bhavani</a></li>
                            <li><strong>Twitter/X:</strong> <a href="https://twitter.com/vamsi_bhavani" target="_blank" rel="noopener noreferrer">@vamsi_bhavani</a></li>
                        </ul>
                    </div>

                    <footer className={styles.lastUpdated}>
                        We value your feedback to make VB Visual better.
                    </footer>
                </article>
            </div>
        </div>
    );
}
