# YouTube Speed Keys

![YouTube Speed Keys icon](icons/icon-128.png)

A small Chrome extension that changes the playback speed of the active YouTube video with keyboard shortcuts. It works with regular videos, YouTube Shorts, and videos opened through YouTube's in-page navigation.

## Shortcuts

| Shortcut | Playback speed |
| --- | ---: |
| <kbd>Alt</kbd> + <kbd>X</kbd> | 1&times; |
| <kbd>Alt</kbd> + <kbd>C</kbd> | 1.5&times; |
| <kbd>Alt</kbd> + <kbd>V</kbd> | 2&times; |
| <kbd>Alt</kbd> + <kbd>B</kbd> | 3&times; |

Shortcuts use the physical X, C, V, and B keys. They are ignored while typing in search fields, comments, chat, and other editable controls.

## Install in Chrome

1. Open chrome://extensions
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the youtube-speed-keys directory

Open or reload a YouTube page after installing the extension.

## How it works

The extension runs only on `https://www.youtube.com/*`. When a supported shortcut is pressed, it asks YouTube's player to change its playback rate so the selected speed is also reflected in YouTube's playback-speed menu. It then briefly displays the selected speed near the top-center of the video.

The 3&times; shortcut requires 3&times; playback to be available for the current YouTube account and video.

It does not use a background worker, popup, storage, or extra Chrome permissions.

## Manual verification

1. Open a regular YouTube video, try all four shortcuts, and confirm the selected rate in YouTube's playback-speed menu.
2. Navigate to another video without refreshing and try them again.
3. Open a YouTube Short and verify the shortcuts work.
4. Type in YouTube search, a comment, or chat and verify the shortcuts do not interfere.
5. Try unrelated YouTube shortcuts and verify their behavior is unchanged.
6. Switch rapidly between speeds and verify one overlay shows the final speed.
7. Reload the page and verify the shortcuts initialize correctly.
8. Open a YouTube page without a video and confirm shortcut presses cause no errors.
9. Enter fullscreen playback and verify the overlay remains visible.
