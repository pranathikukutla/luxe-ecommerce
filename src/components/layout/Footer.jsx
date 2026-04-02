import { Link } from 'react-router-dom'
import { Zap, Twitter, Github, Instagram, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const links = {
    Shop: [
      { label: 'All Products', to: '/shop' },
      { label: 'Rent Items', to: '/rent' },
      { label: 'New Arrivals', to: '/shop?sort=newest' },
      { label: 'Best Sellers', to: '/shop?sort=popular' },
    ],
    Account: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'My Orders', to: '/dashboard/orders' },
      { label: 'My Rentals', to: '/dashboard/rentals' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  }

  return (
    <footer className="bg-surface-card border-t border-surface-border mt-20">
      <div className="page-wrapper py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LUX<span className="text-brand-400">E</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              AI-powered premium e-commerce and rental platform. Shop smarter, rent easier, live better.
            </p>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 123 Commerce St, Hyderabad, India</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@luxe.store</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</div>
            </div>
            <div className="flex gap-3 mt-6">
              {[Twitter, Github, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500/50 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{section}</h4>
              <ul className="space-y-2">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {year} LUXE. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Built with</span>
            <span className="text-red-400">♥</span>
            <span>using React + AI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
