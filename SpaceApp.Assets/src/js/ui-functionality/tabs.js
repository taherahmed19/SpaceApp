export default function addTabsEventListeners() {
    const tabs = document.querySelectorAll('[data-tabs-source]');
    const tabPanes = document.querySelectorAll('[data-tabs-target]');
    
    if (tabs && tabPanes) {
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const tabId = tab.getAttribute("data-tabs-source");
                const itemToShow = tabId && document.querySelector(`[data-tabs-target='${tabId}']`);
    
                if (itemToShow) {
                    tabs.forEach(tab => { tab.classList.remove('active') });
                    tab.classList.add('active');
    
                    tabPanes.forEach(tabPane => { tabPane.classList.remove('active') });
                    itemToShow.classList.add('active');
                }
            })
        })
    }
}

addTabsEventListeners();