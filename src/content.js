(function () {
  "use strict";

  const SPEED_SHORTCUTS = Object.freeze({
    KeyX: 1,
    KeyC: 1.5,
    KeyV: 2,
    KeyB: 3,
  });

  const OVERLAY_DURATION_MS = 800;

  let speedOverlay;
  let overlayTimeoutId;

  function getActiveVideo() {
    return (
      document.querySelector("video.html5-main-video") ??
      document.querySelector("video")
    );
  }

  function isEditableElement(value) {
    if (!(value instanceof Element)) {
      return false;
    }

    return Boolean(
      value.closest("input, textarea, select") ||
        value.isContentEditable ||
        value.closest('[contenteditable]:not([contenteditable="false"])'),
    );
  }

  function shouldIgnoreKeyboardEvent(event) {
    if (event.defaultPrevented) {
      return true;
    }

    return event.composedPath().some(isEditableElement);
  }

  function getSpeedOverlay() {
    if (speedOverlay?.isConnected) {
      return speedOverlay;
    }

    speedOverlay = document.createElement("div");
    speedOverlay.setAttribute("role", "status");
    speedOverlay.setAttribute("aria-live", "polite");
    Object.assign(speedOverlay.style, {
      position: "fixed",
      padding: "8px 12px",
      borderRadius: "6px",
      background: "rgba(0, 0, 0, 0.78)",
      color: "#fff",
      font: "600 16px/1.25 Arial, sans-serif",
      pointerEvents: "none",
      transform: "translateX(-50%)",
      transition: "opacity 120ms ease",
      zIndex: "2147483647",
    });

    return speedOverlay;
  }

  function showSpeedOverlay(video, speed) {
    const overlay = getSpeedOverlay();
    const fullscreenElement = document.fullscreenElement;
    const isVideoFullscreen = fullscreenElement?.contains(video) ?? false;
    const overlayParent = isVideoFullscreen ? fullscreenElement : document.body;

    if (!overlayParent) {
      return;
    }

    if (overlay.parentElement !== overlayParent) {
      overlayParent.append(overlay);
    }

    if (isVideoFullscreen) {
      overlay.style.left = "50%";
      overlay.style.top = "24px";
    } else {
      const videoRect = video.getBoundingClientRect();
      const horizontalCenter = videoRect.left + videoRect.width / 2;

      overlay.style.left = `${horizontalCenter}px`;
      overlay.style.top = `${Math.max(videoRect.top + 24, 16)}px`;
    }

    overlay.textContent = `Speed: ${speed}\u00D7`;
    overlay.style.opacity = "1";

    window.clearTimeout(overlayTimeoutId);
    overlayTimeoutId = window.setTimeout(() => {
      overlay.style.opacity = "0";
    }, OVERLAY_DURATION_MS);
  }

  function setPlaybackSpeed(speed) {
    const video = getActiveVideo();

    if (!video) {
      return;
    }

    try {
      const player = video.closest(".html5-video-player");

      if (typeof player?.setPlaybackRate === "function") {
        player.setPlaybackRate(speed);
      } else {
        video.playbackRate = speed;
      }

      if (video.playbackRate === speed) {
        showSpeedOverlay(video, speed);
      }
    } catch {
      // YouTube can reject a rate that is unavailable for the current account.
    }
  }

  function handleKeyDown(event) {
    const speed = SPEED_SHORTCUTS[event.code];

    if (
      speed === undefined ||
      !event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      shouldIgnoreKeyboardEvent(event)
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setPlaybackSpeed(speed);
  }

  document.addEventListener("keydown", handleKeyDown, true);
})();
