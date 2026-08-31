# Handoff OS Feed

Public data feed for Nir Levy's Handoff OS (iPhone work-phone automation).

- `feed/pins.json` — today's Pinterest pin content (caption, target URL, image URL) for the live Tier-1 Quizbiz domains. Regenerated daily.
- `feed/status.json` — portfolio uptime snapshot. Regenerated hourly.
- `standby-widget.js` — Scriptable (iOS) script that renders `feed/status.json` as a StandBy-mode widget.

No secrets or source code live here — just generated marketing/status content, intentionally public so Pushcut and Scriptable on the phone can fetch it without a token.

Source/generator: private repo `nnlevy/scripts`, folder `handoff-os/`.
