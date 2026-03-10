(function () {
    'use strict';


    var STORAGE_KEYS = Object.freeze({
        SERVICE: 'selectedServiceId',
        PACKAGE: 'selectedPackageId',
        OPTIONS: 'selectedCustomOptions',
        NOTES: 'selectedCustomNotes',
        SCROLL: 'scrollTarget',
        ADDON_HOSTING: 'selectedAddonHosting',
        ADDON_MANAGEMENT: 'selectedAddonManagement',
        ADDON_MANAGEMENT_PLAN: 'selectedAddonManagementPlan'
    });

    var FADE_DURATION = 400;
    var TOAST_DURATION = 4000;
    var SCROLL_DURATION = 1.0;
    var SCROLL_OFFSET = -80;
    var SUBMIT_COOLDOWN_MS = 5000;
    var INPUT_MAX_LENGTH = Object.freeze({
        name: 100,
        email: 254,
        message: 2000,
        businessName: 120,
        websiteUrl: 300
    });

    var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var HOSTING_MONTHLY = 29;
    var MANAGEMENT_BASE_MONTHLY = 99;

    var MANAGEMENT_PLANS = Object.freeze({
        starter: { name: 'Starter Care',  price: 99  },
        growth:  { name: 'Growth Plan',   price: 199 },
        premium: { name: 'Premium Plan',  price: 399 }
    });


    function storageGet(key) {
        try { return sessionStorage.getItem(key); }
        catch (e) { return null; }
    }

    function storageSet(key, value) {
        try { sessionStorage.setItem(key, value); }
        catch (e) {  }
    }

    function storageRemove(key) {
        try { sessionStorage.removeItem(key); }
        catch (e) {  }
    }


    var servicesData = Object.freeze([
        {
            id: "business",
            title: "Business Website",
            icon: "briefcase",
            desc: "A professional multi-page website designed to build trust and convert visitors.",
            popular: true,
            packages: {
                starter: {
                    price: "$1,499",
                    note: "Launch a credible business site fast",
                    features: [
                        "Up to 5 Pages",
                        "Mobile-Responsive Design",
                        "Basic SEO Setup (Titles/Meta + Indexing)",
                        "Contact Form + Lead Delivery",
                        "Basic Analytics Setup (GA4)",
                        "Launch + Basic Training"
                    ]
                },
                custom: {
                    price: "From $1,699",
                    note: "Choose only the modules you need",
                    features: [
                        "Starter Included (Pre-selected)",
                        "Add Pages, Blog/CMS, SEO, Tracking, Integrations",
                        "Built to Your Exact Scope",
                        "Modular Pricing Based on Selections",
                        "Easy Upgrades Later"
                    ]
                },
                professional: {
                    price: "$3,499",
                    note: "Growth-ready site with SEO + tracking included",
                    features: [
                        "Up to 12 Pages",
                        "Blog/CMS Setup + Content Templates",
                        "Local SEO Pack + Schema Basics",
                        "Advanced Analytics Events + Funnel Tracking",
                        "Performance + Security + Accessibility Basics",
                        "Copy/Layout Conversion Polish"
                    ]
                }
            }
        },
        {
            id: "landing",
            title: "Landing Page",
            icon: "mouse-pointer-click",
            desc: "A high-converting single page focused on one goal — leads, signups, or sales.",
            popular: false,
            packages: {
                starter: {
                    price: "$499",
                    note: "Simple landing page for quick launches",
                    features: [
                        "1 Landing Page (Up to ~7 Sections)",
                        "Mobile-Responsive Layout",
                        "Contact/Lead Form",
                        "Basic SEO + Index Setup",
                        "Basic Analytics Setup (GA4)",
                        "Launch in 3–5 Days"
                    ]
                },
                custom: {
                    price: "From $599",
                    note: "Campaign-ready with tracking & integrations",
                    features: [
                        "Starter Included (Pre-selected)",
                        "Add Sections, Copy, Pixels/Events, CRM, Heatmaps, A/B Variants",
                        "Tailored to Your Offer/Funnel",
                        "Modular Pricing Based on Selections",
                        "Scales for Ads + Campaigns"
                    ]
                },
                professional: {
                    price: "$1,299",
                    note: "Conversion-focused setup with tracking & testing",
                    features: [
                        "Landing Page + 1 A/B Variant (Test-Ready)",
                        "Ad Pixels + Key Events Setup",
                        "Heatmap Setup (Hotjar/Clarity)",
                        "CRM/Email Integration (1 Platform)",
                        "Conversion-Focused Layout + CTA Structure",
                        "Speed Optimization + QA Pass"
                    ]
                }
            }
        },
        {
            id: "ecommerce",
            title: "E-Commerce Store",
            icon: "shopping-cart",
            desc: "Online store with secure checkout, payments, and product management.",
            popular: false,
            packages: {
                starter: {
                    price: "$2,999",
                    note: "Start selling online with the essentials",
                    features: [
                        "Store Setup (Shopify/WooCommerce)",
                        "Up to 15 Products Added",
                        "Payments + Shipping Setup (Basic)",
                        "Collections/Categories Setup (Basic)",
                        "Mobile-Responsive Theme Customization",
                        "Basic Analytics Setup (GA4)",
                        "Launch + Store Training"
                    ]
                },
                custom: {
                    price: "From $3,299",
                    note: "Add operations + conversion modules as you grow",
                    features: [
                        "Starter Included (Pre-selected)",
                        "Add Products, Pages, Reviews, Upsells, Email Flows",
                        "Integrations (Inventory/POS, Email, etc.)",
                        "Built Around Your Operations",
                        "Add-ons Priced Per Selection"
                    ]
                },
                professional: {
                    price: "$7,499",
                    note: "Conversion-ready store with growth foundations included",
                    features: [
                        "Up to 75 Products Added",
                        "Custom Category Structure + Filters",
                        "Reviews + UGC Integration",
                        "Product Bundles/Upsells Setup",
                        "Email Flows (Welcome + Cart Abandon)",
                        "Store SEO Foundations (Templates + Schema Basics)"
                    ]
                }
            }
        },
        {
            id: "booking",
            title: "Booking Website",
            icon: "calendar-days",
            desc: "Integrated appointment scheduling with automated confirmations.",
            popular: false,
            packages: {
                starter: {
                    price: "$1,999",
                    note: "Automate bookings with a clean setup",
                    features: [
                        "Up to 5 Pages",
                        "Booking System Setup (Calendly/Acuity)",
                        "Email Confirmations (Basic)",
                        "Mobile-Responsive Design",
                        "Basic Analytics Setup (GA4)",
                        "Launch + Training"
                    ]
                },
                custom: {
                    price: "From $2,199",
                    note: "Add payments, reminders, intake forms, and staff",
                    features: [
                        "Starter Included (Pre-selected)",
                        "Add Deposits, Multiple Staff, SMS, Intake Forms, Policies",
                        "Integrations (Payments, CRM, Email)",
                        "Custom Booking Flows by Service Type",
                        "Add-ons Priced Per Selection"
                    ]
                },
                professional: {
                    price: "$4,499",
                    note: "Operations-ready booking system (payments + reminders included)",
                    features: [
                        "Up to 12 Pages",
                        "Multi-Service + Staff Calendars",
                        "Deposits/Online Payments Setup",
                        "Intake Form + Conditional Questions",
                        "Automated Email/SMS Reminders",
                        "Analytics Events for Booking Conversions"
                    ]
                }
            }
        },
        {
            id: "portfolio",
            title: "Portfolio Website",
            icon: "image",
            desc: "Showcase your work and skills with a polished creative presence.",
            popular: false,
            packages: {
                starter: {
                    price: "$799",
                    note: "A clean portfolio that's easy to share",
                    features: [
                        "Up to 4 Pages",
                        "Portfolio Gallery Layout",
                        "Mobile-Responsive Design",
                        "Contact Form",
                        "Basic SEO Setup",
                        "Basic Analytics Setup (GA4)"
                    ]
                },
                custom: {
                    price: "From $899",
                    note: "Add case studies, CMS, and polish as needed",
                    features: [
                        "Starter Included (Pre-selected)",
                        "Add Case Studies, Blog, CMS, Motion, Newsletter",
                        "Tailored Layout to Your Style",
                        "Add-ons Priced Per Selection",
                        "Easy Upgrades Later"
                    ]
                },
                professional: {
                    price: "$1,999",
                    note: "A polished portfolio built to win better clients",
                    features: [
                        "Up to 10 Pages",
                        "Case Study Template + CMS Collections",
                        "Advanced Interactions + Design Polish (Scoped)",
                        "Speed Optimization + Image/Video Handling",
                        "SEO Foundations + Analytics Events",
                        "Newsletter Signup Integration"
                    ]
                }
            }
        },
        {
            id: "webapp",
            title: "Web Application",
            icon: "cpu",
            desc: "Custom web apps with dashboards, databases, and advanced functionality.",
            popular: false,
            packages: {
                starter: {
                    price: "$6,000",
                    note: "MVP foundation to validate your product",
                    features: [
                        "MVP Scope (Core Feature Set)",
                        "Auth (Login/Signup) Basics",
                        "Database + Admin-Ready Structure",
                        "Responsive UI (Basic)",
                        "Deployment to Production",
                        "Basic QA Pass"
                    ]
                },
                custom: {
                    price: "From $7,500",
                    note: "Sprint-based build with modular functionality",
                    features: [
                        "Starter Included (Pre-selected)",
                        "Add Roles, Payments, Dashboards, APIs, Testing",
                        "Sprint-Based Build with Clear Milestones",
                        "Integrations Priced Per Selection",
                        "Scales Into Full Product"
                    ]
                },
                professional: {
                    price: "$15,000+",
                    note: "Production-grade build with premium UI/UX + QA",
                    features: [
                        "Full MVP + Premium UI/UX Pass",
                        "Roles/Permissions + Admin Dashboard",
                        "Logging/Monitoring + QA Pass",
                        "Automated Testing Setup (Baseline)",
                        "Documentation + Handoff Support",
                        "Optional Payments/Subscriptions (If Needed)"
                    ]
                }
            }
        },
        {
            id: "redesign",
            title: "Web Redesign",
            icon: "refresh-cw",
            desc: "Transform your existing website with modern design and better performance.",
            popular: false,
            packages: {
                starter: {
                    price: "$1,200",
                    note: "Modernize your site without a full rebuild",
                    features: [
                        "Redesign Up to 5 Pages",
                        "Mobile + Layout Cleanup",
                        "Basic Speed Improvements",
                        "Basic SEO Preservation",
                        "Analytics Setup Check (GA4)",
                        "Launch Support"
                    ]
                },
                custom: {
                    price: "From $1,500",
                    note: "Add migration, performance, content, and brand upgrades",
                    features: [
                        "Starter Included (Pre-selected)",
                        "Add Page Rebuilds, Content Rewrite, SEO Migration, Performance",
                        "Keep What Works, Improve What Don’t",
                        "Add-ons Priced Per Selection",
                        "Best If You’re Unsure of Scope"
                    ]
                },
                professional: {
                    price: "$4,000",
                    note: "Full redesign with migration safety + performance included",
                    features: [
                        "Redesign Up to 12 Pages",
                        "Copy/Layout Conversion Pass",
                        "SEO Migration + Redirect Map",
                        "Performance Deep Optimization",
                        "Accessibility Basics Pass",
                        "Analytics + Event Tracking Refresh"
                    ]
                }
            }
        },
        {
            id: "management",
            title: "Ongoing Management",
            icon: "shield-check",
            desc: "Monthly updates, maintenance, security, and technical support.",
            popular: false,
            packages: {
                starter: {
                    price: "$99/mo",
                    note: "Core maintenance + peace of mind",
                    features: [
                        "Updates (Themes/Plugins) Monthly",
                        "Backups + Uptime Monitoring",
                        "Basic Security Checks",
                        "Minor Edits (30 min/mo)",
                        "Monthly Report"
                    ]
                },
                custom: {
                    price: "From $149/mo",
                    note: "Add support time, tracking, SEO, and performance as needed",
                    features: [
                        "Starter Included (Pre-selected)",
                        "Add Hours, SEO, Content, Security, Performance, Analytics",
                        "Flexible Month-to-Month Scope",
                        "Best for Growing Businesses",
                        "Add-ons Priced Per Selection"
                    ]
                },
                professional: {
                    price: "$499/mo",
                    note: "Priority support + proactive monitoring",
                    features: [
                        "Weekly Updates + Monitoring",
                        "Priority Support",
                        "Minor Edits (4 hrs/mo)",
                        "Monthly Speed + SEO Checks",
                        "Emergency Restore Support",
                        "Analytics Dashboard + KPI Tracking"
                    ]
                }
            }
        },
        {
            id: "custom-inquiry",
            title: "Custom Project Inquiry",
            icon: "message-square-plus",
            desc: "Not sure which service fits your needs? Describe your goals and we'll recommend the best solution.",
            popular: false,
            isInquiry: true,
            packages: null
        }
    ]);


    var lenis = null;
    var activeServiceId = null;
    var isMenuOpen = false;
    var lastSubmitTime = 0;
    var wheelHandler = null;


    document.addEventListener('DOMContentLoaded', function() {
        try {
            init();
        } catch(e) {
            console.error('AlgoCraftDev init error:', e);

            document.body.style.opacity = '1';
            document.body.classList.add('fade-in');
        }
    });


    function initPageVisibility() {
        var styleEl = document.createElement('style');
        styleEl.id = 'anim-pause-style';
        document.head.appendChild(styleEl);

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                styleEl.textContent = '*, *::before, *::after { animation-play-state: paused !important; }';
                if (lenis) lenis.stop();
            } else {
                styleEl.textContent = '';
                if (lenis) lenis.start();
            }
        });
    }

    function init() {
        initEmailJS();
        initLenis();
        refreshIcons();
        initFadeIn();
        initPageVisibility();
        initNavigation();
        initServiceModal();
        initAskModal();
        initAddonModals();
        initServiceCards();
        initPackageButtons();
        initClearSelection();
        initContactForm();
        initInquiryForm();
        initFAQ();
        initBlobObserver();
        initAddons();
        initManagementPlans();
        initContactPill();
        handleReturnScroll();
        updateContactSummaryPill();
        initScrollReveal();
        cleanURL();
    }


    function initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("UcOiwxLG_ZaSYkuFs");
        }
    }


    function cleanURL() {
        if (window.location.hash) {
            try {
                history.replaceState(null, '', window.location.pathname + window.location.search);
            } catch (e) {  }
        }
    }


    function initLenis() {
        if (typeof Lenis !== 'undefined') {
            startLenis();
            return;
        }
        var script = document.createElement('script');
        script.src = 'js/vendor/lenis.min.js';
        script.onload = function () {
            if (typeof Lenis !== 'undefined') startLenis();
        };
        document.head.appendChild(script);
    }

    function startLenis() {
        try {

            var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            lenis = new Lenis({
                duration: 1.1,
                easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
                smoothWheel: !isIOS,
                smoothTouch: false,
                wheelMultiplier: 1.0,
                touchMultiplier: isIOS ? 1.0 : 1.5
            });
            function raf(time) {
                try {
                    lenis.raf(time);
                } catch(e) {
                    console.warn('Lenis raf error, stopping loop:', e);
                    lenis = null;
                    return;
                }
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        } catch (e) {
            console.warn('Lenis smooth scroll failed to initialize:', e);
            lenis = null;
        }
    }

    function scrollTo(target, opts) {
        if (!lenis) return;
        var defaults = { duration: SCROLL_DURATION, offset: SCROLL_OFFSET };
        var merged = {};
        var key;
        for (key in defaults) { merged[key] = defaults[key]; }
        if (opts) { for (key in opts) { merged[key] = opts[key]; } }
        lenis.scrollTo(target, merged);
    }



    var serviceDetails = {
        'business': {
            color: 'cyan',
            category: 'Multi-Page Website',
            tagline: 'Builds trust · Converts visitors',
            overview: 'A custom-built multi-page website that represents your business professionally online. It\'s designed to build trust with potential customers, explain what you do, and turn visitors into leads or sales.',
            whoFor: 'Local businesses, service providers, consultants, agencies, or any company that needs a credible online presence to attract and convert customers.',
            includes: [
                'Core page set (Home/About/Services/Contact) within your selected page limit',
                'Mobile-responsive layout across all devices',
                'Contact form with lead delivery to your email',
                'On-page SEO setup — titles, meta descriptions, headings',
                'Fast loading speeds with clean, optimized code',
                'Google Analytics (GA4) setup'
            ],
            useCases: ['Law firm', 'Marketing agency', 'Contractor', 'Med spa', 'Accounting firm', 'Restaurant']
        },
        'landing': {
            color: 'purple',
            category: 'Single-Page Conversion',
            tagline: 'Focused · High-converting',
            overview: 'A single, focused page built to convert visitors into leads, signups, or sales. Everything on the page points toward one clear action — no distractions, no extra navigation.',
            whoFor: 'Business owners running ads, launching a product, promoting an event, or collecting leads from a specific campaign.',
            includes: [
                'Single landing page with up to ~7 sections (expandable with add-ons)',
                'Conversion-focused layout and CTA structure',
                'Mobile-responsive and fast by default',
                'Lead capture form with delivery setup',
                'Basic SEO + indexing setup',
                'Analytics (GA4) setup',
                'Ad pixels/events available (add-on or Professional)'
            ],
            useCases: ['Product launch', 'Google Ads campaign', 'Event registration', 'Free consultation offer', 'Email list signup']
        },
        'ecommerce': {
            color: 'yellow',
            category: 'Online Store',
            tagline: 'Sell online · Built to scale',
            overview: 'A fully functional online store where customers can browse products, add to cart, and check out securely. Built on a reliable platform like Shopify or WooCommerce and customized to fit your brand.',
            whoFor: 'Anyone selling physical products, digital downloads, or merchandise online — from small boutiques to growing retail brands.',
            includes: [
                'Store setup on Shopify or WooCommerce',
                'Product pages with images, descriptions, and variants',
                'Secure payment processing (Stripe, PayPal, etc.)',
                'Shipping rates and tax configuration',
                'Mobile-optimized shopping experience',
                'Order management and customer account setup'
            ],
            useCases: ['Clothing brand', 'Home goods store', 'Supplement company', 'Digital product shop', 'Local retail going online']
        },
        'booking': {
            color: 'pink',
            category: 'Booking & Scheduling',
            tagline: 'Automates bookings · Saves time',
            overview: 'A professional website with an integrated scheduling system that lets clients book appointments directly online — 24/7, without back-and-forth messaging.',
            whoFor: 'Service-based businesses that rely on appointments: salons, clinics, coaches, personal trainers, photographers, consultants.',
            includes: [
                'Booking system setup (Calendly or Acuity)',
                'Service and availability configuration',
                'Automated email confirmations (basic)',
                'Mobile-friendly booking flow',
                'Optional deposits/payments at booking (add-on)',
                'Calendar sync (Google Calendar/Outlook where supported)'
            ],
            useCases: ['Hair salon', 'Physiotherapy clinic', 'Personal trainer', 'Life coach', 'Photography studio', 'Tattoo artist']
        },
        'portfolio': {
            color: 'blue',
            category: 'Portfolio & Showcase',
            tagline: 'Stand out · Show your work',
            overview: 'A polished personal or studio website that showcases your work in the best possible light. Designed to make a strong first impression on potential clients or employers.',
            whoFor: 'Freelancers, creatives, designers, developers, photographers, architects, and anyone whose work speaks for itself.',
            includes: [
                'Gallery or case study layout for your work',
                'About and contact pages',
                'Mobile-responsive design',
                'Image optimization for fast loading',
                'Basic SEO setup',
                'Optional blog or journal section'
            ],
            useCases: ['Graphic designer', 'UX designer', 'Photographer', 'Architect', 'Copywriter', 'Developer looking for clients']
        },
        'webapp': {
            color: 'purple',
            category: 'Custom Web Application',
            tagline: 'Beyond a website · Built for users',
            overview: 'A fully custom web application built from scratch — not a website with a plugin, but real software running in the browser. Think dashboards, portals, tools, or platforms with logic, databases, and user accounts.',
            whoFor: 'Startups building a product, businesses automating internal processes, or teams needing a custom tool that off-the-shelf software can\'t provide.',
            includes: [
                'User authentication (login, signup, roles)',
                'Database design and backend logic',
                'Custom dashboard or admin interface',
                'API integrations with third-party services',
                'Responsive UI built for usability',
                'Deployment to production (cloud hosting)'
            ],
            useCases: ['SaaS product MVP', 'Internal staff portal', 'Client dashboard', 'Booking or inventory system', 'Marketplace or directory']
        },
        'redesign': {
            color: 'pink',
            category: 'Full Site Redesign',
            tagline: 'Modern · Fast · Better conversions',
            overview: 'A complete rebuild of your existing website with a modern design, better performance, and improved user experience — while keeping what already works for your SEO and brand.',
            whoFor: 'Businesses with an outdated website that looks unprofessional, loads slowly, or no longer reflects their brand and services accurately.',
            includes: [
                'Redesign within your selected page limit',
                'Mobile layout cleanup and modernization',
                'Speed and performance improvements',
                'SEO preservation (titles/meta + structure best practices)',
                'Optional SEO migration/redirects available (add-on)',
                'Optional copy refresh/new sections available (add-on)'
            ],
            useCases: ['5-year-old site that looks dated', 'Rebranded company', 'Site that scores poorly on mobile', 'New service offerings to showcase']
        },
        'management': {
            color: 'green',
            category: 'Ongoing Maintenance',
            tagline: 'Always updated · Always protected',
            overview: 'A monthly retainer plan where we handle all the technical upkeep of your website so you don\'t have to think about it. Updates, security, backups, and fixes are all taken care of.',
            whoFor: 'Business owners who want their website to stay secure, current, and performing well without managing it themselves.',
            includes: [
                'Monthly plugin, theme, and CMS updates',
                'Daily or weekly backups with restore capability',
                'Uptime monitoring and security checks',
                'Minor content edits (text, images, prices)',
                'Monthly performance and health report',
                'Priority support for issues that come up'
            ],
            useCases: ['Businesses on WordPress or Shopify', 'Owners who want hands-off maintenance', 'Sites that were built externally and need ongoing care']
        }
    };

    function initServiceModal() {
        var modal    = document.getElementById('service-modal');
        var panel    = modal ? modal.querySelector('.svc-modal-panel') : null;
        var closeBtn = document.getElementById('svc-modal-close');
        var ctaBtn   = document.getElementById('svc-modal-cta');
        var backdrop = modal ? modal.querySelector('.svc-modal-backdrop') : null;

        if (!modal || !panel) return;

        var currentServiceId = null;

        function openModal(serviceId) {
            var service = null;
            for (var i = 0; i < servicesData.length; i++) {
                if (servicesData[i].id === serviceId) { service = servicesData[i]; break; }
            }
            var details = serviceDetails[serviceId];
            if (!service || !details) return;

            currentServiceId = serviceId;


            var iconEl = document.getElementById('svc-modal-icon');
            iconEl.innerHTML = '<i data-lucide="' + escapeAttr(service.icon) + '"></i>';
            panel.setAttribute('data-color', details.color);


            document.getElementById('svc-modal-title').textContent = service.title;
            var catEl = document.getElementById('svc-modal-category');
            var tagEl = document.getElementById('svc-modal-tagline');
            if (catEl) catEl.textContent = details.category || '';
            if (tagEl) tagEl.textContent = details.tagline  || '';


            var includesHTML = '<ul class="svc-includes-list" data-color="' + escapeAttr(details.color) + '">' +
                details.includes.map(function(item) {
                    return '<li>' + escapeHTML(item) + '</li>';
                }).join('') +
            '</ul>';


            var useCasesHTML = '<div class="svc-usecases">' +
                details.useCases.map(function(uc) {
                    return '<span class="svc-usecase-tag">' + escapeHTML(uc) + '</span>';
                }).join('') +
            '</div>';


            document.getElementById('svc-modal-body').innerHTML =
                '<div><p class="svc-section-label">Overview</p>' +
                    '<p class="svc-section-text">' + escapeHTML(details.overview) + '</p></div>' +
                '<div class="svc-divider"></div>' +
                '<div><p class="svc-section-label">Who This Is For</p>' +
                    '<p class="svc-section-text">' + escapeHTML(details.whoFor) + '</p></div>' +
                '<div class="svc-divider"></div>' +
                '<div><p class="svc-section-label">What It Includes</p>' + includesHTML + '</div>' +
                '<div class="svc-divider"></div>' +
                '<div><p class="svc-section-label">Typical Use Cases</p>' + useCasesHTML + '</div>';


            modal.removeAttribute('hidden');


            var scrollY = window.scrollY || window.pageYOffset;
            document.body.style.position = 'fixed';
            document.body.style.top = '-' + scrollY + 'px';
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.dataset.scrollY = scrollY;
            document.body.classList.add('modal-open');
            panel.scrollTop = 0;


            modal._touchTrap = function(e) {
                if (panel.contains(e.target)) return;
                e.preventDefault();
                if (e.touches && e.touches.length === 1) {
                    var dy = (modal._lastTouchY !== undefined) ? (modal._lastTouchY - e.touches[0].clientY) : 0;
                    modal._lastTouchY = e.touches[0].clientY;
                    var atTop    = panel.scrollTop === 0 && dy < 0;
                    var atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1 && dy > 0;
                    if (!atTop && !atBottom) panel.scrollTop += dy;
                }
            };
            modal._touchStart = function(e) {
                modal._lastTouchY = e.touches[0] ? e.touches[0].clientY : undefined;
            };
            modal.addEventListener('touchstart', modal._touchStart, { passive: true });
            modal.addEventListener('touchmove', modal._touchTrap, { passive: false });


            modal._wheelTrap = function(e) {
                e.preventDefault();
                var atTop    = panel.scrollTop === 0 && e.deltaY < 0;
                var atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1 && e.deltaY > 0;
                if (!atTop && !atBottom) {
                    panel.scrollTop += e.deltaY;
                }
            };
            modal.addEventListener('wheel', modal._wheelTrap, { passive: false });


            if (typeof lenis !== 'undefined' && lenis) lenis.stop();


            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    modal.classList.add('is-open');
                    var panel = modal.querySelector('.svc-modal-panel');
                    if (panel) panel.scrollTop = 0;
                    refreshIcons(modal);
                });
            });
        }

        function closeModal() {
            modal.classList.remove('is-open');


            var savedY = parseFloat(document.body.dataset.scrollY) || 0;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            delete document.body.dataset.scrollY;
            document.body.classList.remove('modal-open');
            window.scrollTo(0, savedY);


            if (modal._wheelTrap) {
                modal.removeEventListener('wheel', modal._wheelTrap);
                modal._wheelTrap = null;
            }


            if (modal._touchStart) {
                modal.removeEventListener('touchstart', modal._touchStart);
                modal._touchStart = null;
                modal._lastTouchY = undefined;
            }
            if (modal._touchTrap) {
                modal.removeEventListener('touchmove', modal._touchTrap);
                modal._touchTrap = null;
            }


            if (typeof lenis !== 'undefined' && lenis) lenis.start();

            setTimeout(function() {
                modal.setAttribute('hidden', '');
                currentServiceId = null;
            }, 320);
        }


        closeBtn.addEventListener('click', closeModal);


        backdrop.addEventListener('click', closeModal);


        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
        });


        ctaBtn.addEventListener('click', function() {
            if (!currentServiceId) return;
            var idToSelect = currentServiceId;
            closeModal();
            setTimeout(function() {
                if (window._selectService) {
                    window._selectService(idToSelect);
                }
            }, 360);
        });


        window._openServiceModal = openModal;
    }


    function initAskModal() {
        var modal    = document.getElementById('ask-modal');
        var panel    = modal ? modal.querySelector('.ask-modal-panel') : null;
        var backdrop = modal ? modal.querySelector('.ask-modal-backdrop') : null;
        var closeBtn = document.getElementById('ask-modal-close');
        var form     = document.getElementById('ask-modal-form');
        var submitBtn= document.getElementById('ask-submit-btn');
        var success  = document.getElementById('ask-success');
        var triggerBtn = document.getElementById('ask-question-btn');

        if (!modal || !panel || !triggerBtn) return;


        function openAskModal() {
            modal.removeAttribute('hidden');
            var scrollY = window.scrollY || window.pageYOffset;
            document.body.style.position = 'fixed';
            document.body.style.top = '-' + scrollY + 'px';
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.dataset.askScrollY = scrollY;
            document.body.classList.add('ask-modal-open');
            panel.scrollTop = 0;


            modal._touchTrap = function(e) {
                if (panel.contains(e.target)) return;
                e.preventDefault();
                if (e.touches && e.touches.length === 1) {
                    var dy = (modal._lastTouchY !== undefined) ? (modal._lastTouchY - e.touches[0].clientY) : 0;
                    modal._lastTouchY = e.touches[0].clientY;
                    var atTop    = panel.scrollTop === 0 && dy < 0;
                    var atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1 && dy > 0;
                    if (!atTop && !atBottom) panel.scrollTop += dy;
                }
            };
            modal._touchStart = function(e) {
                modal._lastTouchY = e.touches[0] ? e.touches[0].clientY : undefined;
            };
            modal.addEventListener('touchstart', modal._touchStart, { passive: true });
            modal.addEventListener('touchmove', modal._touchTrap, { passive: false });


            modal._wheelTrap = function(e) {
                e.preventDefault();
                var atTop    = panel.scrollTop === 0 && e.deltaY < 0;
                var atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1 && e.deltaY > 0;
                if (!atTop && !atBottom) panel.scrollTop += e.deltaY;
            };
            modal.addEventListener('wheel', modal._wheelTrap, { passive: false });

            if (typeof lenis !== 'undefined' && lenis) lenis.stop();

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    modal.classList.add('is-open');
                    refreshIcons();
                });
            });
        }

        function closeAskModal() {
            modal.classList.remove('is-open');

            var savedY = parseFloat(document.body.dataset.askScrollY) || 0;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            delete document.body.dataset.askScrollY;
            document.body.classList.remove('ask-modal-open');
            window.scrollTo(0, savedY);

            if (modal._touchStart) {
                modal.removeEventListener('touchstart', modal._touchStart);
                modal._touchStart = null;
                modal._lastTouchY = undefined;
            }
            if (modal._touchTrap) {
                modal.removeEventListener('touchmove', modal._touchTrap);
                modal._touchTrap = null;
            }
            if (modal._wheelTrap) {
                modal.removeEventListener('wheel', modal._wheelTrap);
                modal._wheelTrap = null;
            }
            if (typeof lenis !== 'undefined' && lenis) lenis.start();

            setTimeout(function() {
                modal.setAttribute('hidden', '');

                if (form) form.reset();
                if (success) success.setAttribute('hidden', '');
                if (form) form.style.display = '';
                clearAskErrors();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                    var btnText = submitBtn.querySelector('.ask-btn-text');
                    if (btnText) btnText.textContent = 'Send Message';
                }
            }, 320);
        }


        triggerBtn.addEventListener('click', openAskModal);
        closeBtn.addEventListener('click', closeAskModal);
        backdrop.addEventListener('click', closeAskModal);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) closeAskModal();
        });


        function clearAskErrors() {
            ['name','email','message'].forEach(function(f) {
                var field = document.getElementById('ask-field-' + f);
                var err   = document.getElementById('ask-err-' + f);
                if (field) field.classList.remove('has-error');
                if (err)   err.textContent = '';
            });
        }

        function setAskError(fieldId, msg) {
            var field = document.getElementById('ask-field-' + fieldId);
            var err   = document.getElementById('ask-err-' + fieldId);
            if (field) field.classList.add('has-error');
            if (err)   err.textContent = msg;
        }

        function validateAsk() {
            clearAskErrors();
            var name    = document.getElementById('ask-name').value.trim();
            var email   = document.getElementById('ask-email').value.trim();
            var message = document.getElementById('ask-message').value.trim();
            var valid   = true;

            if (!name) { setAskError('name', 'Please enter your name.'); valid = false; }
            if (!email) {
                setAskError('email', 'Please enter your email.'); valid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setAskError('email', 'Please enter a valid email.'); valid = false;
            }
            if (!message) { setAskError('message', 'Please write a message.'); valid = false; }

            return valid;
        }


        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateAsk()) return;

            var name    = document.getElementById('ask-name').value.trim();
            var email   = document.getElementById('ask-email').value.trim();
            var message = document.getElementById('ask-message').value.trim();
            var btnText = submitBtn.querySelector('.ask-btn-text');

            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            if (btnText) btnText.textContent = 'Sending';

            if (typeof emailjs === 'undefined') {
                if (btnText) btnText.textContent = 'Send Message';
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                showNotification('Email service not loaded. Please try again.', 'error');
                return;
            }

            emailjs.send('service_qzgdeii', 'template_27cs3r5', {
                name:             name,
                email:            email,
                project_type:     '❓ ASK A QUESTION',
                selected_service: 'General Question',
                selected_package: 'N/A',
                custom_options:   'N/A',
                custom_notes:     'N/A',
                message:
                    '=== ASK A QUESTION ===\n\n' +
                    'MESSAGE:\n' + message + '\n' +
                    '\n====================='
            })
            .then(function() {
                form.style.display = 'none';
                success.removeAttribute('hidden');
                refreshIcons();

                setTimeout(closeAskModal, 2500);
            })
            .catch(function(err) {
                console.error('Ask modal EmailJS error:', err);
                if (btnText) btnText.textContent = 'Send Message';
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                showNotification('Failed to send. Please try again.', 'error');
            });
        });


        ['ask-name','ask-email','ask-message'].forEach(function(id) {
            var el = document.getElementById(id);
            var fieldId = id.replace('ask-', '');
            if (el) el.addEventListener('input', function() {
                var field = document.getElementById('ask-field-' + fieldId);
                var err   = document.getElementById('ask-err-' + fieldId);
                if (field) field.classList.remove('has-error');
                if (err)   err.textContent = '';
            });
        });
    }


    function refreshIcons(scope) {
        if (typeof lucide !== 'undefined') {

            if (scope && typeof lucide.createIcons === 'function') {
                lucide.createIcons({ nameAttr: 'data-lucide', nodes: scope.querySelectorAll('[data-lucide]') });
            } else {
                lucide.createIcons();
            }
            return;
        }
        var script = document.createElement('script');
        script.src = 'js/vendor/lucide.min.js';
        script.onload = function () {
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };
        document.head.appendChild(script);
    }


    function initFadeIn() {
        var loader = document.getElementById('page-loader');
        if (loader) loader.classList.remove('active');
        document.body.classList.remove('loading');
        window.addEventListener('pageshow', function() {
            document.body.classList.remove('loading');
        });


        if (typeof IntersectionObserver !== 'undefined') {
            var bentoCards = document.querySelectorAll('.bento-card');
            if (bentoCards.length) {
                var bentoObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('bento-visible');
                            bentoObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

                bentoCards.forEach(function (card) {
                    bentoObserver.observe(card);


                    card.addEventListener('mousemove', function(e) {
                        var rect = card.getBoundingClientRect();
                        var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
                        var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
                        card.style.setProperty('--bento-x', x);
                        card.style.setProperty('--bento-y', y);
                    });


                    card.addEventListener('mouseleave', function() {
                        card.style.setProperty('--bento-x', '50%');
                        card.style.setProperty('--bento-y', '50%');
                    });
                });
            }
        }
    }

    function fadeOutAndNavigate(url) {
        var loader = document.getElementById('page-loader');
        if (loader) loader.classList.add('active');
        document.body.classList.add('fade-out');
        setTimeout(function () {
            window.location.replace(url);
        }, FADE_DURATION);
    }


    function showNotification(text, type) {
        var container = document.getElementById('notification-container');
        if (!container) return;

        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = text;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        container.appendChild(toast);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                toast.classList.add('show');
            });
        });

        setTimeout(function () {
            toast.classList.remove('show');

            var onEnd = function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
                toast.removeEventListener('transitionend', onEnd);
            };

            toast.addEventListener('transitionend', onEnd);

            setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 800);
        }, TOAST_DURATION);
    }


    function addWheelBlock() {
        if (wheelHandler) return;
        wheelHandler = function (e) {
            e.preventDefault();
        };
        document.addEventListener('wheel', wheelHandler, { passive: false });
    }

    function removeWheelBlock() {
        if (!wheelHandler) return;
        document.removeEventListener('wheel', wheelHandler);
        wheelHandler = null;
    }


    function initNavigation() {
        var menuOpen = document.getElementById('menu-open');
        var menuClose = document.getElementById('menu-close');
        var navMenu = document.getElementById('nav-menu');

        function openMenu() {
            if (!navMenu) return;
            navMenu.classList.add('active');
            if (menuOpen) menuOpen.classList.add('hidden');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
            isMenuOpen = true;
            addWheelBlock();

            var firstLink = navMenu.querySelector('.nav-links a');
            if (firstLink) firstLink.focus();
        }

        function closeMenu() {
            if (!navMenu) return;
            navMenu.classList.remove('active');
            if (menuOpen) menuOpen.classList.remove('hidden');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
            isMenuOpen = false;
            removeWheelBlock();

            if (menuOpen) menuOpen.focus();
        }

        if (menuOpen) {
            menuOpen.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                openMenu();
            });
        }

        if (menuClose) {
            menuClose.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });

        document.addEventListener('click', function (e) {
            if (!isMenuOpen || !navMenu || !menuOpen) return;

            var clickedInsideMenu = navMenu.contains(e.target);
            var clickedToggle = menuOpen.contains(e.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });

        document.addEventListener('touchmove', function (e) {
            if (isMenuOpen && navMenu && !navMenu.contains(e.target)) {
                e.preventDefault();
            }
        }, { passive: false });

        var scrollLinks = document.querySelectorAll('a[href^="#"]');
        scrollLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var targetId = link.getAttribute('href');
                if (targetId === '#' || !document.querySelector(targetId)) return;

                e.preventDefault();
                e.stopPropagation();

                if (isMenuOpen) {
                    closeMenu();
                    if (targetId === '#custom-inquiry') activateInquiryMode();
                    if (targetId === '#services') deactivateInquiryMode();
                    if (lenis) lenis.resize();
                    reliableScrollTo(targetId, { delay: 260 });
                } else {
                    if (targetId === '#custom-inquiry') activateInquiryMode();
                    if (targetId === '#services') deactivateInquiryMode();
                    if (lenis) lenis.resize();
                    reliableScrollTo(targetId, { delay: 20 });
                }
            });
        });

        var startProjectBtn = document.querySelector('.project-btn');
        if (startProjectBtn) {
            startProjectBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                reliableScrollTo('#services', { offset: -50 });
            });
        }

        var logoBtn = document.getElementById('logo-btn');
        if (logoBtn) {
            logoBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                reliableScrollTo(0);
            });
        }

        var changeServiceBtn = document.getElementById('change-service-btn');
        if (changeServiceBtn) {
            changeServiceBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                reliableScrollTo('#services');
            });
        }

        var replaceLinks = document.querySelectorAll('.replace-link');
        replaceLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var url = link.getAttribute('href');
                document.body.classList.add('fade-out');
                setTimeout(function () {
                    window.location.replace(url);
                }, FADE_DURATION);
            });
        });
    }


    function initAddonModals() {
        var modals = {
            hosting:    document.getElementById('hosting-info-modal'),
            management: document.getElementById('management-info-modal')
        };
        var btns = {
            hosting:    document.getElementById('hosting-learn-btn'),
            management: document.getElementById('management-learn-btn')
        };

        function openAddonModal(type) {
            var modal = modals[type];
            if (!modal) return;
            modal.removeAttribute('hidden');

            var scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = '-' + scrollY + 'px';
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.dataset.addonScrollY = scrollY;
            if (typeof lenis !== 'undefined' && lenis) lenis.stop();


            var panel = modal.querySelector('.addon-info-panel');
            if (panel) {
                modal._wheelTrap = function(e) {
                    e.preventDefault();
                    var atTop    = panel.scrollTop === 0 && e.deltaY < 0;
                    var atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1 && e.deltaY > 0;
                    if (!atTop && !atBottom) {
                        panel.scrollTop += e.deltaY;
                    }
                };
                modal.addEventListener('wheel', modal._wheelTrap, { passive: false });


                modal._touchTrap = function(e) {
                    if (panel.contains(e.target)) return;
                    e.preventDefault();
                    if (e.touches && e.touches.length === 1) {
                        var dy = (modal._lastTouchY !== undefined) ? (modal._lastTouchY - e.touches[0].clientY) : 0;
                        modal._lastTouchY = e.touches[0].clientY;
                        var atTop    = panel.scrollTop === 0 && dy < 0;
                        var atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1 && dy > 0;
                        if (!atTop && !atBottom) panel.scrollTop += dy;
                    }
                };
                modal._touchStart = function(e) {
                    modal._lastTouchY = e.touches[0] ? e.touches[0].clientY : undefined;
                };
                modal.addEventListener('touchstart', modal._touchStart, { passive: true });
                modal.addEventListener('touchmove', modal._touchTrap, { passive: false });
            }

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    modal.classList.add('is-open');
                    var panel = modal.querySelector('.addon-info-panel');
                    if (panel) panel.scrollTop = 0;
                    refreshIcons(modal);
                });
            });
        }

        function closeAddonModal(type) {
            var modal = modals[type];
            if (!modal) return;
            modal.classList.remove('is-open');


            if (modal._wheelTrap) {
                modal.removeEventListener('wheel', modal._wheelTrap);
                modal._wheelTrap = null;
            }


            if (modal._touchStart) {
                modal.removeEventListener('touchstart', modal._touchStart);
                modal._touchStart = null;
                modal._lastTouchY = undefined;
            }
            if (modal._touchTrap) {
                modal.removeEventListener('touchmove', modal._touchTrap);
                modal._touchTrap = null;
            }
            var savedY = parseInt(document.body.dataset.addonScrollY || '0', 10);
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            delete document.body.dataset.addonScrollY;
            window.scrollTo(0, savedY);
            if (typeof lenis !== 'undefined' && lenis) lenis.start();
            setTimeout(function() { modal.setAttribute('hidden', ''); }, 280);
        }

        Object.keys(modals).forEach(function(type) {
            var modal = modals[type];
            var btn   = btns[type];
            if (!modal) return;


            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openAddonModal(type);
                });
            }


            var backdrop = modal.querySelector('.addon-info-backdrop');
            if (backdrop) backdrop.addEventListener('click', function() { closeAddonModal(type); });


            var closeBtn = modal.querySelector('.addon-info-close');
            if (closeBtn) closeBtn.addEventListener('click', function() { closeAddonModal(type); });


            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.classList.contains('is-open')) closeAddonModal(type);
            });
        });
    }


    function initServiceCards() {
        var servicesContainer = document.getElementById('services-grid');
        var currentServiceLabel = document.getElementById('current-service-name');

        if (!servicesContainer) return;

        var savedServiceId = storageGet(STORAGE_KEYS.SERVICE);
        if (savedServiceId) {
            var foundService = findServiceById(savedServiceId);
            if (foundService && !foundService.isInquiry) {
                activeServiceId = savedServiceId;
                updatePackages(foundService.packages);
                if (currentServiceLabel) {
                    currentServiceLabel.textContent = foundService.title;
                }
            }
        }

        if (!activeServiceId) {
            clearPackages();
        }

        servicesContainer.innerHTML = '';

        servicesData.forEach(function (service) {
            var card = document.createElement('div');
            card.className = service.popular ? 'service-card popular' : 'service-card';

            if (service.isInquiry) {
                card.classList.add('inquiry-card');
            }

            card.setAttribute('data-id', service.id);
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', service.isInquiry
                ? 'Describe your custom project'
                : 'Select ' + service.title + ' service');

            if (service.id === activeServiceId) {
                card.classList.add('active');
            }

            var inquiryExtras = service.isInquiry
                ? '<div class="inq-orb-tl"></div><div class="inq-orb-br"></div><div class="inq-corner"></div>'
                : '';
            card.innerHTML =
                inquiryExtras +
                (service.popular ? '<div class="popular-tag">POPULAR</div>' : '') +
                '<div class="service-icon"><i data-lucide="' + escapeAttr(service.icon) + '"></i></div>' +
                '<h3>' + escapeHTML(service.title) + '</h3>' +
                '<p>' + escapeHTML(service.desc) + '</p>' +
                (service.isInquiry ? '' :
                    '<div class="service-card-cta">' +
                        '<span>Learn More</span>' +
                        '<i data-lucide="arrow-right"></i>' +
                    '</div>');

            function handleCardClick() {
                if (service.isInquiry) {
                    activateInquiryMode();
                    scrollTo('#contact');
                    return;
                }

                activeServiceId = service.id;
                storageSet(STORAGE_KEYS.SERVICE, service.id);

                document.querySelectorAll('.service-card').forEach(function (c) {
                    c.classList.remove('active');
                    c.classList.remove('shimmer-play');
                });
                card.classList.add('active');
                if (window._startShimmerLoop) window._startShimmerLoop(card);

                deactivateInquiryMode();

                storageRemove(STORAGE_KEYS.PACKAGE);
                clearAddonSelections();
                hideAddonsSection();

                if (currentServiceLabel) {
                    currentServiceLabel.textContent = service.title;
                    currentServiceLabel.style.opacity = '0';
                    setTimeout(function () { currentServiceLabel.style.opacity = '1'; }, 100);
                }

                updatePackages(service.packages);
                updateContactSummaryPill();
                reliableScrollTo('#packages', { delay: 100 });
            }

            card.addEventListener('click', handleCardClick);
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick();
                }
            });


            if (!service.isInquiry) {
                var ctaEl = card.querySelector('.service-card-cta');
                if (ctaEl) {
                    ctaEl.addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (window._openServiceModal) window._openServiceModal(service.id);
                    });
                }
            }

            servicesContainer.appendChild(card);
        });

        refreshIcons();


        function playActiveShimmer(card) {
            card.classList.remove('shimmer-play');
            void card.offsetWidth;
            card.classList.add('shimmer-play');
        }
        function startShimmerLoop(card) {
            stopShimmerLoop();
            playActiveShimmer(card);
            window._activeShimmerInterval = setInterval(function() {
                var current = document.querySelector('.service-card.active:not(.inquiry-card)');
                if (current) playActiveShimmer(current);
                else stopShimmerLoop();
            }, 4000);
        }
        function stopShimmerLoop() {
            if (window._activeShimmerInterval) {
                clearInterval(window._activeShimmerInterval);
                window._activeShimmerInterval = null;
            }
        }
        window._startShimmerLoop = startShimmerLoop;
        window._stopShimmerLoop  = stopShimmerLoop;


        if (window.IntersectionObserver) {
            var centreObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting && !entry.target.classList.contains('active')) {
                        var card = entry.target;
                        card.classList.remove('shimmer-play');
                        void card.offsetWidth;
                        card.classList.add('shimmer-play');
                        setTimeout(function() { card.classList.remove('shimmer-play'); }, 800);
                    }
                });
            }, {
                root: null,
                rootMargin: '-35% 0px -35% 0px',
                threshold: 0.1
            });
            document.querySelectorAll('.service-card:not(.inquiry-card)').forEach(function(c) {
                centreObserver.observe(c);
            });
        }


        window._selectService = function(serviceId) {
            var svc = findServiceById(serviceId);
            if (!svc || svc.isInquiry) return;

            activeServiceId = serviceId;
            storageSet(STORAGE_KEYS.SERVICE, serviceId);

            document.querySelectorAll('.service-card').forEach(function(c) {
                c.classList.remove('active');
                c.classList.remove('shimmer-play');
            });
            var targetCard = document.querySelector('.service-card[data-id="' + serviceId + '"]');
            if (targetCard) {
                targetCard.classList.add('active');
                if (window._startShimmerLoop) window._startShimmerLoop(targetCard);
            }

            deactivateInquiryMode();
            storageRemove(STORAGE_KEYS.PACKAGE);
            clearAddonSelections();
            hideAddonsSection();

            var currentServiceLabel = document.getElementById('current-service-name');
            if (currentServiceLabel) {
                currentServiceLabel.textContent = svc.title;
                currentServiceLabel.style.opacity = '0';
                setTimeout(function() { currentServiceLabel.style.opacity = '1'; }, 100);
            }

            updatePackages(svc.packages);
            updateContactSummaryPill();
            reliableScrollTo('#packages', { delay: 120 });
        };
    }


    function updatePackages(packages) {
        setTextById('starter-price', packages.starter.price);
        setTextById('custom-price', packages.custom.price);
        setTextById('pro-price', packages.professional.price);

        setTextById('starter-note', packages.starter.note);
        setTextById('custom-note', packages.custom.note);
        setTextById('pro-note', packages.professional.note);

        renderFeatureList('starter-features', packages.starter.features);
        renderFeatureList('custom-features', packages.custom.features);
        renderFeatureList('pro-features', packages.professional.features);

        refreshIcons();
    }

    function clearPackages() {
        var placeholder = '—';
        var emptyNote = 'Select a service to see pricing';
        var emptyHTML = '<p style="color: rgba(255,255,255,0.4); font-size: 0.9rem; padding: 10px 0;">Choose a service above to see what\'s included</p>';

        ['starter', 'custom', 'pro'].forEach(function (tier) {
            setTextById(tier + '-price', placeholder);
            setTextById(tier + '-note', emptyNote);
            var el = document.getElementById(tier + '-features');
            if (el) el.innerHTML = emptyHTML;
        });
    }

    function renderFeatureList(elementId, features) {
        var container = document.getElementById(elementId);
        if (!container) return;

        container.innerHTML = '';
        features.forEach(function (feature) {
            var div = document.createElement('div');
            div.className = 'card-feature';
            div.innerHTML = '<i data-lucide="check-circle"></i><p>' + escapeHTML(feature) + '</p>';
            container.appendChild(div);
        });
        refreshIcons();
    }


    function initPackageButtons() {
        bindPackageButton('starter-btn', function () {
            storageSet(STORAGE_KEYS.PACKAGE, 'starter');
            updateContactSummaryPill();
            if (lenis) lenis.resize();
            reliableScrollTo('#contact', { delay: 120 });
        });

        bindPackageButton('customize-btn', function () {
            storageSet(STORAGE_KEYS.SERVICE, activeServiceId);
            storageSet(STORAGE_KEYS.PACKAGE, 'custom');
            storageRemove(STORAGE_KEYS.SCROLL);
            fadeOutAndNavigate('custom-page.html');
        });

        bindPackageButton('pro-btn', function () {
            storageSet(STORAGE_KEYS.PACKAGE, 'professional');
            updateContactSummaryPill();
            if (lenis) lenis.resize();
            reliableScrollTo('#contact', { delay: 120 });
        });
    }

    function bindPackageButton(btnId, callback) {
        var btn = document.getElementById(btnId);
        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!activeServiceId) {
                showNotification('Please select a service first.', 'error');
                reliableScrollTo('#services', { delay: 50 });
                return;
            }

            callback();
        });
    }


    function initClearSelection() {
        var btn = document.getElementById('clear-selection-btn');
        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            storageRemove(STORAGE_KEYS.SERVICE);
            storageRemove(STORAGE_KEYS.PACKAGE);
            storageRemove(STORAGE_KEYS.OPTIONS);
            storageRemove(STORAGE_KEYS.NOTES);

            activeServiceId = null;

            deactivateInquiryMode();
            clearAddonSelections();
            hideAddonsSection();

            document.querySelectorAll('.service-card').forEach(function (c) {
                c.classList.remove('active');
            });

            var pillLabel = document.getElementById('current-service-name');
            if (pillLabel) {
                pillLabel.textContent = 'Choose a service above';
                pillLabel.style.opacity = '0';
                setTimeout(function () { pillLabel.style.opacity = '1'; }, 100);
            }

            clearPackages();
            updateContactSummaryPill();

            btn.classList.add('cleared');
            var label = btn.querySelector('span');
            var originalText = label ? label.textContent : '';
            if (label) label.textContent = 'Cleared!';

            showNotification('All selections cleared. Choose a new service to start fresh.', 'success');

            reliableScrollTo('#services', { delay: 150, duration: 0.8, offset: -80 });

            setTimeout(function () {
                btn.classList.remove('cleared');
                if (label) label.textContent = originalText;
            }, 3000);
        });
    }


    function initContactForm() {
        var form = document.getElementById('contact-form');
        if (!form) return;

        form.querySelectorAll('input, textarea').forEach(function (field) {
            field.addEventListener('input', function () {
                clearFieldError(field.id);
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearAllFieldErrors();

            var now = Date.now();
            if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
                showNotification('Please wait a few seconds before sending again.', 'error');
                return;
            }

            var honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) {
                showNotification('Message sent successfully! 🚀', 'success');
                return;
            }

            var nameInput     = document.getElementById('name');
            var emailInput    = document.getElementById('email');
            var messageInput  = document.getElementById('message');
            var timelineInput = document.getElementById('timeline');
            var businessInput = document.getElementById('business-name');
            var urlInput      = document.getElementById('website-url');
            var budgetInput   = document.getElementById('budget');

            var name     = nameInput     ? nameInput.value.trim()     : '';
            var email    = emailInput    ? emailInput.value.trim()    : '';
            var message  = messageInput  ? messageInput.value.trim()  : '';
            var timeline = timelineInput ? timelineInput.value.trim() : '';
            var businessName = businessInput ? businessInput.value.trim() : '';
            var websiteUrl   = urlInput      ? urlInput.value.trim()      : '';
            var budget       = budgetInput   ? budgetInput.value.trim()   : '';

            var hasError = false;

            if (!name) {
                showFieldError('name', 'Please enter your name.');
                hasError = true;
            } else if (name.length > INPUT_MAX_LENGTH.name) {
                showFieldError('name', 'Name is too long (max ' + INPUT_MAX_LENGTH.name + ' characters).');
                hasError = true;
            }

            if (!email) {
                showFieldError('email', 'Please enter your email address.');
                hasError = true;
            } else if (email.length > INPUT_MAX_LENGTH.email) {
                showFieldError('email', 'Email is too long.');
                hasError = true;
            } else if (!EMAIL_REGEX.test(email)) {
                showFieldError('email', 'Please enter a valid email address.');
                hasError = true;
            }

            if (!timeline) {
                showFieldError('timeline', 'Please select a launch timeline.');
                hasError = true;
            }

            if (!message) {
                showFieldError('message', 'Please share a few details about your project.');
                hasError = true;
            } else if (message.length > INPUT_MAX_LENGTH.message) {
                showFieldError('message', 'Message is too long (max ' + INPUT_MAX_LENGTH.message + ' characters).');
                hasError = true;
            }

            if (hasError) {
                var firstErrorField = form.querySelector('.form-group.has-error input, .form-group.has-error textarea');
                if (firstErrorField) firstErrorField.focus();
                return;
            }

            var details = getSelectionDetails();
            var price = getSelectedPackagePrice();

            var btn = form.querySelector('.send-btn');
            var originalBtnText = btn ? btn.textContent : 'Send Message';
            if (btn) {
                btn.textContent = 'Sending...';
                btn.disabled = true;
            }

            lastSubmitTime = now;

            var customOptions = (details.selectedPackageId === 'custom')
                ? getStoredCustomOptions()
                : [];
            var customOptionsText = customOptions.length ? customOptions.join(', ') : 'None selected';
            var customNotes = storageGet(STORAGE_KEYS.NOTES) || '';
            var addonInfo = getAddonSummaryText();

            var fullMessage =
                '=== NEW ORDER / PROJECT REQUEST ===\n\n' +
                'SERVICE:        ' + (details.serviceName  || 'Not selected') + '\n' +
                'PACKAGE:        ' + (details.packageName  || 'Not selected') + '\n' +
                'PRICE:          ' + (price                || 'N/A')          + '\n' +
                'CUSTOM ADD-ONS: ' + customOptionsText + '\n' +
                'INTERNAL NOTES: ' + (customNotes || 'None') + '\n' +
                (addonInfo ? '\nADD-ON DETAILS:\n' + addonInfo + '\n' : '') +
                '\nBUSINESS NAME:  ' + (businessName || 'Not provided') + '\n' +
                'WEBSITE URL:    ' + (websiteUrl   || 'Not provided') + '\n' +
                'TIMELINE:       ' + (timeline     || 'Not provided') + '\n' +
                'BUDGET:         ' + (budget       || 'Not provided') + '\n' +
                '\nPROJECT DETAILS:\n' + (message || '(No details provided)') + '\n' +
                '\n===================================';

            var templateParams = {
                name: name,
                email: email,
                project_type: '🛒 NEW ORDER — ' + (details.serviceName || 'Service'),
                selected_service: details.serviceName || 'Not selected',
                selected_package: details.packageName || 'Not selected',
                custom_options: customOptionsText,
                custom_notes: customNotes || 'None provided',
                business_name: businessName || 'Not provided',
                website_url: websiteUrl || 'Not provided',
                timeline: timeline || 'Not provided',
                budget: budget || 'Not provided',
                message: fullMessage
            };

            if (typeof emailjs === 'undefined') {
                showNotification('Email service not loaded. Please try again.', 'error');
                resetButton(btn, originalBtnText);
                return;
            }

            emailjs.send('service_qzgdeii', 'template_27cs3r5', templateParams)
                .then(function () {
                    showNotification('Message sent successfully! 🚀', 'success');
                    form.reset();

                    ['business-name','website-url','timeline','budget'].forEach(function(id) {
                        var el = document.getElementById(id);
                        if (el) el.value = '';
                    });
                    clearAllFieldErrors();
                    updateContactSummaryPill();
                })
                .catch(function (error) {
                    console.error('EmailJS Error:', error);
                    showNotification('Failed to send. Please try again.', 'error');
                })
                .finally(function () {
                    resetButton(btn, originalBtnText);
                });
        });
    }

    function resetButton(btn, text) {
        if (!btn) return;
        btn.textContent = text;
        btn.disabled = false;
    }


    function initInquiryForm() {
        var form = document.getElementById('inquiry-form');
        if (!form) return;

        var charCount = document.getElementById('inquiry-char-count');
        var details = document.getElementById('inquiry-details');

        if (details && charCount) {
            details.addEventListener('input', function () {
                charCount.textContent = details.value.length;
            });
        }

        form.querySelectorAll('input, select, textarea').forEach(function (field) {
            field.addEventListener('input', function () {
                clearInquiryError(field.id);
            });
            field.addEventListener('change', function () {
                clearInquiryError(field.id);
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearAllInquiryErrors();

            var now = Date.now();
            if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
                showNotification('Please wait a few seconds before sending again.', 'error');
                return;
            }

            var honeypot = document.getElementById('inquiry-website');
            if (honeypot && honeypot.value) {
                showNotification('Inquiry submitted successfully! 🚀', 'success');
                return;
            }

            var nameVal      = getVal('inquiry-name');
            var emailVal     = getVal('inquiry-email');
            var businessVal  = getVal('inquiry-business');
            var currentUrlVal= getVal('inquiry-current-url');
            var buildTypeVal = getVal('inquiry-build-type');
            var goalVal      = getVal('inquiry-goal');
            var budgetVal    = getVal('inquiry-budget');
            var timelineVal  = getVal('inquiry-timeline');
            var detailsVal   = getVal('inquiry-details');

            var hasError = false;

            if (!nameVal) {
                showInquiryError('inquiry-name', 'Please enter your name.');
                hasError = true;
            } else if (nameVal.length > 100) {
                showInquiryError('inquiry-name', 'Name is too long.');
                hasError = true;
            }

            if (!emailVal) {
                showInquiryError('inquiry-email', 'Please enter your email.');
                hasError = true;
            } else if (!EMAIL_REGEX.test(emailVal)) {
                showInquiryError('inquiry-email', 'Please enter a valid email.');
                hasError = true;
            }

            if (!buildTypeVal) {
                showInquiryError('inquiry-build-type', 'Please select what you\'re looking to build.');
                hasError = true;
            }

            if (!goalVal) {
                showInquiryError('inquiry-goal', 'Please select a goal.');
                hasError = true;
            }

            if (!budgetVal) {
                showInquiryError('inquiry-budget', 'Please select a budget range.');
                hasError = true;
            }

            if (!timelineVal) {
                showInquiryError('inquiry-timeline', 'Please select a timeline.');
                hasError = true;
            }

            if (!detailsVal) {
                showInquiryError('inquiry-details', 'Please share a few details about your project.');
                hasError = true;
            } else if (detailsVal.length > 1000) {
                showInquiryError('inquiry-details', 'Details too long (max 1000 characters).');
                hasError = true;
            }

            if (hasError) {
                var firstErr = form.querySelector('.form-group.has-error input, .form-group.has-error select, .form-group.has-error textarea');
                if (firstErr) firstErr.focus();
                return;
            }

            var btn = form.querySelector('.inquiry-submit-btn');
            var originalText = btn ? btn.textContent : 'Submit Inquiry';
            if (btn) {
                btn.textContent = 'Sending...';
                btn.disabled = true;
            }

            lastSubmitTime = now;

            var projectData = {
                serviceType: 'custom-inquiry',
                name: nameVal,
                email: emailVal,
                business: businessVal || 'Not provided',
                currentUrl: currentUrlVal || 'Not provided',
                buildType: buildTypeVal,
                goal: goalVal,
                budget: budgetVal,
                timeline: timelineVal,
                details: detailsVal || 'None provided',
                submittedAt: new Date().toISOString()
            };

            try {
                sessionStorage.setItem('customInquiryData', JSON.stringify(projectData));
            } catch (err) {  }

            var templateParams = {
                name: nameVal,
                email: emailVal,
                project_type: '🔍 CUSTOM PROJECT INQUIRY',
                selected_service: 'Custom Project (needs scoping)',
                selected_package: 'N/A — Manual Review Required',
                custom_options: 'N/A',
                custom_notes: 'N/A',
                message:
                    '=== CUSTOM PROJECT INQUIRY ===\n\n' +
                    'NAME:                 ' + nameVal + '\n' +
                    'EMAIL:                ' + emailVal + '\n' +
                    'BUSINESS NAME:        ' + (businessVal || 'Not provided') + '\n' +
                    'CURRENT WEBSITE:      ' + (currentUrlVal || 'Not provided') + '\n' +
                    'PROJECT TYPE:         ' + buildTypeVal + '\n' +
                    'PROJECT GOAL:         ' + goalVal + '\n' +
                    'BUDGET RANGE:         ' + budgetVal + '\n' +
                    'TIMELINE:             ' + timelineVal + '\n' +
                    '\nPROJECT DETAILS:\n' + (detailsVal || 'None provided') + '\n' +
                    '\n=============================='
            };

            if (typeof emailjs === 'undefined') {
                showNotification('Email service not loaded. Please try again.', 'error');
                resetButton(btn, originalText);
                return;
            }

            emailjs.send('service_qzgdeii', 'template_27cs3r5', templateParams)
                .then(function () {
                    showNotification('Your project details have been received. We\'ll respond within 24 hours.', 'success');
                    form.reset();
                    if (charCount) charCount.textContent = '0';
                    clearAllInquiryErrors();
                })
                .catch(function (error) {
                    console.error('EmailJS Error:', error);
                    showNotification('Failed to send. Please try again.', 'error');
                })
                .finally(function () {
                    resetButton(btn, originalText);
                });
        });
    }


    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function showInquiryError(fieldId, message) {
        var field = document.getElementById(fieldId);
        var errorEl = document.getElementById(fieldId + '-error');
        if (field) {
            var group = field.closest('.form-group');
            if (group) group.classList.add('has-error');
        }
        if (errorEl) errorEl.textContent = message;
    }

    function clearInquiryError(fieldId) {
        var field = document.getElementById(fieldId);
        var errorEl = document.getElementById(fieldId + '-error');
        if (field) {
            var group = field.closest('.form-group');
            if (group) group.classList.remove('has-error');
        }
        if (errorEl) errorEl.textContent = '';
    }

    function clearAllInquiryErrors() {
        var form = document.getElementById('inquiry-form');
        if (!form) return;
        form.querySelectorAll('.form-group.has-error').forEach(function (g) {
            g.classList.remove('has-error');
        });
        form.querySelectorAll('.field-error').forEach(function (e) {
            e.textContent = '';
        });
    }


    function activateInquiryMode() {
        var contactSection = document.getElementById('contact');
        if (contactSection) contactSection.classList.add('inquiry-mode');

        document.querySelectorAll('.service-card').forEach(function (c) {
            c.classList.remove('active');
        });
        activeServiceId = null;
        storageRemove(STORAGE_KEYS.SERVICE);
        storageRemove(STORAGE_KEYS.PACKAGE);

        clearPackages();
        clearAddonSelections();
        hideAddonsSection();

        var pillLabel = document.getElementById('current-service-name');
        if (pillLabel) pillLabel.textContent = 'Choose a service above';

        updateContactSummaryPill();
    }

    function deactivateInquiryMode() {
        var contactSection = document.getElementById('contact');
        if (contactSection) contactSection.classList.remove('inquiry-mode');
    }


    function initBlobObserver() {
        var blobWrapper = document.querySelector('.blob-wrapper');
        if (!blobWrapper || typeof IntersectionObserver === 'undefined') return;

        var blobs = blobWrapper.querySelectorAll('.blob');

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                blobs.forEach(function (blob) {
                    blob.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                });
            });
        }, { threshold: 0 });

        observer.observe(blobWrapper);
    }


    function initFAQ() {
        var faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function (item) {
            var question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', function () {
                var isActive = item.classList.contains('active');

                faqItems.forEach(function (other) {
                    other.classList.remove('active');
                    var otherBtn = other.querySelector('.faq-question');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                });

                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }


    function handleReturnScroll() {
        var storedTarget = storageGet(STORAGE_KEYS.SCROLL);
        if (!storedTarget) return;

        storageRemove(STORAGE_KEYS.SCROLL);

        try {
            history.replaceState(null, '', window.location.pathname);
        } catch (e) {  }

        var showSaved = storageGet('showSavedNotification');
        if (showSaved) {
            storageRemove('showSavedNotification');
            setTimeout(function () {
                showNotification('Customizations saved! Let\'s fill out the details.', 'success');
            }, 400);
        }

        setTimeout(function () {
            var targetEl = document.querySelector(storedTarget);
            if (!targetEl) return;

            scrollTo(targetEl, {
                duration: 0.8,
                offset: 0
            });
        }, 300);
    }


    function findServiceById(id) {
        for (var i = 0; i < servicesData.length; i++) {
            if (servicesData[i].id === id) return servicesData[i];
        }
        return null;
    }

    function setTextById(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function getSelectionDetails() {
        var selectedServiceId = storageGet(STORAGE_KEYS.SERVICE);
        var selectedPackageId = storageGet(STORAGE_KEYS.PACKAGE);

        var serviceName = '';
        var packageName = '';

        if (selectedServiceId) {
            var svc = findServiceById(selectedServiceId);
            if (svc) serviceName = svc.title;
        }

        if (selectedPackageId === 'starter') packageName = 'Starter';
        else if (selectedPackageId === 'custom') packageName = 'Custom';
        else if (selectedPackageId === 'professional') packageName = 'Professional';

        return {
            selectedServiceId: selectedServiceId,
            selectedPackageId: selectedPackageId,
            serviceName: serviceName,
            packageName: packageName
        };
    }

    function getCurrentSelectionSummary() {
        var d = getSelectionDetails();
        if (!d.selectedServiceId && !d.selectedPackageId) {
            return 'No service or package selected yet';
        }
        if (!d.selectedPackageId) {
            return d.serviceName || 'No service selected';
        }

        var summary = (d.serviceName || 'Unknown service') + ' — ' + (d.packageName || 'Unknown package') + ' package';

        return summary;
    }

    function getStoredCustomOptions() {
        var raw = storageGet(STORAGE_KEYS.OPTIONS);
        if (!raw) return [];
        try {
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }


    var SERVICE_ICONS = {
        business:   'briefcase',
        landing:    'mouse-pointer-click',
        ecommerce:  'shopping-cart',
        booking:    'calendar-days',
        portfolio:  'image',
        webapp:     'cpu',
        redesign:   'refresh-cw',
        management: 'shield-check'
    };

    var PACKAGE_BADGE_CLASS = {
        starter:      'badge-starter',
        custom:       'badge-custom',
        professional: 'badge-professional'
    };

    function updateContactSummaryPill() {
        var details       = getSelectionDetails();
        var card          = document.getElementById('contact-sel-pill');
        var bodyEl        = document.getElementById('csp-body');
        var toggleBtn     = document.getElementById('csp-toggle-btn');
        var addonsSection = document.getElementById('csp-addons-section');

        var isManagement = details.selectedServiceId === 'management';


        var validSelection = !!(
            details.selectedServiceId &&
            details.selectedPackageId &&
            details.selectedServiceId !== 'custom-inquiry'
        );


        var bodyIsCurrentlyOpen = bodyEl && bodyEl.classList.contains('open');


        if (card) {
            card.classList.toggle('has-selection', validSelection);
            card.classList.toggle('mgmt-mode', validSelection && isManagement);
        }


        var headerSummary = document.getElementById('csp-header-summary');
        if (headerSummary) {
            if (validSelection) {
                headerSummary.textContent =
                    details.serviceName + '  ·  ' + details.packageName + ' Package';
            } else {
                headerSummary.textContent = 'Choose a service & package above to get started';
            }
        }


        if (toggleBtn) {
            toggleBtn.style.display = (validSelection && isManagement) ? 'none' : '';
        }


        var mgmtRow = document.getElementById('csp-management-row');
        var plansPanelEl = document.getElementById('csp-plans-panel');

        if (addonsSection) {
            addonsSection.style.display = validSelection ? '' : 'none';
        }
        if (mgmtRow) {
            mgmtRow.style.display = (validSelection && isManagement) ? 'none' : '';
        }
        if (plansPanelEl && validSelection && isManagement) {
            plansPanelEl.classList.remove('open');
            plansPanelEl.setAttribute('aria-hidden', 'true');
            plansPanelEl.style.display = 'none';
        }
        if (plansPanelEl && (!validSelection || !isManagement)) {
            plansPanelEl.style.display = '';
        }


        if (!validSelection) {
            if (bodyEl)    { bodyEl.classList.remove('open'); bodyEl.setAttribute('aria-hidden', 'true'); }
            if (toggleBtn) { toggleBtn.setAttribute('aria-expanded', 'false'); }

            var sEl = document.getElementById('csp-service-name');
            var bEl = document.getElementById('csp-package-badge');
            var pEl = document.getElementById('csp-price');
            var fEl = document.getElementById('csp-features-list');
            if (sEl) sEl.textContent = '—';
            if (bEl) { bEl.textContent = '—'; bEl.className = 'csp-package-badge'; }
            if (pEl) pEl.textContent = '—';
            if (fEl) fEl.innerHTML = '';

            var tpEl = document.getElementById('csp-total-project');
            var trEl = document.getElementById('csp-total-monthly-row');
            if (tpEl) tpEl.textContent = '—';
            if (trEl) trEl.style.display = 'none';

            updatePillToggleLabel();
            return;
        }


        if (bodyEl) {
            if (isManagement && !bodyIsCurrentlyOpen) {

                bodyEl.classList.add('open');
                bodyEl.setAttribute('aria-hidden', 'false');
            } else if (bodyIsCurrentlyOpen) {

                bodyEl.classList.add('open');
                bodyEl.setAttribute('aria-hidden', 'false');
            }

        }


        var iconWrap = document.getElementById('csp-package-icon');
        if (iconWrap) {
            var iconName = SERVICE_ICONS[details.selectedServiceId] || 'code-2';
            iconWrap.innerHTML = '<i data-lucide="' + escapeAttr(iconName) + '"></i>';
        }


        var svcNameEl = document.getElementById('csp-service-name');
        if (svcNameEl) svcNameEl.textContent = details.serviceName || '—';


        var badge = document.getElementById('csp-package-badge');
        if (badge) {
            badge.textContent = details.packageName || '—';
            badge.className   = 'csp-package-badge';
            var badgeCls = PACKAGE_BADGE_CLASS[details.selectedPackageId];
            if (badgeCls) badge.classList.add(badgeCls);
        }


        var price    = getSelectedPackagePrice();
        var priceEl3 = document.getElementById('csp-price');
        if (priceEl3) priceEl3.textContent = price || '—';


        var featList = document.getElementById('csp-features-list');
        if (featList) {
            featList.innerHTML = '';
            var svc = findServiceById(details.selectedServiceId);
            var pkg = svc && svc.packages && svc.packages[details.selectedPackageId];
            if (pkg && pkg.features) {
                pkg.features.forEach(function (feat) {
                    var li = document.createElement('li');
                    li.textContent = feat;
                    featList.appendChild(li);
                });
            }
        }


        var totalProjectEl    = document.getElementById('csp-total-project');
        var totalMonthlyRowEl = document.getElementById('csp-total-monthly-row');
        var totalMonthlyValEl = document.getElementById('csp-total-monthly');

        if (totalProjectEl) totalProjectEl.textContent = price || '—';


        if (isManagement) {
            if (totalMonthlyRowEl) totalMonthlyRowEl.style.display = 'none';
        } else {
            var hostingSelected = storageGet(STORAGE_KEYS.ADDON_HOSTING) === 'true';
            var mgmtSelected    = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT) === 'true';
            var planKey2        = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN);
            var planInfo2       = planKey2 && MANAGEMENT_PLANS[planKey2] ? MANAGEMENT_PLANS[planKey2] : null;

            var monthlyTotal = 0;
            if (hostingSelected) monthlyTotal += HOSTING_MONTHLY;
            if (mgmtSelected && planInfo2) monthlyTotal += planInfo2.price;

            if (totalMonthlyRowEl && totalMonthlyValEl) {
                if (monthlyTotal > 0) {
                    totalMonthlyRowEl.style.display = '';
                    totalMonthlyValEl.textContent   = '+$' + monthlyTotal + '/mo';
                } else {
                    totalMonthlyRowEl.style.display = 'none';
                }
            }
        }

        updatePillToggleLabel();
        refreshIcons();


        var budgetRow = document.getElementById('budget-row');
        if (budgetRow) {
            var isCustomPkg = details.selectedPackageId === 'custom';
            var hostSel     = storageGet(STORAGE_KEYS.ADDON_HOSTING)    === 'true';
            var mgmtSel     = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT)  === 'true';
            var showBudget  = isCustomPkg || hostSel || mgmtSel;
            budgetRow.classList.toggle('visible', showBudget);
        }
    }

    function escapeHTML(str) {
        var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return str.replace(/[&<>"']/g, function (c) { return map[c]; });
    }

    function escapeAttr(str) {
        return str.replace(/[&"'<>]/g, function (c) {
            return { '&': '&amp;', '"': '&quot;', "'": '&#39;', '<': '&lt;', '>': '&gt;' }[c];
        });
    }

    function reliableScrollTo(target, options) {
        var opts = options || {};
        var delay = opts.delay || 0;
        var duration = opts.duration || SCROLL_DURATION;
        var offset = opts.offset !== undefined ? opts.offset : SCROLL_OFFSET;

        setTimeout(function () {
            if (lenis) {
                lenis.scrollTo(target, { duration: duration, offset: offset });
            } else {
                var el = typeof target === 'string' ? document.querySelector(target) : null;
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (typeof target === 'number') {
                    window.scrollTo({ top: target, behavior: 'smooth' });
                }
            }
        }, delay);
    }


    function showFieldError(fieldId, message) {
        var field = document.getElementById(fieldId);
        var errorEl = document.getElementById(fieldId + '-error');

        if (field) {
            var group = field.closest('.form-group');
            if (group) group.classList.add('has-error');
        }

        if (errorEl) errorEl.textContent = message;
    }

    function clearFieldError(fieldId) {
        var field = document.getElementById(fieldId);
        var errorEl = document.getElementById(fieldId + '-error');

        if (field) {
            var group = field.closest('.form-group');
            if (group) group.classList.remove('has-error');
        }

        if (errorEl) errorEl.textContent = '';
    }

    function clearAllFieldErrors() {
        document.querySelectorAll('.form-group.has-error').forEach(function (g) {
            g.classList.remove('has-error');
        });
        document.querySelectorAll('.field-error').forEach(function (e) {
            e.textContent = '';
        });
    }


    function initScrollReveal() {
        if (typeof IntersectionObserver === 'undefined') return;

        var selectors = [
            '.section-intro',
            '.value-box',
            '.about-text',
            '.feature-item',
            '.service-card',
            '.step-card',
            '.step-connector',
            '.package-card',
            '.faq-item',
            '.contact-container',
            '.inquiry-container',
            '.service-pill-wrapper',
            '.clear-selection-wrapper',
            '.tier-note-wrapper',
            '.contact-summary-pill',
            '.contact-sel-pill',
            '.addon-card',
            '.addons-summary-card',
            '.total-card',
            '.payment-methods-card'
        ];

        var elements = document.querySelectorAll(selectors.join(','));
        if (!elements.length) return;

        var viewportHeight = window.innerHeight;


        var featureItems = document.querySelectorAll('.about-features .feature-item');
        featureItems.forEach(function (el, i) {
            el.style.setProperty('--reveal-delay', (i * 130) + 'ms');
        });


        var stepCards = document.querySelectorAll('.step-card');
        stepCards.forEach(function (el, i) {
            el.style.setProperty('--reveal-delay', (i * 120) + 'ms');
        });


        if (stepCards.length) {
            var processSteps = document.querySelector('.process-steps');
            var lastActiveStep = null;


            stepCards.forEach(function(card) {
                var spotlight = document.createElement('span');
                spotlight.className = 'step-spotlight';
                card.insertBefore(spotlight, card.firstChild);

                card.addEventListener('mousemove', function(e) {
                    var rect = card.getBoundingClientRect();
                    var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
                    var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
                    card.style.setProperty('--step-x', x);
                    card.style.setProperty('--step-y', y);
                });

                card.addEventListener('mouseleave', function() {
                    card.style.setProperty('--step-x', '50%');
                    card.style.setProperty('--step-y', '50%');
                });
            });

            function updateActiveStep() {
                var isMobileHoriz = window.innerWidth <= 768;
                var closest = null;
                var closestDist = Infinity;

                var sectionRect = processSteps ? processSteps.getBoundingClientRect() : null;
                var sectionInView = sectionRect &&
                    sectionRect.top < window.innerHeight &&
                    sectionRect.bottom > 0;

                if (isMobileHoriz) {

                    var viewportHMid = window.innerWidth / 2;
                    stepCards.forEach(function(card) {
                        var rect = card.getBoundingClientRect();
                        var cardHMid = rect.left + rect.width / 2;
                        var dist = Math.abs(cardHMid - viewportHMid);
                        if (dist < closestDist) {
                            closestDist = dist;
                            closest = card;
                        }
                    });

                    if (!sectionInView || closestDist > window.innerWidth * 0.60) {
                        if (lastActiveStep) {
                            stepCards.forEach(function(c) { c.classList.remove('is-active'); });
                            if (processSteps) processSteps.classList.remove('has-active');
                            lastActiveStep = null;
                        }
                        return;
                    }
                } else {

                    var viewportMid = window.innerHeight / 2;
                    stepCards.forEach(function(card) {
                        var rect = card.getBoundingClientRect();
                        var cardMid = rect.top + rect.height / 2;
                        var dist = Math.abs(cardMid - viewportMid);
                        if (dist < closestDist) {
                            closestDist = dist;
                            closest = card;
                        }
                    });

                    if (!sectionInView || closestDist > window.innerHeight * 0.55) {
                        if (lastActiveStep) {
                            stepCards.forEach(function(c) { c.classList.remove('is-active'); });
                            if (processSteps) processSteps.classList.remove('has-active');
                            lastActiveStep = null;
                        }
                        return;
                    }
                }

                if (closest && closest !== lastActiveStep) {
                    stepCards.forEach(function(c) { c.classList.remove('is-active'); });


                    void closest.offsetWidth;

                    closest.classList.add('is-active');
                    if (processSteps) processSteps.classList.add('has-active');
                    lastActiveStep = closest;
                }
            }


            var scrollTicking = false;
            window.addEventListener('scroll', function() {
                if (!scrollTicking) {
                    requestAnimationFrame(function() {
                        updateActiveStep();
                        scrollTicking = false;
                    });
                    scrollTicking = true;
                }
            }, { passive: true });


            if (processSteps) {
                var horizTicking = false;
                processSteps.addEventListener('scroll', function() {
                    if (!horizTicking) {
                        requestAnimationFrame(function() {
                            updateActiveStep();
                            horizTicking = false;
                        });
                        horizTicking = true;
                    }
                }, { passive: true });
            }


            updateActiveStep();
        }

        var isMobile = window.innerWidth <= 768;

        elements.forEach(function (el) {
            if (isMobile && el.classList.contains('service-card')) return;
            if (el.getBoundingClientRect().top > viewportHeight) {
                el.classList.add('reveal');
            }
        });


        if (isMobile) {
            document.querySelectorAll('.service-card').forEach(function(c) {
                c.classList.remove('reveal', 'revealed');
            });


            var svcObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(m) {
                    if (m.target.classList.contains('service-card')) {
                        if (m.target.classList.contains('reveal') ||
                            m.target.classList.contains('revealed')) {
                            m.target.classList.remove('reveal', 'revealed');
                        }
                    }
                });
            });
            document.querySelectorAll('.service-card').forEach(function(c) {
                svcObserver.observe(c, { attributes: true, attributeFilter: ['class'] });
            });
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {

                    if (window.innerWidth <= 768 && entry.target.classList.contains('service-card')) {
                        entry.target.classList.remove('reveal');
                        observer.unobserve(entry.target);
                        return;
                    }
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);

                    setTimeout(function () {
                        entry.target.classList.remove('reveal', 'revealed');
                    }, 1000);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -30px 0px'
        });


        var featureObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    featureObserver.unobserve(entry.target);
                    setTimeout(function () {
                        entry.target.classList.remove('reveal', 'revealed');
                    }, 1200);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -20px 0px'
        });

        elements.forEach(function (el) {
            if (el.classList.contains('reveal')) {
                if (el.classList.contains('feature-item')) {
                    featureObserver.observe(el);
                } else {
                    observer.observe(el);
                }
            }
        });
    }


    function initAddons() {
        var addonsSection = document.getElementById('addons');
        if (!addonsSection) return;

        var hostingCard = document.getElementById('addon-hosting');
        var managementCard = document.getElementById('addon-management');

        if (hostingCard) {
            hostingCard.addEventListener('click', function () {
                toggleAddon('hosting');
            });
            hostingCard.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAddon('hosting');
                }
            });
        }

        if (managementCard) {
            managementCard.addEventListener('click', function () {
                toggleAddon('management');
            });
            managementCard.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAddon('management');
                }
            });
        }

        var continueBtn = document.getElementById('addons-continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (lenis) lenis.resize();
                reliableScrollTo('#contact', { delay: 80 });
            });
        }

        restoreAddonState();
    }

    function restoreAddonState() {
        var savedHosting    = storageGet(STORAGE_KEYS.ADDON_HOSTING);
        var savedManagement = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT);
        var savedPlan       = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN);

        if (savedHosting === 'true') {
            var hCard = document.getElementById('addon-hosting');
            if (hCard) {
                hCard.classList.add('selected');
                hCard.setAttribute('aria-pressed', 'true');
                var hLabel = hCard.querySelector('.addon-select-label');
                if (hLabel) hLabel.textContent = 'Added ✓';
            }
        }

        if (savedManagement === 'true') {
            var mCard = document.getElementById('addon-management');
            if (mCard) {
                mCard.classList.add('selected');
                mCard.setAttribute('aria-pressed', 'true');
                var mLabel = mCard.querySelector('.addon-select-label');
                if (mLabel) mLabel.textContent = 'Added ✓';
            }
            expandMgmtPlans();

            if (savedPlan && MANAGEMENT_PLANS[savedPlan]) {
                var planCard = document.getElementById('mgmt-plan-' + savedPlan);
                if (planCard) {
                    planCard.classList.add('selected');
                    planCard.setAttribute('aria-pressed', 'true');
                    var pLabel = planCard.querySelector('.mgmt-plan-select-label');
                    if (pLabel) pLabel.textContent = 'Selected ✓';
                }
                var priceLbl = document.getElementById('management-price-label');
                if (priceLbl) priceLbl.textContent = '$' + MANAGEMENT_PLANS[savedPlan].price + '/mo';
            }
        }
    }

    function toggleAddon(type) {
        var card, storageKey;

        if (type === 'hosting') {
            card = document.getElementById('addon-hosting');
            storageKey = STORAGE_KEYS.ADDON_HOSTING;
        } else {
            card = document.getElementById('addon-management');
            storageKey = STORAGE_KEYS.ADDON_MANAGEMENT;
        }

        if (!card) return;

        var isSelected = card.classList.toggle('selected');
        card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

        var selectLabel = card.querySelector('.addon-select-label');
        if (selectLabel) {
            selectLabel.textContent = isSelected ? 'Added ✓' : 'Tap to add';
        }


        if (type === 'management') {
            if (isSelected) {
                expandMgmtPlans();
            } else {
                collapseMgmtPlans();
                storageRemove(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN);

                var priceLbl = document.getElementById('management-price-label');
                if (priceLbl) priceLbl.textContent = 'From $99/mo';

                document.querySelectorAll('.mgmt-plan-card').forEach(function (c) {
                    c.classList.remove('selected');
                    c.setAttribute('aria-pressed', 'false');
                    var lbl = c.querySelector('.mgmt-plan-select-label');
                    if (lbl) lbl.textContent = 'Select';
                });
            }
        }

        storageSet(storageKey, isSelected ? 'true' : 'false');
        updateAddonsTotal();
        updateContactSummaryPill();
        refreshIcons();
    }

    function expandMgmtPlans() {
        var panel = document.getElementById('mgmt-plans-panel');
        if (!panel) return;
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        refreshIcons();
    }

    function collapseMgmtPlans() {
        var panel = document.getElementById('mgmt-plans-panel');
        if (!panel) return;
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
    }

    function initManagementPlans() {
        var planCards = document.querySelectorAll('.mgmt-plan-card');
        planCards.forEach(function (card) {
            card.addEventListener('click', function (e) {
                e.stopPropagation();
                selectManagementPlan(card.getAttribute('data-plan'));
            });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    selectManagementPlan(card.getAttribute('data-plan'));
                }
            });
        });
    }

    function selectManagementPlan(planKey) {
        if (!planKey || !MANAGEMENT_PLANS[planKey]) return;

        var planInfo = MANAGEMENT_PLANS[planKey];


        document.querySelectorAll('.mgmt-plan-card').forEach(function (c) {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
            var lbl = c.querySelector('.mgmt-plan-select-label');
            if (lbl) lbl.textContent = 'Select';
        });


        var card = document.getElementById('mgmt-plan-' + planKey);
        if (card) {
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
            var selLabel = card.querySelector('.mgmt-plan-select-label');
            if (selLabel) selLabel.textContent = 'Selected ✓';
        }


        var priceLbl = document.getElementById('management-price-label');
        if (priceLbl) priceLbl.textContent = '$' + planInfo.price + '/mo';


        storageSet(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN, planKey);

        updateAddonsTotal();
        updateContactSummaryPill();
    }


    function showAddonsSection() {
        var section = document.getElementById('addons');
        if (!section) return;

        var serviceId = storageGet(STORAGE_KEYS.SERVICE);
        if (serviceId === 'management' || serviceId === 'custom-inquiry') return;

        section.classList.remove('addons-hidden');
        updateAddonsSummary();
        updateAddonsTotal();
        refreshIcons();
    }

    function hideAddonsSection() {
        var section = document.getElementById('addons');
        if (!section) return;
        section.classList.add('addons-hidden');
        collapseMgmtPlans();
    }

    function updateAddonsSummary() {
        var details = getSelectionDetails();

        var serviceEl = document.getElementById('addon-service-name');
        var packageEl = document.getElementById('addon-package-name');
        var priceEl = document.getElementById('addon-base-price');

        if (serviceEl) serviceEl.textContent = details.serviceName || '—';
        if (packageEl) packageEl.textContent = details.packageName || '—';

        if (priceEl) {
            var price = getSelectedPackagePrice();
            priceEl.textContent = price || '—';
        }
    }

    function getSelectedPackagePrice() {
        var serviceId = storageGet(STORAGE_KEYS.SERVICE);
        var packageId = storageGet(STORAGE_KEYS.PACKAGE);

        if (!serviceId || !packageId) return null;

        var service = findServiceById(serviceId);
        if (!service || !service.packages) return null;

        var pkg = service.packages[packageId];
        if (!pkg) return null;

        return pkg.price;
    }

    function updateAddonsTotal() {
        var projectTotalEl = document.getElementById('addon-project-total');
        var monthlyTotalEl = document.getElementById('addon-monthly-total');
        var hostingRow     = document.getElementById('total-hosting-row');
        var managementRow  = document.getElementById('total-management-row');
        var emptyRow       = document.getElementById('total-monthly-empty');
        var mgmtPlanName   = document.getElementById('total-mgmt-plan-name');
        var mgmtPlanPrice  = document.getElementById('total-mgmt-plan-price');

        var basePrice = getSelectedPackagePrice();
        if (projectTotalEl) projectTotalEl.textContent = basePrice || '—';

        var hostingSelected    = storageGet(STORAGE_KEYS.ADDON_HOSTING) === 'true';
        var managementSelected = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT) === 'true';
        var planKey            = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN);
        var planInfo           = planKey && MANAGEMENT_PLANS[planKey] ? MANAGEMENT_PLANS[planKey] : null;

        var monthlyTotal = 0;
        if (hostingSelected) monthlyTotal += HOSTING_MONTHLY;
        if (managementSelected && planInfo) monthlyTotal += planInfo.price;


        if (hostingRow)    hostingRow.style.display    = hostingSelected ? 'flex' : 'none';
        if (managementRow) managementRow.style.display = managementSelected ? 'flex' : 'none';
        if (emptyRow)      emptyRow.style.display      = (!hostingSelected && !managementSelected) ? 'block' : 'none';

        if (managementSelected && planInfo) {
            if (mgmtPlanName)  mgmtPlanName.textContent  = planInfo.name;
            if (mgmtPlanPrice) mgmtPlanPrice.textContent = '+$' + planInfo.price + '/mo';
        } else if (managementSelected) {
            if (mgmtPlanName)  mgmtPlanName.textContent  = 'Management';
            if (mgmtPlanPrice) mgmtPlanPrice.textContent = 'from $99/mo';
        }

        if (monthlyTotalEl) {
            monthlyTotalEl.textContent = monthlyTotal === 0 ? '$0/mo' : '$' + monthlyTotal + '/mo';
        }
    }

    function getAddonSummaryText() {
        var hostingSelected    = storageGet(STORAGE_KEYS.ADDON_HOSTING) === 'true';
        var managementSelected = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT) === 'true';

        if (!hostingSelected && !managementSelected) return '';

        var planKey  = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN);
        var planInfo = planKey && MANAGEMENT_PLANS[planKey] ? MANAGEMENT_PLANS[planKey] : null;

        var parts = ['--- Add-Ons ---'];
        if (hostingSelected) parts.push('• Website Hosting (+$' + HOSTING_MONTHLY + '/mo)');
        if (managementSelected) {
            var mgmtLabel = planInfo
                ? planInfo.name + ' (+$' + planInfo.price + '/mo)'
                : 'Ongoing Management (from $' + MANAGEMENT_BASE_MONTHLY + '/mo — plan TBD)';
            parts.push('• ' + mgmtLabel);
        }

        return parts.join('\n');
    }

    function clearAddonSelections() {
        storageRemove(STORAGE_KEYS.ADDON_HOSTING);
        storageRemove(STORAGE_KEYS.ADDON_MANAGEMENT);
        storageRemove(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN);

        var hostingCard    = document.getElementById('addon-hosting');
        var managementCard = document.getElementById('addon-management');

        if (hostingCard) {
            hostingCard.classList.remove('selected');
            hostingCard.setAttribute('aria-pressed', 'false');
            var hLabel = hostingCard.querySelector('.addon-select-label');
            if (hLabel) hLabel.textContent = 'Tap to add';
        }

        if (managementCard) {
            managementCard.classList.remove('selected');
            managementCard.setAttribute('aria-pressed', 'false');
            var mLabel = managementCard.querySelector('.addon-select-label');
            if (mLabel) mLabel.textContent = 'Tap to add';
        }


        var priceLbl = document.getElementById('management-price-label');
        if (priceLbl) priceLbl.textContent = 'From $99/mo';


        collapseMgmtPlans();


        document.querySelectorAll('.mgmt-plan-card').forEach(function (c) {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
            var lbl = c.querySelector('.mgmt-plan-select-label');
            if (lbl) lbl.textContent = 'Select';
        });
    }


    function initContactPill() {
        var toggleBtn = document.getElementById('csp-toggle-btn');
        var body      = document.getElementById('csp-body');
        if (!toggleBtn || !body) return;


        toggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var isOpen = body.classList.contains('open');
            if (isOpen) {
                body.classList.remove('open');
                body.setAttribute('aria-hidden', 'true');
                toggleBtn.setAttribute('aria-expanded', 'false');
            } else {
                body.classList.add('open');
                body.setAttribute('aria-hidden', 'false');
                toggleBtn.setAttribute('aria-expanded', 'true');
                refreshIcons();
            }
        });


        var hostingRow = document.getElementById('csp-hosting-row');
        if (hostingRow) {
            hostingRow.addEventListener('click', function (e) { e.stopPropagation(); togglePillAddon('hosting'); });
            hostingRow.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); togglePillAddon('hosting'); }
            });
        }


        var mgmtRow = document.getElementById('csp-management-row');
        if (mgmtRow) {
            mgmtRow.addEventListener('click', function (e) { e.stopPropagation(); togglePillAddon('management'); });
            mgmtRow.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); togglePillAddon('management'); }
            });
        }


        var planCards = document.querySelectorAll('.csp-plan-card');
        planCards.forEach(function (card) {
            card.addEventListener('click', function (e) {
                e.stopPropagation();
                selectPillManagementPlan(card.getAttribute('data-plan'));
            });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    selectPillManagementPlan(card.getAttribute('data-plan'));
                }
            });
        });

        restorePillAddonState();
    }

    function togglePillAddon(type) {
        var rowId      = type === 'hosting' ? 'csp-hosting-row' : 'csp-management-row';
        var storageKey = type === 'hosting' ? STORAGE_KEYS.ADDON_HOSTING : STORAGE_KEYS.ADDON_MANAGEMENT;
        var row        = document.getElementById(rowId);
        if (!row) return;

        var isSelected = row.classList.toggle('selected');
        row.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        storageSet(storageKey, isSelected ? 'true' : 'false');

        if (type === 'management') {
            var panel = document.getElementById('csp-plans-panel');
            if (panel) {
                if (isSelected) {
                    panel.classList.add('open');
                    panel.setAttribute('aria-hidden', 'false');
                    refreshIcons();
                } else {
                    panel.classList.remove('open');
                    panel.setAttribute('aria-hidden', 'true');
                    storageRemove(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN);
                    document.querySelectorAll('.csp-plan-card').forEach(function (c) {
                        c.classList.remove('selected');
                        c.setAttribute('aria-pressed', 'false');
                    });
                    var priceLbl = document.getElementById('csp-mgmt-price-label');
                    if (priceLbl) priceLbl.textContent = 'from $99/mo';
                }
            }
        }

        updatePillTotalsOnly();
        refreshIcons();
    }


    function updatePillTotalsOnly() {
        var hostingSelected = storageGet(STORAGE_KEYS.ADDON_HOSTING) === 'true';
        var mgmtSelected    = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT) === 'true';
        var planKey2        = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN);
        var planInfo2       = planKey2 && MANAGEMENT_PLANS[planKey2] ? MANAGEMENT_PLANS[planKey2] : null;

        var monthlyTotal = 0;
        if (hostingSelected) monthlyTotal += HOSTING_MONTHLY;
        if (mgmtSelected && planInfo2) monthlyTotal += planInfo2.price;

        var totalMonthlyRowEl = document.getElementById('csp-total-monthly-row');
        var totalMonthlyValEl = document.getElementById('csp-total-monthly');
        if (totalMonthlyRowEl && totalMonthlyValEl) {
            if (monthlyTotal > 0) {
                totalMonthlyRowEl.style.display = '';
                totalMonthlyValEl.textContent   = '+$' + monthlyTotal + '/mo';
            } else {
                totalMonthlyRowEl.style.display = 'none';
            }
        }

        updatePillToggleLabel();
    }

    function selectPillManagementPlan(planKey) {
        if (!planKey || !MANAGEMENT_PLANS[planKey]) return;
        var planInfo = MANAGEMENT_PLANS[planKey];

        document.querySelectorAll('.csp-plan-card').forEach(function (c) {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
        });

        var card = document.getElementById('csp-plan-' + planKey);
        if (card) {
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
        }

        var priceLbl = document.getElementById('csp-mgmt-price-label');
        if (priceLbl) priceLbl.textContent = '$' + planInfo.price + '/mo';

        storageSet(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN, planKey);
        updatePillTotalsOnly();
    }

    function updatePillToggleLabel() {
        var labelEl = document.getElementById('csp-toggle-label');
        if (!labelEl) return;
        var hostingSelected = storageGet(STORAGE_KEYS.ADDON_HOSTING) === 'true';
        var mgmtSelected    = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT) === 'true';
        var count = (hostingSelected ? 1 : 0) + (mgmtSelected ? 1 : 0);
        if (count === 0)      labelEl.textContent = 'Add-ons';
        else if (count === 1) labelEl.textContent = '1 add-on';
        else                  labelEl.textContent = count + ' add-ons';
    }

    function restorePillAddonState() {
        var savedHosting = storageGet(STORAGE_KEYS.ADDON_HOSTING);
        var savedMgmt    = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT);
        var savedPlan    = storageGet(STORAGE_KEYS.ADDON_MANAGEMENT_PLAN);

        if (savedHosting === 'true') {
            var hRow = document.getElementById('csp-hosting-row');
            if (hRow) { hRow.classList.add('selected'); hRow.setAttribute('aria-pressed', 'true'); }
        }

        if (savedMgmt === 'true') {
            var mRow = document.getElementById('csp-management-row');
            if (mRow) { mRow.classList.add('selected'); mRow.setAttribute('aria-pressed', 'true'); }
            var panel = document.getElementById('csp-plans-panel');
            if (panel) { panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); }

            if (savedPlan && MANAGEMENT_PLANS[savedPlan]) {
                var planCard = document.getElementById('csp-plan-' + savedPlan);
                if (planCard) { planCard.classList.add('selected'); planCard.setAttribute('aria-pressed', 'true'); }
                var priceLbl = document.getElementById('csp-mgmt-price-label');
                if (priceLbl) priceLbl.textContent = '$' + MANAGEMENT_PLANS[savedPlan].price + '/mo';
            }
        }

        updatePillToggleLabel();
    }

})();

