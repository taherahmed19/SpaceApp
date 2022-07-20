const spaceViewer = document.querySelector('.space-viewer');

export function configureControls(viz) {
    if (spaceViewer) {
        configureLayersButton();
        configureFullScreenButton();
        configurePlayButton(viz);
        configurePauseButton(viz);
        //configureZoomAsteroidButton(viz);
    }
}

function configureLayersButton() {
    const layersButton = spaceViewer.querySelector('.space-viewer__item--layers');
    const layersPanel = spaceViewer.querySelector('.space-viewer__layers');
    const controls = spaceViewer.querySelector('.space-viewer__controls')

    if (layersButton && layersPanel) {
        layersButton.addEventListener("click", () => {
            layersPanel.classList.toggle('active');
            controls.style.display = "none";
        })
    }

    const layersCloseButton = spaceViewer.querySelector('.space-viewer__close');
    if (layersCloseButton && controls) {
        layersCloseButton.addEventListener("click", () => {
            controls.style.display = "flex";
            layersPanel.classList.toggle('active');
        })
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

function configureZoomAsteroidButton(viz) {
    const zoomToAsteroidButton = document.querySelector('.space-viewer__item--hide-planets');

    if (zoomToAsteroidButton) {
        zoomToAsteroidButton.addEventListener("click", (e) => {
            let asteroidObjectPos = asteroidObject.getOrbit().getPositionAtTime(jd, false)
            console.log(asteroidObject.getOrbit());

            viz
                .getViewer()
                .get3jsCamera()
                .position.set(asteroidObjectPos[0], asteroidObjectPos[1], asteroidObjectPos[2]);

        })
    }
}