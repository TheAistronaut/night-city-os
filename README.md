# NIGHT CITY OS

Personal gamified habit and training tracker. Single user, offline, no backend.

## Files

```
index.html              the entire app — markup, styles, logic, fonts
manifest.webmanifest    PWA metadata
sw.js                   service worker (must stay at the repo root)
icons/                  app icons
```

Fonts are inlined into `index.html` as base64, so the app makes no
network requests at runtime. Rajdhani and Orbitron are SIL Open Font
License; the licence text is in `fonts/OFL.txt` if you keep that folder.

## Deploying

Push to the repo, then Settings → Pages → deploy from branch.

Every path in the app is relative, so it works from a project subpath
(`user.github.io/repo/`) with no configuration. Do not move `sw.js` into
a subfolder — a service worker can only control pages at or below its own
directory.

## Installing to the phone

Open the Pages URL in Safari → Share → Add to Home Screen.

Install it rather than using it in a browser tab. Safari clears
script-writable storage after roughly seven days of no interaction for
ordinary sites; installed home-screen apps are exempt, and the app also
asks for persistent storage on launch. CONFIG → DATA shows whether that
was granted.

## Shipping an update

1. Edit `index.html`.
2. Bump `CACHE` in `sw.js` — `ncos-v1` → `ncos-v2`.
3. Push.

The running app checks for a new worker whenever it returns to the
foreground. When one is ready it shows a RELOAD prompt rather than
swapping code mid-tap. **If you skip step 2 the old version keeps
serving from cache.**

## Training

TRAINING → PLAN builds the exercise library. Each exercise declares what
it measures — weight and reps, reps only, distance and time, or duration
— so lifting, calisthenics, running and classes all work without a
schema change. Routines are named groups of exercises.

Nothing is preloaded. The repo is public, so no exercise or contract is
hardcoded.

A session in progress is written to storage on every change, so a locked
phone or a reload mid-workout loses nothing.

**Feeding XP.** Sessions do not award XP directly. Create a contract in
CONFIG with the TRAINING flag set, point a routine at it, and finishing a
session clears that contract at its tier value. Contracts flagged this
way cannot be tapped by hand.

## Backups

CONFIG → DATA → DOWNLOAD JSON. Do it monthly.

Browser storage can be evicted; installing to the home screen reduces
that risk substantially but does not eliminate it. The export is the
only real backup. It is also the migration path between devices, and
between the Claude artifact and this build — the two use different
storage backends and cannot see each other's data.

## Calibration

`LEVEL_CONSTANT` is 40, which assumes roughly 70 XP a day. After about
thirty days of real use, compare your actual average against that and
adjust the constant once. Do not tune it before there is data.
