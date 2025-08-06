"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-light-fg border-b border-light-border px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="font-bold text-lg text-brand hover:text-brand/80 transition-colors duration-150"
        >
          Bluedit
        </Link>
        <Link
          href="/b/create"
          className="text-light-text-secondary hover:text-light-text-primary transition-colors duration-150"
        >
          Create Subbluedit
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {session ? (
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 text-light-text-primary hover:text-brand transition-colors duration-150">
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-sm font-medium">
                {session.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block">{session.user?.name}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-light-fg border border-light-border rounded-md shadow-lg focus:outline-none z-50">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut()}
                        className={cn(
                          active ? 'bg-light-bg text-light-text-primary' : 'text-light-text-secondary',
                          'block w-full text-left px-4 py-2 text-sm transition-colors duration-150'
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <Link
            href="/api/auth/signin"
            className="bg-brand text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand/90 transition-colors duration-150"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export { Navbar };
