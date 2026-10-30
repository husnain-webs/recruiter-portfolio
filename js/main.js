/**
 * Husnain Haider Portfolio - Interactive Core Script
 * Talent Acquisition & Sourcing Specialist
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Toggle (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('hh_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('hh_theme', newTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Navbar & Scrollspy
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scrollspy active indicator
    let currentSectionId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Reset on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Animated Stats Counter (IntersectionObserver)
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.counter-val');
  let hasAnimatedStats = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimatedStats) {
        hasAnimatedStats = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const duration = 1800;
          const stepTime = Math.abs(Math.floor(duration / target));
          let current = 0;

          const timer = setInterval(() => {
            current += Math.ceil(target / 40);
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = current;
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    statsObserver.observe(statsStrip);
  }

  // --------------------------------------------------------------------------
  // 5. Interactive Sourcing Calculator & Pipeline Simulator
  // --------------------------------------------------------------------------
  const roleDomainPills = document.querySelectorAll('[data-calc-role]');
  const seniorityPills = document.querySelectorAll('[data-calc-seniority]');
  const hiresRange = document.getElementById('hiresRange');
  const hiresCountDisplay = document.getElementById('hiresCountDisplay');

  const metricPool = document.getElementById('calcPool');
  const metricQualified = document.getElementById('calcQualified');
  const metricDelivery = document.getElementById('calcDelivery');
  const metricChannels = document.getElementById('calcChannels');
  const btnApplyToForm = document.getElementById('applyCalcToForm');

  let currentDomain = 'tech';
  let currentSeniority = 'senior';
  let currentHires = 1;

  function recalculatePipeline() {
    let basePoolPerHire = 1200;
    let baseQualifiedRatio = 0.14;
    let baseDeliveryDays = 4;
    let channels = 'LinkedIn Recruiter + GitHub Boolean';

    // Domain adjustments
    if (currentDomain === 'tech') {
      basePoolPerHire = 1400;
      channels = 'LinkedIn Recruiter + GitHub + Dev Networks';
    } else if (currentDomain === 'devops') {
      basePoolPerHire = 950;
      baseQualifiedRatio = 0.11;
      channels = 'Multi-pivot Boolean + Apollo + Tech Communities';
    } else if (currentDomain === 'sales') {
      basePoolPerHire = 1800;
      baseQualifiedRatio = 0.18;
      baseDeliveryDays = 3;
      channels = 'Sales Navigator + Clay Waterfall + ZoomInfo';
    } else if (currentDomain === 'exec') {
      basePoolPerHire = 600;
      baseQualifiedRatio = 0.08;
      baseDeliveryDays = 6;
      channels = 'Confidential Headhunting + Direct Industry Mapping';
    }

    // Seniority adjustments
    if (currentSeniority === 'mid') {
      basePoolPerHire = Math.round(basePoolPerHire * 1.3);
    } else if (currentSeniority === 'staff') {
      basePoolPerHire = Math.round(basePoolPerHire * 0.7);
      baseQualifiedRatio *= 0.85;
      baseDeliveryDays += 1;
    } else if (currentSeniority === 'lead') {
      basePoolPerHire = Math.round(basePoolPerHire * 0.5);
      baseQualifiedRatio *= 0.75;
      baseDeliveryDays += 2;
    }

    const totalPool = Math.round(basePoolPerHire * currentHires);
    const totalQualified = Math.round(totalPool * baseQualifiedRatio);
    const turnaround = `${baseDeliveryDays}-${baseDeliveryDays + 2} Business Days`;

    if (metricPool) metricPool.textContent = totalPool.toLocaleString();
    if (metricQualified) metricQualified.textContent = `${totalQualified}+`;
    if (metricDelivery) metricDelivery.textContent = turnaround;
    if (metricChannels) metricChannels.textContent = channels;
  }

  roleDomainPills.forEach(pill => {
    pill.addEventListener('click', () => {
      roleDomainPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentDomain = pill.getAttribute('data-calc-role');
      recalculatePipeline();
    });
  });

  seniorityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      seniorityPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentSeniority = pill.getAttribute('data-calc-seniority');
      recalculatePipeline();
    });
  });

  if (hiresRange) {
    hiresRange.addEventListener('input', (e) => {
      currentHires = parseInt(e.target.value, 10);
      if (hiresCountDisplay) {
        hiresCountDisplay.textContent = currentHires === 5 ? '5+ Hires' : `${currentHires} Hire${currentHires > 1 ? 's' : ''}`;
      }
      recalculatePipeline();
    });
  }

  // Pre-fill contact form with calculation details
  if (btnApplyToForm) {
    btnApplyToForm.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      const subjectInput = document.getElementById('formSubject');
      const messageInput = document.getElementById('formMessage');

      if (subjectInput) {
        subjectInput.value = `Sourcing Sprint Inquiry: ${currentSeniority.toUpperCase()} ${currentDomain.toUpperCase()} (${currentHires} Hire${currentHires > 1 ? 's' : ''})`;
      }
      if (messageInput) {
        messageInput.value = `Hi Husnain,\n\nI just ran the Sourcing Pipeline Simulator on your site for:\n- Domain: ${currentDomain}\n- Seniority: ${currentSeniority}\n- Target Hires: ${currentHires}\n\nWe are looking to kick off this search soon. Let's discuss your availability and sprint timeline.`;
      }

      contactSection?.scrollIntoView({ behavior: 'smooth' });
      showToast('Pipeline parameters applied to contact form!');
    });
  }

  // Initialize calculator on start
  recalculatePipeline();

  // --------------------------------------------------------------------------
  // 6. Portfolio Case Studies Data & Modal Handler
  // --------------------------------------------------------------------------
  const caseStudiesData = {
    'case-1': {
      title: 'US Fintech Scale-Up: 3x Senior Golang & Kubernetes Engineers',
      category: 'Technical Recruitment',
      metric: '3 Placed in 24 Days',
      overview: 'A Series-B FinTech client based in New York needed 3 high-impact distributed systems engineers with heavy Go, Kubernetes, and high-throughput microservices experience within 30 days.',
      challenge: 'High competition in the US market, passive candidates unresponsive to generic recruiter messaging, and strict architectural screening requirements.',
      solution: 'Constructed 4-tier Boolean search strings combining GitHub commit keywords, LinkedIn Recruiter advanced filters, and ex-FinTech company alumni. Implemented a 3-touch hyper-personalized outreach emphasizing distributed concurrency challenges.',
      funnel: [
        { label: 'Talent Pool Mapped', count: '540 candidates' },
        { label: 'Calibrated Candidates Screened', count: '82 profiles' },
        { label: 'Initial Shortlist Presented', count: '14 profiles' },
        { label: 'Client 1st Round Interviews', count: '9 interviews' },
        { label: 'Accepted Offers', count: '3 Hires' }
      ],
      booleanSnippet: '("Senior Go Engineer" OR "Staff Golang Engineer") AND ("distributed systems" OR "high throughput") AND ("Kubernetes" OR "gRPC") -junior -intern',
      tools: ['LinkedIn Recruiter', 'GitHub Search', 'Hunter.io', 'Google Sheets CRM']
    },
    'case-2': {
      title: 'B2B SaaS: Outbound Account Intelligence & Verified Contact Mining',
      category: 'B2B Lead Generation',
      metric: '3,800+ Verified US Contacts (98.4% Deliverability)',
      overview: 'An enterprise HR-tech software provider required an exhaustive outbound lead pipeline targeting VP People, Directors of Talent, and Chief HR Officers across US tech firms with 50-500 employees.',
      challenge: 'High bounce rates with stale ZoomInfo contacts and complex multi-decision maker hierarchies in rapidly evolving scale-ups.',
      solution: 'Deployed Clay.com waterfall data enrichment querying Apollo, SalesQL, and NeverBounce in sequence. Cross-referenced verified direct work emails and mobile numbers with LinkedIn Sales Navigator active status.',
      funnel: [
        { label: 'Target Accounts Identified', count: '650 accounts' },
        { label: 'Decision Makers Mapped', count: '4,100 profiles' },
        { label: 'Dual-Verified Clean Contacts', count: '3,820 leads' },
        { label: 'Email Deliverability Rate', count: '98.4%' }
      ],
      booleanSnippet: '("VP Talent" OR "VP People" OR "Head of People" OR "Chief Human Resources Officer") AND ("SaaS" OR "Software") AND ("United States")',
      tools: ['Clay.com', 'Apollo.io', 'Sales Navigator', 'NeverBounce', 'Debounce']
    },
    'case-3': {
      title: 'Stealth AI Startup: Foundational Head of Product & Staff ML Engineer',
      category: 'Executive & AI Search',
      metric: 'Shortlist Delivered in 5 Days',
      overview: 'San Francisco based seed-funded generative AI platform required an early-stage Head of Product and a Staff Machine Learning Engineer comfortable with LLM evaluation frameworks.',
      challenge: 'Stealth mode constraints (could not disclose company name publicly) and high salary competition from Tier-1 tech giants.',
      solution: 'Executed discrete confidential talent mapping across ex-FAANG and top AI research labs. Crafted compelling founder-narrative teasers highlighting equity upside and autonomy.',
      funnel: [
        { label: 'Discreet Candidates Mapped', count: '290 profiles' },
        { label: 'Confidential Screenings Conducted', count: '38 candidates' },
        { label: 'Client Founder Pitches', count: '6 finalists' },
        { label: 'Hires Closed', count: '2 key leaders' }
      ],
      booleanSnippet: '("Staff Machine Learning" OR "Principal AI Engineer") AND ("LLM" OR "Transformer" OR "RLHF") AND ("San Francisco" OR "Remote")',
      tools: ['LinkedIn Recruiter', 'ArXiv Author Mining', 'Signal Hire', 'Notion ATS']
    },
    'case-4': {
      title: 'Competitor Talent Mapping: European Remote DevOps & Site Reliability',
      category: 'Talent Mapping & Insights',
      metric: 'Full Landscape Dossier in 6 Days',
      overview: 'A multinational logistics tech enterprise wanted to benchmark talent density, average tenure, and compensation expectations across Eastern Europe and DACH regions for high-availability SRE talent.',
      challenge: 'Fragmented local market job titles, multi-lingual resumes, and lack of clear benchmark salary metrics.',
      solution: 'Synthesized deep regional Boolean sourcing queries and conducted 25 informational qualification interviews to map the entire candidate density map with tier-ranked talent hubs.',
      funnel: [
        { label: 'Regional Profiles Mapped', count: '1,200+ SREs' },
        { label: 'Detailed Talent Matrix Dossier', count: '45-page Report' },
        { label: 'Pre-vetted Talent Bench', count: '48 ready candidates' }
      ],
      booleanSnippet: '("Site Reliability Engineer" OR "DevOps Engineer" OR "Platform Engineer") AND ("Terraform" OR "AWS" OR "Prometheus") AND ("Germany" OR "Poland" OR "Romania")',
      tools: ['LinkedIn Recruiter', 'Google Sheets Pivot', 'Pipedrive', 'ZoomInfo']
    }
  };

  // Portfolio Filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Open / Close Logic
  const modalBackdrop = document.getElementById('caseModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalOverview = document.getElementById('modalOverview');
  const modalChallenge = document.getElementById('modalChallenge');
  const modalSolution = document.getElementById('modalSolution');
  const modalFunnelList = document.getElementById('modalFunnelList');
  const modalBoolean = document.getElementById('modalBoolean');
  const modalToolsList = document.getElementById('modalToolsList');

  document.querySelectorAll('.view-case-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const caseId = e.currentTarget.getAttribute('data-case-id');
      const caseData = caseStudiesData[caseId];

      if (caseData && modalBackdrop) {
        if (modalTitle) modalTitle.textContent = caseData.title;
        if (modalCategory) modalCategory.textContent = caseData.category;
        if (modalOverview) modalOverview.textContent = caseData.overview;
        if (modalChallenge) modalChallenge.textContent = caseData.challenge;
        if (modalSolution) modalSolution.textContent = caseData.solution;
        if (modalBoolean) modalBoolean.textContent = caseData.booleanSnippet;

        // Funnel stages
        if (modalFunnelList) {
          modalFunnelList.innerHTML = caseData.funnel.map(item => `
            <div class="funnel-row" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color);font-size:0.875rem;">
              <span style="color:var(--text-secondary);">${item.label}</span>
              <strong style="color:var(--accent-cyan);font-family:var(--font-mono);">${item.count}</strong>
            </div>
          `).join('');
        }

        // Tools tags
        if (modalToolsList) {
          modalToolsList.innerHTML = caseData.tools.map(tool => `
            <span class="mini-tag" style="margin-right:6px;">${tool}</span>
          `).join('');
        }

        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 7. FAQ Accordion Handler
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8. Clipboard Copy & Toast Notifications
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Selected: ${textToCopy}`);
        });
      } else {
        showToast(`Selected: ${textToCopy}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. Contact Form Mailto Generator & Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const company = formData.get('company') || 'N/A';
      const roleType = formData.get('roleType') || 'Talent Sourcing';
      const subject = formData.get('subject') || `Sourcing Inquiry from ${name}`;
      const message = formData.get('message') || '';

      const bodyContent = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nRequirement: ${roleType}\n\nMessage:\n${message}\n\nSent via Portfolio Contact Form.`;

      const mailtoUrl = `mailto:haiderhusnainllc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;

      showToast('Opening your email client with inquiry...');
      window.location.href = mailtoUrl;
    });
  }

  // Update dynamic year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
