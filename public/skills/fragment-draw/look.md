# The look

The validator reads text. This is what only eyes can check. Do it every time the piece changes.

## The views

Open the built page, `fragment-<name>.html`, in a browser. Four parameters on its address make every view, and they join with `&`:

- `?at=` holds the piece still: a frame index for an illustration (0 is the first), a `t` from 0 to 1 for a field or a diagram.
- `?theme=light` or `?theme=dark` sets the theme, as the page's button does.
- `?w=320` narrows the page to 320px, the width of a phone's column.
- `?play=0` opens it paused.

| View | Address |
| --- | --- |
| rest | `?at=<rest>` (illustration), `?at=<still>` (field), `?at=0.3` (diagram) |
| light | the rest view `&theme=light` |
| dark | the rest view `&theme=dark` |
| narrow | the rest view `&w=320` |
| lap | the page as it opens, watched once from the start to the start again |
| frames | for an illustration, each frame in turn with the page's Next button |

Keep the window at least 800px wide for every view but the narrow one. Wait a second after loading before judging: the font loads, then the piece draws.

## What to see

Answer each with yes or no. A no is fixed in the piece before anything is handed over. Zoom when a line is too small to judge.

1. **It reads as Fragment at a glance.** Put it beside its nearest reference frame (`references/<name>.png`), or the example for its kind: the same type, the same weight of line, the same white. If it would look out of place on fragment.dev, it is a no.
2. **The rest view says the idea alone** (rule 09). Without playing it, you can say what the piece is about. The rest frame is the most complete one, not an empty start.
3. **One thing changes at a time** (rule 09). Step through the frames, or watch a lap: each step changes one small thing, and you can name it.
4. **Grey says what is first** (rule 04). The subject of the current step is `main`; what is waiting is `main-300` or `main-500`. Nothing is dimmed with opacity.
5. **Colour means an account** (rule 05). Every coloured mark is an account type, attention (orange) or code. Three accents at most in a frame.
6. **Centred, with the white kept** (rule 06). One composition, nothing within 20px of the plate's edge, the content spanning about half the width.
7. **Boxes and chevrons** (rule 07). Square corners, straight orthogonal lines, open chevrons; merges share a trunk.
8. **The words are real** (rule 10). Every label could appear in Fragment's product or docs: accounts, entries, calls, amounts with two decimals.
9. **Both themes.** In dark, every line, mark and word is still there and still means the same; nothing is left white on white or black on black.
10. **Narrow.** At 320px nothing is clipped, the type is still legible, and the idea still reads. An illustration shows its narrow set (the read-out says `narrow`), a diagram scales down whole, a field drops to 14px cells.
11. **The lap is calm.** A diagram's `$` moves one step at a time and then rests; a field breathes rather than flickers everywhere; an illustration's typing reads at the speed of a person typing, and its last frame holds long enough to read.
12. **The page is clean.** No error line under the controls, nothing on the console.

## Without a browser

Answer the same questions from the code, each with the line that makes it true: the `rest` or `still` for 2, the frame logic for 3, the tones for 4 and 5, the positions for 6. Then say at hand-over, in these words, that the piece was **not looked at in a browser**. Do not skip the list and do not guess a yes.
