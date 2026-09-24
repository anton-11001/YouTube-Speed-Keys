# YouTube-Speed-Keys

Build a production-quality Chrome extension called "YouTube Speed Keys".

GOAL

The extension has exactly one responsibility:
change the playback speed of the currently active YouTube video using keyboard shortcuts.

Shortcuts:

- Alt+z -> 1x
- Alt+x -> 1.5x
- Alt+c -> 2x
- Alt+v -> 3x

The extension must work on:

- normal YouTube videos
- YouTube Shorts
- videos navigated to through YouTube's SPA navigation without a full page reload

Do not add unrelated functionality.

TECHNICAL APPROACH

Use:

- Chrome Extension Manifest V3
- Vanilla JavaScript
- No React
- No TypeScript unless it materially improves the implementation
- No npm dependencies
- No build system unless genuinely necessary

Prefer a directly loadable extension:
manifest.json
src/content.js
README.md

ARCHITECTURE

Use a content script running on:
https://www.youtube.com/*

The content script should listen for keyboard events and update the
playbackRate property of the active HTMLVideoElement.

Do NOT use:

- background/service worker
- popup
- options page
- Chrome storage
- injected page scripts
- MutationObserver unless there is a demonstrated need for it

YouTube is an SPA, but because the keyboard handler can resolve the
current video element at the moment the shortcut is pressed, there
should be no need to track navigation or retain references to video
elements.

IMPLEMENTATION

Create a constant configuration map:

const SPEED_SHORTCUTS = {
Digit1: 1,
Digit2: 1.5,
Digit3: 2,
Digit4: 3,
};

Register one keydown listener.

A shortcut is valid only when:

- event.altKey === true
- event.ctrlKey === false
- event.metaKey === false
- event.code exists in SPEED_SHORTCUTS

Use event.code rather than event.key so the shortcuts are based on
physical number keys and are less dependent on keyboard layout.

INPUT SAFETY

Do not trigger shortcuts when the user is typing.

Ignore events when the target is:

- input
- textarea
- select
- contenteditable
- inside an element with contenteditable enabled

Also ignore the event if event.defaultPrevented is already true.

VIDEO SELECTION

At shortcut execution time, find the appropriate HTMLVideoElement.

For normal YouTube usage:

document.querySelector('video.html5-main-video')

is preferred.

Provide a reasonable fallback to:

document.querySelector('video')

Do not cache the video element globally because YouTube can replace
video DOM nodes during SPA navigation.

If no video exists, do nothing and do not throw.

SPEED CHANGE

Set:

video.playbackRate = speed;

Do not simulate clicks on YouTube's UI.
Do not manipulate YouTube's internal React/state objects.
Use the standard HTMLMediaElement playbackRate API.

After setting the value, verify that video.playbackRate reflects the
requested speed.

Do not artificially restrict the speed to values exposed by YouTube's
UI. 3x should work through HTMLMediaElement.playbackRate even if the
YouTube menu does not expose it.

EVENT HANDLING

Call preventDefault() and stopPropagation() only after recognizing one
of our shortcuts.

Do not interfere with unrelated keyboard shortcuts.

Keep the keyboard handler small and delegate responsibilities to
functions such as:

getActiveVideo()
shouldIgnoreKeyboardEvent(event)
setPlaybackSpeed(speed)
handleKeyDown(event)

Avoid unnecessary abstractions/classes.

UX

When the speed changes, display a small temporary overlay:

"Speed: 1.5×"

Requirements:

- centered or near the top-center of the video
- visible for approximately 800ms
- pointer-events: none
- high z-index
- unobtrusive
- subsequent speed changes should update/reuse the same overlay instead
  of creating multiple DOM elements

Keep styling self-contained.

Do not depend on YouTube CSS classes for styling the overlay.

MANIFEST

Use Manifest V3.

Request the minimum permissions possible.

The extension should not need:

- tabs
- storage
- scripting
- activeTab
- webRequest
- host access outside YouTube

Configure the content script through manifest.json with:

matches:
https://www.youtube.com/*

Run at document_idle.

QUALITY REQUIREMENTS

The implementation should:

- be small
- have clear function names
- contain no dead code
- contain no speculative abstractions
- contain comments only where they explain a non-obvious decision
- fail silently if there is no video
- survive YouTube SPA navigation
- not interfere with normal YouTube keyboard controls
- not interfere with typing in comments/search/chat
- handle repeated key presses correctly

TEST MANUALLY

Verify:

1. Open a normal YouTube video.
2. Alt+z -> playbackRate === 1
3. Alt+x -> playbackRate === 1.5
4. Alt+c -> playbackRate === 2
5. Alt+v -> playbackRate === 3
6. Navigate to another video without refreshing -> shortcuts still work.
7. Open a YouTube Short -> shortcuts work.
8. Type in YouTube search -> shortcuts don't interfere.
9. Type a comment -> shortcuts don't interfere.
10. Use unrelated YouTube shortcuts -> behavior is unchanged.
11. Rapidly switch between speeds -> overlay and speed remain correct.
12. Reload the page -> extension initializes correctly.
13. Open a page without an active video -> no errors.

DELIVERABLE

Return the complete project, including:

youtube-speed-keys/
manifest.json
src/
content.js
README.md

README should contain exact Chrome installation instructions:

1. Open chrome://extensions
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the youtube-speed-keys directory

Do not overengineer the solution.
Do not introduce a framework or dependency for functionality that can
be implemented cleanly with browser APIs.
