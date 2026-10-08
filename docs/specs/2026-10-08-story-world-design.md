# Home page: "Signal → Product" story world

## Intent
Recruiters land on the home page and, by scrolling, watch how I work as an AI Product Manager: noise becomes
insight, insight becomes a plan, the plan becomes shipped products, products produce measurable outcomes.
No avatar. The story is told by one continuous 3D particle world the camera flies through.

## Chapters (scroll order)
| # | Chapter | Particles form | Camera | DOM text |
|---|---------|----------------|--------|----------|
| 0 | Noise (hero) | drifting storm | idle, mouse parallax | name, role, intro, CTAs, stats, location |
| 1 | Listen | ~26 tight clusters (people, teams) | dives between clusters | "Every product starts as noise." |
| 2 | Shape | constellation: nodes + glowing edges | slow orbit | "I find the shape in it." |
| 3 | Ship | outlines of floating case-study screens; real screenshots fade in | flies down the corridor | "Then I ship it." hover = lift + title, click = case study |
| 4 | Measure + AI | layered neural network, particles flowing along edges | pull-back | metrics |
| 5 | Build | the words LET'S BUILD | settles | CTAs |

After the story the cream sections slide over the world: Selected work (unchanged cards), companies marquee,
contact (shared footer).

## Mechanics
- One fixed `<canvas id="world">` (three.js) behind a transparent `.story`; later sections have their own
  background and cover it. Rendering pauses when the story is off screen.
- Scroll progress `p` (0–1) over `.story` drives both the camera (`z = 16 − 200p`, gentle sway) and the
  formation phase. Phase holds on each formation while its text is on screen, then morphs with per-particle
  stagger and turbulence.
- Each particle stores its position in all six formations as attributes; the vertex shader blends the two
  around the current phase. Network particles flow along their edge over time.
- Cursor: particles are pushed away from the pointer's 3D point; camera parallax; screens raycast for hover
  and click.
- Load: particles burst out from the centre as the curtain lifts.
- Mobile: fewer particles, narrower formations, tap to open screens. Reduced motion: no turbulence or sway.
- No WebGL: the story text still reads on the dark background.

## Files
- `assets/world.js`: the world (replaces `assets/gl.js`).
- `index.html`: story chapters, Selected work, marquee.
- `assets/site.css`: story styles replace the old stage styles.
- `assets/site.js`: `page:enter` fires as the curtain lifts (already done).
