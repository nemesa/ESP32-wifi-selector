class MenuSettingsViewModel {
    constructor(ajaxHandler, connectionInfo) {
        this.ajaxHandler = ajaxHandler
        this.connectionInfo = connectionInfo;
        this.isLoaderVisible = ko.observable(false);


        this.ap_ssid = ko.observable('');
        this.ap_password = ko.observable('');
        this.connect_to_ssid = ko.observable('');
        this.connect_to_password = ko.observable('');

        this.getSettings = async () => {
            this.isLoaderVisible(true);
            try {
                const response = await this.ajaxHandler.settings();
                this.ap_ssid(response.ap_ssid);
                this.ap_password(response.ap_password);
                this.connect_to_ssid(response.connect_to_ssid);
                this.connect_to_password(response.connect_to_password);

                if (response.connect_to_ssid) {
                    this.connectionInfo.doConnectionPolling(true);
                }

                
                Toastify({
                    text: "Settings loaded successfully",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
            }
            catch (e) { 
                Toastify({
                    text: "ERROR! Failed to load settings",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
            }
            finally {
                this.isLoaderVisible(false);
            }
        }

        this.onRefreshSettingsClicked = async () => {
            await this.getSettings()
        }

        this.onDisconnectClicked = async () => {
            this.connect_to_password(null);
            this.connect_to_ssid(null);
            await this.onSaveSettingsClicked();
        }


        this.onSaveSettingsClicked = async () => {
            await this.ajaxHandler.saveSettings({
                ap_ssid: this.ap_ssid() || null,
                ap_password: this.ap_password() || null,
                connect_to_ssid: this.connect_to_ssid() || null,
                connect_to_password: this.connect_to_password() || null
            });

            if (this.connect_to_ssid() || null) {
                this.connectionInfo.doConnectionPolling(true);
            }
            else {
                this.connectionInfo.doConnectionPolling(false);
            }

        }

        this.getSettings();

        this.getPasswordInputType = (isVisible) => {
            return isVisible ? 'text' : 'password';
        }

        this.connect_to_password_visible = ko.observable(false);
        this.connect_to_password_type_attr = ko.pureComputed(() => {
            return this.getPasswordInputType(this.connect_to_password_visible());
        }, this);

        this.ap_password_visible = ko.observable(false);
        this.ap_password_type_attr = ko.pureComputed(() => {
            return this.getPasswordInputType(this.ap_password_visible());
        }, this);

        this.afterMenuRequested = () => {
            this.getSettings();
        }
    }
};