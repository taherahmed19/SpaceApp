import { errorNotifications, infoNotifications } from "../data/notification-objects";

const notificationDisplayTime = 4000 //ms

/**
 * TODO: Extend to add showOnce logic if needed
 * @param {*} message 
 * @param {*} container 
 */
export function showErrorNotification(property, container) {
    if (container && errorNotifications.hasOwnProperty(property)) {
        const notificationData = errorNotifications[property];
        const id = notificationData.id;
        const message = notificationData.message;

        if (id && message) {
            const notificationWrapper = container.querySelector('.notification-wrapper');

            if (notificationWrapper) {
                const existingNotification = notificationWrapper.querySelector(`[data-notification-id='${id}']`);

                if (!existingNotification) {
                    const template = `
                        <div class="notification notification--error" data-notification-id="${id}">
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
                        const existingNotification = notificationWrapper.querySelector(`[data-notification-id='${id}']`);
                        if (existingNotification) {
                            existingNotification.remove();
                        }
                    }, notificationDisplayTime);

                    configureCloseButton(id, notificationTimeout);
                }
            }
        }

    } else {
        console.error(`Element error: ${container}`);
    }
}

export function showInfoNotification(property, container) {
    if (container && infoNotifications.hasOwnProperty(property)) {
        const notificationData = infoNotifications[property];
        const id = notificationData.id;
        const message = notificationData.message;
        const showOnce = notificationData.showOnce;
        const displayed = notificationData.displayed;

        if (showOnce && displayed == false) {
            notificationData.displayed = true;
            renderNotification()
        }

        function renderNotification() {
            const notificationWrapper = container.querySelector('.notification-wrapper');

            if (id && message && notificationWrapper) {
                const existingNotification = notificationWrapper.querySelector(`[data-notification-id='${id}']`);

                if (!existingNotification) {
                    const template = `
                        <div class="notification notification--info" data-notification-id="${id}">
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
                        const existingNotification = notificationWrapper.querySelector(`[data-notification-id='${id}']`);
                        if (existingNotification) {
                            existingNotification.remove();
                        }
                    }, notificationDisplayTime);

                    configureCloseButton(id, notificationTimeout);
                }
            }
        }

    } else {
        console.error(`Property error: ${container}`);
    }
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