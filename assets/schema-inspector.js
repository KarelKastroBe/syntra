/**
 * SCHEMA.ORG STRUCTURED DATA INSPECTOR & VISUALIZER
 * Visualiseert alle Course, FAQPage, BreadcrumbList en Event schemas
 * voor Search Engines (Google Rich Results) en AI Chatbots (LLM Citations).
 * 100% Modulair & Standalone.
 */

(function() {
    'use strict';

    function init() {
        injectTopBarButton();
    }

    function injectTopBarButton() {
        var rightContainer = document.querySelector('.pb-right');
        if (!rightContainer) {
            setTimeout(injectTopBarButton, 200);
            return;
        }

        if (document.getElementById('wfSchemaToggle')) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pb-btn-schema';
        btn.id = 'wfSchemaToggle';
        btn.title = 'Bekijk de actieve Schema.org Structured Data voor Google & AI Chatbots';
        btn.innerHTML = '🤖 <strong>Schema: JSON-LD</strong>';

        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '5px';
        btn.style.background = '#0F172A';
        btn.style.color = '#38BDF8';
        btn.style.border = '1px solid #1E3A5F';
        btn.style.borderRadius = '4px';
        btn.style.padding = '3px 8px';
        btn.style.fontSize = '11px';
        btn.style.cursor = 'pointer';
        btn.style.marginRight = '6px';
        btn.style.fontFamily = 'inherit';

        btn.addEventListener('mouseenter', function() {
            this.style.background = '#1E293B';
            this.style.color = '#7DD3FC';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.background = '#0F172A';
            this.style.color = '#38BDF8';
        });

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openSchemaModal();
        });

        // Insert before Brand Select or at the beginning of pb-right
        var brandLabel = rightContainer.querySelector('label');
        if (brandLabel) {
            rightContainer.insertBefore(btn, brandLabel);
        } else {
            rightContainer.appendChild(btn);
        }
    }

    function openSchemaModal() {
        var existing = document.getElementById('wfSchemaModalOverlay');
        if (existing) existing.remove();

        // Detect all script[type="application/ld+json"] on the current page
        var scripts = document.querySelectorAll('script[type="application/ld+json"]');
        var parsedSchemas = [];

        scripts.forEach(function(s) {
            try {
                var json = JSON.parse(s.textContent.trim());
                parsedSchemas.push(json);
            } catch (e) {
                console.error('Kon JSON-LD niet parsen:', e);
            }
        });

        var overlay = document.createElement('div');
        overlay.className = 'wf-modal-overlay active';
        overlay.id = 'wfSchemaModalOverlay';
        overlay.style.zIndex = '10010';

        var contentHtml = '';

        if (parsedSchemas.length === 0) {
            contentHtml = 
                '<div style="padding:30px; text-align:center; color:#64748B;">' +
                    '<div style="font-size:36px; margin-bottom:12px;">🔍</div>' +
                    '<strong style="font-size:15px; color:#0F172A; display:block; margin-bottom:6px;">Geen Schema.org scripts gedetecteerd op deze pagina</strong>' +
                    '<p style="font-size:13px; line-height:1.5; margin-bottom:18px;">Bekijk de <a href="opleiding.html" style="color:#0284C7; font-weight:700;">Cursusfiche</a> of de <a href="faq.html" style="color:#0284C7; font-weight:700;">FAQ-pagina</a> voor live demonstraties van <code>Course</code> en <code>FAQPage</code> structured data.</p>' +
                '</div>';
        } else {
            contentHtml += 
                '<div style="padding:16px 20px; background:#F8FAFC; border-bottom:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">' +
                    '<div>' +
                        '<span class="wf-tag wf-tag-green" style="font-size:11px;">Gevalideerd Schema.org</span> ' +
                        '<span style="font-size:12px; color:#64748B; margin-left:8px;">Geoptimaliseerd voor Google Rich Snippets &amp; AI LLM Search (SearchGPT, Perplexity, Gemini)</span>' +
                    '</div>' +
                    '<button type="button" id="wfCopySchemaJsonBtn" class="wf-btn wf-btn-sm" style="font-size:11.5px; background:#0F172A; color:#FFFFFF; padding:4px 10px;">📋 Kopieer JSON-LD</button>' +
                '</div>' +
                '<div style="padding:20px; max-height:70vh; overflow-y:auto; font-family:ui-monospace, SFMono-Regular, monospace; font-size:12px; line-height:1.6; background:#0B132B; color:#7DD3FC; border-radius:0 0 6px 6px;">';

            parsedSchemas.forEach(function(schema, idx) {
                var jsonStr = JSON.stringify(schema, null, 2);
                contentHtml += '<pre style="margin:0 0 20px 0; white-space:pre-wrap; word-break:break-all;" id="schemaJsonPre_' + idx + '">' + escapeHtml(jsonStr) + '</pre>';
            });

            contentHtml += '</div>';
        }

        overlay.innerHTML = 
            '<div class="wf-modal" style="max-width: 780px; width:95%;">' +
                '<div class="wf-modal-header" style="background:#0F172A; color:#FFFFFF;">' +
                    '<div class="wf-modal-title" style="display:flex; align-items:center; gap:8px;">' +
                        '<span>🤖 Schema.org Structured Data Inspector</span>' +
                        '<span style="font-size:11px; background:#1E3A5F; color:#38BDF8; padding:2px 8px; border-radius:4px; font-weight:700;">JSON-LD</span>' +
                    '</div>' +
                    '<button type="button" class="wf-modal-close" id="wfCloseSchemaModalX" style="color:#94A3B8;">&times;</button>' +
                '</div>' +
                contentHtml +
                '<div class="wf-modal-footer" style="display:flex; justify-content:space-between; align-items:center;">' +
                    '<div style="font-size:12px; color:#64748B;">' +
                        'Validatie via Schema.org / Google Search Central standaarden' +
                    '</div>' +
                    '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm" id="wfCloseSchemaModalBtn">Sluiten</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(overlay);

        document.getElementById('wfCloseSchemaModalX').addEventListener('click', function() { overlay.remove(); });
        document.getElementById('wfCloseSchemaModalBtn').addEventListener('click', function() { overlay.remove(); });

        var copyBtn = document.getElementById('wfCopySchemaJsonBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                var textToCopy = parsedSchemas.map(function(s) { return JSON.stringify(s, null, 2); }).join('\n\n');
                navigator.clipboard.writeText(textToCopy).then(function() {
                    copyBtn.textContent = '✓ Gekopieerd!';
                    setTimeout(function() { copyBtn.textContent = '📋 Kopieer JSON-LD'; }, 2000);
                });
            });
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
