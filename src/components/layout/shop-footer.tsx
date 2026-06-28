import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { FaFacebookF, FaFacebookMessenger, FaInstagram } from "react-icons/fa";

export default function ShopFooter() {
  return (
    <footer className="bg-[#0A0A0A] text-gray-400 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Newsletter Section */}
        {/* <div className="grid gap-8 border-b border-gray-800 py-12 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-2xl font-light tracking-wide text-white">
              Join the <span className="text-[#C8A46A]">DECUS WORLD</span>
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Subscribe to receive exclusive updates, early access to new
              collections, and private invitations.
            </p>
          </div>
          <form className="flex w-full max-w-md md:ml-auto">
            <input
              type="email"
              placeholder="Email address"
              className="w-full border-b border-gray-700 bg-transparent py-3 text-white placeholder-gray-600 outline-none transition-colors focus:border-[#C8A46A]"
            />
            <button
              type="submit"
              className="ml-4 flex items-center gap-2 border-b border-[#C8A46A] py-3 text-sm font-medium uppercase tracking-widest text-[#C8A46A] transition-colors hover:text-white hover:border-white"
            >
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        </div> */}

        {/* Main Footer Content */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand - Spans 4 columns on large screens */}
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-light tracking-[0.4em] text-white">
              DW
            </h2>
            <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#C8A46A]">
              Decus World
            </h3>
            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-500">
              Experience fashion beyond trends. Discover timeless collections
              designed with premium craftsmanship, refined elegance, and
              exceptional quality.
            </p>
          </div>

          {/* Quick Links - Spans 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-300">
              Explore
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "Shop", path: "/shop" },
                { name: "About Us", path: "/about" },
                { name: "Collections", path: "/collections" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="group inline-flex items-center transition-colors hover:text-[#C8A46A]"
                  >
                    <span className="mr-0 w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:w-2 group-hover:opacity-100">
                      ›
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service - Spans 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-300">
              Customer Care
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                { name: "Shipping Policy", path: "/shipping" },
                { name: "Returns & Refund", path: "/returns" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms & Conditions", path: "/terms" },
                { name: "FAQ", path: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="group inline-flex items-center transition-colors hover:text-[#C8A46A]"
                  >
                    <span className="mr-0 w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:w-2 group-hover:opacity-100">
                      ›
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Spans 4 columns */}
          <div className="lg:col-span-4">
            <h4 className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-300">
              Visit Our Boutique
            </h4>
            <div className="space-y-5 text-sm">
              <div className="flex gap-4">
                <MapPin className="mt-1 shrink-0 text-[#C8A46A]" size={18} />
                <p className="leading-7 text-gray-400">
                  Avenue-3, Road-10, House-717,
                  <br />
                  Mirpur DOHS, Dhaka, Bangladesh
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="shrink-0 text-[#C8A46A]" size={18} />
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="transition-colors hover:text-[#C8A46A]"
                >
                  +880 1XXX-XXXXXX
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="shrink-0 text-[#C8A46A]" size={18} />
                <a
                  href="mailto:info@decusworld.com"
                  className="transition-colors hover:text-[#C8A46A]"
                >
                  info@decusworld.com
                </a>
              </div>

              {/* Socials */}
              <div className="flex gap-3 pt-4">
                <Link
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all duration-300 hover:border-transparent hover:bg-[#C8A46A] hover:text-black"
                >
                  <FaFacebookF size={14} />
                </Link>
                <Link
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all duration-300 hover:border-transparent hover:bg-[#C8A46A] hover:text-black"
                >
                  <FaInstagram size={14} />
                </Link>
                <Link
                  href="https://www.facebook.com/messages/t/61586243758034/"
                  aria-label="Messenger"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all duration-300 hover:border-transparent hover:bg-[#C8A46A] hover:text-black"
                >
                  <FaFacebookMessenger size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-gray-800 py-8 text-sm text-gray-500 md:flex-row">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} DECUS WORLD. All rights reserved.
          </p>

          <p className="order-3 tracking-[0.3em] uppercase text-[#C8A46A] text-xs md:order-2">
            Experience Fashion Beyond Trends
          </p>

          {/* Placeholder Payment Methods */}
          {/* <div className="order-2 flex items-center gap-3 md:order-3">
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-400">VISA</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-400">MASTERCARD</span>
            <span className="rounded bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-400">bKASH</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
