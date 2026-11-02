/**
 * FEEDBACK TOOL (Visual Pinpoint Feedback System)
 * 100% Modulair & Standalone met JSON/CSV Export & Import
 * Syntra MVL / NxtPro / Syntra Brussel Wireframe Suite
 */

(function() {
    'use strict';

    var STORAGE_KEY = 'wf_visual_feedback_items';
    var AUTHOR_KEY = 'wf_feedback_author_name';
    var isFeedbackModeActive = false;
    var currentPendingPin = null;

    // Detect current page identifier
    function getPageId() {
        var path = window.location.pathname;
        var page = path.split('/').pop().replace('.html', '') || 'index';
        return page;
    }

    // 1. Data Store Helpers
    function getAllFeedback() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Fout bij laden van feedback data:', e);
            return [];
        }
    }

    function saveAllFeedback(items) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Fout bij opslaan van feedback data:', e);
        }
    }

    function getPageFeedback() {
        var currentPage = getPageId();
        return getAllFeedback().filter(function(item) {
            return item.page === currentPage;
        });
    }

    function getSavedAuthor() {
        return localStorage.getItem(AUTHOR_KEY) || 'Karel - Marketing';
    }

    function saveAuthor(name) {
        if (name && name.trim()) {
            localStorage.setItem(AUTHOR_KEY, name.trim());
        }
    }

    // 2. Initialize Feedback System
    function init() {
        injectTopBarButton();
        injectFloatingBanner();
        injectFloatingDrawerTrigger();
        injectDrawer();
        renderPagePins();
        updateFeedbackCountBadges();

        // Listen for clicks in feedback mode
        document.addEventListener('click', handlePageClick, true);

        // Escape key turns off feedback mode or closes modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeFeedbackModal();
                if (isFeedbackModeActive) {
                    toggleFeedbackMode(false);
                }
            }
        });
    }

    // 3. UI Injections
    function injectTopBarButton() {
        var rightContainer = document.querySelector('.pb-right');
        if (!rightContainer) {
            setTimeout(injectTopBarButton, 200);
            return;
        }

        if (document.getElementById('wfFeedbackToggle')) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pb-btn-feedback';
        btn.id = 'wfFeedbackToggle';
        btn.title = 'Activeer feedbackmodus om opmerkingen op het scherm te pinnen';
        btn.innerHTML = '<span class="pb-feedback-dot"></span> Feedback: <strong id="wfFeedbackStatus">UIT</strong>';

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFeedbackMode(!isFeedbackModeActive);
        });

        // Insert before Brand Select or at the beginning of pb-right
        var brandLabel = rightContainer.querySelector('label');
        if (brandLabel) {
            rightContainer.insertBefore(btn, brandLabel);
        } else {
            rightContainer.appendChild(btn);
        }
    }

    function injectFloatingBanner() {
        if (document.getElementById('wfFeedbackModeBanner')) return;

        var banner = document.createElement('div');
        banner.className = 'wf-feedback-mode-banner';
        banner.id = 'wfFeedbackModeBanner';
        banner.innerHTML = 
            '<span>📍 <strong>Feedback-modus actief:</strong> Klik op een willekeurige plek op de pagina om een opmerking te pinnen.</span>' +
            '<button type="button" id="wfCloseFeedbackModeBtn" style="background:#D97706; border:none; color:#FFFFFF; padding:3px 10px; border-radius:14px; font-size:11px; font-weight:700; cursor:pointer;">Klaar / Sluiten &times;</button>';
        document.body.appendChild(banner);

        document.getElementById('wfCloseFeedbackModeBtn').addEventListener('click', function() {
            toggleFeedbackMode(false);
        });
    }

    function injectFloatingDrawerTrigger() {
        if (document.getElementById('wfFeedbackDrawerTrigger')) return;

        var trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'wf-feedback-drawer-trigger';
        trigger.id = 'wfFeedbackDrawerTrigger';
        trigger.innerHTML = '💬 Feedback <span class="wf-fb-count-badge" id="wfFeedbackGlobalCount">0</span>';

        trigger.addEventListener('click', function() {
            openFeedbackDrawer();
        });

        document.body.appendChild(trigger);
    }

    function injectDrawer() {
        if (document.getElementById('wfFeedbackDrawer')) return;

        var drawer = document.createElement('div');
        drawer.className = 'wf-feedback-drawer';
        drawer.id = 'wfFeedbackDrawer';
        drawer.innerHTML = 
            '<div class="wf-fb-drawer-header">' +
                '<div style="font-size:14px; font-weight:800; display:flex; align-items:center; gap:8px;">' +
                    '<span>💬 Feedback Overzicht</span>' +
                    '<span class="wf-fb-count-badge" id="wfFeedbackDrawerCount">0</span>' +
                '</div>' +
                '<button type="button" class="wf-fb-modal-close" id="wfCloseDrawerBtn">&times;</button>' +
            '</div>' +
            '<div style="padding:10px 16px; background:#EEF2F6; border-bottom:1px solid #CBD5E1; display:flex; justify-content:space-between; align-items:center;">' +
                '<div style="font-size:12px; font-weight:700; color:#334155;">' +
                    'Pagina: <span style="color:#D97706;" id="wfDrawerPageLabel">' + getPageId() + '.html</span>' +
                '</div>' +
                '<button type="button" id="wfDrawerAddPinBtn" style="background:#D97706; color:#FFFFFF; border:none; border-radius:4px; padding:4px 10px; font-size:11px; font-weight:700; cursor:pointer;">+ Nieuwe Pin</button>' +
            '</div>' +
            '<div class="wf-fb-drawer-body" id="wfFeedbackList">' +
                '<!-- Dynamic list of feedback items -->' +
            '</div>' +
            '<div class="wf-fb-drawer-footer">' +
                '<div class="wf-fb-drawer-btn-row">' +
                    '<button type="button" class="wf-btn wf-btn-sm" id="wfExportCsvBtn" style="flex:1; background:#0F172A; color:#FFFFFF; font-size:12px; padding:8px 10px;">📥 Exporteer CSV</button>' +
                    '<button type="button" class="wf-btn wf-btn-sm" id="wfExportJsonBtn" style="flex:1; background:#334155; color:#FFFFFF; font-size:12px; padding:8px 10px;">📥 Exporteer JSON</button>' +
                '</div>' +
                '<div class="wf-fb-drawer-btn-row">' +
                    '<label class="wf-btn wf-btn-sm" style="flex:1; background:#FFFFFF; border:1px solid #CBD5E1; color:#334155; font-size:11.5px; padding:6px 10px; text-align:center; cursor:pointer;">' +
                        '📤 Importeer JSON' +
                        '<input type="file" id="wfImportJsonInput" accept=".json" style="display:none;">' +
                    '</label>' +
                    '<button type="button" id="wfClearPageFeedbackBtn" style="background:none; border:none; color:#EF4444; font-size:11.5px; font-weight:700; cursor:pointer; padding:6px 8px;">Wis pagina</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(drawer);

        document.getElementById('wfCloseDrawerBtn').addEventListener('click', closeFeedbackDrawer);
        document.getElementById('wfDrawerAddPinBtn').addEventListener('click', function() {
            closeFeedbackDrawer();
            toggleFeedbackMode(true);
        });

        // Export CSV
        document.getElementById('wfExportCsvBtn').addEventListener('click', exportToCsv);

        // Export JSON
        document.getElementById('wfExportJsonBtn').addEventListener('click', exportToJson);

        // Import JSON
        document.getElementById('wfImportJsonInput').addEventListener('change', importFromJson);

        // Clear Page Feedback
        document.getElementById('wfClearPageFeedbackBtn').addEventListener('click', clearPageFeedback);
    }

    // 4. Toggle Feedback Mode
    function toggleFeedbackMode(activate) {
        isFeedbackModeActive = activate;
        document.body.classList.toggle('wf-feedback-mode', isFeedbackModeActive);

        var btn = document.getElementById('wfFeedbackToggle');
        var status = document.getElementById('wfFeedbackStatus');
        if (btn && status) {
            btn.classList.toggle('active', isFeedbackModeActive);
            status.textContent = isFeedbackModeActive ? 'AAN' : 'UIT';
        }

        var banner = document.getElementById('wfFeedbackModeBanner');
        if (banner) {
            banner.classList.toggle('show', isFeedbackModeActive);
        }
    }

    // 5. Handling Clicks in Feedback Mode
    function handlePageClick(e) {
        if (!isFeedbackModeActive) return;

        // Ignore clicks inside prototype bar, feedback modal, feedback drawer, or existing pins
        if (e.target.closest('#wfPrototypeBar, .wf-feedback-drawer, .wf-fb-modal-overlay, .wf-feedback-drawer-trigger, .wf-feedback-mode-banner, .wf-feedback-pin')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        var x = e.pageX;
        var y = e.pageY;

        // Relative percentage across body to preserve layout on resizing
        var docWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
        var xPercent = (x / docWidth) * 100;

        // Determine context element
        var targetEl = e.target;
        var elDescription = getElementDescription(targetEl);

        currentPendingPin = {
            id: 'fb_' + Date.now(),
            page: getPageId(),
            x: x,
            y: y,
            xPercent: xPercent.toFixed(2),
            selector: elDescription,
            timestamp: new Date().toISOString()
        };

        openFeedbackInputModal(currentPendingPin);
    }

    function getElementDescription(el) {
        if (!el) return 'Pagina achtergrond';
        var tag = el.tagName.toLowerCase();
        var id = el.id ? '#' + el.id : '';
        var cls = el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : '';
        var text = el.textContent ? el.textContent.trim().substring(0, 30) : '';
        if (text) text = ' ("' + text.replace(/\s+/g, ' ') + '...")';
        return tag + id + cls + text;
    }

    // 6. Feedback Input Modal
    function openFeedbackInputModal(pinData) {
        closeFeedbackModal();

        var defaultAuthor = getSavedAuthor();

        var overlay = document.createElement('div');
        overlay.className = 'wf-fb-modal-overlay';
        overlay.id = 'wfFbInputModal';
        overlay.innerHTML = 
            '<div class="wf-fb-modal">' +
                '<div class="wf-fb-modal-header">' +
                    '<div class="wf-fb-modal-title">📍 Feedback Toevoegen</div>' +
                    '<button type="button" class="wf-fb-modal-close" id="wfModalCloseX">&times;</button>' +
                '</div>' +
                '<div class="wf-fb-modal-body">' +
                    '<div class="wf-fb-form-group">' +
                        '<label class="wf-fb-label">Gemarkeerd element:</label>' +
                        '<div class="wf-fb-context-badge">' + pinData.selector + '</div>' +
                    '</div>' +
                    '<div style="display:flex; gap:12px;">' +
                        '<div class="wf-fb-form-group" style="flex:1;">' +
                            '<label class="wf-fb-label">Jouw Naam / Rol *</label>' +
                            '<input type="text" class="wf-fb-input" id="wfFbAuthor" value="' + defaultAuthor + '" placeholder="bv. Karel - Marketing">' +
                        '</div>' +
                        '<div class="wf-fb-form-group" style="flex:1;">' +
                            '<label class="wf-fb-label">Type Feedback</label>' +
                            '<select class="wf-fb-select" id="wfFbCategory">' +
                                '<option value="opmerking" selected>💡 Opmerking</option>' +
                                '<option value="suggestie">✨ Suggestie / Idee</option>' +
                                '<option value="fout">⚠️ Fout / Probleem</option>' +
                                '<option value="vraag">❓ Vraag</option>' +
                                '<option value="positief">👍 Akkoord / Goed</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>' +
                    '<div class="wf-fb-form-group">' +
                        '<label class="wf-fb-label">Opmerking / Feedback *</label>' +
                        '<textarea class="wf-fb-textarea" id="wfFbComment" placeholder="Beschrijf bondig wat je opmerkt, wat anders moet of welke vraag je hebt..."></textarea>' +
                    '</div>' +
                '</div>' +
                '<div class="wf-fb-modal-footer">' +
                    '<button type="button" class="wf-btn wf-btn-outline wf-btn-sm" id="wfFbCancelBtn">Annuleren</button>' +
                    '<button type="button" class="wf-btn wf-btn-primary wf-btn-sm" id="wfFbSubmitBtn" style="background:#D97706; border-color:#D97706;">Pin Opslaan &rarr;</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(overlay);

        var commentInput = document.getElementById('wfFbComment');
        if (commentInput) commentInput.focus();

        document.getElementById('wfModalCloseX').addEventListener('click', closeFeedbackModal);
        document.getElementById('wfFbCancelBtn').addEventListener('click', closeFeedbackModal);

        document.getElementById('wfFbSubmitBtn').addEventListener('click', function() {
            var author = document.getElementById('wfFbAuthor').value.trim() || 'Anoniem';
            var category = document.getElementById('wfFbCategory').value;
            var comment = document.getElementById('wfFbComment').value.trim();

            if (!comment) {
                alert('Gelieve een korte opmerking in te vullen.');
                document.getElementById('wfFbComment').focus();
                return;
            }

            saveAuthor(author);

            var items = getAllFeedback();
            var newNumber = items.filter(function(i) { return i.page === pinData.page; }).length + 1;

            var feedbackItem = {
                id: pinData.id,
                number: newNumber,
                page: pinData.page,
                x: pinData.x,
                y: pinData.y,
                xPercent: pinData.xPercent,
                selector: pinData.selector,
                author: author,
                category: category,
                comment: comment,
                date: new Date().toLocaleDateString('nl-BE'),
                time: new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }),
                timestamp: pinData.timestamp
            };

            items.push(feedbackItem);
            saveAllFeedback(items);

            closeFeedbackModal();
            renderPagePins();
            updateFeedbackCountBadges();

            // Open drawer to confirm
            openFeedbackDrawer();
        });
    }

    function closeFeedbackModal() {
        var modal = document.getElementById('wfFbInputModal');
        if (modal) modal.remove();
        currentPendingPin = null;
    }

    // 7. Visual Pins on Page
    function renderPagePins() {
        // Clear existing pins
        document.querySelectorAll('.wf-feedback-pin').forEach(function(p) { p.remove(); });

        var pageItems = getPageFeedback();
        pageItems.forEach(function(item, idx) {
            var pin = document.createElement('div');
            pin.className = 'wf-feedback-pin';
            pin.setAttribute('data-type', item.category);
            pin.setAttribute('data-id', item.id);
            pin.id = 'pin_' + item.id;
            pin.style.left = item.x + 'px';
            pin.style.top = item.y + 'px';
            pin.title = '#' + (idx + 1) + ' [' + item.author + ']: ' + item.comment;

            pin.innerHTML = '<span class="wf-feedback-pin-inner">' + (idx + 1) + '</span>';

            pin.addEventListener('click', function(e) {
                e.stopPropagation();
                openFeedbackDrawer();
                highlightFeedbackInDrawer(item.id);
            });

            document.body.appendChild(pin);
        });
    }

    // 8. Feedback Drawer & List
    function openFeedbackDrawer() {
        var drawer = document.getElementById('wfFeedbackDrawer');
        if (drawer) {
            drawer.classList.add('open');
            renderDrawerList();
        }
    }

    function closeFeedbackDrawer() {
        var drawer = document.getElementById('wfFeedbackDrawer');
        if (drawer) {
            drawer.classList.remove('open');
        }
    }

    function renderDrawerList() {
        var listContainer = document.getElementById('wfFeedbackList');
        if (!listContainer) return;

        var items = getPageFeedback();
        updateFeedbackCountBadges();

        if (items.length === 0) {
            listContainer.innerHTML = 
                '<div style="text-align:center; padding: 40px 16px; color:#64748B;">' +
                    '<div style="font-size:32px; margin-bottom:10px;">📌</div>' +
                    '<strong style="font-size:14px; color:#0F172A; display:block; margin-bottom:4px;">Nog geen feedback op deze pagina</strong>' +
                    '<p style="font-size:12px; line-height:1.5; margin-bottom:16px;">Klik op "+ Nieuwe Pin" of activeer de Feedback-modus in de topbalk om een punt aan te duiden.</p>' +
                    '<button type="button" class="wf-btn wf-btn-primary wf-btn-sm" onclick="document.getElementById(\'wfDrawerAddPinBtn\').click();" style="background:#D97706; border-color:#D97706;">Plaats eerste pin &rarr;</button>' +
                '</div>';
            return;
        }

        var html = '';
        items.forEach(function(item, idx) {
            html += 
                '<div class="wf-fb-item" data-id="' + item.id + '" id="card_' + item.id + '">' +
                    '<div class="wf-fb-item-header">' +
                        '<span class="wf-fb-item-tag ' + item.category + '">#' + (idx + 1) + ' ' + item.category + '</span>' +
                        '<span class="wf-fb-item-time">' + item.date + ' om ' + item.time + '</span>' +
                    '</div>' +
                    '<div class="wf-fb-item-author">👤 ' + escapeHtml(item.author) + '</div>' +
                    '<div class="wf-fb-item-comment">' + escapeHtml(item.comment) + '</div>' +
                    '<div class="wf-fb-item-target">Target: ' + escapeHtml(item.selector) + '</div>' +
                    '<div class="wf-fb-item-actions">' +
                        '<button type="button" class="wf-fb-action-btn wf-fb-btn-locate" data-id="' + item.id + '">🎯 Toon op pagina</button>' +
                        '<button type="button" class="wf-fb-action-btn wf-fb-btn-delete" data-id="' + item.id + '">🗑️ Verwijderen</button>' +
                    '</div>' +
                '</div>';
        });

        listContainer.innerHTML = html;

        // Attach listeners
        listContainer.querySelectorAll('.wf-fb-btn-locate').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = this.getAttribute('data-id');
                locatePinOnPage(id);
            });
        });

        listContainer.querySelectorAll('.wf-fb-btn-delete').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = this.getAttribute('data-id');
                deleteFeedbackItem(id);
            });
        });
    }

    function locatePinOnPage(id) {
        var pin = document.getElementById('pin_' + id);
        if (pin) {
            pin.scrollIntoView({ behavior: 'smooth', block: 'center' });
            pin.style.transform = 'translate(-14px, -36px) rotate(-45deg) scale(1.4)';
            setTimeout(function() {
                pin.style.transform = '';
            }, 1200);
        }
    }

    function highlightFeedbackInDrawer(id) {
        var card = document.getElementById('card_' + id);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            card.style.borderColor = '#D97706';
            card.style.background = '#FFFBEB';
            setTimeout(function() {
                card.style.borderColor = '';
                card.style.background = '';
            }, 1500);
        }
    }

    function deleteFeedbackItem(id) {
        if (!confirm('Ben je zeker dat je deze feedbackpin wilt verwijderen?')) return;
        var all = getAllFeedback();
        var updated = all.filter(function(i) { return i.id !== id; });
        saveAllFeedback(updated);
        renderPagePins();
        renderDrawerList();
        updateFeedbackCountBadges();
    }

    function clearPageFeedback() {
        var currentPage = getPageId();
        if (!confirm('Ben je zeker dat je alle feedback van "' + currentPage + '.html" wilt wissen?')) return;
        var all = getAllFeedback();
        var updated = all.filter(function(i) { return i.page !== currentPage; });
        saveAllFeedback(updated);
        renderPagePins();
        renderDrawerList();
        updateFeedbackCountBadges();
    }

    function updateFeedbackCountBadges() {
        var pageCount = getPageFeedback().length;
        var totalCount = getAllFeedback().length;

        var globalBadge = document.getElementById('wfFeedbackGlobalCount');
        if (globalBadge) globalBadge.textContent = totalCount;

        var drawerBadge = document.getElementById('wfFeedbackDrawerCount');
        if (drawerBadge) drawerBadge.textContent = pageCount + ' op deze pagina (' + totalCount + ' totaal)';
    }

    // 9. EXPORT & IMPORT (CSV & JSON)
    function exportToCsv() {
        var all = getAllFeedback();
        if (all.length === 0) {
            alert('Er is nog geen feedback ingevoerd om te exporteren.');
            return;
        }

        // CSV Header
        var csv = '\uFEFF'; // UTF-8 BOM voor correcte weergave van accenten in Excel
        csv += 'ID;Pagina;Nummer;Type;Auteur;Opmerking;Element;Datum;Tijd;Positie_X;Positie_Y\n';

        all.forEach(function(item, index) {
            var row = [
                item.id,
                item.page + '.html',
                index + 1,
                item.category,
                '"' + (item.author || '').replace(/"/g, '""') + '"',
                '"' + (item.comment || '').replace(/"/g, '""').replace(/\n/g, ' ') + '"',
                '"' + (item.selector || '').replace(/"/g, '""') + '"',
                item.date,
                item.time,
                item.x,
                item.y
            ];
            csv += row.join(';') + '\n';
        });

        downloadFile(csv, 'syntra-wireframe-feedback-' + new Date().toISOString().slice(0, 10) + '.csv', 'text/csv;charset=utf-8;');
    }

    function exportToJson() {
        var all = getAllFeedback();
        if (all.length === 0) {
            alert('Er is nog geen feedback ingevoerd om te exporteren.');
            return;
        }

        var json = JSON.stringify({
            exportDate: new Date().toISOString(),
            totalItems: all.length,
            items: all
        }, null, 2);

        downloadFile(json, 'syntra-wireframe-feedback-' + new Date().toISOString().slice(0, 10) + '.json', 'application/json');
    }

    function importFromJson(e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(evt) {
            try {
                var data = JSON.parse(evt.target.result);
                var importedItems = Array.isArray(data) ? data : (data.items || []);

                if (!Array.isArray(importedItems) || importedItems.length === 0) {
                    alert('Geen geldige feedback-items gevonden in het JSON-bestand.');
                    return;
                }

                var current = getAllFeedback();
                var currentIds = current.map(function(i) { return i.id; });
                var added = 0;

                importedItems.forEach(function(item) {
                    if (item.id && currentIds.indexOf(item.id) === -1) {
                        current.push(item);
                        added++;
                    }
                });

                saveAllFeedback(current);
                renderPagePins();
                renderDrawerList();
                updateFeedbackCountBadges();

                alert('Succesvol ' + added + ' feedback-items geïmporteerd!');
            } catch (err) {
                alert('Fout bij importeren van JSON: ' + err.message);
            }
        };
        reader.readAsText(file);
    }

    function downloadFile(content, fileName, mimeType) {
        var blob = new Blob([content], { type: mimeType });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
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

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
