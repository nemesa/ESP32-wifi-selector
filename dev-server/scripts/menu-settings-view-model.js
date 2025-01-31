class MenuSettingsViewModel {
    constructor(ajaxHandler) {        
        this.ajaxHandler = ajaxHandler
        this.settingsJson = ko.observable('');
        this.getSettings = function () {
            this.ajaxHandler.settings().then((response) => {
                this.settingsJson(JSON.stringify(response, null, 2));
            });
        }

        this.onRefreshSettingsClicked = function () {
            this.settingsJson('');
            this.getSettings();
        }


        this.getSettings();
    }
};