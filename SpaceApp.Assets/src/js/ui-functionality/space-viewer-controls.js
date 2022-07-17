const spaceViewer = document.querySelector('.space-viewer');

if (spaceViewer) {
    const fullScreenButton = spaceViewer.querySelector('.space-viewer__item--fullscreen');

    fullScreenButton.addEventListener("click", () => {
        if (document.fullscreenElement == null) {
            if (spaceViewer.requestFullscreen) {
                spaceViewer.requestFullscreen();
            } else if (spaceViewer.webkitRequestFullscreen) { /* Safari */
                spaceViewer.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            }
        }
    })
}
