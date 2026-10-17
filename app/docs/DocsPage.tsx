'use client';

import { useEffect, useState } from 'react';
import './docs.css';
import { BookOpen, Code2, Compass, ArrowRight } from 'lucide-react';

/* ---------------------------------- nav ---------------------------------- */

const NAV: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: 'Getting Started',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'platform-map', label: 'Platform map' },
    ],
  },
  {
    group: 'User Guide',
    items: [
      { id: 'guide-home', label: 'Portal home' },
      { id: 'guide-register', label: 'Register for an event' },
      { id: 'guide-success', label: 'Claim your certificate' },
      { id: 'guide-certificate', label: 'Certificate page' },
      { id: 'guide-verifystudent', label: 'Graduation check-in' },
      { id: 'guide-verified', label: 'Boarding pass' },
      { id: 'guide-verify', label: 'Verify a certificate' },
      { id: 'guide-admin-login', label: 'Staff login' },
      { id: 'guide-admin-dashboard', label: 'Admin dashboard' },
      { id: 'guide-admin-certificates', label: 'Certificate generator' },
    ],
  },
  {
    group: 'Technical Guide',
    items: [
      { id: 'tech-languages', label: 'Languages & stack' },
      { id: 'tech-architecture', label: 'Architecture' },
      { id: 'tech-frontend', label: 'Frontend routes' },
      { id: 'tech-api', label: 'API reference' },
      { id: 'tech-models', label: 'Data models' },
      { id: 'tech-env', label: 'Environment variables' },
      { id: 'tech-setup', label: 'Local setup' },
      { id: 'tech-deploy', label: 'Deployment' },
    ],
  },
];

const ALL_IDS = NAV.flatMap(g => g.items.map(i => i.id));

/* ------------------------------ ui primitives ----------------------------- */

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-[12.5px] bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200">
    {children}
  </code>
);

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24 mb-16">
    <h2 className="text-[26px] font-semibold tracking-tight mb-4 pb-3 border-b border-neutral-200">{title}</h2>
    <div className="space-y-4 text-[15px] leading-[1.75] text-neutral-600">{children}</div>
  </section>
);

const Sub = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[17px] font-semibold text-neutral-900 pt-4">{children}</h3>
);

const Shot = ({ src, caption, route }: { src: string; caption: string; route: string }) => (
  <figure className="my-6 rounded-xl border border-neutral-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] bg-white">
    <img src={src} alt={caption} className="w-full block" loading="lazy" />
    <figcaption className="flex items-center justify-between gap-3 px-4 py-2.5 bg-neutral-50 border-t border-neutral-200">
      <span className="text-[12.5px] text-neutral-500">{caption}</span>
      <code className="font-mono text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded whitespace-nowrap">{route}</code>
    </figcaption>
  </figure>
);

const Step = ({ n, title, children }: { n: number; title: string; children?: React.ReactNode }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-neutral-900 text-white text-[13px] font-semibold flex items-center justify-center mt-0.5">
      {n}
    </div>
    <div className="min-w-0">
      <p className="font-semibold text-neutral-900 text-[15px]">{title}</p>
      {children && <div className="text-[14.5px] text-neutral-600 mt-1 space-y-1">{children}</div>}
    </div>
  </div>
);

