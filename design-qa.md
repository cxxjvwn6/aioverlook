# Design QA — Glass / Neumorphic Blend

## Evidence

- Source visual truth:
  - `C:/Users/choco/AppData/Local/Temp/codex-clipboard-4f1148ee-c7ad-40e3-81d6-f65379a45f7c.png` — 841 × 1200 px, pale blue editorial grid and coral accent.
  - `C:/Users/choco/AppData/Local/Temp/codex-clipboard-3247356e-1d15-46ef-ab48-2452030a8841.png` — 736 × 736 px, rounded inset controls and soft monochrome depth.
  - `C:/Users/choco/AppData/Local/Temp/codex-clipboard-3acf103b-9220-4fd2-9fc5-fc1d94082f17.png` — 1200 × 1689 px, translucent glass panels and elevated navigation.
- Browser-rendered implementation:
  - `qa-glass/01-home-390.jpg` — 390 × 1491 px, CSS viewport 390 × 844, DPR 1.
  - `qa-glass/02-result-390.jpg` — 375 × 2589 px content capture, CSS viewport 390 × 844, DPR 1; 15 px browser scrollbar excluded from content width.
  - `qa-glass/03-home-1440.jpg` — 1425 × 1474 px content capture, CSS viewport 1440 × 1000, DPR 1.
  - `qa-glass/04-comparison.jpg` — combined source/reference and implementation evidence, 1620 × 1600 px.
- States: empty home, selected gender, validation error, loading, populated result, owner logged out, invalid password, owner authenticated, filtered owner table, logged out again.
- Density normalization: comparison board scales each source and implementation proportionally into labeled slots; no fidelity finding is based on browser chrome or density differences.

## Findings

- No actionable P0/P1/P2 findings remain.
- Typography: the dense black Korean display type, narrow uppercase system labels, and restrained body copy preserve the references' editorial hierarchy without clipped text.
- Spacing and layout: mobile uses a single readable column with 44 px or larger tap targets; desktop resolves to a centered 920 px work area. No horizontal overflow was found at 390 px or 1440 px.
- Colors and tokens: pale ice blue, charcoal, translucent white, coral, violet, and mint consistently blend the three sources. Glass blur and neumorphic inset/raised shadows remain subtle enough for legibility.
- Image quality and assets: the references are interface-only and contain no required product photography or brand illustration. Existing Lucide icons remain consistent with the product codebase; no placeholder raster assets were introduced.
- Copy and content: Korean task copy remains clear, while compact English specification labels preserve the established lab-system identity.
- Interaction and accessibility: focus indicators, form labels, password masking, error announcement, reduced motion, selected states, sharing feedback, and 44 px minimum controls are present. All active buttons were exercised in the browser.

## Comparison History

1. Initial implementation used strict black-and-white industrial panels and square controls, a P1 mismatch against the new translucent, rounded references.
   - Fix: replaced the surface tokens with pale blue glass, backdrop blur, soft inset/raised shadows, 18–30 px radii, and restrained coral/violet/mint accents.
   - Post-fix evidence: `qa-glass/04-comparison.jpg` shows the new implementation carries the first reference's editorial grid, the second reference's soft controls, and the third reference's layered glass depth.
2. The old bottom navigation exposed disabled buttons, a P2 interaction/affordance issue for the request that every button work.
   - Fix: converted non-routes to non-interactive status labels; every remaining button now has a working action.
   - Post-fix evidence: browser DOM audit found eight enabled buttons and no disabled or actionless buttons on the home screen; the complete name-analysis and owner flows passed.

## Primary Interactions Tested

- Empty submission validation.
- Both name inputs and all gender selections.
- Analysis request, loading state, result rendering, back to form.
- Share action invocation and same-combination re-analysis implementation.
- Easter egg: 14 logo taps remain on `/`; tap 15 opens `/owner`.
- Owner route before login contains only one password input and no raw names.
- Invalid password rejection, valid password login, row loading, name filtering, logout, and post-logout data removal.
- Current browser logs after the final stylesheet reload contain no runtime errors; the only captured errors were transient hot-reload messages during the atomic stylesheet replacement and were cleared by the successful reload/build.

## Follow-up Polish

- P3: On devices without a native share sheet, the clipboard confirmation can be made more prominent in a later iteration.
- P3: Supabase leaked-password protection should be enabled in the dashboard when the plan supports it.

## Final Result

final result: passed
