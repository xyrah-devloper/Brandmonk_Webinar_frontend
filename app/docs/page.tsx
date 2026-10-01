import type { Metadata } from 'next';
import DocsPage from './DocsPage';

export const metadata: Metadata = {
  title: 'Documentation | Brand Monk Academy',
  description: 'User and technical documentation for the Brand Monk Academy webinar & certificate platform',
};

export default function Page() {
  return <DocsPage />;
}
