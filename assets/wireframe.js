/**
 * Wireframe Prototype Controller
 * Injects top navigation bar, multi-brand switching & UX annotation toggles
 */
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', initPrototype);

    function initPrototype() {
        // Determine active page
        var path = window.location.pathname;
        var currentPage = 'home';
        if (path.indexOf('themas') !== -1) currentPage = 'themas';
        else if (path.indexOf('sector-bouw') !== -1) currentPage = 'sector-bouw';
        else if (path.indexOf('zoeken') !== -1) currentPage = 'zoeken';
        else if (path.indexOf('opleiding') !== -1) currentPage = 'opleiding';
        else if (path.indexOf('afrekenen') !== -1) currentPage = 'afrekenen';
        else if (path.indexOf('bevestiging') !== -1) currentPage = 'bevestiging';

        // Load saved brand
        var savedBrand = localStorage.getItem('wf_brand') || 'syntra';
        document.body.setAttribute('data-brand', savedBrand);

        // Mapping of all wireframe prototype pages (0 t/m 8)
        var wireframePages = [
            { id: 'home', file: 'index.html', title: '0. Homepage (B2C & B2B Hub)' },
            { id: 'themas', file: 'themas.html', title: '1. Thema\'s & 18 Sectoren' },
            { id: 'sector-bouw', file: 'sector-bouw.html', title: '2. Sector Hub: Bouw & Energie' },
            { id: 'zoeken', file: 'zoeken.html', title: '3. Zoeken & Split-Catalogus' },
            { id: 'opleiding', file: 'opleiding.html', title: '4. Cursusdetailfiche (Elektro)' },
            { id: 'faq', file: 'faq.html', title: '5. FAQ & Schema Kennisbank' },
            { id: 'afrekenen', file: 'afrekenen.html', title: '6. Inschrijving / Checkout (B2C & B2B)' },
            { id: 'bevestiging', file: 'bevestiging.html', title: '7. Bevestiging & PDF Dossier' }
        ];

        // Determine current page index for prev/next buttons
        var currentIdx = 0;
        for (var i = 0; i < wireframePages.length; i++) {
            if (wireframePages[i].id === currentPage) {
                currentIdx = i;
                break;
            }
        }
        var prevPage = currentIdx > 0 ? wireframePages[currentIdx - 1].file : null;
        var nextPage = currentIdx < wireframePages.length - 1 ? wireframePages[currentIdx + 1].file : null;

        // Build select options
        var pageOptionsHtml = '';
        wireframePages.forEach(function(p, idx) {
            var selected = (p.id === currentPage) ? ' selected' : '';
            pageOptionsHtml += '<option value="' + p.file + '"' + selected + '>' + p.title + '</option>';
        });

        // Inject Prototype Navigation Bar with Dropdown
        var bar = document.createElement('div');
        bar.id = 'prototype-bar';
        bar.innerHTML = 
            '<div class="pb-left">' +
                '<a href="index.html" class="pb-logo">' +
                    '<span>Medium-Fi Wireframe</span>' +
                    '<span class="pb-tag">Sprint 1</span>' +
                '</a>' +
            '</div>' +
            '<nav class="pb-nav">' +
                '<div class="pb-page-quick-jump">' +
                    (prevPage ? '<a href="' + prevPage + '" class="pb-page-nav-btn" title="Vorige wireframe">&larr;</a>' : '<span class="pb-page-nav-btn" style="opacity:0.35;cursor:default;">&larr;</span>') +
                    '<div class="pb-page-select-wrapper">' +
                        '<select class="pb-page-select" id="wfPageDropdown" title="Kies een wireframe scherm (0 t/m 7)">' +
                            pageOptionsHtml +
                        '</select>' +
                        '<span class="pb-page-select-arrow">▼</span>' +
                    '</div>' +
                    (nextPage ? '<a href="' + nextPage + '" class="pb-page-nav-btn" title="Volgende wireframe">&rarr;</a>' : '<span class="pb-page-nav-btn" style="opacity:0.35;cursor:default;">&rarr;</span>') +
                '</div>' +
            '</nav>' +
            '<div class="pb-right">' +
                '<button type="button" class="pb-btn-user" id="wfUserToggle" title="Simuleer inloggen als cursist (Karel Strosse)">' +
                    '<span class="pb-user-dot"></span> Cursist: <strong id="wfUserStatus">Uitgelogd</strong>' +
                '</button>' +
                '<button type="button" class="pb-btn-design" id="wfDesignToggle" title="Schakel tussen Medium-Fidelity Wireframe en Hi-Fi Syntra Design">' +
                    '<span class="pb-design-dot"></span> Weergave: <strong id="wfDesignStatus">Wireframe</strong>' +
                '</button>' +
                '<button type="button" class="pb-btn-meetplan" id="wfMeetplanToggle" title="Toon het meetplan en alle tracking events">' +
                    '<span class="pb-meetplan-dot"></span> Meetplan: <strong id="wfMeetplanStatus">UIT</strong>' +
                '</button>' +
                '<label style="font-size:11px;color:#94a3b8;font-weight:600;">Merk:</label>' +
                '<select class="pb-select" id="wfBrandSelect">' +
                    '<option value="syntra"' + (savedBrand === 'syntra' ? ' selected' : '') + '>Syntra Midden-Vlaanderen</option>' +
                    '<option value="nxtpro"' + (savedBrand === 'nxtpro' ? ' selected' : '') + '>NxtPro B2B</option>' +
                    '<option value="brussel"' + (savedBrand === 'brussel' ? ' selected' : '') + '>Syntra Brussel</option>' +
                '</select>' +
            '</div>';

        document.body.insertBefore(bar, document.body.firstChild);

        // Handle Page Dropdown Change
        var pageDropdown = document.getElementById('wfPageDropdown');
        if (pageDropdown) {
            pageDropdown.addEventListener('change', function() {
                var targetUrl = this.value;
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
            });
        }

        // Handle Brand Switcher
        var brandSelect = document.getElementById('wfBrandSelect');
        if (brandSelect) {
            brandSelect.addEventListener('change', function() {
                var brand = this.value;
                document.body.setAttribute('data-brand', brand);
                localStorage.setItem('wf_brand', brand);
                updateBrandLabels(brand);
            });
            updateBrandLabels(savedBrand);
        }

        // Initialize Design Mode Switcher (Wireframe vs Hi-Fi Design)
        initDesignMode();

        // Initialize Official Brand Assets (SVG Logo)
        initOfficialBranding();

        // Initialize User Login Simulation (Suggestie 1B)
        initUserAccount(currentPage);

        // Initialize Course Interactive Features (Vraag stellen, Wachtlijst, Subsidiecalculator)
        initCourseInteractiveFeatures(currentPage);

        // Initialize Infosessie Features
        initInfosessieFeatures(currentPage);

        // Initialize Favorites & Wishlist Lead Generation System
        initFavoritesSystem(currentPage);

        // Initialize Athena AI Chatbot Widget first so it can be tracked
        initAthenaWidget(currentPage);

        // Initialize Interactive Meetplan Overlay
        initMeetplan(currentPage);
        // Handle Cluster Sub-navigation Active State
        var clusterLinks = document.querySelectorAll('.wf-cluster-links a');
        if (clusterLinks.length > 0) {
            clusterLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    clusterLinks.forEach(function(l) { l.classList.remove('active'); });
                    this.classList.add('active');
                });
            });

            // Scrollspy for cluster sub-nav
            window.addEventListener('scroll', function() {
                var scrollPos = window.scrollY + 180;
                clusterLinks.forEach(function(link) {
                    var targetId = link.getAttribute('href');
                    if (targetId && targetId.startsWith('#')) {
                        var targetEl = document.querySelector(targetId);
                        if (targetEl) {
                            var top = targetEl.offsetTop;
                            var height = targetEl.offsetHeight;
                            if (scrollPos >= top && scrollPos < top + height) {
                                clusterLinks.forEach(function(l) { l.classList.remove('active'); });
                                link.classList.add('active');
                            }
                        }
                    }
                });
            });
        }
        // Handle Anchor Links (Cursusdetail In-Page Navigatie)
        var anchorLinks = document.querySelectorAll('.wf-anchor-links a');
        if (anchorLinks.length > 0) {
            anchorLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    anchorLinks.forEach(function(l) { l.classList.remove('active'); });
                    this.classList.add('active');
                });
            });

            // Scrollspy for course anchor nav
            window.addEventListener('scroll', function() {
                var scrollPos = window.scrollY + 180;
                anchorLinks.forEach(function(link) {
                    var targetId = link.getAttribute('href');
                    if (targetId && targetId.startsWith('#')) {
                        var targetEl = document.querySelector(targetId);
                        if (targetEl) {
                            var top = targetEl.offsetTop;
                            var height = targetEl.offsetHeight;
                            if (scrollPos >= top && scrollPos < top + height) {
                                anchorLinks.forEach(function(l) { l.classList.remove('active'); });
                                link.classList.add('active');
                            }
                        }
                    }
                });
            });
        }
    }

    function updateBrandLabels(brand) {
        var logoName = 'SYNTRA';
        var logoSub = 'Midden-Vlaanderen';
        if (brand === 'nxtpro') {
            logoName = 'NXTPRO';
            logoSub = 'B2B Bedrijfsopleidingen & Maatwerk';
        } else if (brand === 'brussel') {
            logoName = 'SYNTRA';
            logoSub = 'Brussel';
        }

        document.querySelectorAll('.wf-brand-name').forEach(function(el) {
            el.textContent = logoName;
        });
        document.querySelectorAll('.wf-brand-sub').forEach(function(el) {
            el.textContent = logoSub;
        });

        // Update logo image sources based on active brand
        var logoSrc = 'assets/images/logo-syntra.svg';
        var logoAlt = 'Syntra Midden-Vlaanderen';
        if (brand === 'nxtpro') {
            logoSrc = 'assets/images/logo-nxtpro.svg';
            logoAlt = 'NxtPro Bedrijfsopleidingen';
        }

        document.querySelectorAll('.wf-brand-logo .wf-logo-img').forEach(function(img) {
            img.src = logoSrc;
            img.alt = logoAlt;
            img.setAttribute('data-brand-img', brand);
        });

        document.querySelectorAll('.wf-footer-logo-img').forEach(function(img) {
            img.src = logoSrc;
            img.alt = logoAlt;
            img.setAttribute('data-brand-img', brand);
        });
    }

    function initOfficialBranding() {
        // Inject official SVG logo into all topbar brand containers if not already present
        document.querySelectorAll('.wf-brand-logo').forEach(function(logoLink) {
            if (!logoLink.querySelector('.wf-logo-img')) {
                var img = document.createElement('img');
                img.className = 'wf-logo-img';
                img.src = 'assets/images/logo-syntra.svg';
                img.alt = 'Syntra Midden-Vlaanderen';
                logoLink.insertBefore(img, logoLink.firstChild);
            }
        });

        // Inject official SVG logo into footer
        var footerCol = document.querySelector('.wf-footer .wf-footer-col');
        if (footerCol && !footerCol.querySelector('.wf-footer-logo-img')) {
            var footerLogo = document.createElement('img');
            footerLogo.className = 'wf-footer-logo-img';
            footerLogo.src = 'assets/images/logo-syntra.svg';
            footerLogo.alt = 'Syntra Midden-Vlaanderen';
            var firstEl = footerCol.firstElementChild;
            if (firstEl) {
                firstEl.classList.add('wf-footer-logo-fallback');
                footerCol.insertBefore(footerLogo, firstEl);
            }
        }
    }

    /* ==========================================================================
       DESIGN MODE CONTROLLER (Wireframe vs High-Fidelity Syntra Design)
       ========================================================================== */
    function initDesignMode() {
        var toggleBtn = document.getElementById('wfDesignToggle');
        var statusLabel = document.getElementById('wfDesignStatus');
        if (!toggleBtn) return;

        // Ensure Google Fonts link is injected
        if (!document.getElementById('wfGoogleFonts')) {
            var fontLink = document.createElement('link');
            fontLink.id = 'wfGoogleFonts';
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Inter:wght@400;500;600;700;800&display=swap';
            document.head.appendChild(fontLink);
        }

        var isDesign = localStorage.getItem('wf_design_mode') === 'true';

        function updateDesignUI(active) {
            if (active) {
                document.body.classList.add('wf-design-mode');
                toggleBtn.classList.add('active');
                if (statusLabel) statusLabel.textContent = 'Hi-Fi Design';
                applyDesignPhotos(true);
            } else {
                document.body.classList.remove('wf-design-mode');
                toggleBtn.classList.remove('active');
                if (statusLabel) statusLabel.textContent = 'Wireframe';
                applyDesignPhotos(false);
            }
        }

        toggleBtn.addEventListener('click', function() {
            var current = document.body.classList.contains('wf-design-mode');
            var next = !current;
            localStorage.setItem('wf_design_mode', next ? 'true' : 'false');
            updateDesignUI(next);
        });

        // Initialize state
        updateDesignUI(isDesign);
    }

    function applyDesignPhotos(active) {
        var placeholders = document.querySelectorAll('.wf-img-ph');
        if (!active) {
            placeholders.forEach(function(el) {
                if (el.dataset.wfOriginalStyle !== undefined) {
                    el.style.backgroundImage = el.dataset.wfOriginalBg || '';
                    el.style.backgroundSize = el.dataset.wfOriginalSize || '';
                    el.style.backgroundPosition = el.dataset.wfOriginalPos || '';
                    el.style.border = '';
                } else {
                    el.style.backgroundImage = '';
                    el.style.backgroundSize = '';
                    el.style.backgroundPosition = '';
                    el.style.border = '';
                }
            });
            return;
        }

        var photoMap = {
            'creatief': 'assets/images/visual-creatief-ambacht.jpg',
            'ambacht': 'assets/images/visual-creatief-ambacht.jpg',
            'mode': 'assets/images/visual-creatief-ambacht.jpg',
            'maatwerk': 'assets/images/visual-creatief-ambacht.jpg',
            'design': 'assets/images/visual-creatief-ambacht.jpg',
            'textiel': 'assets/images/visual-creatief-ambacht.jpg',
            'kunst': 'assets/images/visual-creatief-ambacht.jpg',
            'interieur': 'assets/images/visual-creatief-ambacht.jpg',

            'werfleider': 'assets/images/hero-bouw.jpg',
            'bouw': 'assets/images/hero-bouw.jpg',
            'veiligheid': 'assets/images/hero-bouw.jpg',
            'hoogte': 'assets/images/hero-bouw.jpg',
            'elektro': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
            'residentieel': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
            'energie': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=80',

            'ondernemen': 'assets/images/hero-home.jpg',
            'management': 'assets/images/hero-home.jpg',
            'digitaal': 'assets/images/hero-home.jpg',
            'bedrijf': 'assets/images/hero-home.jpg',
            'ai': 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=900&q=80',
            'prompt': 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=900&q=80',
            'data': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
            'zorg': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
            'culinair': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
            'horeca': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
            'brochure': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
            'hero_home': 'assets/images/hero-home.jpg',
            'hero_sector': 'assets/images/hero-bouw.jpg',
            'hero_course': 'assets/images/hero-bouw.jpg'
        };

        placeholders.forEach(function(el, i) {
            if (!el.dataset.wfOriginalStyle) {
                el.dataset.wfOriginalStyle = 'true';
                el.dataset.wfOriginalBg = el.style.backgroundImage || '';
                el.dataset.wfOriginalSize = el.style.backgroundSize || '';
                el.dataset.wfOriginalPos = el.style.backgroundPosition || '';
            }

            // Determine image by surrounding contextual text
            var card = el.closest('.wf-card') || el.closest('.wf-card-horizontal') || el.closest('.wf-section') || el.parentElement;
            var text = card ? card.textContent.toLowerCase() : '';

            var selectedImg = el.dataset.designImg || null;
            if (!selectedImg) {
                if (el.closest('.wf-section:first-of-type') && (text.indexOf('doeners') !== -1 || text.indexOf('professionals') !== -1)) {
                    selectedImg = photoMap['hero_home'];
                } else if (text.indexOf('bouw & energie') !== -1 && text.indexOf('expertise voor de bouw') !== -1) {
                    selectedImg = photoMap['hero_sector'];
                } else if (text.indexOf('residentieel') !== -1 || text.indexOf('elektro') !== -1) {
                    selectedImg = photoMap['residentieel'];
                } else if (text.indexOf('werfleider') !== -1) {
                    selectedImg = photoMap['werfleider'];
                } else if (text.indexOf('prompt') !== -1 || text.indexOf('ai') !== -1 || text.indexOf('digitaal') !== -1) {
                    selectedImg = photoMap['digitaal'];
                } else if (text.indexOf('ondernemen') !== -1 || text.indexOf('management') !== -1) {
                    selectedImg = photoMap['ondernemen'];
                } else if (text.indexOf('zorg') !== -1) {
                    selectedImg = photoMap['zorg'];
                } else if (text.indexOf('culinair') !== -1 || text.indexOf('horeca') !== -1) {
                    selectedImg = photoMap['culinair'];
                } else if (text.indexOf('veiligheid') !== -1 || text.indexOf('hoogte') !== -1) {
                    selectedImg = photoMap['hoogte'];
                } else if (text.indexOf('brochure') !== -1) {
                    selectedImg = photoMap['brochure'];
                } else if (text.indexOf('bouw') !== -1) {
                    selectedImg = photoMap['bouw'];
                } else {
                    var defaults = [photoMap['hero_home'], photoMap['bouw'], photoMap['residentieel'], photoMap['digitaal']];
                    selectedImg = defaults[i % defaults.length];
                }
            }

            el.style.backgroundImage = 'url("' + selectedImg + '")';
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            el.style.border = 'none';
        });
    }

    // Global Interactive Rooster View Switcher (List vs Calendar)
    window.switchRoosterView = function(btn, viewType) {
        var container = btn.closest('.wf-session-expand');
        if (!container) return;
        
        var buttons = container.querySelectorAll('.wf-rooster-switch-btn');
        buttons.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var listView = container.querySelector('.rooster-view-list');
        var calView = container.querySelector('.rooster-view-cal');
        if (viewType === 'list') {
            if (listView) listView.style.display = 'block';
            if (calView) calView.style.display = 'none';
        } else {
            if (listView) listView.style.display = 'none';
            if (calView) calView.style.display = 'block';
        }
    };

    window.changeCalMonth = function(btn, monthName) {
        var wrapper = btn.closest('.wf-cal-wrapper');
        if (!wrapper) return;
        var months = wrapper.querySelectorAll('.wf-cal-month-data');
        months.forEach(function(m) { m.style.display = 'none'; });
        var target = wrapper.querySelector('.wf-cal-month-' + monthName);
        if (target) target.style.display = 'block';
    };

    /* ==========================================================================
       MEETPLAN CONTROLLER & EVENT CATALOG
       ========================================================================== */
    window.dataLayer = window.dataLayer || [];
    window.wfDataLayerLog = window.wfDataLayerLog || [];

    var meetplanCatalog = {
        'home': [
            {
                id: 'home_search',
                selector: 'form[action="zoeken.html"]',
                event: 'search',
                shortLabel: 'Catalogus Zoekbalk',
                category: 'Site Search',
                trigger: 'Zoekopdracht indienen via de centrale hero zoekbalk',
                funnelStep: 'Fase 1: Oriëntatie & Intentie',
                rationale: 'Cruciaal om zoekintentie, leemtes in het opleidingsaanbod en zoekgedrag (bv. vraag naar specifieke software of certificaten) in kaart te brengen.',
                payload: {
                    event: 'search',
                    search_term: 'Residentieel elektricien',
                    search_category: 'Opleidingsaanbod',
                    user_brand: 'syntra'
                }
            },
            {
                id: 'home_theme_bouw',
                selector: '.wf-grid-4 .wf-card:nth-child(1)',
                event: 'select_content',
                shortLabel: 'Bouw & Energie',
                category: 'Domeinkeuze',
                trigger: 'Klik op themakaart "Bouw, Hout & Energie"',
                funnelStep: 'Fase 1: Oriëntatie & Domeinkeuze',
                rationale: 'Meet doorklik vanuit de homepage direct naar de modulaire Sector Hub Bouw.',
                payload: {
                    event: 'select_content',
                    content_type: 'opleidingsthema',
                    item_id: 'bouw-hout-energie',
                    destination_url: 'sector-bouw.html'
                }
            },
            {
                id: 'home_theme_elektro',
                selector: '.wf-grid-4 .wf-card:nth-child(2)',
                event: 'select_content',
                shortLabel: 'Elektro & Auto',
                category: 'Domeinkeuze',
                trigger: 'Klik op themakaart "Elektro & Automatisatie"',
                funnelStep: 'Fase 1: Oriëntatie & Domeinkeuze',
                rationale: 'Monitort interesse in technische knelpuntberoepen en domotica.',
                payload: {
                    event: 'select_content',
                    content_type: 'opleidingsthema',
                    item_id: 'elektro-automatisatie',
                    destination_url: 'zoeken.html'
                }
            },
            {
                id: 'home_theme_digitaal',
                selector: '.wf-grid-4 .wf-card:nth-child(3)',
                event: 'select_content',
                shortLabel: 'Digitaal & AI',
                category: 'Domeinkeuze',
                trigger: 'Klik op themakaart "Digitaal, Data & AI"',
                funnelStep: 'Fase 1: Oriëntatie & Domeinkeuze',
                rationale: 'Bepaalt de homepage-tractie van IT, programmeren en AI bedrijfsworkshops.',
                payload: {
                    event: 'select_content',
                    content_type: 'opleidingsthema',
                    item_id: 'digitaal-data-ai',
                    destination_url: 'zoeken.html'
                }
            },
            {
                id: 'home_theme_ondernemen',
                selector: '.wf-grid-4 .wf-card:nth-child(4)',
                event: 'select_content',
                shortLabel: 'Ondernemen & HR',
                category: 'Domeinkeuze',
                trigger: 'Klik op themakaart "Ondernemen, HR & Financiën"',
                funnelStep: 'Fase 1: Oriëntatie & Domeinkeuze',
                rationale: 'Monitort vraag naar ondernemersvaardigheden en managementcursussen.',
                payload: {
                    event: 'select_content',
                    content_type: 'opleidingsthema',
                    item_id: 'ondernemen-hr-financien',
                    destination_url: 'themas.html'
                }
            },
            {
                id: 'home_course_click',
                selector: '.wf-grid-3 .wf-card:first-child',
                event: 'select_item',
                shortLabel: 'Opleiding in de kijker',
                category: 'GA4 Enhanced Ecommerce',
                trigger: 'Klik op een opleiding in de kijker (bv. Residentieel Elektricien)',
                funnelStep: 'Fase 2: Productselectie',
                rationale: 'Bepaalt de Click-Through Rate (CTR) van uitgelichte opleidingen tegenover de bredere themalijst.',
                payload: {
                    event: 'select_item',
                    item_list_id: 'populair_home',
                    item_list_name: 'Opleidingen in de kijker',
                    items: [{
                        item_id: 'EL-2026-RES',
                        item_name: 'Residentieel Elektrotechnisch Installateur',
                        item_category: 'Bouw & Energie',
                        price: 1250.00
                    }]
                }
            },
            {
                id: 'home_favorite_wishlist',
                selector: '.wf-fav-btn',
                event: 'add_to_wishlist',
                shortLabel: 'Opleiding Favoriet',
                category: 'GA4 Enhanced Ecommerce & Leads',
                trigger: 'Klik op het hartje om een opleiding te bewaren en profiel aan te maken',
                funnelStep: 'Fase 2: Latente Interesse & Lead Acquisitie',
                rationale: 'Essentiële micro-conversie: capteert leads van twijfelaars die nog niet direct inschrijven maar wel startdata willen volgen.',
                payload: {
                    event: 'add_to_wishlist',
                    items: [{
                        item_id: 'EL-2026-RES',
                        item_name: 'Residentieel Elektrotechnisch Installateur',
                        price: 1250.00
                    }],
                    user_authenticated: false,
                    lead_source: 'favoriet_opslaan'
                }
            },
            {
                id: 'home_brochure_lead',
                selector: 'section.bg-alt .wf-btn-primary',
                event: 'generate_lead',
                shortLabel: 'Brochure Download',
                category: 'Lead Generation',
                trigger: 'Klik op "Blader digitaal" of brochure download',
                funnelStep: 'Fase 1: Oriëntatie & Micro-conversie',
                rationale: 'Hoge indicatie van latente inschrijfintentie; voedt geautomatiseerde retargeting/email nurturing via CRM.',
                payload: {
                    event: 'generate_lead',
                    lead_type: 'brochure_download',
                    campaign_year: '2026-2027',
                    document_name: 'Opleidingsbrochure'
                }
            }
        ],
        'themas': [
            {
                id: 'themas_card_bouw',
                selector: '.wf-grid-3 .wf-card:nth-child(1)',
                event: 'select_content',
                shortLabel: 'Bouw & Energie',
                category: 'Sectorkeuze',
                trigger: 'Klik op sector "Bouw & Energie" (84 opleidingen)',
                funnelStep: 'Fase 1: Domeinkeuze',
                rationale: 'Meet doorklik naar de thematische sectorhub Bouw & Energie voor specifieke vakkennis en premies.',
                payload: {
                    event: 'select_content',
                    content_type: 'sector_hub',
                    theme_name: 'Bouw & Energie',
                    destination_url: 'sector-bouw.html',
                    total_courses_in_theme: 84
                }
            },
            {
                id: 'themas_card_elektro',
                selector: '.wf-grid-3 .wf-card:nth-child(2)',
                event: 'select_content',
                shortLabel: 'Elektro & Automatisatie',
                category: 'Sectorkeuze',
                trigger: 'Klik op sector "Elektro & Automatisatie" (42 opleidingen)',
                funnelStep: 'Fase 1: Domeinkeuze',
                rationale: 'Analyseert de vraag naar residentiële vs industriële elektrotechniek.',
                payload: {
                    event: 'select_content',
                    content_type: 'themapagina',
                    theme_name: 'Elektro & Automatisatie',
                    destination_url: 'zoeken.html',
                    total_courses_in_theme: 42
                }
            },
            {
                id: 'themas_card_digitaal',
                selector: '.wf-grid-3 .wf-card:nth-child(3)',
                event: 'select_content',
                shortLabel: 'Digitaal & AI',
                category: 'Sectorkeuze',
                trigger: 'Klik op sector "Digitaal & Kunstmatige Intelligentie" (38 opleidingen)',
                funnelStep: 'Fase 1: Domeinkeuze',
                rationale: 'Geeft realtime inzicht in de populariteit van IT herscholing en AI automatisatie.',
                payload: {
                    event: 'select_content',
                    content_type: 'themapagina',
                    theme_name: 'Digitaal & Kunstmatige Intelligentie',
                    destination_url: 'zoeken.html',
                    total_courses_in_theme: 38
                }
            },
            {
                id: 'themas_card_ondernemen',
                selector: '.wf-grid-3 .wf-card:nth-child(4)',
                event: 'select_content',
                shortLabel: 'Ondernemen & HR',
                category: 'Sectorkeuze',
                trigger: 'Klik op sector "Ondernemen, HR & Financiën" (61 opleidingen)',
                funnelStep: 'Fase 1: Domeinkeuze',
                rationale: 'Meet interesse van starters, zelfstandigen en KMO zaakvoerders in bedrijfsvoering.',
                payload: {
                    event: 'select_content',
                    content_type: 'themapagina',
                    theme_name: 'Ondernemen, HR & Financiën',
                    destination_url: 'zoeken.html',
                    total_courses_in_theme: 61
                }
            },
            {
                id: 'themas_card_zorg',
                selector: '.wf-grid-3 .wf-card:nth-child(5)',
                event: 'select_content',
                shortLabel: 'Zorg & Welzijn',
                category: 'Sectorkeuze',
                trigger: 'Klik op sector "Zorg & Begeleiding" (29 opleidingen)',
                funnelStep: 'Fase 1: Domeinkeuze',
                rationale: 'Volgt instroom voor zorgkundigen en kinderbegeleiders met strenge toelatingseisen.',
                payload: {
                    event: 'select_content',
                    content_type: 'themapagina',
                    theme_name: 'Zorg & Begeleiding',
                    destination_url: 'zoeken.html',
                    total_courses_in_theme: 29
                }
            },
            {
                id: 'themas_card_culinair',
                selector: '.wf-grid-3 .wf-card:nth-child(6)',
                event: 'select_content',
                shortLabel: 'Culinaire Beroepen',
                category: 'Sectorkeuze',
                trigger: 'Klik op sector "Culinaire Beroepen" (34 opleidingen)',
                funnelStep: 'Fase 1: Domeinkeuze',
                rationale: 'Meet tractie in horeca- en ambachtstrajecten (kok, patissier, bakker, brouwer).',
                payload: {
                    event: 'select_content',
                    content_type: 'themapagina',
                    theme_name: 'Culinaire Beroepen',
                    destination_url: 'zoeken.html',
                    total_courses_in_theme: 34
                }
            }
        ],
        'sector-bouw': [
            {
                id: 'sector_subnav',
                selector: '.wf-cluster-nav',
                event: 'cluster_navigation',
                shortLabel: 'Sector Navigatie',
                category: 'Sectornavigatie',
                trigger: 'Navigeren via de sector-subnavenbalk (Overzicht, Opleidingen, Actueel, B2B, Subsidies)',
                funnelStep: 'Fase 1: Sectorverdieping',
                rationale: 'Meet welke specifieke sectie bouwaannemers en particulieren het meest raadplegen binnen een cluster-hub.',
                payload: {
                    event: 'cluster_navigation',
                    sector: 'Bouw & Energie',
                    nav_target: '#b2b-bouw'
                }
            },
            {
                id: 'sector_search',
                selector: '#sectorSearchInput',
                event: 'search',
                shortLabel: 'Sector Zoekbalk',
                category: 'Sector Zoekopdracht',
                trigger: 'Zoekopdracht uitvoeren binnen het Bouw & Energie aanbod (bv. "warmtepomp", "veiligheid")',
                funnelStep: 'Fase 1: Gerichte Sector Exploratie',
                rationale: 'Meet de specifieke zoekintentie van bouwprofessionals binnen het geclusterde sectordomein.',
                payload: {
                    event: 'search',
                    search_term: 'dakwerken',
                    search_scope: 'sector_bouw',
                    results_count: 14
                }
            },
            {
                id: 'sector_subdomain_filter',
                selector: '#sectorSubdomainFilters',
                event: 'filter_applied',
                shortLabel: 'Subdomein Tabs',
                category: 'Sector Filteren',
                trigger: 'Subdomein selecteren (Werf & Coördinatie, HVAC, Elektrotechniek, Hout & Dak)',
                funnelStep: 'Fase 1: Sector Verdieping',
                rationale: 'Brengt in kaart welke subbranches binnen de bouwsector de grootste instroom genereren.',
                payload: {
                    event: 'filter_applied',
                    filter_type: 'subdiscipline',
                    filter_value: 'HVAC & Sanitair',
                    results_remaining: 22
                }
            },
            {
                id: 'sector_course_click_1',
                selector: '#sectorCourseElektro',
                event: 'select_item',
                shortLabel: 'Cursus Elektricien',
                category: 'GA4 Enhanced Ecommerce',
                trigger: 'Klik op "Bekijk cursus" (Residentieel Elektricien) binnen sector Bouw',
                funnelStep: 'Fase 2: Opleiding Overweging',
                rationale: 'E-commerce doorklikratio vanuit gespecialiseerde sectorhubs vergelijken met generieke zoeklijsten.',
                payload: {
                    event: 'select_item',
                    item_list_name: 'Sector Hub Bouw',
                    items: [{
                        item_id: 'EL-2026-RES',
                        item_name: 'Residentieel Elektrotechnisch Installateur',
                        price: 1250.00
                    }]
                }
            },
            {
                id: 'sector_course_click_2',
                selector: '#sectorCourseWerfleider',
                event: 'select_item',
                shortLabel: 'Cursus Werfleider',
                category: 'GA4 Enhanced Ecommerce',
                trigger: 'Klik op "Bekijk cursus" (Werfleider Woningbouw)',
                funnelStep: 'Fase 2: Opleiding Overweging',
                rationale: 'Bepaalt de interesse in leidinggevende bachelors/attesten in de bouwsector.',
                payload: {
                    event: 'select_item',
                    item_list_name: 'Sector Hub Bouw',
                    items: [{
                        item_id: 'BW-2026-WERF',
                        item_name: 'Werfleider Woning- en Appartementsbouw',
                        price: 1450.00
                    }]
                }
            },
            {
                id: 'sector_b2b_quote',
                selector: '#b2b-bouw .wf-btn-primary',
                event: 'generate_lead',
                shortLabel: 'B2B Offerte Bouw',
                category: 'B2B Lead Gen (NxtPro)',
                trigger: 'Aanvraag vrijblijvende B2B offerte voor bouwwerf / groepstraining',
                funnelStep: 'B2B Lead Funnel',
                rationale: 'Hoogste B2B commerciële waarde: leidt tot directe opvolging door accountmanager Bouw.',
                payload: {
                    event: 'generate_lead',
                    lead_type: 'b2b_in_company_quote',
                    sector: 'Bouw & Energie',
                    fonds_pc: 'PC 124'
                }
            },
            {
                id: 'sector_subsidy_click',
                selector: '#subsidies .wf-grid-3 .wf-card:first-child',
                event: 'view_subsidy_info',
                shortLabel: 'Constructiv Premie',
                category: 'Financiering & Premies',
                trigger: 'Raadplegen van Constructiv PC 124 of Winteropleidingen regelingen',
                funnelStep: 'Fase 2: Financiële Drempelverlaging',
                rationale: 'Analyseert hoe zwaar de sectorpremie meespeelt in het beslissingsproces van bouwbedrijven.',
                payload: {
                    event: 'view_subsidy_info',
                    subsidy_name: 'Constructiv (PC 124) Winteropleidingen',
                    user_segment: 'b2b'
                }
            },
            {
                id: 'sector_newsletter_sub',
                selector: '#wfSectorNewsBtn',
                event: 'generate_lead',
                shortLabel: 'Aanmelden Bouw-Updates',
                category: 'Sector Lead Nurturing',
                trigger: 'Inschrijven op bouwnieuws, wetgeving en nieuwe opleidingsstartdata',
                funnelStep: 'Fase 1: Doelgroep Nurturing & Micro-conversie',
                rationale: 'Legt latente interesse vast van professionals die nu nog niet inschrijven, gesegmenteerd per persona.',
                payload: {
                    event: 'sector_newsletter_subscribed',
                    sector: 'Bouw & Energie',
                    segment: 'particulier',
                    topics: ['normen', 'startdata', 'subsidies']
                }
            }
        ],
        'zoeken': [
            {
                id: 'catalog_search_keyword',
                selector: '#catalogSearchBox',
                event: 'search',
                shortLabel: 'Trefwoord Zoeken',
                category: 'Catalogus Zoekfunctie',
                trigger: 'Zoeken op trefwoord binnen de cursusresultaten (bv. "Elektricien", "BIM")',
                funnelStep: 'Fase 1: Gerichte Exploratie',
                rationale: 'Cruciaal voor zoekterm-analyse: brengt in kaart welke beroepen of software cursisten letterlijk intikken.',
                payload: {
                    event: 'search',
                    search_term: 'Elektricien',
                    search_scope: 'catalogus_filter',
                    results_count: 84
                }
            },
            {
                id: 'catalog_sort',
                selector: '#catalogSortBox',
                event: 'sort_change',
                shortLabel: 'Sortering',
                category: 'Catalogus Sorteren',
                trigger: 'Sortering wijzigen (Startdatum, Populariteit, Prijs)',
                funnelStep: 'Fase 1: Gerichte Exploratie',
                rationale: 'Bepaalt wat cursisten primair motiveert: planning (snelste start) of budget (prijs laag-hoog).',
                payload: {
                    event: 'sort_change',
                    sort_by: 'start_date_asc',
                    results_count: 84
                }
            },
            {
                id: 'filter_campus',
                selector: '#filterGroupCampus',
                event: 'filter_applied',
                shortLabel: 'Filter: Campus',
                category: 'Locatie Matching',
                trigger: 'Filteren op één of meerdere campussen (Mechelen, Sint-Niklaas, Leuven, Brussel, Online)',
                funnelStep: 'Fase 1: Geografische Matching',
                rationale: 'Meet de geografische vraagverdeling over de Syntra-campussen en de populariteit van digitaal afstandsonderwijs.',
                payload: {
                    event: 'filter_applied',
                    filter_type: 'campus',
                    filter_value: 'Sint-Niklaas',
                    results_remaining: 36
                }
            },
            {
                id: 'filter_lesmoment',
                selector: '#filterGroupLesmoment',
                event: 'filter_applied',
                shortLabel: 'Filter: Lesmoment',
                category: 'Formule & Agenda',
                trigger: 'Filteren op lesmoment (Voltijds dagtraject, Avondopleiding, Zaterdag/Weekend)',
                funnelStep: 'Fase 1: Praktische Inpassing',
                rationale: 'Evalueert de verhouding tussen voltijdse cursisten en werkenden die een avondtraject zoeken.',
                payload: {
                    event: 'filter_applied',
                    filter_type: 'schedule_mode',
                    filter_value: 'avond',
                    results_remaining: 24
                }
            },
            {
                id: 'filter_beschikbaarheid',
                selector: '#filterGroupBeschikbaarheid',
                event: 'filter_applied',
                shortLabel: 'Filter: B2B/Type',
                category: 'Doelgroep Segmentatie',
                trigger: 'Filteren tussen open inschrijvingen en op aanvraag (in-company/B2B)',
                funnelStep: 'Fase 1: Doelgroep Matching',
                rationale: 'Onderscheidt individuele cursisten van werkgevers die zoeken naar gesloten bedrijfsopleidingen.',
                payload: {
                    event: 'filter_applied',
                    filter_type: 'availability_type',
                    filter_value: 'in_company',
                    results_remaining: 18
                }
            },
            {
                id: 'filter_vakgebied',
                selector: '#filterGroupVakgebied',
                event: 'filter_applied',
                shortLabel: 'Filter: Sector',
                category: 'Domein Navigatie',
                trigger: 'Filteren op sector/vakgebied (Bouw, Elektro, IT/AI, Bedrijf)',
                funnelStep: 'Fase 1: Domein Focus',
                rationale: 'Monitort sectorale interesseverschuivingen en cross-sectorale zoekpaden.',
                payload: {
                    event: 'filter_applied',
                    filter_type: 'theme_sector',
                    filter_value: 'bouw-hout-energie',
                    results_remaining: 84
                }
            },
            {
                id: 'filter_reset',
                selector: '#filterResetBtn',
                event: 'filter_reset',
                shortLabel: 'Wis Filters',
                category: 'Filter Navigatie',
                trigger: 'Klik op "Wissen" om alle actieve catalogusfilters te resetten',
                funnelStep: 'Fase 1: Heroriëntatie',
                rationale: 'Signaleert frictie of te restrictieve filtering waarbij cursisten de zoekcriteria herstarten.',
                payload: {
                    event: 'filter_reset',
                    cleared_filters_count: 4,
                    total_results_restored: 120
                }
            },
            {
                id: 'search_result_item',
                selector: '#searchResultCard1',
                event: 'select_item',
                shortLabel: 'Cursus Selectie',
                category: 'GA4 Enhanced Ecommerce',
                trigger: 'Doorklikken vanuit de zoekresultaten naar cursusdetail (Residentieel Elektricien)',
                funnelStep: 'Fase 2: Productselectie',
                rationale: 'Standaard GA4 e-commerce metric om zoekrelevantie en doorklikratio per rankingpositie te monitoren.',
                payload: {
                    event: 'select_item',
                    item_list_name: 'Search Results Catalog',
                    items: [{
                        item_id: 'EL-2026-RES',
                        item_name: 'Residentieel Elektrotechnisch Installateur',
                        price: 1250.00
                    }]
                }
            }
        ],
        'opleiding': [
            {
                id: 'course_hero_enroll',
                selector: '.wf-section:first-of-type .wf-btn-primary',
                event: 'cta_click',
                category: 'Conversie CTA',
                trigger: 'Klik op "Kies jouw campus & schrijf in" in de hero header',
                funnelStep: 'Fase 2: Directe Conversie-intentie',
                rationale: 'Meet of cursisten direct converteren zonder eerst de volledige pagina door te scrollen.',
                payload: {
                    event: 'cta_click',
                    cta_position: 'hero_header',
                    cta_label: 'Kies jouw campus & schrijf in'
                }
            },
            {
                id: 'course_anchor_nav',
                selector: '.wf-anchor-nav',
                event: 'navigation_anchor',
                category: 'Cursus Oriëntatie',
                trigger: 'Gebruik van sticky ankerpunten (Programma, Getuigschrift, Toelating, Rooster, Subsidies)',
                funnelStep: 'Fase 2: Informatiebehoefte',
                rationale: 'Brengt in kaart welke inhoudelijke velden beslissend zijn voor inschrijving (vaak subsidies en getuigschrift).',
                payload: {
                    event: 'navigation_anchor',
                    section_target: '#programma',
                    scroll_depth: 35
                }
            },
            {
                id: 'course_floating_enroll',
                selector: '.wf-floating-enroll',
                event: 'begin_checkout_floating',
                category: 'Sticky CTA Conversie',
                trigger: 'Klik op de zwevende actieknop "Inschrijven & Data (8 Sessies)"',
                funnelStep: 'Fase 3: Sessie Selectie',
                rationale: 'Meet het conversie-effect van de persistente floating button tegenover statische pagina-knoppen.',
                payload: {
                    event: 'begin_checkout_floating',
                    course_id: 'EL-2026-RES',
                    total_sessions_available: 8
                }
            },
            {
                id: 'course_rooster_view',
                selector: '.wf-rooster-switch',
                event: 'view_schedule_mode',
                category: 'Lessenrooster Interactie',
                trigger: 'Wisselen tussen Lijstweergave en Kalenderweergave',
                funnelStep: 'Fase 2: Praktische Inpassing',
                rationale: 'Onderzoekt hoe cursisten hun lessenrooster visualiseren en verifiëren met hun privé/werkagenda.',
                payload: {
                    event: 'view_schedule_mode',
                    view_selected: 'calendar_grid',
                    campus: 'Sint-Niklaas'
                }
            },
            {
                id: 'course_calendar_export',
                selector: 'button[onclick*="alert"][onclick*="ics"]',
                event: 'export_calendar',
                category: 'Micro-conversie',
                trigger: 'Downloaden van het Lessenrooster als .ics kalenderbestand',
                funnelStep: 'Fase 2: Hoge Intentie',
                rationale: 'Sterkste signaal van serieuze interesse; cursist plaatst lessen al in eigen Outlook/Google agenda.',
                payload: {
                    event: 'export_calendar',
                    format: 'ics',
                    campus: 'Sint-Niklaas',
                    session_count: 30
                }
            },
            {
                id: 'course_enroll_button',
                selector: '.wf-session-row:not(.is-header) .wf-btn-primary',
                event: 'begin_checkout',
                category: 'GA4 Enhanced Ecommerce (Stap 1)',
                trigger: 'Klik op "Inschrijven &rarr;" bij een specifieke campus en datum',
                funnelStep: 'Fase 3: Start Inschrijving',
                rationale: 'Het officiële beginpunt van de e-commerce inschrijvingsfunnel conform Google Analytics 4 standaard.',
                payload: {
                    event: 'begin_checkout',
                    ecommerce: {
                        currency: 'EUR',
                        value: 1250.00,
                        items: [{
                            item_id: 'EL-2026-RES',
                            item_name: 'Residentieel Elektrotechnisch Installateur',
                            item_category: 'Bouw & Energie',
                            campus: 'Sint-Niklaas',
                            start_date: '2026-09-14',
                            price: 1250.00,
                            quantity: 1
                        }]
                    }
                }
            },
            {
                id: 'course_subsidies_view',
                selector: '#subsidies .wf-grid-3',
                event: 'view_subsidy_details',
                category: 'Subsidies & Financiering',
                trigger: 'Weergave van sectorpremies (Constructiv, Volta, VOV, Opleidingscheques)',
                funnelStep: 'Fase 2: Prijs/Financiering',
                rationale: 'Meet impact van sectorpremies op conversiebereidheid bij twijfelende bezoekers.',
                payload: {
                    event: 'view_subsidy_details',
                    supported_schemes: ['Constructiv PC 124', 'Volta PC 149.01', 'VOV', 'Opleidingscheques']
                }
            }
        ],
        'afrekenen': [
            {
                id: 'checkout_segment_b2b',
                selector: '#customerTypeTabs',
                event: 'checkout_segment_change',
                category: 'Klantsegmentatie (B2B vs B2C)',
                trigger: 'Wisselen tussen Particulier (privé) en Bedrijf (B2B factuur)',
                funnelStep: 'Checkout Stap 1: Facturatiegegevens',
                rationale: 'Essentieel voor de scheiding tussen Syntra (B2C) en NxtPro (B2B); B2B leidt tot hogere orderwaarde en meerdere deelnemers.',
                payload: {
                    event: 'checkout_segment_change',
                    customer_type: 'bedrijf',
                    funnel_step: 1
                }
            },
            {
                id: 'checkout_vat_validate',
                selector: '#inputBTW',
                event: 'vat_validation',
                category: 'KBO / BTW Formulier-validatie',
                trigger: 'Invoeren van BTW/ondernemingsnummer met automatische Modulo 97 controle',
                funnelStep: 'Checkout Stap 1: B2B Verificatie',
                rationale: 'Monitort formulier-frictie; foutieve btw-nummers zijn een bekende drop-off oorzaak in B2B webformulieren.',
                payload: {
                    event: 'vat_validation',
                    is_valid: true,
                    vat_country: 'BE',
                    company_sector: 'Bouw'
                }
            },
            {
                id: 'checkout_add_participant',
                selector: 'button[onclick*="addParticipant"]',
                event: 'participant_add',
                category: 'Multi-Cursist Inschrijving',
                trigger: 'Klik op "+ Extra deelnemer toevoegen (+ € 1.250)"',
                funnelStep: 'Checkout Stap 2: Deelnemers',
                rationale: 'Cruciale B2B hefboom: toont direct volumeboekingen (groepsinvesteringen van bedrijven in personeel).',
                payload: {
                    event: 'participant_add',
                    new_total_participants: 2,
                    incremental_value: 1250.00,
                    cart_total_value: 2500.00
                }
            },
            {
                id: 'checkout_subsidies_select',
                selector: '.wf-checkout-step:nth-of-type(3)',
                event: 'subsidy_declaration',
                category: 'Subsidie & Sectorfonds Registratie',
                trigger: 'Selectie van Constructiv, Volta, VOV of Opleidingscheque ondersteuning',
                funnelStep: 'Checkout Stap 3: Subsidies',
                rationale: 'Wettelijk en operationeel vereist om de attesten voor sectorfondsen automatisch klaar te zetten in het ERP/SIS.',
                payload: {
                    event: 'subsidy_declaration',
                    selected_schemes: ['Constructiv PC 124', 'Vlaams Opleidingsverlof'],
                    participant_count: 2
                }
            },
            {
                id: 'checkout_payment_method',
                selector: '.wf-form-radio',
                event: 'add_payment_info',
                category: 'GA4 Enhanced Ecommerce (Stap 4)',
                trigger: 'Keuze betaalmethode: Bancontact, Overschrijving op factuur 30d, Kredietkaart',
                funnelStep: 'Checkout Stap 4: Betaalwijze',
                rationale: 'Meet voorkeur tussen directe consumentenbetaling (Bancontact) versus zakelijke betaling na factuur (30d).',
                payload: {
                    event: 'add_payment_info',
                    payment_type: 'factuur_30d',
                    currency: 'EUR',
                    value: 2500.00
                }
            },
            {
                id: 'checkout_submit',
                selector: '#checkoutForm button[type="submit"], #wfCheckoutForm button[type="submit"]',
                event: 'checkout_submit',
                category: 'GA4 Funnel Complete',
                trigger: 'Klik op "Inschrijving Bevestigen &rarr;"',
                funnelStep: 'Checkout Finale Stap: Voltooiing',
                rationale: 'Eindpunt van het webformulier vlak voor overdracht naar de bevestigingspagina en het ERP (KERN/SIS).',
                payload: {
                    event: 'checkout_submit',
                    customer_type: 'bedrijf',
                    participants_count: 2,
                    total_amount: 2500.00
                }
            }
        ],
        'bevestiging': [
            {
                id: 'confirm_purchase',
                selector: '.wf-tag-dark',
                event: 'purchase',
                category: 'GA4 Enhanced Ecommerce (Hoofdconversie)',
                trigger: 'Succesvol laden van de bevestigingspagina na ERP registratie',
                funnelStep: 'Fase 4: Voltooide Transactie',
                rationale: 'De primaire Noordster-conversie (macro-conversie) van de gehele website met officiële transactiewaarde.',
                payload: {
                    event: 'purchase',
                    ecommerce: {
                        transaction_id: 'SYN-2026-89412',
                        value: 1250.00,
                        tax: 0.00,
                        currency: 'EUR',
                        customer_type: 'bedrijf',
                        participants_count: 1,
                        items: [{
                            item_id: 'EL-2026-RES',
                            item_name: 'Residentieel Elektrotechnisch Installateur',
                            price: 1250.00,
                            quantity: 1
                        }]
                    }
                }
            },
            {
                id: 'confirm_pdf_download',
                selector: 'a[onclick*="alert"]',
                event: 'file_download',
                category: 'Document download',
                trigger: 'Klik op "Download Inschrijvingsbewijs (PDF)"',
                funnelStep: 'Post-conversie Interactie',
                rationale: 'Meet of cursisten direct hun formele bewijs downloaden voor hun werkgever of eigen administratie.',
                payload: {
                    event: 'file_download',
                    file_name: 'inschrijvingsbewijs-SYN-2026-89412.pdf',
                    file_type: 'application/pdf',
                    transaction_id: 'SYN-2026-89412'
                }
            }
        ]
    };

    function initMeetplan(currentPage) {
        var toggleBtn = document.getElementById('wfMeetplanToggle');
        var statusLabel = document.getElementById('wfMeetplanStatus');
        if (!toggleBtn) return;

        var isActive = localStorage.getItem('wf_meetplan') === 'true';

        function updateToggleUI(active) {
            if (active) {
                document.body.classList.add('wf-meetplan-active');
                toggleBtn.classList.add('active');
                if (statusLabel) statusLabel.textContent = 'AAN';
            } else {
                document.body.classList.remove('wf-meetplan-active');
                toggleBtn.classList.remove('active');
                if (statusLabel) statusLabel.textContent = 'UIT';
            }
        }

        toggleBtn.addEventListener('click', function() {
            var currentState = document.body.classList.contains('wf-meetplan-active');
            var newState = !currentState;
            localStorage.setItem('wf_meetplan', newState ? 'true' : 'false');
            updateToggleUI(newState);
        });

        // Initial setup
        updateToggleUI(isActive);
        renderMeetplanPins(currentPage);
        renderMeetplanDrawer(currentPage);
    }

    function getMeetplanEvents(currentPage) {
        var list = (meetplanCatalog[currentPage] || []).slice();
        if (document.getElementById('athenaLauncher')) {
            list.push({
                id: 'athena_chatbot',
                selector: '#athenaLauncher',
                event: 'chat_opened',
                shortLabel: 'Athena AI Gids',
                category: 'AI Studieadvies',
                trigger: 'Klik op de zwevende Athena chatbot widget rechtsonder',
                funnelStep: 'Fase 1/2: Begeleide Conversie',
                rationale: 'Meet hoeveel bezoekers via de interactieve AI dialoog sneller de juiste opleiding of subsidie-info vinden ten opzichte van traditionele zoek- en menunavigatie.',
                payload: {
                    event: 'chat_opened',
                    chat_agent: 'athena',
                    assistance_type: 'guided_course_advisor'
                }
            });
        }
        return list;
    }

    function renderMeetplanPins(currentPage) {
        var events = getMeetplanEvents(currentPage);
        events.forEach(function(ev, index) {
            var el = document.querySelector(ev.selector);
            if (el) {
                el.setAttribute('data-wf-track', ev.id);
                
                // Add badge pin if not already present
                var existingBadge = el.querySelector('.wf-track-badge[data-event-id="' + ev.id + '"]');
                if (!existingBadge) {
                    var badge = document.createElement('div');
                    badge.className = 'wf-track-badge';
                    badge.setAttribute('data-event-id', ev.id);
                    badge.title = 'Meetpunt #' + (index + 1) + ': Klik om tracking payload & dataLayer schema te bekijken';
                    var badgeLabel = ev.shortLabel ? (' ' + ev.event + ' &bull; ' + ev.shortLabel) : (' ' + ev.event);
                    badge.innerHTML = '<span class="wf-track-badge-num">#' + (index + 1) + '</span>' + badgeLabel;
                    
                    badge.addEventListener('click', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        openMeetplanModal(ev, index + 1);
                    });

                    // Ensure positioning context for non-void elements
                    var isVoid = ['INPUT', 'SELECT', 'TEXTAREA', 'IMG'].indexOf(el.tagName) !== -1;
                    if (isVoid) {
                        var parent = el.parentElement;
                        if (parent) {
                            if (window.getComputedStyle(parent).position === 'static') {
                                parent.style.position = 'relative';
                            }
                            parent.appendChild(badge);
                        }
                    } else {
                        var computedPos = window.getComputedStyle(el).position;
                        if (computedPos === 'static') {
                            el.style.position = 'relative';
                        }
                        el.appendChild(badge);
                    }
                }
            }
        });
    }

    function openMeetplanModal(ev, itemNum) {
        var existing = document.getElementById('wfTrackModalBackdrop');
        if (existing) existing.remove();

        var backdrop = document.createElement('div');
        backdrop.id = 'wfTrackModalBackdrop';
        backdrop.className = 'wf-track-modal-backdrop';

        var formattedJSON = JSON.stringify(ev.payload, null, 2);

        backdrop.innerHTML = 
            '<div class="wf-track-modal">' +
                '<div class="wf-track-modal-header">' +
                    '<div>' +
                        '<div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#38BDF8; font-weight:800;">' +
                            'Meetpunt #' + (itemNum || '1') + ' &bull; ' + ev.category +
                        '</div>' +
                        '<div style="font-size:18px; font-weight:900; font-family:ui-monospace, monospace; margin-top:2px;">' +
                            'dataLayer.push({ event: "' + ev.event + '" })' +
                        '</div>' +
                    '</div>' +
                    '<button type="button" id="wfModalCloseBtn" style="background:none; border:none; color:#94A3B8; font-size:24px; cursor:pointer; line-height:1;">&times;</button>' +
                '</div>' +
                '<div class="wf-track-modal-body">' +
                    '<div style="margin-bottom:14px;">' +
                        '<strong style="font-size:13px; color:#0F172A;">Trigger Moment:</strong>' +
                        '<div style="font-size:13px; color:#475569; margin-top:2px;">' + ev.trigger + '</div>' +
                    '</div>' +
                    '<div style="margin-bottom:14px;">' +
                        '<strong style="font-size:13px; color:#0F172A;">Funnel Fase:</strong>' +
                        '<div style="font-size:13px; color:#0284C7; font-weight:700; margin-top:2px;">' + ev.funnelStep + '</div>' +
                    '</div>' +
                    '<div style="margin-bottom:14px;">' +
                        '<strong style="font-size:13px; color:#0F172A;">Waarom meten we dit? (Zakelijke KPI &amp; Reden):</strong>' +
                        '<div style="font-size:13px; color:#334155; margin-top:2px; line-height:1.5; background:#F8FAFC; border:1px solid #E2E8F0; padding:10px 12px; border-radius:6px;">' +
                            ev.rationale +
                        '</div>' +
                    '</div>' +
                    '<div style="margin-bottom:16px;">' +
                        '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                            '<strong style="font-size:13px; color:#0F172A;">GA4 / GTM dataLayer Payload:</strong>' +
                            '<button type="button" id="wfTestPushBtn" style="background:#0284C7; color:#FFFFFF; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:700; cursor:pointer;">' +
                                'Test Event (Push to dataLayer)' +
                            '</button>' +
                        '</div>' +
                        '<pre class="wf-track-code">' + escapeHtml(formattedJSON) + '</pre>' +
                    '</div>' +
                    '<div id="wfPushNotice" style="display:none; font-size:12px; background:#ECFDF5; border:1px solid #10B981; color:#065F46; padding:8px 12px; border-radius:6px; margin-bottom:14px;">' +
                        'Event succesvol gepushed naar window.dataLayer en geregistreerd in de prototype sessielog!' +
                    '</div>' +
                    '<div style="display:flex; justify-content:flex-end;">' +
                        '<button type="button" id="wfModalCloseBtn2" class="wf-btn wf-btn-outline wf-btn-sm" style="font-size:12px;">Sluiten</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        document.body.appendChild(backdrop);

        document.getElementById('wfModalCloseBtn').addEventListener('click', function() { backdrop.remove(); });
        document.getElementById('wfModalCloseBtn2').addEventListener('click', function() { backdrop.remove(); });
        backdrop.addEventListener('click', function(e) {
            if (e.target === backdrop) backdrop.remove();
        });

        document.getElementById('wfTestPushBtn').addEventListener('click', function() {
            window.dataLayer.push(JSON.parse(JSON.stringify(ev.payload)));
            window.wfDataLayerLog.push({
                timestamp: new Date().toLocaleTimeString('nl-BE'),
                event: ev.event,
                payload: ev.payload
            });
            document.getElementById('wfPushNotice').style.display = 'block';
            updateDrawerLiveLog();
        });
    }

    function renderMeetplanDrawer(currentPage) {
        var existing = document.getElementById('wfMeetplanDrawer');
        if (existing) existing.remove();

        var events = getMeetplanEvents(currentPage);

        var drawer = document.createElement('div');
        drawer.id = 'wfMeetplanDrawer';
        drawer.className = 'wf-meetplan-drawer';

        drawer.innerHTML = 
            '<div class="wf-meetplan-drawer-bar" id="wfDrawerBar">' +
                '<div style="display:flex; align-items:center; gap:8px;">' +
                    '<span style="background:#0284C7; color:#fff; padding:2px 8px; border-radius:4px; font-weight:800; font-size:11px;">MEETPLAN ACTIEF</span>' +
                    '<span><strong>' + events.length + ' meetpunten</strong> op deze pagina &bull; Klik voor DataLayer &amp; Funnel overzicht</span>' +
                '</div>' +
                '<div style="font-weight:700; color:#38BDF8;" id="wfDrawerToggleLabel">' +
                    'Open Dashboard ▴' +
                '</div>' +
            '</div>' +
            '<div class="wf-meetplan-drawer-content" id="wfDrawerContent">' +
                '<div style="display:flex; gap:12px; margin-bottom:16px; border-bottom:1px solid #334155; padding-bottom:8px;">' +
                    '<button type="button" id="tabBtnEvents" style="background:#0284C7; color:#fff; border:none; padding:6px 14px; border-radius:4px; font-size:12px; font-weight:700; cursor:pointer;">Meetpunten (' + events.length + ')</button>' +
                    '<button type="button" id="tabBtnFunnel" style="background:transparent; color:#94A3B8; border:1px solid #334155; padding:6px 14px; border-radius:4px; font-size:12px; font-weight:700; cursor:pointer;">Funnel Structuur</button>' +
                    '<button type="button" id="tabBtnLog" style="background:transparent; color:#94A3B8; border:1px solid #334155; padding:6px 14px; border-radius:4px; font-size:12px; font-weight:700; cursor:pointer;">Live DataLayer Log (<span id="wfLogCount">0</span>)</button>' +
                '</div>' +
                '<div id="drawerTabEvents">' +
                    '<div class="wf-meetplan-event-list">' +
                        events.map(function(ev, idx) {
                            return '<div class="wf-meetplan-event-card" data-event-key="' + ev.id + '">' +
                                '<div style="display:flex; justify-content:space-between; margin-bottom:4px;">' +
                                    '<span style="font-size:10px; color:#38BDF8; font-weight:800;">#' + (idx + 1) + ' ' + ev.category + '</span>' +
                                    '<span style="font-size:10px; color:#94A3B8;">' + ev.funnelStep.split(':')[0] + '</span>' +
                                '</div>' +
                                '<div style="font-family:ui-monospace, monospace; font-weight:700; color:#FFFFFF; font-size:13px; margin-bottom:4px;">' +
                                    ev.event +
                                '</div>' +
                                '<div style="font-size:11px; color:#94A3B8; line-height:1.4;">' +
                                    ev.trigger +
                                '</div>' +
                                '<div style="margin-top:8px; font-size:11px; color:#38BDF8; text-decoration:underline;">' +
                                    'Bekijk schema &rarr;' +
                                '</div>' +
                            '</div>';
                        }).join('') +
                    '</div>' +
                '</div>' +
                '<div id="drawerTabFunnel" style="display:none; font-size:13px; line-height:1.6; color:#CBD5E1;">' +
                    '<div style="background:#1E293B; border:1px solid #334155; border-radius:8px; padding:16px;">' +
                        '<h4 style="font-size:14px; color:#FFFFFF; margin-bottom:10px; font-weight:800;">De 6 Fasen van de Syntra &amp; NxtPro Meetarchitectuur:</h4>' +
                        '<ol style="padding-left:20px; margin:0; display:flex; flex-direction:column; gap:8px;">' +
                            '<li><strong>Fase 1: Oriëntatie &amp; Intentie:</strong> <code>search</code>, <code>select_content</code>, <code>filter_applied</code>. Meet de initiële zoeknood en domeininteresse.</li>' +
                            '<li><strong>Fase 2: Opleiding Overweging:</strong> <code>view_item</code>, <code>view_schedule_mode</code>, <code>export_calendar</code>. Evalueert drempelverlagers (rooster, subsidies).</li>' +
                            '<li><strong>Fase 3: Conversiestart (Inschrijving):</strong> <code>begin_checkout</code>. Officiële entry in de GA4 E-Commerce funnel per campus en startdatum.</li>' +
                            '<li><strong>Fase 4: Klantsegmentatie &amp; Volume:</strong> <code>checkout_segment_change (b2b/b2c)</code>, <code>vat_validation</code>, <code>participant_add</code>. Meet B2B volume vs particulier.</li>' +
                            '<li><strong>Fase 5: Betaal- &amp; Subsidiekeuze:</strong> <code>subsidy_declaration</code>, <code>add_payment_info</code>. Registreert intentie voor sectorpremies en betaalmethode.</li>' +
                            '<li><strong>Fase 6: Transactie &amp; ERP Sync:</strong> <code>purchase</code>, <code>file_download</code>. Definitieve registratie met omzet en koppeling naar KERN/SIS.</li>' +
                        '</ol>' +
                    '</div>' +
                '</div>' +
                '<div id="drawerTabLog" style="display:none; font-size:12px; font-family:ui-monospace, monospace; color:#38BDF8;" id="drawerLiveLogContainer">' +
                    '<div id="wfLogEntries" style="background:#0F172A; padding:12px; border-radius:6px; max-height:220px; overflow-y:auto; border:1px solid #1E293B;">' +
                        '<span style="color:#64748B;">Nog geen events gepusht tijdens deze sessie. Klik op een meetpunt om een test-event te triggeren!</span>' +
                    '</div>' +
                '</div>' +
            '</div>';

        document.body.appendChild(drawer);

        var drawerBar = document.getElementById('wfDrawerBar');
        var toggleLabel = document.getElementById('wfDrawerToggleLabel');
        drawerBar.addEventListener('click', function() {
            drawer.classList.toggle('expanded');
            toggleLabel.textContent = drawer.classList.contains('expanded') ? 'Sluit Dashboard ▾' : 'Open Dashboard ▴';
        });

        // Tab switching in drawer
        var btnEvents = document.getElementById('tabBtnEvents');
        var btnFunnel = document.getElementById('tabBtnFunnel');
        var btnLog = document.getElementById('tabBtnLog');
        var tabEvents = document.getElementById('drawerTabEvents');
        var tabFunnel = document.getElementById('drawerTabFunnel');
        var tabLog = document.getElementById('drawerTabLog');

        function setDrawerTab(activeBtn, activeTab) {
            [btnEvents, btnFunnel, btnLog].forEach(function(b) {
                b.style.background = 'transparent';
                b.style.color = '#94A3B8';
                b.style.border = '1px solid #334155';
            });
            [tabEvents, tabFunnel, tabLog].forEach(function(t) { t.style.display = 'none'; });

            activeBtn.style.background = '#0284C7';
            activeBtn.style.color = '#FFFFFF';
            activeBtn.style.border = 'none';
            activeTab.style.display = 'block';
        }

        btnEvents.addEventListener('click', function() { setDrawerTab(btnEvents, tabEvents); });
        btnFunnel.addEventListener('click', function() { setDrawerTab(btnFunnel, tabFunnel); });
        btnLog.addEventListener('click', function() { setDrawerTab(btnLog, tabLog); });

        // Event card click scrolls to element and opens modal
        drawer.querySelectorAll('.wf-meetplan-event-card').forEach(function(card, idx) {
            card.addEventListener('click', function() {
                var ev = events[idx];
                var el = document.querySelector(ev.selector);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(function() {
                        openMeetplanModal(ev, idx + 1);
                    }, 400);
                } else {
                    openMeetplanModal(ev, idx + 1);
                }
            });
        });
    }

    function updateDrawerLiveLog() {
        var logContainer = document.getElementById('wfLogEntries');
        var logCount = document.getElementById('wfLogCount');
        if (!logContainer) return;

        if (logCount) logCount.textContent = window.wfDataLayerLog.length;

        logContainer.innerHTML = window.wfDataLayerLog.map(function(item) {
            return '<div style="margin-bottom:8px; border-bottom:1px solid #1E293B; padding-bottom:6px;">' +
                '<span style="color:#94A3B8;">[' + item.timestamp + ']</span> ' +
                '<strong style="color:#FFFFFF;">' + item.event + '</strong>: ' +
                '<span style="color:#38BDF8;">' + JSON.stringify(item.payload) + '</span>' +
            '</div>';
        }).join('');
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /* ==========================================================================
       ATHENA AI CHATBOT WIDGET
       ========================================================================== */
    function initAthenaWidget(currentPage) {
        if (document.getElementById('athenaLauncher')) return;

        // 1. Create Launcher Button
        var launcher = document.createElement('div');
        launcher.id = 'athenaLauncher';
        launcher.className = 'athena-launcher';
        launcher.title = 'Vraag studieadvies aan Athena AI Cursusgids';
        launcher.innerHTML = 
            '<div class="athena-avatar-badge">A</div>' +
            '<div class="athena-launcher-text">' +
                '<span class="athena-launcher-name">ATHENA</span>' +
                '<span class="athena-launcher-sub">Vraag studieadvies</span>' +
            '</div>' +
            '<span class="athena-pulse-dot"></span>';

        // 2. Create Chat Panel Window
        var panel = document.createElement('div');
        panel.id = 'athenaPanel';
        panel.className = 'athena-panel';
        panel.innerHTML = 
            '<div class="athena-panel-header">' +
                '<div class="athena-panel-title-wrap">' +
                    '<div class="athena-avatar-badge" style="width:28px;height:28px;font-size:13px;">A</div>' +
                    '<div>' +
                        '<div class="athena-panel-title">ATHENA AI GIDS</div>' +
                        '<div class="athena-panel-status"><span style="width:6px;height:6px;background:#38BDF8;border-radius:50%;display:inline-block;"></span> Syntra &amp; NxtPro Adviseur</div>' +
                    '</div>' +
                '</div>' +
                '<button type="button" class="athena-panel-close" id="athenaCloseBtn" title="Sluiten">&times;</button>' +
            '</div>' +
            '<div class="athena-messages" id="athenaMessages">' +
                '<!-- Initial Bot Welcome -->' +
                '<div class="athena-msg bot">' +
                    '<div class="athena-msg-bubble">' +
                        'Hallo! Ik ben <strong>Athena</strong>, je digitale studie- en opleidingsgids voor Syntra en NxtPro.<br><br>' +
                        'Ik help je direct met inhoud van opleidingen, lesmomenten, campussen of subsidie-advies. Waar ben je naar op zoek?' +
                        '<div class="athena-prompts-wrap">' +
                            '<button type="button" class="athena-prompt-chip" data-query="populair">Populairste opleidingen</button>' +
                            '<button type="button" class="athena-prompt-chip" data-query="elektricien">Voorkennis Elektricien?</button>' +
                            '<button type="button" class="athena-prompt-chip" data-query="subsidie">Subsidies &amp; KMO?</button>' +
                            '<button type="button" class="athena-prompt-chip" data-query="avond">Avondonderwijs / Werk &amp; Studie</button>' +
                            '<button type="button" class="athena-prompt-chip" data-query="b2b">Bedrijfsopleiding op maat (B2B)</button>' +
                        '</div>' +
                    '</div>' +
                    '<span class="athena-msg-time">' + getAthenaTime() + '</span>' +
                '</div>' +
            '</div>' +
            '<form class="athena-input-bar" id="athenaForm">' +
                '<input type="text" id="athenaInput" placeholder="Stel een vraag aan Athena..." autocomplete="off">' +
                '<button type="submit" id="athenaSendBtn">Verstuur</button>' +
            '</form>';

        document.body.appendChild(launcher);
        document.body.appendChild(panel);

        // Toggle Open / Close
        launcher.addEventListener('click', function() {
            var isOpen = panel.classList.contains('is-open');
            if (isOpen) {
                panel.classList.remove('is-open');
            } else {
                panel.classList.add('is-open');
                var input = document.getElementById('athenaInput');
                if (input) setTimeout(function() { input.focus(); }, 150);
                
                // Track in dataLayer
                pushAthenaEvent('chat_opened', {
                    chat_agent: 'athena',
                    source_page: currentPage
                });
            }
        });

        document.getElementById('athenaCloseBtn').addEventListener('click', function() {
            panel.classList.remove('is-open');
        });

        // Quick prompts handler (event delegation)
        panel.addEventListener('click', function(e) {
            var chip = e.target.closest('.athena-prompt-chip');
            if (chip) {
                var queryKey = chip.getAttribute('data-query');
                var chipText = chip.textContent;
                handleUserQuery(chipText, queryKey);
            }
            
            var athenaLink = e.target.closest('.athena-link');
            if (athenaLink) {
                pushAthenaEvent('chat_cta_click', {
                    chat_agent: 'athena',
                    target_url: athenaLink.getAttribute('href'),
                    link_text: athenaLink.textContent.trim()
                });
            }
        });

        // Form submit
        var form = document.getElementById('athenaForm');
        var inputField = document.getElementById('athenaInput');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var text = inputField.value.trim();
            if (!text) return;
            inputField.value = '';
            handleUserQuery(text, null);
        });

        function handleUserQuery(userText, queryKey) {
            // Append User Message
            appendMessage('user', escapeHtml(userText));

            // Track Query
            pushAthenaEvent('chat_message_sent', {
                chat_agent: 'athena',
                message_text: userText,
                query_key: queryKey || 'custom_input'
            });

            // Show typing indicator
            var messagesContainer = document.getElementById('athenaMessages');
            var typingEl = document.createElement('div');
            typingEl.className = 'athena-typing';
            typingEl.innerHTML = 
                'Athena zoekt in het Syntra cursusaanbod ' +
                '<span class="athena-typing-dot"></span>' +
                '<span class="athena-typing-dot"></span>' +
                '<span class="athena-typing-dot"></span>';
            messagesContainer.appendChild(typingEl);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Generate Smart Response after 450ms
            setTimeout(function() {
                typingEl.remove();
                var botAnswer = generateAthenaResponse(userText, queryKey);
                appendMessage('bot', botAnswer);
            }, 450);
        }

        function appendMessage(sender, htmlContent) {
            var messagesContainer = document.getElementById('athenaMessages');
            var msgDiv = document.createElement('div');
            msgDiv.className = 'athena-msg ' + sender;
            msgDiv.innerHTML = 
                '<div class="athena-msg-bubble">' + htmlContent + '</div>' +
                '<span class="athena-msg-time">' + getAthenaTime() + '</span>';
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function generateAthenaResponse(text, key) {
            var lower = (text || '').toLowerCase();

            if (key === 'elektricien' || lower.indexOf('elektri') !== -1 || lower.indexOf('residentieel') !== -1) {
                return 'Voor de opleiding <strong>Residentieel Elektrotechnisch Installateur</strong> (120 lesuren) heb je <strong>geen voorkennis nodig</strong>! Je start vanaf de basis: veilig kappen, sleuven trekken, zekeringkasten monteren en AREI-keuringen voorbereiden in onze ateliers.<br><br>' +
                       'Er starten sessies in Mechelen, Sint-Niklaas en Brussel.<br>' +
                       '<a href="opleiding.html" class="athena-link">Bekijk het complete lesprogramma &amp; rooster &rarr;</a>';
            }

            if (key === 'subsidie' || lower.indexOf('subsidie') !== -1 || lower.indexOf('kmo') !== -1 || lower.indexOf('korting') !== -1 || lower.indexOf('premie') !== -1) {
                return 'De Vlaamse overheid heeft de KMO-portefeuille voordelen herzien. Voor Syntra &amp; NxtPro opleidingen kun je echter rekenen op krachtige alternatieven:<br>' +
                       '&bull; <strong>Constructiv (PC 124):</strong> Tot &euro; 40/dag premie voor bouwbedrijven en winteropleidingen.<br>' +
                       '&bull; <strong>Volta (PC 149):</strong> Opleidingsvergoedingen voor elektrotechniek.<br>' +
                       '&bull; <strong>Vlaams Opleidingsverlof (VOV):</strong> Betaald verlof voor werknemers.<br><br>' +
                       '<a href="opleiding.html#subsidies" class="athena-link">Bekijk alle subsidievoorwaarden per sector &rarr;</a>';
            }

            if (key === 'avond' || lower.indexOf('avond') !== -1 || lower.indexOf('weekend') !== -1 || lower.indexOf('combin') !== -1 || lower.indexOf('werk') !== -1) {
                return 'Het merendeel van onze cursisten combineert een opleiding met een job. Daarom bieden we flexibele formules:<br>' +
                       '&bull; <strong>Avondonderwijs:</strong> 1 of 2 avonden per week (18:30 - 22:00)<br>' +
                       '&bull; <strong>Zaterdagopleidingen:</strong> Intensieve weekendmodules overdag<br>' +
                       '&bull; <strong>Voltijds dagtraject:</strong> Snelste weg naar een nieuw beroep in 1 jaar.<br><br>' +
                       '<a href="zoeken.html" class="athena-link">Filter de catalogus op jouw gewenste lesmoment &rarr;</a>';
            }

            if (key === 'b2b' || lower.indexOf('b2b') !== -1 || lower.indexOf('bedrijf') !== -1 || lower.indexOf('in-company') !== -1 || lower.indexOf('werf') !== -1 || lower.indexOf('team') !== -1) {
                return 'Voor bedrijven verzorgt <strong>NxtPro</strong> opleidingen op maat. We trainen je medewerkers op een Syntra-campus of exclusief op jullie eigen werf of bedrijfssite met aangepaste lesdata.<br><br>' +
                       '<a href="sector-bouw.html#b2b-bouw" class="athena-link">Vraag direct een B2B groepsofferte aan &rarr;</a>';
            }

            if (key === 'populair' || lower.indexOf('populair') !== -1 || lower.indexOf('welke') !== -1 || lower.indexOf('aanbod') !== -1) {
                return 'Onze absolute knelpunt- en topopleidingen voor 2026-2027 zijn:<br>' +
                       '1. <strong>Residentieel Elektricien</strong> (Bouw &amp; Energie)<br>' +
                       '2. <strong>Werfleider Woning- en Appartementsbouw</strong><br>' +
                       '3. <strong>Prompt Engineering &amp; AI Automatisatie</strong><br>' +
                       '4. <strong>HVAC &amp; Warmtepomptechnicus</strong><br><br>' +
                       '<a href="themas.html" class="athena-link">Blader door alle 6 vakgebieden &rarr;</a>';
            }

            if (lower.indexOf('campus') !== -1 || lower.indexOf('mechelen') !== -1 || lower.indexOf('niklaas') !== -1 || lower.indexOf('brussel') !== -1 || lower.indexOf('leuven') !== -1) {
                return 'Syntra Midden-Vlaanderen en Syntra Brussel hebben campussen op strategische bereikbare locaties: <strong>Mechelen (Zandpoortvest), Sint-Niklaas, Leuven en Brussel (Tour &amp; Taxis)</strong>, telkens met state-of-the-art praktijkateliers en parking.<br><br>' +
                       '<a href="zoeken.html" class="athena-link">Filter opleidingen op jouw dichtstbijzijnde campus &rarr;</a>';
            }

            if (lower.indexOf('inschrijv') !== -1 || lower.indexOf('start') !== -1 || lower.indexOf('datum') !== -1 || lower.indexOf('kost') !== -1 || lower.indexOf('prijs') !== -1) {
                return 'Inschrijven kan direct online via onze beveiligde 3-staps checkout. De meeste beroepsopleidingen starten in <strong>september of oktober 2026</strong> en zijn volledig vrijgesteld van btw.<br><br>' +
                       '<a href="afrekenen.html" class="athena-link">Bekijk de inschrijvings- en facturatieflow &rarr;</a>';
            }

            // Default intelligent fallback
            return 'Interessante vraag! In onze opleidingscatalogus vind je meer dan 84 praktijkgerichte beroepsopleidingen en getuigschriften.<br><br>' +
                   'Wat wil je doen?<br>' +
                   '&bull; <a href="zoeken.html" class="athena-link">Doorzoek het aanbod op trefwoord &rarr;</a><br>' +
                   '&bull; <a href="themas.html" class="athena-link">Kies jouw sector of vakgebied &rarr;</a><br>' +
                   '&bull; <a href="opleiding.html#docenten" class="athena-link">Kom in contact met een trajectbegeleider &rarr;</a>';
        }

        function getAthenaTime() {
            var now = new Date();
            var h = String(now.getHours()).padStart(2, '0');
            var m = String(now.getMinutes()).padStart(2, '0');
            return h + ':' + m;
        }

        function pushAthenaEvent(eventName, eventPayload) {
            window.dataLayer = window.dataLayer || [];
            window.wfDataLayerLog = window.wfDataLayerLog || [];
            
            var fullPayload = Object.assign({ event: eventName }, eventPayload);
            window.dataLayer.push(fullPayload);
            window.wfDataLayerLog.push({
                timestamp: new Date().toLocaleTimeString('nl-BE'),
                event: eventName,
                payload: fullPayload
            });

            if (typeof updateDrawerLiveLog === 'function') {
                updateDrawerLiveLog();
            }
        }
    }

    /* ==========================================================================
       USER ACCOUNT SIMULATION CONTROLLER (Suggestie 1B)
       ========================================================================== */
    function initUserAccount(currentPage) {
        var userToggleBtn = document.getElementById('wfUserToggle');
        var userStatusLabel = document.getElementById('wfUserStatus');

        var isUserLoggedIn = localStorage.getItem('wf_logged_in') === 'true';

        function updateUserUI(loggedIn) {
            document.body.setAttribute('data-wf-user', loggedIn ? 'cursist' : 'guest');
            if (userToggleBtn) userToggleBtn.classList.toggle('active', loggedIn);
            if (userStatusLabel) userStatusLabel.textContent = loggedIn ? 'Ingelogd (Karel)' : 'Uitgelogd';

            // Personal banner on homepage
            var personalBanner = document.getElementById('wfPersonalBanner');
            if (personalBanner) {
                personalBanner.style.display = loggedIn ? 'block' : 'none';
            }

            // Update header nav action button
            document.querySelectorAll('.wf-nav-actions').forEach(function(actionsContainer) {
                var existingProfile = actionsContainer.querySelector('.wf-user-profile-badge');
                var existingLoginBtn = actionsContainer.querySelector('#wfNavLoginBtn');

                if (loggedIn) {
                    if (existingLoginBtn) existingLoginBtn.remove();
                    if (!existingProfile) {
                        var profileBadge = document.createElement('div');
                        profileBadge.className = 'wf-user-profile-badge';
                        profileBadge.id = 'wfNavUserProfile';
                        profileBadge.innerHTML = 
                            '<div class="wf-user-avatar">KS</div>' +
                            '<div class="wf-user-info">' +
                                '<span class="wf-user-name">Karel Strosse</span>' +
                                '<span class="wf-user-role">Cursist Elektro</span>' +
                            '</div>' +
                            '<div class="wf-user-dropdown-menu">' +
                                '<a href="opleiding.html#sessies">📅 Mijn Lessenrooster</a>' +
                                '<a href="#">📄 Mijn Inschrijvingen (1)</a>' +
                                '<a href="#">🎓 Attesten &amp; Voortgang</a>' +
                                '<a href="#" id="wfNavLogoutAction" style="color:#DC2626; font-weight:700;">Uitloggen</a>' +
                            '</div>';
                        actionsContainer.insertBefore(profileBadge, actionsContainer.firstChild);

                        profileBadge.querySelector('#wfNavLogoutAction').addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleLogin(false);
                        });
                    }
                } else {
                    if (existingProfile) existingProfile.remove();
                    if (!existingLoginBtn) {
                        var loginBtn = document.createElement('a');
                        loginBtn.href = '#';
                        loginBtn.id = 'wfNavLoginBtn';
                        loginBtn.className = 'wf-btn wf-btn-outline wf-btn-sm';
                        loginBtn.textContent = 'Inloggen';
                        loginBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            toggleLogin(true);
                        });
                        actionsContainer.insertBefore(loginBtn, actionsContainer.firstChild);
                    }
                }
            });
        }

        function toggleLogin(nextState) {
            localStorage.setItem('wf_logged_in', nextState ? 'true' : 'false');
            updateUserUI(nextState);
            if (typeof window.wfRenderFavoritesState === 'function') {
                window.wfRenderFavoritesState();
            }

            // Log event in dataLayer for Meetplan
            window.dataLayer = window.dataLayer || [];
            window.wfDataLayerLog = window.wfDataLayerLog || [];
            var evtPayload = {
                event: nextState ? 'user_login_simulated' : 'user_logout_simulated',
                user_role: nextState ? 'cursist' : 'guest',
                user_name: nextState ? 'Karel Strosse' : null
            };
            window.dataLayer.push(evtPayload);
            window.wfDataLayerLog.push({
                timestamp: new Date().toLocaleTimeString('nl-BE'),
                event: evtPayload.event,
                payload: evtPayload
            });
            if (typeof updateDrawerLiveLog === 'function') updateDrawerLiveLog();
        }

        window.wfToggleLogin = toggleLogin;

        if (userToggleBtn) {
            userToggleBtn.addEventListener('click', function() {
                var current = localStorage.getItem('wf_logged_in') === 'true';
                toggleLogin(!current);
            });
        }

        // Initialize state
        updateUserUI(isUserLoggedIn);
    }

    /* ==========================================================================
       COURSE DETAIL INTERACTIVE FEATURES (Vraag stellen, Wachtlijst, Subsidies)
       ========================================================================== */
    function initCourseInteractiveFeatures(currentPage) {
        if (currentPage !== 'opleiding') return;

        // 1. Inject Modals for Course Inquiries & Waitlist
        var modalsContainer = document.createElement('div');
        modalsContainer.id = 'wfCourseModals';
        modalsContainer.innerHTML = 
            '<!-- Modal 1: Stel een vraag -->' +
            '<div class="wf-modal-overlay" id="wfModalQuestion">' +
                '<div class="wf-modal">' +
                    '<div class="wf-modal-header">' +
                        '<div class="wf-modal-title">💬 Stel een vraag over deze opleiding</div>' +
                        '<button type="button" class="wf-modal-close" onclick="document.getElementById(\'wfModalQuestion\').classList.remove(\'active\')">&times;</button>' +
                    '</div>' +
                    '<div class="wf-modal-body">' +
                        '<div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:10px 14px; border-radius:4px; margin-bottom:14px; font-size:12px;">' +
                            '<strong>Residentieel Elektrotechnisch Installateur</strong><br>' +
                            '<span style="color:#64748B;">Trajectbegeleider Sarah Verbeeck beantwoordt je vraag gemiddeld binnen 24 uur.</span>' +
                        '</div>' +
                        '<label style="display:block; font-weight:700; font-size:12px; margin-bottom:6px;">Veelgestelde onderwerpen:</label>' +
                        '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">' +
                            '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm wf-chip-btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById(\'wfInquiryText\').value=\'Kan ik deze cursus vlot combineren met een voltijdse job van 38 uur?\';">Combinatie met werk?</button>' +
                            '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm wf-chip-btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById(\'wfInquiryText\').value=\'Wat is de exacte kostprijs van de benodigde gereedschappen voor het atelier?\';">Materiaalkost?</button>' +
                            '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm wf-chip-btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById(\'wfInquiryText\').value=\'Kom ik met mijn technisch TSO-diploma in aanmerking voor een vrijstelling van Module 1?\';">Vrijstellingsvoorwaarden?</button>' +
                            '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm wf-chip-btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById(\'wfInquiryText\').value=\'Kan ik betalen met Vlaamse opleidingscheques en VOV aanvragen?\';">Subsidies &amp; Cheques?</button>' +
                        '</div>' +
                        '<label style="display:block; font-weight:700; font-size:12px; margin-bottom:6px;">Jouw vraag of opmerking:</label>' +
                        '<textarea id="wfInquiryText" rows="4" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:10px; font-family:inherit; font-size:13px; outline:none;" placeholder="Typ hier jouw vraag..."></textarea>' +
                        '<div style="margin-top:12px;">' +
                            '<label style="display:block; font-weight:700; font-size:12px; margin-bottom:4px;">Jouw e-mailadres:</label>' +
                            '<input type="email" id="wfInquiryEmail" value="karel@voorbeeld.be" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:8px 12px; font-size:13px;">' +
                        '</div>' +
                        '<div id="wfInquirySuccess" style="display:none; background:#ECFDF5; border:1px solid #A7F3D0; color:#065F46; padding:12px; border-radius:4px; margin-top:12px; font-size:12px;">' +
                            '✓ <strong>Vraag succesvol verzonden!</strong> Trajectbegeleider Sarah Verbeeck neemt binnen 24 uur contact met je op via e-mail.' +
                        '</div>' +
                    '</div>' +
                    '<div class="wf-modal-footer">' +
                        '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm" onclick="document.getElementById(\'wfModalQuestion\').classList.remove(\'active\')">Sluiten</button>' +
                        '<button type="button" class="wf-btn wf-btn-primary wf-btn-sm" id="wfSubmitInquiryBtn">Verstuur Vraag &rarr;</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<!-- Modal 2: Houd mij op de hoogte van nieuwe data -->' +
            '<div class="wf-modal-overlay" id="wfModalWaitlist">' +
                '<div class="wf-modal">' +
                    '<div class="wf-modal-header">' +
                        '<div class="wf-modal-title">📅 Blijf op de hoogte van nieuwe lesdata</div>' +
                        '<button type="button" class="wf-modal-close" onclick="document.getElementById(\'wfModalWaitlist\').classList.remove(\'active\')">&times;</button>' +
                    '</div>' +
                    '<div class="wf-modal-body">' +
                        '<p style="color:#64748B; margin-bottom:14px; font-size:12px;">' +
                            'Syntra opent regelmatig extra lesgroepen in het voorjaar of bijkomende campussen. Geef hier je voorkeur door en ontvang als eerste bericht.' +
                        '</p>' +
                        '<div style="margin-bottom:12px;">' +
                            '<label style="display:block; font-weight:700; font-size:12px; margin-bottom:4px;">Gewenste Campus:</label>' +
                            '<select id="wfWaitlistCampus" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:8px 12px; font-size:13px;">' +
                                '<option value="sint-niklaas">Campus Sint-Niklaas</option>' +
                                '<option value="gent">Campus Gent</option>' +
                                '<option value="aalst">Campus Aalst</option>' +
                                '<option value="asse">Campus Asse</option>' +
                                '<option value="brussel">Syntra Brussel (Tour &amp; Taxis)</option>' +
                                '<option value="alle">Alle campussen zijn goed</option>' +
                            '</select>' +
                        '</div>' +
                        '<div style="margin-bottom:12px;">' +
                            '<label style="display:block; font-weight:700; font-size:12px; margin-bottom:4px;">Voorkeur Lesmoment:</label>' +
                            '<div style="display:flex; gap:12px; flex-wrap:wrap; font-size:12px;">' +
                                '<label><input type="radio" name="wf_moment_pref" value="avond" checked> Avondopleiding</label>' +
                                '<label><input type="radio" name="wf_moment_pref" value="zaterdag"> Zaterdag</label>' +
                                '<label><input type="radio" name="wf_moment_pref" value="dag"> Voltijds Dag</label>' +
                            '</div>' +
                        '</div>' +
                        '<div style="margin-bottom:12px;">' +
                            '<label style="display:block; font-weight:700; font-size:12px; margin-bottom:4px;">Jouw e-mailadres:</label>' +
                            '<input type="email" id="wfWaitlistEmail" value="karel@voorbeeld.be" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:8px 12px; font-size:13px;">' +
                        '</div>' +
                        '<div id="wfWaitlistSuccess" style="display:none; background:#ECFDF5; border:1px solid #A7F3D0; color:#065F46; padding:12px; border-radius:4px; font-size:12px;">' +
                            '✓ <strong>Voorkeur opgeslagen!</strong> We mailen je direct zodra er nieuwe data voor Residentieel Elektro beschikbaar zijn.' +
                        '</div>' +
                    '</div>' +
                    '<div class="wf-modal-footer">' +
                        '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm" onclick="document.getElementById(\'wfModalWaitlist\').classList.remove(\'active\')">Annuleren</button>' +
                        '<button type="button" class="wf-btn wf-btn-primary wf-btn-sm" id="wfSubmitWaitlistBtn">Bevestig Voorkeur &rarr;</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<!-- Modal 3: Video Player Modal -->' +
            '<div class="wf-modal-overlay" id="wfModalVideo">' +
                '<div class="wf-modal" style="max-width:680px;">' +
                    '<div class="wf-modal-header">' +
                        '<div class="wf-modal-title">▶ Een lesavond in het atelier met docent Marc Van Acker</div>' +
                        '<button type="button" class="wf-modal-close" onclick="document.getElementById(\'wfModalVideo\').classList.remove(\'active\')">&times;</button>' +
                    '</div>' +
                    '<div class="wf-modal-body" style="padding:0; background:#000000; position:relative; overflow:hidden;">' +
                        '<div style="position:relative; width:100%; padding-bottom:56.25%; background:#0B0F19; display:flex; align-items:center; justify-content:center;">' +
                            '<div style="position:absolute; inset:0; display:flex; flex-direction:column; justify-content:space-between; padding:20px; color:#FFFFFF; background:radial-gradient(circle at center, rgba(30,41,59,0.4) 0%, rgba(15,23,42,0.95) 100%);">' +
                                '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                                    '<span style="background:rgba(239,68,68,0.9); color:#FFFFFF; font-size:10px; font-weight:800; padding:2px 8px; border-radius:3px; text-transform:uppercase;">Syntra Video Player</span>' +
                                    '<span style="font-size:12px; color:#94A3B8;">HD 1080p &bull; 02:18</span>' +
                                '</div>' +
                                '<div style="text-align:center;">' +
                                    '<div style="width:64px; height:64px; border-radius:50%; background:var(--wf-primary); color:#FFFFFF; display:inline-flex; align-items:center; justify-content:center; font-size:26px; box-shadow:0 0 30px rgba(0,0,0,0.6); padding-left:4px;">▶</div>' +
                                    '<div style="margin-top:14px; font-size:15px; font-weight:700;">Residentieel Elektrotechnisch Installateur</div>' +
                                    '<div style="font-size:12px; color:#94A3B8; margin-top:4px;">Opgenomen in het praktijkatelier op Campus Sint-Niklaas</div>' +
                                '</div>' +
                                '<div>' +
                                    '<div style="height:4px; background:rgba(255,255,255,0.2); border-radius:2px; overflow:hidden; margin-bottom:8px;">' +
                                        '<div style="height:100%; width:35%; background:var(--wf-primary); border-radius:2px;"></div>' +
                                    '</div>' +
                                    '<div style="display:flex; justify-content:space-between; font-size:11px; color:#94A3B8;">' +
                                        '<span>00:48 / 02:18</span>' +
                                        '<span>Praktijkinstructie verdeelkast &amp; AREI-keuring</span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="wf-modal-footer" style="justify-content:space-between; align-items:center;">' +
                        '<span style="font-size:12px; color:#64748B;">Zelf ervaren? Bezoek de gratis infosessie in het atelier!</span>' +
                        '<div style="display:flex; gap:8px;">' +
                            '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm" onclick="document.getElementById(\'wfModalVideo\').classList.remove(\'active\')">Sluiten</button>' +
                            '<a href="#sessies" class="wf-btn wf-btn-primary wf-btn-sm" onclick="document.getElementById(\'wfModalVideo\').classList.remove(\'active\')">Schrijf in voor deze cursus &rarr;</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<!-- Modal 4: Atelier Foto Detail -->' +
            '<div class="wf-modal-overlay" id="wfModalGalleryPreview">' +
                '<div class="wf-modal" style="max-width:620px;">' +
                    '<div class="wf-modal-header">' +
                        '<div class="wf-modal-title" id="wfGalleryModalTitle">Praktijkatelier in Beeld</div>' +
                        '<button type="button" class="wf-modal-close" onclick="document.getElementById(\'wfModalGalleryPreview\').classList.remove(\'active\')">&times;</button>' +
                    '</div>' +
                    '<div class="wf-modal-body" style="padding:0;">' +
                        '<div id="wfGalleryModalImg" style="height:320px; background-size:cover; background-position:center; background-color:#E2E8F0;"></div>' +
                        '<div style="padding:16px 20px;">' +
                            '<div style="font-size:14px; font-weight:800; margin-bottom:4px;" id="wfGalleryModalHeading">Montagewanden &amp; Leidingen Kappen</div>' +
                            '<p style="font-size:13px; color:#64748B; line-height:1.5;" id="wfGalleryModalDesc">' +
                                'In het Syntra-praktijkatelier beschikt elke cursist over een eigen proefwand met inbouwdozen, buizen en flexibele leidingen conform AREI-standaarden.' +
                            '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="wf-modal-footer">' +
                        '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm" onclick="document.getElementById(\'wfModalGalleryPreview\').classList.remove(\'active\')">Sluiten</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        document.body.appendChild(modalsContainer);

        // Bind Buttons to Open Question Modal
        document.querySelectorAll('.wf-btn-ask-question, #wfBtnAskQuestion, #wfBtnAskDocent').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var modal = document.getElementById('wfModalQuestion');
                if (modal) modal.classList.add('active');
            });
        });

        // Submit Question Handler
        var submitInquiryBtn = document.getElementById('wfSubmitInquiryBtn');
        if (submitInquiryBtn) {
            submitInquiryBtn.addEventListener('click', function() {
                var text = document.getElementById('wfInquiryText').value;
                var email = document.getElementById('wfInquiryEmail').value;
                var success = document.getElementById('wfInquirySuccess');
                if (success) success.style.display = 'block';

                // Push to dataLayer (Meetplan)
                window.dataLayer = window.dataLayer || [];
                window.wfDataLayerLog = window.wfDataLayerLog || [];
                var evt = {
                    event: 'course_inquiry_submitted',
                    course_id: 'ELEK-2026',
                    course_name: 'Residentieel Elektrotechnisch Installateur',
                    inquiry_topic: text ? text.substring(0, 50) : 'General question'
                };
                window.dataLayer.push(evt);
                window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: evt.event, payload: evt });
                if (typeof updateDrawerLiveLog === 'function') updateDrawerLiveLog();

                setTimeout(function() {
                    document.getElementById('wfModalQuestion').classList.remove('active');
                    if (success) success.style.display = 'none';
                }, 2000);
            });
        }

        // Bind Waitlist Button
        var btnNotifyNew = document.getElementById('wfBtnNotifyNewDates');
        if (btnNotifyNew) {
            btnNotifyNew.addEventListener('click', function(e) {
                e.preventDefault();
                var modal = document.getElementById('wfModalWaitlist');
                if (modal) modal.classList.add('active');
            });
        }

        // Submit Waitlist Handler
        var submitWaitlistBtn = document.getElementById('wfSubmitWaitlistBtn');
        if (submitWaitlistBtn) {
            submitWaitlistBtn.addEventListener('click', function() {
                var campus = document.getElementById('wfWaitlistCampus').value;
                var success = document.getElementById('wfWaitlistSuccess');
                if (success) success.style.display = 'block';

                window.dataLayer = window.dataLayer || [];
                window.wfDataLayerLog = window.wfDataLayerLog || [];
                var evt = {
                    event: 'new_dates_waitlist_signup',
                    course_id: 'ELEK-2026',
                    preferred_campus: campus
                };
                window.dataLayer.push(evt);
                window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: evt.event, payload: evt });
                if (typeof updateDrawerLiveLog === 'function') updateDrawerLiveLog();

                setTimeout(function() {
                    document.getElementById('wfModalWaitlist').classList.remove('active');
                    if (success) success.style.display = 'none';
                }, 2000);
            });
        }

        // Subsidie Calculator Logic
        var calcRadios = document.querySelectorAll('input[name="wf_calc_profile"]');
        if (calcRadios.length > 0) {
            var calcAmount = document.getElementById('wfCalcAmount');
            var calcMonthly = document.getElementById('wfCalcMonthly');
            var calcDeduction = document.getElementById('wfCalcDeduction');
            var calcNote = document.getElementById('wfCalcNote');

            calcRadios.forEach(function(radio) {
                radio.addEventListener('change', function() {
                    calcRadios.forEach(function(r) { r.closest('label').classList.remove('active'); });
                    this.closest('label').classList.add('active');

                    var val = this.value;
                    var netPrice = '€ 1.250';
                    var monthly = 'of 4 × € 312,50 / maand (renteloos afbetalingsplan)';
                    var deduction = '€ 0 subsidie';
                    var note = 'Standaardprijs inclusief praktijkmateriaal en examenkans.';

                    if (val === 'vdab') {
                        netPrice = '€ 0';
                        monthly = 'Volledig kosteloos via opleidingscontract';
                        deduction = '100% gefinancierd via VDAB';
                        note = 'Kosteloos voor werkzoekenden via erkend opleidingstraject met verplaatsingsvergoeding.';
                    } else if (val === 'cheques') {
                        netPrice = '€ 1.000';
                        monthly = 'of 4 × € 250,00 / maand (na aftrek opleidingscheques)';
                        deduction = '€ 250 Vlaamse Opleidingscheques';
                        note = 'Werknemers in loondienst hebben tevens recht op tot 125 uren Vlaams Opleidingsverlof (VOV).';
                    } else if (val === 'kmo') {
                        netPrice = '€ 875';
                        monthly = 'of 4 × € 218,75 / maand (na 30% KMO-subsidie)';
                        deduction = '30% subsidie via KMO-portefeuille (-€ 375)';
                        note = 'Syntra is erkend dienstverlener (DV.O105423). Subsidie rechtstreeks aan te vragen via VLAIO.';
                    } else if (val === 'pc_124') {
                        netPrice = '€ 0';
                        monthly = '100% gedekt via Constructiv sectorfonds';
                        deduction = '100% terugbetaald via Constructiv PC 124';
                        note = 'Arbeiders uit de bouwsector ontvangen bovenop het gratis inschrijvingsgeld een winteropleidingspremie.';
                    } else if (val === 'pc_149') {
                        netPrice = '€ 0';
                        monthly = '100% gedekt via Volta sectorfonds';
                        deduction = '100% tussenkomst via Volta PC 149.01';
                        note = 'Erkend sectorfonds elektrotechniek betaalt de volledige cursus en verleent een sectorale premie.';
                    }

                    if (calcAmount) calcAmount.textContent = netPrice;
                    if (calcMonthly) calcMonthly.textContent = monthly;
                    if (calcDeduction) calcDeduction.textContent = deduction;
                    if (calcNote) calcNote.textContent = note;

                    // Log in dataLayer
                    window.dataLayer = window.dataLayer || [];
                    window.wfDataLayerLog = window.wfDataLayerLog || [];
                    var evt = {
                        event: 'subsidy_calculator_used',
                        selected_profile: val,
                        calculated_net_price: netPrice
                    };
                    window.dataLayer.push(evt);
                    window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: evt.event, payload: evt });
                    if (typeof updateDrawerLiveLog === 'function') updateDrawerLiveLog();
                });
            });
        }

        // Video Modal Trigger
        var videoCard = document.getElementById('wfCourseVideoCard');
        if (videoCard) {
            videoCard.addEventListener('click', function() {
                var modal = document.getElementById('wfModalVideo');
                if (modal) modal.classList.add('active');

                // Log video play in Meetplan dataLayer
                window.dataLayer = window.dataLayer || [];
                window.wfDataLayerLog = window.wfDataLayerLog || [];
                var evt = {
                    event: 'video_play',
                    video_title: 'Lesavond in het atelier met docent Marc Van Acker',
                    video_duration: '02:18',
                    course_id: 'ELEK-2026'
                };
                window.dataLayer.push(evt);
                window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: evt.event, payload: evt });
                if (typeof updateDrawerLiveLog === 'function') updateDrawerLiveLog();
            });
        }

        // Gallery Items & Hero Thumbnail Click & Lightbox
        var galleryItems = document.querySelectorAll('.wf-gallery-item, .wf-hero-thumb-compact');
        if (galleryItems.length > 0) {
            galleryItems.forEach(function(item) {
                item.addEventListener('click', function() {
                    var title = this.getAttribute('title') || 'Atelier in beeld';
                    var caption = this.querySelector('.wf-gallery-caption span') ? this.querySelector('.wf-gallery-caption span').textContent : title;
                    var imgPh = this.querySelector('.wf-img-ph');
                    var bgImg = imgPh ? (imgPh.style.backgroundImage || '') : '';

                    var modal = document.getElementById('wfModalGalleryPreview');
                    var modalTitle = document.getElementById('wfGalleryModalTitle');
                    var modalHeading = document.getElementById('wfGalleryModalHeading');
                    var modalImg = document.getElementById('wfGalleryModalImg');

                    if (modalTitle) modalTitle.textContent = title;
                    if (modalHeading) modalHeading.textContent = caption;
                    if (modalImg) {
                        modalImg.style.backgroundImage = bgImg || (imgPh && imgPh.dataset.designImg ? 'url("' + imgPh.dataset.designImg + '")' : '');
                        modalImg.style.backgroundSize = 'cover';
                    }

                    if (modal) modal.classList.add('active');

                    // Log in dataLayer
                    window.dataLayer = window.dataLayer || [];
                    window.wfDataLayerLog = window.wfDataLayerLog || [];
                    var evt = {
                        event: 'gallery_image_view',
                        image_title: title,
                        course_id: 'ELEK-2026'
                    };
                    window.dataLayer.push(evt);
                    window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: evt.event, payload: evt });
                    if (typeof updateDrawerLiveLog === 'function') updateDrawerLiveLog();
                });
            });
        }
    }

    /* ==========================================================================
       INFOSESSIE & OPENLESDAGEN CONTROLLER (Homepage & Detail)
       ========================================================================== */
    function initInfosessieFeatures(currentPage) {
        // Modal for Infosessie Booking
        var modalOverlay = document.createElement('div');
        modalOverlay.className = 'wf-modal-overlay';
        modalOverlay.id = 'wfModalInfosessie';
        modalOverlay.innerHTML = 
            '<div class="wf-modal">' +
                '<div class="wf-modal-header">' +
                    '<div class="wf-modal-title">🎟️ Gratis Plek Reserveren voor Infosessie</div>' +
                    '<button type="button" class="wf-modal-close" onclick="document.getElementById(\'wfModalInfosessie\').classList.remove(\'active\')">&times;</button>' +
                '</div>' +
                '<div class="wf-modal-body">' +
                    '<div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:12px; border-radius:4px; margin-bottom:14px; font-size:12px;">' +
                        '<strong id="wfInfoSessionTitle">Infosessie Duaal Leren &amp; Voltijds Dag</strong><br>' +
                        '<span style="color:#64748B;" id="wfInfoSessionDetails">Zaterdag 29/08 om 10:00 • Campus Sint-Niklaas</span>' +
                    '</div>' +
                    '<div style="margin-bottom:12px;">' +
                        '<label style="display:block; font-weight:700; font-size:12px; margin-bottom:4px;">Jouw Voor- en Achternaam:</label>' +
                        '<input type="text" id="wfInfoName" value="Karel Strosse" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:8px 12px; font-size:13px;">' +
                    '</div>' +
                    '<div style="margin-bottom:12px;">' +
                        '<label style="display:block; font-weight:700; font-size:12px; margin-bottom:4px;">E-mailadres (voor bevestiging &amp; kalenderlink):</label>' +
                        '<input type="email" id="wfInfoEmail" value="karel@voorbeeld.be" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:8px 12px; font-size:13px;">' +
                    '</div>' +
                    '<div style="margin-bottom:12px;">' +
                        '<label style="display:block; font-weight:700; font-size:12px; margin-bottom:4px;">Aantal personen:</label>' +
                        '<select id="wfInfoCount" style="width:100%; border:1px solid #CBD5E1; border-radius:4px; padding:8px 12px; font-size:13px;">' +
                            '<option value="1">1 persoon</option>' +
                            '<option value="2">2 personen (bv. cursist + ouder/partner)</option>' +
                            '<option value="3">3 personen</option>' +
                        '</select>' +
                    '</div>' +
                    '<div id="wfInfoSuccess" style="display:none; background:#ECFDF5; border:1px solid #A7F3D0; color:#065F46; padding:12px; border-radius:4px; font-size:12px;">' +
                        '✓ <strong>Plek succesvol gereserveerd!</strong> Een bevestiging met routebeschrijving en .ics kalenderlink is naar je gemaild.' +
                    '</div>' +
                '</div>' +
                '<div class="wf-modal-footer">' +
                    '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm" onclick="document.getElementById(\'wfModalInfosessie\').classList.remove(\'active\')">Annuleren</button>' +
                    '<button type="button" class="wf-btn wf-btn-primary wf-btn-sm" id="wfSubmitInfosessieBtn">Bevestig Reservatie &rarr;</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modalOverlay);

        // Bind reserve buttons
        document.querySelectorAll('.wf-btn-reserve-infosessie').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var card = this.closest('.wf-infosessie-card') || this.parentElement;
                var title = card.querySelector('.wf-infosessie-title') ? card.querySelector('.wf-infosessie-title').textContent : 'Infosessie Syntra';
                var meta = card.querySelector('.wf-infosessie-meta') ? card.querySelector('.wf-infosessie-meta').textContent : '';

                var titleEl = document.getElementById('wfInfoSessionTitle');
                var detailsEl = document.getElementById('wfInfoSessionDetails');
                if (titleEl) titleEl.textContent = title;
                if (detailsEl) detailsEl.textContent = meta;

                modalOverlay.classList.add('active');
            });
        });

        // Submit Infosessie
        var submitBtn = document.getElementById('wfSubmitInfosessieBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                var title = document.getElementById('wfInfoSessionTitle').textContent;
                var success = document.getElementById('wfInfoSuccess');
                if (success) success.style.display = 'block';

                window.dataLayer = window.dataLayer || [];
                window.wfDataLayerLog = window.wfDataLayerLog || [];
                var evt = {
                    event: 'infosessie_registered',
                    session_title: title,
                    registration_type: 'free_seat'
                };
                window.dataLayer.push(evt);
                window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: evt.event, payload: evt });
                if (typeof updateDrawerLiveLog === 'function') updateDrawerLiveLog();

                setTimeout(function() {
                    modalOverlay.classList.remove('active');
                    if (success) success.style.display = 'none';
                }, 2000);
            });
        }

        // Campus Filter on Homepage Infosessies
        var filterBtns = document.querySelectorAll('.wf-infosessies-filter button');
        var sessionCards = document.querySelectorAll('.wf-infosessie-card');
        if (filterBtns.length > 0 && sessionCards.length > 0) {
            filterBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(function(b) { b.classList.remove('wf-btn-primary'); b.classList.add('wf-btn-outline'); });
                    this.classList.remove('wf-btn-outline');
                    this.classList.add('wf-btn-primary');

                    var campus = this.getAttribute('data-campus');
                    sessionCards.forEach(function(card) {
                        if (campus === 'all' || card.getAttribute('data-campus') === campus) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
        }

        // -------------------------------------------------------------
        // Sectoren Dropdown Interaction (Mobile & Desktop)
        // -------------------------------------------------------------
        var dropdownTrigger = document.getElementById('wfNavSectorenBtn');
        var dropdownItem = dropdownTrigger ? dropdownTrigger.closest('.wf-nav-dropdown-item') : null;

        if (dropdownTrigger && dropdownItem) {
            dropdownTrigger.addEventListener('click', function(e) {
                // If on mobile/small screen, toggle dropdown instead of jumping immediately
                if (window.innerWidth <= 900) {
                    e.preventDefault();
                    dropdownItem.classList.toggle('is-open');
                }
            });

            document.addEventListener('click', function(e) {
                if (!dropdownItem.contains(e.target)) {
                    dropdownItem.classList.remove('is-open');
                }
            });
        }

        // -------------------------------------------------------------
        // Sector Hub Bouw Newsletter & Segment Pills
        // -------------------------------------------------------------
        var segmentPills = document.querySelectorAll('.wf-segment-pill');
        segmentPills.forEach(function(pill) {
            pill.addEventListener('click', function() {
                segmentPills.forEach(function(p) { p.classList.remove('active'); });
                this.classList.add('active');
            });
        });

        var sectorNewsBtn = document.getElementById('wfSectorNewsBtn');
        if (sectorNewsBtn) {
            sectorNewsBtn.addEventListener('click', function() {
                var emailInput = document.getElementById('wfSectorNewsEmail');
                var email = emailInput ? emailInput.value.trim() : '';
                var activePill = document.querySelector('.wf-segment-pill.active');
                var segment = activePill ? activePill.getAttribute('data-segment') : 'algemeen';

                var topics = [];
                if (document.getElementById('wfNewsNormen') && document.getElementById('wfNewsNormen').checked) topics.push('wetgeving_normen');
                if (document.getElementById('wfNewsStartdata') && document.getElementById('wfNewsStartdata').checked) topics.push('cursus_startdata');
                if (document.getElementById('wfNewsSubsidies') && document.getElementById('wfNewsSubsidies').checked) topics.push('subsidies_winteropleidingen');
                if (document.getElementById('wfNewsInfosessies') && document.getElementById('wfNewsInfosessies').checked) topics.push('infosessies');

                var successEl = document.getElementById('wfSectorNewsSuccess');
                if (successEl) {
                    successEl.style.display = 'block';
                }

                window.dataLayer = window.dataLayer || [];
                window.wfDataLayerLog = window.wfDataLayerLog || [];
                var payload = {
                    event: 'sector_newsletter_subscribed',
                    sector: 'Bouw & Energie',
                    segment: segment,
                    topics: topics,
                    email_provided: email ? true : false
                };
                window.dataLayer.push(payload);
                window.wfDataLayerLog.push({
                    timestamp: new Date().toLocaleTimeString('nl-BE'),
                    event: payload.event,
                    payload: payload
                });

                if (typeof updateDrawerLiveLog === 'function') {
                    updateDrawerLiveLog();
                }

                if (emailInput) {
                    emailInput.value = '';
                }
            });
        }
    }

    /* ==========================================================================
       FAVORITES & WISHLIST LEAD GENERATION SYSTEM
       ========================================================================== */
    function initFavoritesSystem(currentPage) {
        // Storage helpers
        function getFavorites() {
            try {
                var stored = localStorage.getItem('wf_favorites');
                return stored ? JSON.parse(stored) : [];
            } catch(e) {
                return [];
            }
        }

        function saveFavorites(favs) {
            localStorage.setItem('wf_favorites', JSON.stringify(favs));
            renderFavoritesUI();
        }

        // Active pending course for registration modal
        var pendingCourse = null;

        // 1. Inject Toast Container
        if (!document.getElementById('wfFavToast')) {
            var toastEl = document.createElement('div');
            toastEl.id = 'wfFavToast';
            toastEl.className = 'wf-toast';
            toastEl.innerHTML = 
                '<span class="wf-toast-icon">✓</span>' +
                '<div class="wf-toast-body" id="wfFavToastText">Opleiding opgeslagen in favorieten</div>' +
                '<button type="button" class="wf-toast-close" onclick="document.getElementById(\'wfFavToast\').classList.remove(\'show\')">&times;</button>';
            document.body.appendChild(toastEl);
        }

        var toastTimeout = null;
        function showToast(message, icon) {
            var toast = document.getElementById('wfFavToast');
            var text = document.getElementById('wfFavToastText');
            var iconEl = toast ? toast.querySelector('.wf-toast-icon') : null;
            if (toast && text) {
                text.innerHTML = message;
                if (iconEl) iconEl.textContent = icon || '✓';
                toast.classList.add('show');
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(function() {
                    toast.classList.remove('show');
                }, 4000);
            }
        }

        // 2. Inject Lead Capture / Registration Modal
        if (!document.getElementById('wfModalFavoriteAuth')) {
            var authModal = document.createElement('div');
            authModal.className = 'wf-modal-overlay';
            authModal.id = 'wfModalFavoriteAuth';
            authModal.innerHTML = 
                '<div class="wf-modal" style="max-width: 520px;">' +
                    '<div class="wf-modal-header">' +
                        '<div class="wf-modal-title">Toegevoegd aan favorieten</div>' +
                        '<button type="button" class="wf-modal-close" onclick="document.getElementById(\'wfModalFavoriteAuth\').classList.remove(\'active\')">&times;</button>' +
                    '</div>' +
                    '<div class="wf-modal-body">' +
                        '<div class="wf-fav-modal-preview">' +
                            '<div>' +
                                '<strong id="wfFavModalCourseTitle" style="font-size: 14px; display:block; line-height: 1.35; margin-bottom:2px;">Residentieel Elektrotechnisch Installateur</strong>' +
                                '<small style="color:var(--wf-text-muted);" id="wfFavModalCourseId">Opleidingscode: EL-2026-RES</small>' +
                            '</div>' +
                        '</div>' +
                        '<div class="wf-auth-tabs">' +
                            '<button type="button" class="wf-auth-tab active" id="wfAuthTabRegister">Nieuw profiel (Lead)</button>' +
                            '<button type="button" class="wf-auth-tab" id="wfAuthTabLogin">Ik heb al een account</button>' +
                        '</div>' +
                        '<div id="wfAuthFormRegister">' +
                            '<p style="font-size: 12.5px; color: var(--wf-text-muted); line-height: 1.5; margin-bottom: 14px;">' +
                                'Sla deze opleiding gratis op om startdata te vergelijken, lesprogramma\'s te bewaren en herinneringen te ontvangen.' +
                            '</p>' +
                            '<div style="margin-bottom: 10px;">' +
                                '<label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">Voor- en Achternaam *</label>' +
                                '<input type="text" id="wfAuthName" placeholder="bv. Karel Strosse" value="Karel Strosse" class="wf-input" style="width:100%; font-size:13px; padding:8px 12px;">' +
                            '</div>' +
                            '<div style="margin-bottom: 10px;">' +
                                '<label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">E-mailadres *</label>' +
                                '<input type="email" id="wfAuthEmail" placeholder="bv. naam@bedrijf.be" value="karel@voorbeeld.be" class="wf-input" style="width:100%; font-size:13px; padding:8px 12px;">' +
                            '</div>' +
                            '<div style="margin-bottom: 14px;">' +
                                '<label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">Telefoonnummer (optioneel voor SMS/WhatsApp herinnering)</label>' +
                                '<input type="tel" id="wfAuthPhone" placeholder="bv. 0470 12 34 56" class="wf-input" style="width:100%; font-size:13px; padding:8px 12px;">' +
                            '</div>' +
                            '<label style="display:flex; align-items:flex-start; gap:8px; font-size:12px; color:var(--wf-text-muted); cursor:pointer; margin-bottom:16px;">' +
                                '<input type="checkbox" id="wfAuthAlertOptin" checked style="margin-top:2px;">' +
                                '<span>Hou me op de hoogte van nieuwe startdata, openlesdagen en uiterste inschrijfdata voor deze opleiding.</span>' +
                            '</label>' +
                            '<button type="button" class="wf-btn wf-btn-primary" id="wfBtnSubmitRegister" style="width:100%; justify-content:center; padding:10px;">' +
                                'Opslaan in Mijn Favorieten &rarr;' +
                            '</button>' +
                        '</div>' +
                        '<div id="wfAuthFormLogin" style="display:none;">' +
                            '<p style="font-size: 12.5px; color: var(--wf-text-muted); line-height: 1.5; margin-bottom: 14px;">' +
                                'Meld je aan met je bestaande Syntra profiel om je opgeslagen favorieten te synchroniseren.' +
                            '</p>' +
                            '<div style="margin-bottom: 10px;">' +
                                '<label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">E-mailadres</label>' +
                                '<input type="email" id="wfLoginEmail" value="karel@voorbeeld.be" class="wf-input" style="width:100%; font-size:13px; padding:8px 12px;">' +
                            '</div>' +
                            '<div style="margin-bottom: 16px;">' +
                                '<label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">Wachtwoord of Eenmalige Login Code</label>' +
                                '<input type="password" id="wfLoginPass" value="••••••••" class="wf-input" style="width:100%; font-size:13px; padding:8px 12px;">' +
                            '</div>' +
                            '<button type="button" class="wf-btn wf-btn-primary" id="wfBtnSubmitLogin" style="width:100%; justify-content:center; padding:10px;">' +
                                'Aanmelden &amp; Bewaren &rarr;' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="wf-modal-footer" style="justify-content:center; font-size:11.5px; color:var(--wf-text-muted);">' +
                        '🔒 Gratis &amp; vrijblijvend &bull; AVG/GDPR conform &bull; Geen ongewenste reclame' +
                    '</div>' +
                '</div>';
            document.body.appendChild(authModal);

            // Tab logic
            var tabReg = document.getElementById('wfAuthTabRegister');
            var tabLog = document.getElementById('wfAuthTabLogin');
            var formReg = document.getElementById('wfAuthFormRegister');
            var formLog = document.getElementById('wfAuthFormLogin');

            if (tabReg && tabLog) {
                tabReg.addEventListener('click', function() {
                    tabReg.classList.add('active');
                    tabLog.classList.remove('active');
                    formReg.style.display = 'block';
                    formLog.style.display = 'none';
                });
                tabLog.addEventListener('click', function() {
                    tabLog.classList.add('active');
                    tabReg.classList.remove('active');
                    formLog.style.display = 'block';
                    formLog.style.display = 'none';
                });
            }

            // Submit Register (Lead Generation)
            var btnSubReg = document.getElementById('wfBtnSubmitRegister');
            if (btnSubReg) {
                btnSubReg.addEventListener('click', function() {
                    var name = document.getElementById('wfAuthName').value.trim() || 'Karel Strosse';
                    var email = document.getElementById('wfAuthEmail').value.trim() || 'karel@voorbeeld.be';
                    var optin = document.getElementById('wfAuthAlertOptin') ? document.getElementById('wfAuthAlertOptin').checked : true;

                    if (typeof window.wfToggleLogin === 'function') {
                        window.wfToggleLogin(true);
                    } else {
                        localStorage.setItem('wf_logged_in', 'true');
                    }

                    if (pendingCourse) {
                        var favs = getFavorites();
                        var exists = favs.some(function(f) { return f.id === pendingCourse.id; });
                        if (!exists) {
                            favs.push(pendingCourse);
                            saveFavorites(favs);
                        }
                    }

                    authModal.classList.remove('active');
                    showToast('Toegevoegd aan favorieten: <strong>' + (pendingCourse ? pendingCourse.title : 'Opleiding') + '</strong>');

                    // Log DataLayer
                    window.dataLayer = window.dataLayer || [];
                    window.wfDataLayerLog = window.wfDataLayerLog || [];
                    var leadPayload = {
                        event: 'generate_lead',
                        lead_type: 'favoriet_registratie',
                        lead_source: 'wishlist_auth_modal',
                        course_id: pendingCourse ? pendingCourse.id : null,
                        course_name: pendingCourse ? pendingCourse.title : null,
                        user_name: name,
                        user_email: email,
                        notifications_optin: optin
                    };
                    window.dataLayer.push(leadPayload);
                    window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: leadPayload.event, payload: leadPayload });

                    var wishPayload = {
                        event: 'add_to_wishlist',
                        course_id: pendingCourse ? pendingCourse.id : null,
                        course_name: pendingCourse ? pendingCourse.title : null,
                        user_authenticated: true,
                        lead_generated: true
                    };
                    window.dataLayer.push(wishPayload);
                    window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: wishPayload.event, payload: wishPayload });
                    if (typeof updateDrawerLiveLog === 'function') updateDrawerLiveLog();
                });
            }

            // Submit Login
            var btnSubLog = document.getElementById('wfBtnSubmitLogin');
            if (btnSubLog) {
                btnSubLog.addEventListener('click', function() {
                    if (typeof window.wfToggleLogin === 'function') {
                        window.wfToggleLogin(true);
                    } else {
                        localStorage.setItem('wf_logged_in', 'true');
                    }

                    if (pendingCourse) {
                        var favs = getFavorites();
                        var exists = favs.some(function(f) { return f.id === pendingCourse.id; });
                        if (!exists) {
                            favs.push(pendingCourse);
                            saveFavorites(favs);
                        }
                    }

                    authModal.classList.remove('active');
                    showToast('Toegevoegd aan favorieten: <strong>' + (pendingCourse ? pendingCourse.title : 'Opleiding') + '</strong>');

                    // Log DataLayer
                    window.dataLayer = window.dataLayer || [];
                    window.wfDataLayerLog = window.wfDataLayerLog || [];
                    var wishPayload = {
                        event: 'add_to_wishlist',
                        course_id: pendingCourse ? pendingCourse.id : null,
                        course_name: pendingCourse ? pendingCourse.title : null,
                        user_authenticated: true,
                        lead_generated: false
                    };
                    window.dataLayer.push(wishPayload);
                    window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: wishPayload.event, payload: wishPayload });
                    if (typeof updateDrawerLiveLog === 'function') updateDrawerLiveLog();
                });
            }
        }

        // 3. Inject "Mijn Favorieten" List Modal
        if (!document.getElementById('wfModalFavoritesList')) {
            var listModal = document.createElement('div');
            listModal.className = 'wf-modal-overlay';
            listModal.id = 'wfModalFavoritesList';
            listModal.innerHTML = 
                '<div class="wf-modal" style="max-width: 600px;">' +
                    '<div class="wf-modal-header">' +
                        '<div class="wf-modal-title">Mijn Bewaarde Favorieten</div>' +
                        '<button type="button" class="wf-modal-close" onclick="document.getElementById(\'wfModalFavoritesList\').classList.remove(\'active\')">&times;</button>' +
                    '</div>' +
                    '<div class="wf-modal-body" style="padding: 16px 20px;">' +
                        '<div id="wfFavoritesListContent">' +
                            '<!-- Rendered by JS -->' +
                        '</div>' +
                    '</div>' +
                    '<div class="wf-modal-footer" style="display:flex; justify-content:space-between; align-items:center;">' +
                        '<button type="button" id="wfClearAllFavoritesBtn" style="background:none; border:none; color:#EF4444; font-size:12px; font-weight:700; cursor:pointer;">Alle favorieten wissen</button>' +
                        '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm" onclick="document.getElementById(\'wfModalFavoritesList\').classList.remove(\'active\')">Sluiten</button>' +
                    '</div>' +
                '</div>';
            document.body.appendChild(listModal);

            var clearBtn = document.getElementById('wfClearAllFavoritesBtn');
            if (clearBtn) {
                clearBtn.addEventListener('click', function() {
                    saveFavorites([]);
                    renderFavoritesListModal();
                    showToast('Alle favorieten zijn gewist.', '🗑️');
                });
            }
        }

        function renderFavoritesListModal() {
            var content = document.getElementById('wfFavoritesListContent');
            if (!content) return;
            var favs = getFavorites();
            if (favs.length === 0) {
                content.innerHTML = 
                    '<div style="text-align:center; padding: 36px 20px;">' +
                        '<h3 style="font-size:16px; font-weight:800; margin-bottom:6px;">Nog geen bewaarde opleidingen</h3>' +
                        '<p style="font-size:13px; color:var(--wf-text-muted); margin-bottom:18px;">' +
                            'Klik op het hartje bij een cursus op de homepage, zoekpagina of cursusfiche om deze hier te bewaren en startdata te vergelijken.' +
                        '</p>' +
                        '<a href="zoeken.html" class="wf-btn wf-btn-primary wf-btn-sm">Ontdek alle opleidingen &rarr;</a>' +
                    '</div>';
                return;
            }

            var html = '<div style="display:flex; flex-direction:column; gap:12px;">';
            favs.forEach(function(item) {
                html += 
                    '<div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; padding:14px 16px; display:flex; justify-content:space-between; align-items:center; gap:14px;">' +
                        '<div>' +
                            '<strong style="font-size:14px; display:block; margin-bottom:3px;">' + item.title + '</strong>' +
                            '<span style="font-size:11.5px; color:var(--wf-text-muted);">Code: ' + item.id + ' &bull; Erkend getuigschrift</span>' +
                        '</div>' +
                        '<div style="display:flex; gap:8px; align-items:center; flex-shrink:0;">' +
                            '<a href="opleiding.html" class="wf-btn wf-btn-primary wf-btn-sm" style="font-size:12px;">Bekijk &amp; Inschrijven &rarr;</a>' +
                            '<button type="button" class="wf-remove-fav-btn" data-id="' + item.id + '" style="background:none; border:1px solid #CBD5E1; border-radius:4px; padding:6px 10px; color:#64748B; font-size:12px; cursor:pointer;" title="Verwijderen uit favorieten">&times;</button>' +
                        '</div>' +
                    '</div>';
            });
            html += '</div>';
            content.innerHTML = html;

            content.querySelectorAll('.wf-remove-fav-btn').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var id = this.getAttribute('data-id');
                    var updated = getFavorites().filter(function(f) { return f.id !== id; });
                    saveFavorites(updated);
                    renderFavoritesListModal();
                    showToast('Opleiding verwijderd uit je favorieten.', '🗑️');
                });
            });
        }

        // 4. Synchronization of UI elements
        function renderFavoritesUI() {
            var favs = getFavorites();
            var favIds = favs.map(function(f) { return f.id; });
            var isUserLoggedIn = localStorage.getItem('wf_logged_in') === 'true';

            // Update all favorite buttons on cards
            document.querySelectorAll('.wf-fav-btn').forEach(function(btn) {
                var cid = btn.getAttribute('data-course-id');
                var isFav = favIds.indexOf(cid) !== -1;
                btn.classList.toggle('is-favorite', isFav);
                btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
            });

            // Update hero button on detail page
            document.querySelectorAll('.wf-fav-btn-hero').forEach(function(btn) {
                var cid = btn.getAttribute('data-course-id');
                var isFav = favIds.indexOf(cid) !== -1;
                btn.classList.toggle('is-favorite', isFav);
                var textEl = btn.querySelector('.wf-fav-text');
                if (textEl) {
                    textEl.textContent = isFav ? 'Bewaard in favorieten' : 'Bewaar als favoriet';
                }
            });

            // Update topbar badges
            document.querySelectorAll('.wf-top-favorites-btn').forEach(function(btn) {
                var badge = btn.querySelector('.wf-fav-count-badge');
                var iconSpan = btn.querySelector('span:first-child');
                if (badge) {
                    badge.textContent = favs.length;
                    badge.style.display = favs.length > 0 ? 'inline-block' : 'none';
                }
                if (iconSpan) {
                    iconSpan.textContent = favs.length > 0 ? '♥' : '♡';
                }
            });

            // Update topbar user login label
            document.querySelectorAll('.wf-top-user-btn').forEach(function(btn) {
                if (isUserLoggedIn) {
                    btn.textContent = 'Mijn Syntra (Karel)';
                    btn.style.color = 'var(--wf-primary)';
                } else {
                    btn.textContent = 'Aanmelden';
                    btn.style.color = 'inherit';
                }
            });
        }

        window.wfRenderFavoritesState = renderFavoritesUI;

        // 5. Global Delegated Click Listeners
        document.addEventListener('click', function(e) {
            // Click on .wf-fav-btn or .wf-fav-btn-hero
            var favBtn = e.target.closest('.wf-fav-btn, .wf-fav-btn-hero');
            if (favBtn) {
                e.preventDefault();
                e.stopPropagation();

                var courseId = favBtn.getAttribute('data-course-id') || 'CURSUS-2026';
                var courseTitle = favBtn.getAttribute('data-course-title');
                if (!courseTitle) {
                    var card = favBtn.closest('.wf-card, .wf-card-horizontal, .wf-related-card');
                    var h3 = card ? card.querySelector('h3, .wf-card-title') : null;
                    courseTitle = h3 ? h3.textContent.trim() : 'Opleiding';
                }

                var isUserLoggedIn = localStorage.getItem('wf_logged_in') === 'true';

                if (!isUserLoggedIn) {
                    // Not registered yet -> trigger Lead Capture simulation modal!
                    pendingCourse = { id: courseId, title: courseTitle };
                    var titleEl = document.getElementById('wfFavModalCourseTitle');
                    var idEl = document.getElementById('wfFavModalCourseId');
                    if (titleEl) titleEl.textContent = courseTitle;
                    if (idEl) idEl.textContent = 'Opleidingscode: ' + courseId;
                    var authModal = document.getElementById('wfModalFavoriteAuth');
                    if (authModal) authModal.classList.add('active');
                } else {
                    // Already logged in -> toggle favorite directly
                    var favs = getFavorites();
                    var index = favs.findIndex(function(f) { return f.id === courseId; });
                    if (index !== -1) {
                        favs.splice(index, 1);
                        saveFavorites(favs);
                        showToast('Opleiding verwijderd uit je favorieten.', '🗑️');

                        window.dataLayer = window.dataLayer || [];
                        window.wfDataLayerLog = window.wfDataLayerLog || [];
                        var payload = { event: 'remove_from_wishlist', course_id: courseId, course_name: courseTitle };
                        window.dataLayer.push(payload);
                        window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: payload.event, payload: payload });
                    } else {
                        favs.push({ id: courseId, title: courseTitle });
                        saveFavorites(favs);
                        showToast('Toegevoegd aan favorieten: <strong>' + courseTitle + '</strong>');

                        window.dataLayer = window.dataLayer || [];
                        window.wfDataLayerLog = window.wfDataLayerLog || [];
                        var payload = { event: 'add_to_wishlist', course_id: courseId, course_name: courseTitle, user_authenticated: true };
                        window.dataLayer.push(payload);
                        window.wfDataLayerLog.push({ timestamp: new Date().toLocaleTimeString('nl-BE'), event: payload.event, payload: payload });
                    }
                    if (typeof updateDrawerLiveLog === 'function') updateDrawerLiveLog();
                }
                return;
            }

            // Click on Topbar Favorites Button
            var topFavBtn = e.target.closest('.wf-top-favorites-btn');
            if (topFavBtn) {
                e.preventDefault();
                renderFavoritesListModal();
                var listModal = document.getElementById('wfModalFavoritesList');
                if (listModal) listModal.classList.add('active');
                return;
            }

            // Click on Topbar User Button
            var topUserBtn = e.target.closest('.wf-top-user-btn');
            if (topUserBtn) {
                e.preventDefault();
                var isUserLoggedIn = localStorage.getItem('wf_logged_in') === 'true';
                if (!isUserLoggedIn) {
                    pendingCourse = { id: 'ALGEMEEN', title: 'Syntra Opleidingen Profiel' };
                    var authModal = document.getElementById('wfModalFavoriteAuth');
                    if (authModal) authModal.classList.add('active');
                } else {
                    renderFavoritesListModal();
                    var listModal = document.getElementById('wfModalFavoritesList');
                    if (listModal) listModal.classList.add('active');
                }
                return;
            }

            // Click on Header Zoeken Button while already on zoeken.html
            var navSearchBtn = e.target.closest('#wfNavSearchBtn');
            if (navSearchBtn && window.location.pathname.indexOf('zoeken.html') !== -1) {
                var searchInput = document.getElementById('searchKeyword') || document.querySelector('.wf-search-input');
                if (searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
        });

        // Initial render
        renderFavoritesUI();
    }

})();