if (document.getElementById('next-step-btn')) {

(function () {
    'use strict';


    var STORAGE = Object.freeze({
        SERVICE: 'selectedServiceId',
        PACKAGE: 'selectedPackageId',
        OPTIONS: 'selectedCustomOptions',
        NOTES: 'selectedCustomNotes',
        SCROLL: 'scrollTarget'
    });

    var FADE_MS = 400;
    var DEFAULT_SERVICE = 'business';
    var NOTES_MAX = 1000;


    function storageGet(key) {
        try { return sessionStorage.getItem(key); }
        catch (e) { return null; }
    }

    function storageSet(key, value) {
        try { sessionStorage.setItem(key, value); }
        catch (e) {  }
    }


    var customizationData = Object.freeze({
        business: {
            label: "Business Website",
            heroTitle: "Customize your Business Website",
            heroText: "Build a site that looks trustworthy, explains your offer clearly, and converts visitors into leads. Start with the Starter base, then add only what you need.",
            included: [
                "Up to 5 Pages",
                "Mobile-Responsive Design",
                "Basic SEO Setup (Titles/Meta + Indexing)",
                "Contact Form + Lead Delivery",
                "Basic Analytics Setup (GA4)",
                "Launch + Basic Training"
            ],
            options: [
                "Extra Page (+$120/page)",
                "Blog/CMS Setup (+$450)",
                "Copywriting (+$120/page)",
                "Local SEO Pack — GMB + Schema + On-page (+$600)",
                "Advanced Analytics Events + Funnel Tracking (+$300)",
                "Email Marketing Integration — Mailchimp/Klaviyo (+$250)",
                "Live Chat / WhatsApp Button (+$90)",
                "Accessibility Pass — WCAG Basics (+$350)",
                "Custom Animations/Interactions (+$300)",
                "Multi-Language (+$350 + $80/page per extra language)"
            ]
        },
        landing: {
            label: "Landing Page",
            heroTitle: "Customize your Landing Page",
            heroText: "Make your landing page conversion-ready. Add tracking, integrations, and variants based on your campaign and funnel.",
            included: [
                "1 Landing Page (Up to ~7 Sections)",
                "Mobile-Responsive Layout",
                "Contact/Lead Form",
                "Basic SEO + Index Setup",
                "Basic Analytics Setup (GA4)",
                "Launch in 3–5 Days"
            ],
            options: [
                "Extra Section (+$40/section)",
                "Copywriting — Full Page (+$300)",
                "A/B Variant Page (+$250 each)",
                "Ad Pixels/Events Setup — Meta/Google/TikTok (+$180)",
                "Heatmap Setup — Hotjar/MS Clarity (+$90)",
                "Calendly/Booking Embed (+$80)",
                "CRM Integration — HubSpot, etc. (+$250–$450)",
                "Custom Illustration/Graphics (+$150)",
                "Multi-Language (+$250)"
            ]
        },
        ecommerce: {
            label: "E‑Commerce Store",
            heroTitle: "Customize your E‑Commerce Store",
            heroText: "Set up a store that's easy to manage and designed to convert. Start with the essentials, then add growth and operations features as needed.",
            included: [
                "Store Setup (Shopify/WooCommerce)",
                "Up to 15 Products Added",
                "Payments + Shipping Setup (Basic)",
                "Collections/Categories Setup (Basic)",
                "Mobile-Responsive Theme Customization",
                "Basic Analytics Setup (GA4)",
                "Launch + Store Training"
            ],
            options: [
                "Extra Products Added (+$12/product or +$350 per 50)",
                "Custom Page — About/FAQ/Policies (+$120/page)",
                "Reviews + UGC Integration (+$180)",
                "Product Bundles/Upsells Setup (+$350)",
                "Subscription Payments (+$450)",
                "Email Flows Setup — Klaviyo/Mailchimp (+$600)",
                "Advanced Shipping Rules/Tax Config (+$300)",
                "SEO Pack for Store — Templates + Schema + Collections (+$900)",
                "Inventory/POS Integration (+$400–$900)",
                "Multi-Currency/Multi-Language (+$500–$1,200)"
            ]
        },
        booking: {
            label: "Booking Website",
            heroTitle: "Customize your Booking Website",
            heroText: "Create a smooth booking experience that reduces back-and-forth and increases completed appointments. Add payments, reminders, and intake details as needed.",
            included: [
                "Up to 5 Pages",
                "Booking System Setup (Calendly/Acuity)",
                "Email Confirmations (Basic)",
                "Mobile-Responsive Design",
                "Basic Analytics Setup (GA4)",
                "Launch + Training"
            ],
            options: [
                "Online Deposits/Full Payments (+$350)",
                "Multi-Staff Setup (+$250)",
                "Intake Form + Conditional Questions (+$180)",
                "SMS Reminders Setup (+$250)",
                "No-Show Policy + Cancellation Rules (+$120)",
                "Google Calendar Two-Way Sync (+$90)",
                "Memberships/Packages (+$450)",
                "CRM/Email Integration (+$250–$450)",
                "Extra Page (+$120/page)",
                "Local SEO Pack (+$600)"
            ]
        },
        portfolio: {
            label: "Portfolio Website",
            heroTitle: "Customize your Portfolio Website",
            heroText: "Show your work clearly and make it easy for people to contact you. Add case studies, a blog, and polish as your portfolio grows.",
            included: [
                "Up to 4 Pages",
                "Portfolio Gallery Layout",
                "Mobile-Responsive Design",
                "Contact Form",
                "Basic SEO Setup",
                "Basic Analytics Setup (GA4)"
            ],
            options: [
                "Case Study Template + CMS (+$450)",
                "Extra Page (+$120/page)",
                "Blog Setup (+$450)",
                "Copywriting (+$120/page)",
                "Newsletter Signup Integration (+$120)",
                "Video Embeds + Performance Setup (+$150)",
                "Custom Animations (+$300)",
                "Multi-Language (+$350)",
                "Advanced SEO + Schema (+$550)"
            ]
        },
        webapp: {
            label: "Web Application",
            heroTitle: "Customize your Web Application",
            heroText: "Define the MVP clearly, then add production-grade modules like roles, payments, integrations, and testing based on your roadmap.",
            included: [
                "MVP Scope (Core Feature Set)",
                "Auth (Login/Signup) Basics",
                "Database + Admin-Ready Structure",
                "Responsive UI (Basic)",
                "Deployment to Production",
                "Basic QA Pass"
            ],
            options: [
                "Roles/Permissions (+$900)",
                "Admin Dashboard (+$1,200)",
                "Payments — Stripe One-Time (+$1,200)",
                "Subscriptions + Billing Portal (+$1,800)",
                "API Integration — Per Service (+$600–$2,000)",
                "Email System — Transactional (+$350)",
                "File Uploads/Media Handling (+$450)",
                "Audit Logs/Activity Feed (+$500)",
                "Automated Testing Setup (+$900)",
                "SLA/Priority Support — Monthly (+$500–$2,000)"
            ]
        },
        redesign: {
            label: "Web Redesign",
            heroTitle: "Customize your Web Redesign",
            heroText: "Modernize your site without losing what already works. Add migration, performance, content, and brand upgrades based on your priorities.",
            included: [
                "Redesign Up to 5 Pages",
                "Mobile + Layout Cleanup",
                "Basic Speed Improvements",
                "Basic SEO Preservation",
                "Analytics Setup Check (GA4)",
                "Launch Support"
            ],
            options: [
                "Extra Page Redesigned (+$140/page)",
                "Copy Refresh (+$120/page)",
                "SEO Migration + Redirect Map (+$450)",
                "Performance Deep Optimization (+$450)",
                "Accessibility Pass (+$350)",
                "New Brand Style Refresh — Colors/Type/Components (+$600)",
                "New Photo/Graphics Direction (+$250)",
                "Rebuild on New Platform — WP/Webflow/etc. (+$800–$2,000)"
            ]
        },
        management: {
            label: "Ongoing Management",
            heroTitle: "Customize your Management Plan",
            heroText: "Keep your site updated, secure, and supported. Add only the ongoing services you'll actually use each month.",
            included: [
                "Updates (Themes/Plugins) Monthly",
                "Backups + Uptime Monitoring",
                "Basic Security Checks",
                "Minor Edits (30 min/mo)",
                "Monthly Report"
            ],
            options: [
                "Extra Support Time (+$90/hour)",
                "Analytics Dashboard + KPI Tracking (+$90/mo)",
                "Performance Monitoring + Tuning (+$120/mo)",
                "Advanced Security — WAF, Hardening (+$120/mo)",
                "Monthly SEO Content — 1 Blog (+$250)",
                "Local SEO Maintenance (+$200/mo)",
                "E-Commerce Maintenance (+$150/mo)"
            ]
        }
    });


    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initFade();
        initLenis();

        var selectedId = resolveServiceId();
        var config = customizationData[selectedId];

        populateHero(config);
        renderIncluded('included-list', config.included);
        renderOptions('options-list', config.options, loadPreselectedOptions());
        initCustomNotes();
        refreshIcons();

        bindBackButton(selectedId);
        bindSaveButton(selectedId);
        initScrollReveal();
    }


    function initFade() {
        var loader = document.getElementById('page-loader');
        document.body.classList.remove('loading');
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                document.body.classList.add('fade-in');
                if (loader) loader.classList.remove('active');
            });
        });

        window.addEventListener('pageshow', function (e) {
            document.body.classList.remove('fade-out', 'loading');
            document.body.classList.add('fade-in');
            if (loader) loader.classList.remove('active');
        });
    }

    function fadeOutAndNavigate(url) {
        var loader = document.getElementById('page-loader');
        if (loader) loader.classList.add('active');
        document.body.classList.add('fade-out');
        setTimeout(function () {
            window.location.replace(url);
        }, FADE_MS);
    }


    function initLenis() {
        if (typeof Lenis === 'undefined') return;
        try {
            var isIOScp = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            var lenisInstance = new Lenis({
                duration: 1.1,
                easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
                smoothWheel: !isIOScp,
                smoothTouch: false,
                wheelMultiplier: 1.0,
                touchMultiplier: isIOScp ? 1.0 : 1.5
            });
            function raf(time) {
                try {
                    lenisInstance.raf(time);
                } catch(e) {
                    console.warn('Lenis raf error on custom page:', e);
                    return;
                }
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        } catch (e) {
            console.warn('Lenis smooth scroll failed to initialize:', e);
        }
    }


    function refreshIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }


    function resolveServiceId() {
        var id = storageGet(STORAGE.SERVICE) || DEFAULT_SERVICE;
        if (!customizationData[id]) {
            id = DEFAULT_SERVICE;
        }
        return id;
    }

    function loadPreselectedOptions() {
        var raw = storageGet(STORAGE.OPTIONS);
        if (!raw) return [];
        try {
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }


    function populateHero(config) {
        var titleEl = document.getElementById('custom-title');
        var subtitleEl = document.getElementById('custom-subtitle');
        var pillEl = document.getElementById('current-service-name');

        if (titleEl) titleEl.textContent = config.heroTitle;
        if (subtitleEl) subtitleEl.textContent = config.heroText;
        if (pillEl) pillEl.textContent = config.label;
    }


    function renderIncluded(elementId, items) {
        var container = document.getElementById(elementId);
        if (!container) return;

        container.innerHTML = '';

        items.forEach(function (text) {
            var li = document.createElement('li');
            li.className = 'feature-row';

            var iconSpan = document.createElement('span');
            iconSpan.className = 'feature-icon included-check';
            iconSpan.innerHTML = '<i data-lucide="check"></i>';

            var textSpan = document.createElement('span');
            textSpan.className = 'feature-text';
            textSpan.textContent = text;

            li.appendChild(iconSpan);
            li.appendChild(textSpan);
            container.appendChild(li);
        });
    }


    function renderOptions(elementId, options, preselected) {
        var container = document.getElementById(elementId);
        if (!container) return;

        container.innerHTML = '';

        options.forEach(function (optionText) {
            var isChecked = preselected.indexOf(optionText) !== -1;

            var li = document.createElement('li');
            li.className = 'feature-row';

            var label = document.createElement('label');
            label.className = 'option-label';

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'option-checkbox';
            if (isChecked) checkbox.checked = true;

            var fakeBox = document.createElement('span');
            fakeBox.className = 'fake-box';

            var textSpan = document.createElement('span');
            textSpan.className = 'feature-text';
            textSpan.textContent = optionText;

            label.appendChild(checkbox);
            label.appendChild(fakeBox);
            label.appendChild(textSpan);
            li.appendChild(label);
            container.appendChild(li);
        });
    }


    function initCustomNotes() {
        var textarea = document.getElementById('custom-notes');
        var countEl = document.getElementById('char-count');
        var counterWrapper = document.getElementById('char-counter');

        if (!textarea || !countEl) return;

        var saved = storageGet(STORAGE.NOTES);
        if (saved) {
            textarea.value = saved;
            updateCounter(saved.length);
        }

        textarea.addEventListener('input', function () {
            updateCounter(textarea.value.length);
        });

        function updateCounter(len) {
            countEl.textContent = len;

            if (!counterWrapper) return;

            counterWrapper.classList.remove('warning', 'danger');
            if (len >= 900) {
                counterWrapper.classList.add('danger');
            } else if (len >= 750) {
                counterWrapper.classList.add('warning');
            }
        }
    }

    function getCustomNotes() {
        var textarea = document.getElementById('custom-notes');
        return textarea ? textarea.value.trim() : '';
    }


    function getSelectedCustomOptions() {
        var selected = [];
        var labels = document.querySelectorAll('#options-list .option-label');

        labels.forEach(function (label) {
            var checkbox = label.querySelector('.option-checkbox');
            var textEl = label.querySelector('.feature-text');
            if (checkbox && checkbox.checked && textEl) {
                selected.push(textEl.textContent.trim());
            }
        });

        return selected;
    }


    function saveAllState(selectedId) {
        storageSet(STORAGE.SERVICE, selectedId);
        storageSet(STORAGE.PACKAGE, 'custom');
        storageSet(STORAGE.OPTIONS, JSON.stringify(getSelectedCustomOptions()));
        storageSet(STORAGE.NOTES, getCustomNotes());
    }


    function showNotification(text, type) {
        var container = document.getElementById('notification-container');
        if (!container) return;

        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = text;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        container.appendChild(toast);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                toast.classList.add('show');
            });
        });

        setTimeout(function () {
            toast.classList.remove('show');

            var onEnd = function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
                toast.removeEventListener('transitionend', onEnd);
            };

            toast.addEventListener('transitionend', onEnd);

            setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 800);
        }, 3000);
    }


    function bindBackButton(selectedId) {
        var btn = document.getElementById('back-home-btn');
        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            saveAllState(selectedId);
            storageSet(STORAGE.SCROLL, '#packages');
            var loader = document.getElementById('page-loader');
            if (loader) loader.classList.add('active');
            document.body.classList.add('fade-out');
            setTimeout(function () {
                window.location.replace('index.html');
            }, FADE_MS);
        });
    }

    function bindSaveButton(selectedId) {
        var btn = document.getElementById('next-step-btn');
        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            saveAllState(selectedId);
            storageSet(STORAGE.SCROLL, '#contact');

            try {
                sessionStorage.setItem('showSavedNotification', 'true');
            } catch (err) {  }

            var loader = document.getElementById('page-loader');
            if (loader) loader.classList.add('active');
            fadeOutAndNavigate('index.html');
        });
    }


    function initScrollReveal() {
        if (typeof IntersectionObserver === 'undefined') return;

        var selectors = [
            '.custom-card',
            '.custom-notes-card',
            '.next-step-wrapper',
            '.back-note'
        ];

        var elements = document.querySelectorAll(selectors.join(','));
        if (!elements.length) return;

        var viewportHeight = window.innerHeight;

        elements.forEach(function (el) {
            if (el.getBoundingClientRect().top > viewportHeight) {
                el.classList.add('reveal');
            }
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);

                    setTimeout(function () {
                        entry.target.classList.remove('reveal', 'revealed');
                    }, 1000);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(function (el) {
            if (el.classList.contains('reveal')) {
                observer.observe(el);
            }
        });
    }

})();
}
