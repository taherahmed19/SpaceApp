const spaceViewer = document.querySelector('.space-viewer');

export function configureControls(viz) {
    if (spaceViewer) {
        configureFullScreenButton();
        configurePlayButton(viz);
        configurePauseButton(viz);
    }
}

function configureFullScreenButton() {
    const fullScreenButton = spaceViewer.querySelector('.space-viewer__item--fullscreen');

    if (fullScreenButton) {
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
}

function configurePlayButton(viz) {
    const playButton = spaceViewer.querySelector('.space-viewer__item--play');
    const pauseButton = spaceViewer.querySelector('.space-viewer__item--pause');

    if (playButton && pauseButton) {
        playButton.addEventListener("click", () => {
            pauseButton.classList.remove('hide');
            playButton.classList.add('hide');
            viz.start();
        })
    }
}

function configurePauseButton(viz) {
    const pauseButton = spaceViewer.querySelector('.space-viewer__item--pause');
    const playButton = spaceViewer.querySelector('.space-viewer__item--play');

    if (pauseButton && playButton) {
        pauseButton.addEventListener("click", () => {
            playButton.classList.remove('hide');
            pauseButton.classList.add('hide');
            viz.stop();
        })
    }
}