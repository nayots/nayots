# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

GitHub-flavoured Markdown README rendered on <https://github.com/nayots>, plus
self-contained SVG images and one zero-dependency Node script run by a GitHub
Action. No framework, no build step for the page itself. (Confirmed in chat
2026-10-01: custom on-brand SVGs, no third-party stats services.)

## Users

- Recruiters, hiring managers and engineers who land on the GitHub profile from
  a CV, LinkedIn, a PR or a repository, and decide in seconds whether this
  person is worth a closer look.
- Fellow developers browsing from a repository they found useful
  (`ai-agent-usage-monitor`), checking who made it.

## Product Purpose

Introduce Stoyan Grigorov as a broad, hands-on software engineer, make the
nayots identity memorable, and route visitors to real work (public repos,
nayots.com) and a contact channel (LinkedIn). Success: a visitor remembers the
page an hour later and clicks through to at least one piece of work.

## Positioning

The profile is itself a crafted artifact in a personal identity system
(nayots: *a name rendered as luminous stardust*) rather than a generator-built
badge wall. Its live "year as a sky" is the owner's actual contribution
calendar, regenerated daily — something no template can copy.

## Operating Context

- Rendered by GitHub's Markdown pipeline; images through `<img>` via camo.
  SVGs may animate with CSS/SMIL but run no script and load nothing external.
- Viewed in GitHub light and dark themes, desktop (~830px content column) and
  mobile (~360–400px).

## Capabilities and Constraints

- Only public repositories may be named or linked: `ai-agent-usage-monitor`
  and older public repos. Private work is never mentioned.
- The stack is broad (.NET, AWS, frontend, infrastructure, AI). The owner
  explicitly does not want the page to focus on a stack inventory.
- Repository becomes public only after the finished README is on master.

## Brand Commitments

- nayots brand system (sibling repo `nayots_branding`, `BRAND.md`): marks are
  copied verbatim, never recreated; locked Ice·Gold palette on deep navy;
  Space Grotesk 700 lowercase, tracking −0.035em for brand display type;
  particle marks only on navy at ≥64px; flat marks get nothing added.
- Motto from the owner's GitHub bio: *ad astra per aspera*.
- nayots.com tagline: "software engineer · building things that scale."

## Evidence on Hand

- Name, location (Sofia, Bulgaria), site nayots.com, LinkedIn
  `linkedin.com/in/grigorov-stoyan`.
- Public project: AI Usage Monitor — Windows desktop widget showing live quota
  for Claude Code, Codex and Cursor; MIT; no telemetry.
- nayots.com — single-viewport particle wordmark landing page (~100k GPU
  particles).
- Live GitHub contribution calendar via GraphQL.
- No testimonials, employer names, metrics or certifications are provided;
  none may be invented.

## Product Principles

1. One identity, fully committed — every image belongs to the nayots sky.
2. Show, don't list — breadth as one composed image, never a logo wall.
3. Live over static — at least one element reflects real, current activity.
4. Only true things — no invented numbers, roles or claims.

## Accessibility & Inclusion

Every image carries meaningful alt text; animated SVGs honour
`prefers-reduced-motion`; text inside images meets contrast on navy and stays
legible at 360px wide.
