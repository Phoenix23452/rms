import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { LocationType } from "@/hooks/use-locations";
import Link from "next/link";

interface FooterProps {
  location?: LocationType | null;
}

const Footer = ({ location }: FooterProps) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Tasty Bites</h3>
            <p className="text-gray-300 mb-4">
              Delicious food delivered to your doorstep. Quality ingredients,
              tasty meals, and fast delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-orange-400">
                <Facebook size={18} />
              </a>
              <a href="#" className="hover:text-orange-400">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-orange-400">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/menu"
                  className="text-gray-300 hover:text-orange-400"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-orange-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-orange-400"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/customer/orders"
                  className="text-gray-300 hover:text-orange-400"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-gray-300">
              {location && location.openingHours ? (
                location.openingHours.map((hours, index) => (
                  <li key={index}>
                    {hours.day}:{" "}
                    {hours.closed ? "Closed" : `${hours.open} - ${hours.close}`}
                  </li>
                ))
              ) : (
                <>
                  <li>Monday - Friday: 9:00 AM - 10:00 PM</li>
                  <li>Saturday - Sunday: 10:00 AM - 11:00 PM</li>
                  <li>Holidays: 10:00 AM - 9:00 PM</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="text-gray-300 not-italic">
              {location ? (
                <>
                  <p>{location.name}</p>
                  <p>{location.address}</p>
                  <p className="mt-2">Email: {location.email}</p>
                  <p>Phone: {location.phone}</p>
                </>
              ) : (
                <>
                  <p>123 Main Street</p>
                  <p>New York, NY 10001</p>
                  <p className="mt-2">Email: info@tastybites.com</p>
                  <p>Phone: (123) 456-7890</p>
                </>
              )}
            </address>
          </div>
        </div>
      </div>

      {/* Single copyright section for all pages */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 This product is from wezsol.com. Created by Wezsol.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
