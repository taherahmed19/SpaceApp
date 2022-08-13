const notificationDisplayTime = 4000 //ms

export function showErrorNotification(message, notificationId, container) {
    if (container) {
        const notificationWrapper = container.querySelector('.notification-wrapper');

        if (notificationWrapper) {
            const existingNotification = notificationWrapper.querySelector(`[data-notification-id='${notificationId}']`);

            if (!existingNotification) {
                const template = `
                    <div class="notification" data-notification-id="${notificationId}">
                        <div class="notification__text-wrapper">
                            <p class="notification__title">${message}</p>
                        </div>
                        <button class="notification__close-btn js-notification-close" type="button">
                            <img src="/assets/images/close.svg"/>
                        </button>
                    </div>
                `;

                notificationWrapper.insertAdjacentHTML("afterbegin", template);

                const notificationTimeout = setTimeout(function () {
                    const existingNotification = notificationWrapper.querySelector(`[data-notification-id='${notificationId}']`);
                    if (existingNotification) {
                        existingNotification.remove();
                    }
                }, notificationDisplayTime);

                configureCloseButton(notificationId, notificationTimeout);
            }
        }
    } else {
        console.error(`Element error: ${container}`);
    }
}

export function showInfoNotification() {

}

function configureCloseButton(notificationId, notificationTimeout) {
    const closeBtn = document.querySelector('.js-notification-close');

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            const notificationElement = closeBtn.closest(`[data-notification-id='${notificationId}']`);

            if (notificationElement) {
                const textElement = notificationElement.querySelector('.notification__title');

                if (textElement && !notificationElement.classList.contains('d-none')) {
                    notificationElement.remove();
                    clearTimeout(notificationTimeout)
                }
            }
        })
    }
}