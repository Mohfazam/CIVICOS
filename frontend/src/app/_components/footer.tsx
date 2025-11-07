"use client";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg text-foreground mb-4">CIVICOS</h3>
            <p className="text-muted-foreground text-sm">
              AI-Powered Governance Accountability Platform
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#docs" className="hover:text-foreground transition">
                  API Docs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-foreground transition">
                  About
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-foreground transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#privacy" className="hover:text-foreground transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-foreground transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-foreground transition">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CIVICOS. Made for Indian Governance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}