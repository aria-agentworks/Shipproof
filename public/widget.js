/**
 * ShipProof Trust Widget
 * Embeddable verification badge for seller storefronts.
 *
 * Usage:
 *   <script src="https://shipproof.netlify.app/widget.js" data-seller="SELLER_ID"></script>
 *
 * The script finds itself, reads data-seller, and injects a floating trust badge.
 */
;(function () {
  'use strict'

  // Guard: prevent duplicate injection
  var KEY = '__shipproof_widget_loaded'
  if (window[KEY]) return
  window[KEY] = true

  var SELLER = null
  var WIDGET_ID = 'shipproof-trust-widget'

  // Locate our script tags
  var scripts = document.querySelectorAll('script[data-seller]')
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src && /widget\.js(\?.*)?$/.test(scripts[i].src)) {
      SELLER = scripts[i].getAttribute('data-seller')
      break
    }
  }

  // Guard: no seller ID found
  if (!SELLER) return

  // Guard: already injected for this session
  try {
    if (localStorage.getItem('__shipproof_hidden_' + SELLER) === '1') return
  } catch (e) { /* storage unavailable */ }

  // Guard: element already exists
  if (document.getElementById(WIDGET_ID)) return

  // --- Build the widget DOM ---
  var wrapper = document.createElement('div')
  wrapper.id = WIDGET_ID

  var shadow = wrapper.attachShadow ? wrapper.attachShadow({ mode: 'closed' }) : null

  var host = shadow || wrapper

  host.innerHTML = '\
<style>\
  :host { all: initial; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }\
  * { box-sizing: border-box; margin: 0; padding: 0; }\
  .sp-badge-wrap { position: fixed; bottom: 20px; right: 20px; z-index: 999999; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }\
  .sp-close { position: absolute; top: -8px; right: -8px; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; line-height: 18px; text-align: center; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }\
  .sp-close:hover { color: #374151; background: #f3f4f6; }\
  .sp-badge { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #059669; color: #fff; border-radius: 9999px; font-size: 13px; font-weight: 600; text-decoration: none; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35); cursor: pointer; transition: transform 0.18s, box-shadow 0.18s; user-select: none; position: relative; letter-spacing: 0.01em; }\
  .sp-badge:hover { transform: scale(1.06); box-shadow: 0 6px 20px rgba(5, 150, 105, 0.45); }\
  .sp-badge svg { width: 16px; height: 16px; flex-shrink: 0; }\
  .sp-tooltip { position: absolute; bottom: calc(100% + 10px); right: 0; background: #1f2937; color: #f9fafb; font-size: 11px; font-weight: 400; padding: 6px 10px; border-radius: 6px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }\
  .sp-tooltip::after { content: ""; position: absolute; top: 100%; right: 16px; border: 5px solid transparent; border-top-color: #1f2937; }\
  .sp-badge:hover .sp-tooltip { opacity: 1; }\
  .sp-powered { font-size: 10px; color: #9ca3af; text-align: right; padding-right: 4px; cursor: pointer; text-decoration: none; transition: color 0.15s; }\
  .sp-powered:hover { color: #059669; }\
  @media (max-width: 480px) {\
    .sp-badge-wrap { bottom: 12px; right: 12px; }\
    .sp-badge { font-size: 12px; padding: 7px 14px; }\
  }\
</style>\
<div class="sp-badge-wrap">\
  <a class="sp-badge" href="https://shipproof.netlify.app/" target="_blank" rel="noopener noreferrer">\
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>\
    Verified by ShipProof\
    <span class="sp-tooltip">This seller verifies all shipments</span>\
  </a>\
  <a class="sp-powered" href="https://shipproof.netlify.app/" target="_blank" rel="noopener noreferrer">Powered by ShipProof</a>\
  <button class="sp-close" aria-label="Close">&times;</button>\
</div>'

  // Close button handler
  var closeBtn = host.querySelector('.sp-close')
  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.preventDefault()
      e.stopPropagation()
      wrapper.remove()
      try { localStorage.setItem('__shipproof_hidden_' + SELLER, '1') } catch (e) { /* noop */ }
    })
  }

  // Inject after DOM ready
  function inject() {
    document.body.appendChild(wrapper)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject)
  } else {
    inject()
  }
})()
