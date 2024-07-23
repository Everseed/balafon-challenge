import * as React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Icons } from './icons';

const hoverLinkStyles = 'hover:underline underline-offset-2';

export function Footer() {
  return (
    <footer className="dark:bg-black">
      <article className="container flex flex-col py-6 gap-x-8 gap-y-4 lg:flex-row lg:justify-between lg:py-4">
        <section className="flex flex-col lg:flex-row gap-x-2 gap-y-4 lg:items-center">
          <Link href={'/'} title="CodeRacer Home">
            <Icons.logo width={36} height={36} />
          </Link>
          <p>
            Built by&nbsp;
            <Link
              href=""
              target="_blank"
              title="Everseed"
              rel="noreferrer"
              className={`font-medium text-primary ${hoverLinkStyles}`}
            >
              Cody
            </Link>
            &nbsp;& his{' '}
            <Link
              href=""
              target="_blank"
              title="Everseed"
              rel="noreferrer"
              className={`font-medium text-primary ${hoverLinkStyles}`}
            >
              Discord
            </Link>{' '}
            community.
          </p>
          <p>
            The source code is available on&nbsp;
            <Link
              href=""
              target="_blank"
              rel="noreferrer"
              className={`font-medium text-primary ${hoverLinkStyles}`}
            >
              Github.
            </Link>
          </p>
        </section>

        <section
          data-name="legal-links"
          className="flex flex-row flex-wrap gap-4 text-sm lg:items-center"
        >
          <Link
            href={'/privacy'}
            title="See our privacy policy."
            className={hoverLinkStyles}
          >
            Privacy
          </Link>
          <Link
            href={'/terms'}
            title="See our terms & conditions"
            className={hoverLinkStyles}
          >
            Terms
          </Link>
          <Link
            href={'/about'}
            title="See what this website is about"
            className={hoverLinkStyles}
          >
            About
          </Link>
        </section>
      </article>
    </footer>
  );
}