const Method = ({ m }: { m: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' }) => {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    POST: 'bg-sky-50 text-sky-700 border-sky-200',
    PUT: 'bg-orange-50 text-orange-700 border-orange-200',
    PATCH: 'bg-amber-50 text-amber-700 border-amber-200',
    DELETE: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-block font-mono text-[10.5px] font-semibold px-1.5 py-0.5 rounded border w-[62px] text-center ${colors[m]}`}>
      {m}
    </span>
  );
};

const ApiTable = ({ rows }: { rows: [string, string, string][] }) => (
  <div className="my-4 rounded-lg border border-neutral-200 overflow-hidden">
    <table className="w-full text-[13px]">
      <thead>
        <tr className="bg-neutral-50 border-b border-neutral-200">
          <th className="text-left font-semibold text-neutral-500 px-4 py-2.5 w-[70px]">Method</th>
          <th className="text-left font-semibold text-neutral-500 px-4 py-2.5">Endpoint</th>
          <th className="text-left font-semibold text-neutral-500 px-4 py-2.5">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([m, path, desc], i) => (
          <tr key={i} className="border-b border-neutral-100 last:border-0">
            <td className="px-4 py-2.5 align-top"><Method m={m as any} /></td>
            <td className="px-4 py-2.5 align-top"><code className="font-mono text-[12px] text-neutral-800">{path}</code></td>
            <td className="px-4 py-2.5 align-top text-neutral-600">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RouteTable = ({ rows }: { rows: [string, string, string][] }) => (
  <div className="my-4 rounded-lg border border-neutral-200 overflow-hidden">
    <table className="w-full text-[13px]">
      <thead>
        <tr className="bg-neutral-50 border-b border-neutral-200">
          <th className="text-left font-semibold text-neutral-500 px-4 py-2.5">Route</th>
          <th className="text-left font-semibold text-neutral-500 px-4 py-2.5">Access</th>
          <th className="text-left font-semibold text-neutral-500 px-4 py-2.5">Purpose</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([path, access, desc], i) => (
          <tr key={i} className="border-b border-neutral-100 last:border-0">
            <td className="px-4 py-2.5 align-top"><code className="font-mono text-[12px] text-emerald-700">{path}</code></td>
            <td className="px-4 py-2.5 align-top text-neutral-600 whitespace-nowrap">{access}</td>
            <td className="px-4 py-2.5 align-top text-neutral-600">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EnvTable = ({ rows }: { rows: [string, string][] }) => (
  <div className="my-4 rounded-lg border border-neutral-200 overflow-hidden">
    <table className="w-full text-[13px]">
      <thead>
        <tr className="bg-neutral-50 border-b border-neutral-200">
          <th className="text-left font-semibold text-neutral-500 px-4 py-2.5 w-[260px]">Variable</th>
          <th className="text-left font-semibold text-neutral-500 px-4 py-2.5">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, desc], i) => (
          <tr key={i} className="border-b border-neutral-100 last:border-0">
            <td className="px-4 py-2.5 align-top"><code className="font-mono text-[12px] text-neutral-800">{name}</code></td>
            <td className="px-4 py-2.5 align-top text-neutral-600">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Callout = ({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'warn' }) => (
  <div className={`my-4 rounded-lg border-l-4 px-4 py-3 text-[14px] ${
    tone === 'warn'
      ? 'border-amber-400 bg-amber-50 text-amber-900'
      : 'border-neutral-300 bg-neutral-50 text-neutral-700'
  }`}>
    {children}
  </div>
);

const Pre = ({ children }: { children: string }) => (
  <pre className="my-4 rounded-lg bg-[#0d0d0d] text-neutral-200 text-[12.5px] leading-relaxed px-5 py-4 overflow-x-auto font-mono">
    {children}
  </pre>
);

/* --------------------------------- page ---------------------------------- */

export default function DocsPage() {
  const [active, setActive] = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      let current = ALL_IDS[0];
      for (const id of ALL_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileNav(false);
  };

  return (
    <div className="docs-root min-h-screen bg-white" style={{ fontFamily: "'IBM Plex Sans', 'Inter', sans-serif" }}>

      {/* ------------------------------ top bar ------------------------------ */}
      <header className="fixed top-0 inset-x-0 h-14 bg-white/90 backdrop-blur border-b border-neutral-200 z-40 flex items-center px-5 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-neutral-900 text-white flex items-center justify-center">
            <BookOpen size={15} />
          </div>
          <span className="font-semibold text-[15px] text-neutral-900">Brand Monk Academy</span>
          <span className="text-neutral-300">/</span>
          <span className="text-[14px] text-neutral-500">Documentation</span>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-6 text-[13px]">
          <a href="#guide-home" onClick={go('guide-home')} className="text-neutral-500 hover:text-neutral-900 transition-colors">User Guide</a>
          <a href="#tech-languages" onClick={go('tech-languages')} className="text-neutral-500 hover:text-neutral-900 transition-colors">Technical Guide</a>
          <a href="/" className="text-neutral-900 font-medium border border-neutral-200 rounded-md px-3 py-1.5 hover:bg-neutral-50 transition-colors">
            Back to site
          </a>
        </div>
        <button
          className="md:hidden ml-auto text-neutral-600 border border-neutral-200 rounded-md px-3 py-1.5 text-[13px]"
          onClick={() => setMobileNav(v => !v)}
        >
          Menu
        </button>
      </header>

      {/* mobile nav dropdown */}
      {mobileNav && (
        <div className="md:hidden fixed top-14 inset-x-0 bg-white border-b border-neutral-200 z-40 max-h-[70vh] overflow-y-auto docs-scroll px-5 py-4">
          {NAV.map(g => (
            <div key={g.group} className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">{g.group}</p>
              {g.items.map(i => (
                <a key={i.id} href={`#${i.id}`} onClick={go(i.id)}
                  className="block py-1.5 text-[14px] text-neutral-600">
                  {i.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------ sidebar ------------------------------ */}
      <aside className="hidden md:block fixed top-14 bottom-0 left-0 w-[264px] border-r border-[#1e2a55] overflow-y-auto docs-scroll-dark bg-[#0e1a3f] px-5 py-8">
        {NAV.map(g => (
          <div key={g.group} className="mb-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-2 px-2">{g.group}</p>
            <ul>
              {g.items.map(i => (
                <li key={i.id}>
                  <a
                    href={`#${i.id}`}
                    onClick={go(i.id)}
                    className={`block px-2 py-[5px] text-[13.5px] rounded-md transition-all border-l-2 ${
                      active === i.id
                        ? 'text-white font-medium border-emerald-400 bg-white/10'
                        : 'text-slate-300/80 border-transparent hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* ------------------------------ content ------------------------------ */}
      <main className="pt-14 md:pl-[264px]">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 py-10">

          {/* ============================ OVERVIEW ============================ */}
          <section id="overview" className="scroll-mt-24 mb-16">
            <p className="text-[13px] font-semibold text-emerald-700 uppercase tracking-wider mb-2">Documentation</p>
            <h1 className="text-[34px] font-semibold tracking-tight text-neutral-900 leading-tight mb-4">
              Brand Monk Academy Platform
            </h1>
            <p className="text-[16px] leading-[1.8] text-neutral-600">
              The Brand Monk Academy platform handles the full lifecycle of event registrations and
              certificates — students register for webinars and courses, confirm their Instagram
              follow, and receive a verifiable PDF certificate. Staff manage events, students,
              eligibility, and certificate delivery from a private admin console.
            </p>
            <p className="text-[16px] leading-[1.8] text-neutral-600">
              This page contains two guides, presented top-to-bottom. The{' '}
              <a href="#guide-home" onClick={go('guide-home')} className="text-emerald-700 font-medium hover:underline">User Guide</a>{' '}
              explains every screen in plain language — no technical background needed. The{' '}
              <a href="#tech-languages" onClick={go('tech-languages')} className="text-emerald-700 font-medium hover:underline">Technical Guide</a>{' '}
              documents the stack, routes, API, and data model for developers.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <a href="#guide-home" onClick={go('guide-home')}
                className="group rounded-xl border border-neutral-200 p-5 hover:border-neutral-400 hover:shadow-sm transition-all">
                <Compass size={20} className="text-emerald-600 mb-3" />
                <p className="font-semibold text-neutral-900 text-[15px] flex items-center gap-2">
                  User Guide <ArrowRight size={14} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </p>
                <p className="text-[13.5px] text-neutral-500 mt-1">How to use every page — for students, attendees, and staff.</p>
              </a>
              <a href="#tech-languages" onClick={go('tech-languages')}
                className="group rounded-xl border border-neutral-200 p-5 hover:border-neutral-400 hover:shadow-sm transition-all">
                <Code2 size={20} className="text-emerald-600 mb-3" />
                <p className="font-semibold text-neutral-900 text-[15px] flex items-center gap-2">
                  Technical Guide <ArrowRight size={14} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </p>
                <p className="text-[13.5px] text-neutral-500 mt-1">Stack, architecture, API reference, and data models.</p>
              </a>
            </div>
          </section>

          <Section id="platform-map" title="Platform map">
            <p>Every public and staff surface of the site at a glance:</p>
            <RouteTable rows={[
              ['/', 'Public', 'Portal landing page — platform guide and staff login entry point'],
              ['/register/[slug]', 'Public', 'Registration form for a specific webinar or course'],
              ['/webinar/success', 'Public', 'Post-registration flow: Instagram follow gate and certificate download'],
              ['/certificate/[id]', 'Public', 'Certificate view and download for a registered student'],
              ['/verifystudent', 'Public', 'Graduation event check-in form (mobile-number lookup)'],
              ['/verified', 'Public', 'Digital boarding pass shown after a successful check-in'],
              ['/verify/[certificateId]', 'Public', 'Certificate authenticity check — the page QR codes open'],
              ['/admin/login', 'Staff', 'Username/password login for academy staff'],
              ['/admin/dashboard', 'Staff', 'Admin console — stats, courses, webinars, students, certificates, verifications'],
              ['/admin/certificates', 'Staff', 'Standalone certificate generator (manual or bulk)'],
            ]} />
          </Section>

          {/* =========================== USER GUIDE =========================== */}
          <div className="mb-10 mt-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-neutral-400 border-b border-neutral-200 pb-3">
              Part 1 — User Guide
            </p>
          </div>

          <Section id="guide-home" title="Portal home">
            <p>
              The home page is the public entry point. It presents the academy branding in a
              certificate-style layout, explains the three-step certificate process
              (<strong>Attend → Follow Us → Download Certificate</strong>), and provides the{' '}
              <strong>Staff Login</strong> button in the top-right corner for admins.
            </p>
            <Shot src="/docs/home.jpg" caption="Portal home — the landing page every visitor sees" route="/" />
            <p>From here:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Students</strong> do not log in — they register through a link shared by the academy and follow the on-screen steps.</li>
              <li><strong>Staff</strong> click <strong>Staff Login</strong> to reach the admin portal.</li>
            </ul>
          </Section>

          <Section id="guide-register" title="Register for an event">
            <p>
              Each webinar or course has its own registration link in the form{' '}
              <Code>/register/&lt;event-slug&gt;</Code>. Staff copy this link from the admin
              dashboard (<em>Webinars → Copy Registration Link</em>) and share it with attendees.
            </p>
            <Shot src="/docs/register.jpg" caption="Registration form for an event" route="/register/agentic-ai-2g5yfrjf" />
            <Sub>How to fill it in</Sub>
            <div className="space-y-4 mt-4">
              <Step n={1} title="Open the registration link">The banner at the top confirms the event name and date.</Step>
              <Step n={2} title="Enter your details">
                <p>Required fields: <strong>Full Name</strong>, <strong>Profession</strong>, <strong>Email</strong>, <strong>Phone Number</strong>, and <strong>Location</strong>. College/Company, Department, and Year/Experience are optional.</p>
              </Step>
              <Step n={3} title="Click Register Now">
                <p>Webinar registrations continue to the certificate claim flow. Course registrations show a thank-you confirmation immediately.</p>
              </Step>
            </div>
            <Callout>If the link is invalid or the event is closed, the page shows “Registration Not Found”. Ask the academy for a fresh link.</Callout>
          </Section>

          <Section id="guide-success" title="Claim your certificate">
            <p>
              After a webinar registration you land on <Code>/webinar/success</Code>, a three-step
              checklist: <em>Registration Complete → Follow Instagram → Download Certificate</em>.
            </p>
            <Shot src="/docs/success-instagram.jpg" caption="Step 1 — registration confirmation with your certificate ID" route="/webinar/success" />
            <div className="space-y-4 mt-4">
              <Step n={1} title="Confirm your details">Your name, email, program, and certificate ID are displayed.</Step>
              <Step n={2} title="Follow on Instagram">
                <p>Click <strong>Follow on Instagram</strong> — it opens <Code>@brandmonkacademy</Code> in a new tab. After following, return and press <strong>Verify Follow</strong>.</p>
              </Step>
              <Step n={3} title="Download your certificate">
                <p>Once verified, the <strong>Download Certificate</strong> button unlocks and saves a PDF named after you.</p>
              </Step>
            </div>
            <Shot src="/docs/success-certificate.jpg" caption="Step 3 — certificate unlocked and ready to download as PDF" route="/webinar/success" />
          </Section>

          <Section id="guide-certificate" title="Certificate page">
            <p>
              The direct certificate link <Code>/certificate/&lt;student-id&gt;</Code> shows your
              certificate with a download button and an optional Google review prompt.
            </p>
            <Shot src="/docs/certificate.jpg" caption="Certificate pending state — shown until an admin approves eligibility" route="/certificate/[id]" />
            <Callout tone="warn">
              If you see <strong>“Certificate Pending”</strong>, the academy has not approved your
              certificate yet. Once staff mark you eligible, the same link shows the certificate
              preview and download button.
            </Callout>
          </Section>

          <Section id="guide-verifystudent" title="Graduation check-in">
            <p>
              For graduation events, students check in at <Code>/verifystudent</Code> by entering
              the name, email, and — most importantly — the <strong>mobile number used during
              course registration</strong>.
            </p>
            <Shot src="/docs/verifystudent.jpg" caption="Student verification form for graduation functions" route="/verifystudent" />
            <div className="space-y-4 mt-4">
              <Step n={1} title="Enter your details">Full name, email address, and your registered 10-digit mobile number.</Step>
              <Step n={2} title="Submit">The system looks up your course record by mobile number.</Step>
              <Step n={3} title="Get your boarding pass">
                <p>A digital boarding pass is generated instantly and also emailed to you. If your number isn’t found, contact an admin.</p>
              </Step>
            </div>
          </Section>

          <Section id="guide-verified" title="Boarding pass">
            <p>
              <Code>/verified</Code> displays your event boarding pass — name, email, mobile, and
              course — styled as a ticket with a celebration animation. This is the page linked
              from the confirmation email; show it at the venue entrance.
            </p>
            <Shot src="/docs/verified.jpg" caption="Digital boarding pass for the graduation ceremony" route="/verified" />
          </Section>

          <Section id="guide-verify" title="Verify a certificate">
            <p>
              Every issued certificate carries a QR code that opens{' '}
              <Code>/verify/&lt;certificate-id&gt;</Code>. Anyone — an employer, for example — can
              scan it to confirm the certificate is genuine.
            </p>
            <Shot src="/docs/verify.jpg" caption="Public verification page showing a valid certificate" route="/verify/[certificateId]" />
            <p>A valid certificate shows the holder’s name, course, certificate ID, issue date, and a green <strong>Certificate Verified</strong> banner. Invalid or unknown IDs show a “certificate not found” state.</p>
          </Section>

          <Section id="guide-admin-login" title="Staff login">
            <p>
              Staff reach the console at <Code>/admin/login</Code> (or via the Staff Login button on
              the home page). Enter your assigned username and password — credentials are issued by
              the academy and differ per branch (Chennai and Coimbatore).
            </p>
            <Shot src="/docs/admin-login.jpg" caption="Admin portal login" route="/admin/login" />
            <Callout>There is no self-service signup. If login fails, confirm the credentials with your administrator.</Callout>
          </Section>

          <Section id="guide-admin-dashboard" title="Admin dashboard">
            <p>
              After login you land on <Code>/admin/dashboard</Code>. A left sidebar exposes six
              sections; your branch role decides which actions are enabled.
            </p>
            <Shot src="/docs/admin-dashboard.jpg" caption="Dashboard overview — registrations, programs, and trends" route="/admin/dashboard" />

            <Sub>Dashboard</Sub>
            <p>Headline stats (total registrations, active courses, certificates sent, eligible students), monthly registration trends, top programs, and the latest registrations.</p>

            <Sub>Student Records</Sub>
            <Shot src="/docs/admin-students.jpg" caption="Student records — search, filter, add, import, and export" route="/admin/dashboard" />
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Switch between <strong>All / Courses / Webinars</strong> and filter by program.</li>
              <li><strong>Add Student</strong> registers a single student; <strong>Upload</strong> bulk-imports from an Excel sheet; <strong>Download</strong> exports the list.</li>
              <li>Row actions edit a student, toggle certificate eligibility, or send the certificate email.</li>
            </ul>

            <Sub>Webinars & Courses</Sub>
            <Shot src="/docs/admin-webinars.jpg" caption="Webinar management — create events and copy registration links" route="/admin/dashboard" />
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Create Webinar</strong> makes a new event with its own registration link.</li>
              <li><strong>Copy Registration Link</strong> on each card copies the public <Code>/register/…</Code> URL to share with attendees.</li>
              <li>Toggle a card between <strong>Active</strong> and closed to open or pause registrations.</li>
            </ul>

            <Sub>Verifications</Sub>
            <Shot src="/docs/admin-verifications.jpg" caption="Graduation check-in submissions with attendance toggles" route="/admin/dashboard" />
            <p>
              Lists every submission from <Code>/verifystudent</Code>. Use it at the venue door:
              search by name or mobile, mark <strong>Attended</strong>, or delete duplicates. The
              stat cards show totals, attendance, and submissions not found in the course database.
            </p>
          </Section>

          <Section id="guide-admin-certificates" title="Certificate generator">
            <p>
              <Code>/admin/certificates</Code> is a standalone tool for producing course
              certificates in two ways:
            </p>
            <Shot src="/docs/admin-certificates.jpg" caption="Certificate generator — manual entry tab" route="/admin/certificates" />
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Manual Entry</strong> — add students one by one (name, course, batch, contact details).</li>
              <li><strong>Bulk Upload</strong> — paste or import a whole batch at once.</li>
            </ul>
            <p>
              Generated certificates get a unique verification ID each. From there you can copy the
              verification link, preview the certificate, or trigger the email delivery.
            </p>
          </Section>

          {/* ========================= TECHNICAL GUIDE ========================= */}
          <div className="mb-10 mt-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-neutral-400 border-b border-neutral-200 pb-3">
              Part 2 — Technical Guide
            </p>
          </div>

          <Section id="tech-languages" title="Languages & stack">
            <Sub>Languages</Sub>
            <div className="my-4 rounded-lg border border-neutral-200 overflow-hidden">
              <table className="w-full text-[13.5px]">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left font-semibold text-neutral-500 px-4 py-2.5">Language</th>
                    <th className="text-left font-semibold text-neutral-500 px-4 py-2.5">Used for</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-100">
                    <td className="px-4 py-2.5 font-medium text-neutral-800">TypeScript (TSX)</td>
                    <td className="px-4 py-2.5 text-neutral-600">Entire frontend — Next.js App Router pages and React components</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="px-4 py-2.5 font-medium text-neutral-800">JavaScript (CommonJS)</td>
                    <td className="px-4 py-2.5 text-neutral-600">Entire backend — Express server, routes, controllers, models, scripts</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="px-4 py-2.5 font-medium text-neutral-800">CSS / Tailwind</td>
                    <td className="px-4 py-2.5 text-neutral-600">Styling — Tailwind CSS v4 utilities plus a custom certificate theme</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-neutral-800">Python</td>
                    <td className="px-4 py-2.5 text-neutral-600">One utility script (<Code>utils/recolor_graduates.py</Code>) for image processing</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Sub>Frontend</Sub>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Next.js 16</strong> (App Router, Turbopack) + <strong>React 19</strong></li>
              <li><strong>Tailwind CSS v4</strong> via <Code>@tailwindcss/postcss</Code></li>
              <li><strong>Axios</strong> for API calls (<Code>utils/config.ts</Code> resolves the base URL)</li>
              <li><strong>jsPDF</strong> + <strong>html2canvas</strong> / <strong>html-to-image</strong> — client-side certificate PDF export</li>
              <li><strong>recharts</strong> — dashboard charts, <strong>framer-motion</strong> — boarding-pass animations</li>
              <li><strong>qrcode</strong>, <strong>xlsx</strong>, <strong>jszip</strong> — QR generation, Excel import/export, ZIP bundling</li>
              <li><strong>lucide-react</strong> + <strong>react-icons</strong> — icons</li>
            </ul>

            <Sub>Backend</Sub>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Node.js</strong> + <strong>Express 5</strong> REST API (<Code>server.js</Code>)</li>
              <li><strong>Mongoose 9</strong> ODM on <strong>MongoDB Atlas</strong></li>
              <li><strong>Nodemailer</strong> + <strong>Resend</strong> — certificate and boarding-pass emails</li>
              <li><strong>canvas</strong> — server-side certificate image rendering</li>
              <li><strong>qrcode</strong>, <strong>jsqr</strong>, <strong>pngjs</strong> — QR code generation and decoding</li>
              <li><strong>cors</strong>, <strong>dotenv</strong>, <strong>body-parser</strong>, <strong>nodemon</strong> (dev)</li>
            </ul>
          </Section>

          <Section id="tech-architecture" title="Architecture">
            <p>Two deployables plus a managed database:</p>
            <Pre>{`Browser ──► Frontend (Next.js 16 · Vercel)
                │   registrations.brandmonkacademy.com
                │
                ├─► /api/*  ──Next.js rewrite proxy──► Backend (Express 5 · Render)
                │                                        brandmonk-backend-1.onrender.com
                │                                           │
                │                                           ├─► MongoDB Atlas (Mongoose)
                │                                           ├─► Email (Nodemailer / Resend)
                │                                           └─► canvas · qrcode (cert rendering)
                │
                └─► NEXT_PUBLIC_API_URL set? → calls the backend directly (no proxy)`}</Pre>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The frontend proxies <Code>/api/*</Code> to the backend via <Code>next.config.ts</Code> rewrites, so browser requests stay same-origin.</li>
              <li>Admin auth is a hardcoded credential check (<Code>adminController.js</Code>) stored in <Code>sessionStorage</Code> — there is no JWT/session token; protected pages simply check <Code>adminData</Code> on mount.</li>
              <li>Certificate PDFs are rendered client-side from the DOM (html2canvas → jsPDF); QR verification links point back at <Code>/verify/…</Code> pages.</li>
              <li>CORS is whitelisted in <Code>server.js</Code> for the production domain and localhost dev ports.</li>
            </ul>
          </Section>

          <Section id="tech-frontend" title="Frontend routes">
            <p>App Router pages under <Code>app/</Code>. Index routes (<Code>/register</Code>, <Code>/webinar</Code>, <Code>/verify</Code>, <Code>/certificate</Code>, <Code>/admin</Code>) just redirect.</p>
            <RouteTable rows={[
              ['/', 'Public', 'Portal landing — certificate-themed guide + staff login entry'],
              ['/register/[slug]', 'Public', 'Event registration form; resolves slug via GET /api/webinars/slug/:slug'],
              ['/webinar/success', 'Public', '3-step claim flow; reads registeredStudent from sessionStorage'],
              ['/certificate/[id]', 'Public', 'Certificate preview/download; gated on student.isEligible'],
              ['/verifystudent', 'Public', 'Check-in form posting to POST /api/verify-student'],
              ['/verified', 'Public', 'Boarding pass rendered from query params (framer-motion confetti)'],
              ['/verify/[certificateId]', 'Public', 'Verifies via GET /api/course-students/verify/:certificateId'],
              ['/verify/[...id]', 'Public', 'Catch-all verifier (handles ids containing slashes/underscores)'],
              ['/verify/course/[...id]', 'Public', 'Course-certificate verifier → GET /api/course-students/:id'],
              ['/admin/login', 'Staff', 'POST /api/admin/login; stores adminData in sessionStorage'],
              ['/admin/dashboard', 'Staff', 'Tabbed console: dashboard, courses, webinars, students, certificates, verifications'],
              ['/admin/certificates', 'Staff', 'Standalone manual/bulk certificate generator'],
              ['/docs', 'Public', 'This documentation page'],
            ]} />
            <p>
              Shared components: <Code>components/CertificateTemplate.tsx</Code> (the printable
              certificate DOM), <Code>components/Navbar.tsx</Code>, <Code>components/Sidebar.tsx</Code>.
            </p>
          </Section>

          <Section id="tech-api" title="API reference">
            <p>Base URL: <Code>{'{API_URL}'}/api</Code> — served by Express on port <Code>5000</Code> locally.</p>

            <Sub>Students — /api/students</Sub>
            <ApiTable rows={[
              ['POST', '/register', 'Register a student for a webinar/course slug'],
              ['POST', '/verify-email', 'Email check used by the Instagram follow flow'],
              ['POST', '/instagram-verified', 'Marks hasFollowedInstagram on the student'],
              ['GET', '/:id', 'Fetch a student record (certificate page)'],
            ]} />

            <Sub>Admin — /api/admin</Sub>
            <ApiTable rows={[
              ['POST', '/login', 'Credential check → { username, location, role }'],
              ['GET', '/students', 'List all students (includes duplicate detection)'],
              ['POST', '/students', 'Create a student'],
              ['POST', '/students/bulk-import', 'Bulk import students'],
              ['PUT', '/students/:id', 'Update a student'],
              ['DELETE', '/students/:id', 'Delete a student'],
              ['GET', '/stats', 'Dashboard aggregate stats'],
              ['PATCH', '/students/:id/eligibility', 'Toggle certificate eligibility (manager role)'],
              ['POST', '/students/:id/send-certificate', 'Email the certificate (manager role)'],
              ['POST', '/students/remove-duplicates', 'Deduplicate registrations'],
            ]} />

            <Sub>Webinars — /api/webinars</Sub>
            <ApiTable rows={[
              ['POST', '/', 'Create a webinar/course event'],
              ['GET', '/', 'List all events'],
              ['GET', '/slug/:slug', 'Fetch one event by slug (registration page)'],
              ['PUT', '/:id', 'Update an event'],
              ['PATCH', '/:id/toggle', 'Open/close registrations'],
              ['DELETE', '/:id', 'Delete an event'],
            ]} />

            <Sub>Course students — /api/course-students</Sub>
            <ApiTable rows={[
              ['POST', '/', 'Create a course student / certificate record'],
              ['POST', '/bulk/generate', 'Bulk-generate certificates'],
              ['GET', '/', 'List course students'],
              ['GET', '/course/:slug', 'List students of one course'],
              ['GET', '/verify/:certificateId', 'Public certificate verification'],
              ['GET', '/:id', 'Fetch by certificate ID'],
              ['GET', '/:idPrefix/:idSuffix', 'Fetch by split certificate ID'],
              ['PATCH', '/eligibility/:certificateId', 'Toggle eligibility by certificate ID'],
              ['PATCH', '/mark-sent/:certificateId', 'Mark certificate email as sent'],
              ['DELETE', '/:id', 'Delete a course student'],
            ]} />

            <Sub>Verify student — /api/verify-student</Sub>
            <ApiTable rows={[
              ['POST', '/', 'Check-in: mobile lookup → creates entry + emails boarding pass'],
              ['GET', '/entries', 'List check-in submissions'],
              ['PATCH', '/entries/:id/attendance', 'Toggle attended flag'],
              ['DELETE', '/entries/:id', 'Delete a submission'],
            ]} />

            <Sub>Misc</Sub>
            <ApiTable rows={[
              ['GET', '/api/health', 'Liveness + MongoDB connection state'],
              ['GET', '/', 'API index'],
            ]} />
          </Section>

          <Section id="tech-models" title="Data models">
            <p>Mongoose schemas in <Code>backend/models/</Code>:</p>
            <div className="my-4 rounded-lg border border-neutral-200 overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left font-semibold text-neutral-500 px-4 py-2.5 w-[190px]">Model</th>
                    <th className="text-left font-semibold text-neutral-500 px-4 py-2.5">Key fields</th>
                    <th className="text-left font-semibold text-neutral-500 px-4 py-2.5">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Student', 'name, email, phone, webinarId/Slug, location, profession, certificateId, isEligible, hasFollowedInstagram, certificateSent', 'Webinar/course registrations + certificate state'],
                    ['CourseStudent', 'name, courseName, courseSlug, certificateId (unique), phoneNumber, batch, isEligible, certificateSent', 'Issued course certificates, keyed by certificateId'],
                    ['Webinar', 'name, slug (auto-generated), type Webinar|Course, date, location, isActive, totalRegistrations, batchCode, trainer', 'Events that own registration links'],
                    ['Admin', 'username, password, location (Chennai|Coimbatore), role (viewer|manager)', 'Staff accounts — viewer reads, manager approves/sends'],
                    ['StudentVerification', 'name, email, mobile, courseName/Slug, certificateId, attended', 'Graduation check-in submissions'],
                  ].map(([m, f, p]) => (
                    <tr key={m} className="border-b border-neutral-100 last:border-0 align-top">
                      <td className="px-4 py-2.5"><code className="font-mono text-[12px] font-semibold text-neutral-900">{m}</code></td>
                      <td className="px-4 py-2.5"><code className="font-mono text-[11.5px] text-neutral-600">{f}</code></td>
                      <td className="px-4 py-2.5 text-neutral-600">{p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Callout>
              Certificate IDs look like <Code>BMASEPVEMES/Q1401S042</Code>. Because they contain a
              slash, QR links substitute underscores — the verify pages convert <Code>_</Code> back
              to <Code>/</Code> before lookup.
            </Callout>
          </Section>

          <Section id="tech-env" title="Environment variables">
            <Sub>Backend (.env)</Sub>
            <EnvTable rows={[
              ['PORT', 'API port — default 5000'],
              ['MONGO_URI', 'MongoDB Atlas connection string'],
              ['EMAIL_USER / EMAIL_PASS', 'SMTP credentials (Gmail app password) for Nodemailer'],
              ['FRONTEND_URL', 'Base URL used in emailed links (boarding passes, certificates)'],
              ['FIREBASE_STARTUP_SYNC', 'Optional legacy Firebase backup sync on boot (default false)'],
            ]} />
            <Sub>Frontend (.env.local)</Sub>
            <EnvTable rows={[
              ['NEXT_PUBLIC_API_URL', 'Optional absolute backend URL; when unset the browser uses the /api rewrite proxy'],
            ]} />
            <Callout tone="warn">Never commit real credentials. The repo ships <Code>.env.example</Code> as the template.</Callout>
          </Section>

          <Section id="tech-setup" title="Local setup">
            <Pre>{`# Backend — http://localhost:5000
cd Brandmonk_Webinar_backend
npm install
npm run dev          # nodemon, or: npm start

# Frontend — http://localhost:3000
cd Brandmonk_Webinar_frontend
npm install
npm run dev          # Next.js + Turbopack`}</Pre>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Copy <Code>backend/.env.example</Code> → <Code>.env</Code> and fill in <Code>MONGO_URI</Code> and email credentials.</li>
              <li>By default browser API calls hit <Code>/api/*</Code>, which <Code>next.config.ts</Code> rewrites to the production Render backend. To use your local backend during development, set <Code>NEXT_PUBLIC_API_URL=http://localhost:5000</Code>.</li>
              <li>Health check: <Code>GET http://localhost:5000/api/health</Code>.</li>
            </ul>
            <Sub>Repository layout</Sub>
            <Pre>{`frontend/                     # Next.js 16 app (TypeScript)
  app/                      # routes: /, register, webinar/success,
                          #   certificate, verify, verifystudent,
                          #   verified, admin/*, docs
  app/components/           # CertificateTemplate, Navbar, Sidebar
  utils/config.ts           # API_URL resolution
  public/docs/              # screenshots used by this page

backend/                    # Express 5 API (JavaScript / CommonJS)
  server.js                 # entry — CORS, routes, health check
  config/db.js              # Mongoose connection
  models/                   # Student, CourseStudent, Webinar, Admin,
                          #   StudentVerification
  routes/                   # student, admin, webinar, course-student,
                          #   verify-student routers
  controllers/              # request handlers
  services/                 # certificateService, emailService, firebaseBackup
  scripts/                  # ~60 one-off data migration/seed scripts
  templates/                # certificate_template.png`}</Pre>
          </Section>

          <Section id="tech-deploy" title="Deployment">
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Frontend</strong> — Vercel, served at <Code>registrations.brandmonkacademy.com</Code>.</li>
              <li><strong>Backend</strong> — Render at <Code>brandmonk-backend-1.onrender.com</Code>; reached through the Next.js <Code>/api/*</Code> rewrite.</li>
              <li><strong>Database</strong> — MongoDB Atlas cluster (connection string in <Code>MONGO_URI</Code>).</li>
              <li><strong>CORS</strong> — <Code>server.js</Code> whitelists the production domain plus localhost:3000/3001/5000.</li>
              <li><strong>Cold starts</strong> — the Render free tier sleeps; the first API call after idle can take up to ~60s. This shows up as a long “Loading” state on data-driven pages.</li>
            </ul>
          </Section>

          {/* footer */}
          <div className="border-t border-neutral-200 pt-8 pb-16 mt-4">
            <p className="text-[13px] text-neutral-400">
              Brand Monk Academy · Platform documentation · Last updated October 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
