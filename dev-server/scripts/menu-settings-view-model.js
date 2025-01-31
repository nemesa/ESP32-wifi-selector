class MenuSettingsViewModel {
    constructor(ajaxHandler) {
        this.ajaxHandler = ajaxHandler


        this.ap_ssid = ko.observable('');
        this.ap_password = ko.observable('');
        this.connect_to_ssid = ko.observable('');
        this.connect_to_password = ko.observable('');

        this.getSettings = async () => {
            const response = await this.ajaxHandler.settings();
            this.ap_ssid(response.ap_ssid);
            this.ap_password(response.ap_password);
            this.connect_to_ssid(response.connect_to_ssid);
            this.connect_to_password(response.connect_to_password);
        }

        this.onRefreshSettingsClicked = async () => {
            await this.getSettings()
        }


        this.onSaveSettingsClicked = async () => {
            const response = await this.ajaxHandler.saveSettings({
                ap_ssid: this.ap_ssid() || null,
                ap_password: this.ap_password() || null,
                connect_to_ssid: this.connect_to_ssid() || null,
                connect_to_password: this.connect_to_password() || null
            });

            if (response.success) {
                alert('Settings saved successfully');
            } else {
                alert('Failed to save settings');
            }
        }

        this.getSettings();
    }
};