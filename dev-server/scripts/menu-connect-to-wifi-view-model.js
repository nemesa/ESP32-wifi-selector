class MenuConnectToWifiViewModel {
    constructor(ajaxHandler) {
        self = this;
        this.ajaxHandler = ajaxHandler
        this.scanWifiNetworksButtonDisable = ko.observable(false);
        this.isTryToConnectToWifi = ko.observable(false);
        this.lastScanResults = ko.observableArray([]);

        this.transformWifiScanResultToViewModel = (response, onConnectCallback) => {
            if (response && response.networks && response.networks.length > 0) {

                const resultLookup = {}
                response.networks.forEach(network => {
                    const key = network.SSID + "_" + network.EncryptionType;
                    if (!resultLookup[key]) {
                        resultLookup[key] = network;
                    } else {
                        if (parseInt(network.RSSI) > parseInt(resultLookup[key].RSSI)) {
                            resultLookup[key] = network;
                        }
                    }
                });

                return Object.values(resultLookup).map((scanResult) => new WifiNetworkListItem(scanResult, onConnectCallback));
            }
            return [];
        }

        this.onConnectCallback = (ssid, encryptionType) => {
            console.log(this);
            let password = "";
            if (encryptionType !== "None") {
                password = prompt("Please enter the password for " + ssid, "");
            }
            if (password !== null) {
                this.isTryToConnectToWifi(true);
                this.lastScanResults.removeAll();
                this.ajaxHandler.connectoToNetwork(ssid, password).then((response) => {
                    console.log(response);
                }).finally(() => {
                    this.isTryToConnectToWifi(false);
                });
            }
        }

        this.scanWifiNetworks = async () => {
            try {
                this.lastScanResults.removeAll();
                this.scanWifiNetworksButtonDisable(true);
                this.isTryToConnectToWifi(false);
                const response = await this.ajaxHandler.scanWifi();
                // this.lastScanResults(this.transformWifiScanResultToViewModel(response, (ssid, encryptionType) => {
                //     this.onConnectCallback(ssid, encryptionType);
                // }));

                this.lastScanResults(this.transformWifiScanResultToViewModel(response, this.onConnectCallback));
            }
            catch (e) {
                console.log(e);
            }
            finally {
                this.scanWifiNetworksButtonDisable(false);
                this.isTryToConnectToWifi(false);
            }
        };
    }
};