class WifiNetworkListItem {
    constructor(scanResult, onConnectCallback) {
        this.ssid = scanResult.SSID;
        this.rssi = parseInt(scanResult.RSSI);
        this.encryptionType = scanResult.EncryptionType;
        this.onConnectClick = function () {
            if (onConnectCallback) {
                onConnectCallback(this.ssid, this.encryptionType);
            }
        }
    }
}