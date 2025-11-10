"use client"; // Add this directive at the top of the file

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md h-16 flex items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#1E293B]">In Loving Memory</h1>
          <div className="hidden md:flex space-x-4 items-center">
            <a href="#home" className="text-sm text-[#1E293B] hover:text-[#EC4899]">Home</a>
            <a href="#new-memorial" className="text-sm text-[#1E293B] hover:text-[#EC4899]">New Memorial</a>
            <a href="#login-register" className="text-sm text-[#1E293B] hover:text-[#EC4899]">Login/Register</a>
            {/* Search Bar */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="border border-[#FBCFE8] rounded-full px-4 py-2 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#EC4899] pr-10"
              />
              <button className="absolute inset-y-0 right-3 flex items-center text-[#EC4899] focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 18l6-6m0 0l-6-6m6 6H3" />
                </svg>
              </button>
            </div>
          </div>
          {/* Hamburger Menu */}
          <button
            className="md:hidden text-[#1E293B] focus:outline-none flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <a href="#home" className="block px-4 py-2 text-sm text-[#1E293B] hover:text-[#EC4899]">Home</a>
            <a href="#new-memorial" className="block px-4 py-2 text-sm text-[#1E293B] hover:text-[#EC4899]">New Memorial</a>
            <a href="#login-register" className="block px-4 py-2 text-sm text-[#1E293B] hover:text-[#EC4899]">Login/Register</a>
            {/* Search Bar */}
            <div className="px-4 py-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-[#FBCFE8] rounded-full px-4 py-2 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#EC4899] pr-10"
              />
              <button className="absolute inset-y-0 right-3 flex items-center text-[#EC4899] focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 18l6-6m0 0l-6-6m6 6H3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Section: What We Do */}
        <section id="info" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-[#1E293B]">What We Do</h2>
          <p className="text-lg text-[#1E293B] leading-relaxed">
            In Loving Memory is a platform dedicated to helping families and friends create, share, and remember loved ones who have passed away. 
            Create personalized memorial pages, leave tributes, and celebrate the lives of those who meant the most to you.
          </p>
        </section>

        {/* Search Bar Below "What We Do" */}
        <div className="mb-12 relative">
          <input
            type="text"
            placeholder="Search for a loved one..."
            className="w-full border border-[#FBCFE8] rounded-full px-4 py-2 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#EC4899] pr-10"
          />
          <button className="absolute inset-y-0 right-3 flex items-center text-[#EC4899] focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 18l6-6m0 0l-6-6m6 6H3" />
            </svg>
          </button>
        </div>

        {/* Section: Collection of Deceased */}
        <section id="todays-passed">
          <h2 className="text-3xl font-bold mb-6 text-[#1E293B]">Today&apos;s Passed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Cards */}
            <div className="bg-[#FDF2F8] shadow-md rounded-lg p-6">
              <div className="w-36 h-36 mx-auto overflow-hidden rounded-full">
                <Image src="/black-placeholder.jpeg" alt="Placeholder Image" width={150} height={150} className="object-cover" />
              </div>
              <h3 className="text-xl font-bold mt-4 text-center text-[#1E293B]">John Doe</h3>
              <p className="text-lg text-center text-[#1E293B]">1950 - 2025</p>
            </div>
            <div className="bg-[#FDF2F8] shadow-md rounded-lg p-6">
              <div className="w-36 h-36 mx-auto overflow-hidden rounded-full">
                <Image src="/black-placeholder.jpeg" alt="Placeholder Image" width={150} height={150} className="object-cover" />
              </div>
              <h3 className="text-xl font-bold mt-4 text-center text-[#1E293B]">Jane Smith</h3>
              <p className="text-lg text-center text-[#1E293B]">1975 - 2025</p>
            </div>
            {/* Add more cards dynamically */}
          </div>
        </section>
      </main>
    </div>
  );
}
