import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "VB Visual - Visualize Computer Science Concepts",
  description: "Visualize Computer Science Concepts through beautiful, interactive visualizations. Learn by seeing how algorithms work step by step.",
  keywords: ["Vamsi Bhavani", "Computer Science", "DSA", "Data Structures", "Algorithms", "Visualization", "Learn", "Arrays", "Linked List", "Trees", "Open Source"],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar />

        <main className="site-main">
          {children}
        </main>

        <footer className="site-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-brand">
                <p className="footer-text">
                  Made with 💜 by {SITE_CONFIG.author}
                </p>
              </div>
              <div className="footer-links">
                <div className="footer-link-group">
                  <span className="footer-link-title">Platform</span>
                  <FooterLink href="/subjects/logic-building" label="Logic Building" />
                  <FooterLink href="/subjects/data-structures" label="Data Structures" />
                </div>
                <div className="footer-link-group">
                  <span className="footer-link-title">Open Source</span>
                  <ExternalFooterLink href={SITE_CONFIG.repoUrl} label="GitHub" />
                  <ExternalFooterLink href={`${SITE_CONFIG.repoUrl}/blob/main/CONTRIBUTING.md`} label="Contribute" />
                  {SITE_CONFIG.donateUrl && (
                    <ExternalFooterLink href={SITE_CONFIG.donateUrl} label="Support the project" />
                  )}
                </div>
                <div className="footer-link-group">
                  <span className="footer-link-title">Support</span>
                  <FooterLink href="/contact" label="Contact Us" />
                  <ExternalFooterLink href={`${SITE_CONFIG.repoUrl}/issues`} label="Report an Issue" />
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Released under the MIT License.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="footer-link" prefetch={false}>
      {label}
    </Link>
  );
}

function ExternalFooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="footer-link" target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
