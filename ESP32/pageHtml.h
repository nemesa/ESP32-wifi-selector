const char app_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<meta name="viewport" content="width=device-width, initial-scale=1">

<head>

    <script src="/ko.js"></script>
    <script type="text/javascript">

        function transformWifiScanResultToViewModel(response, onConnectCallback) {
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

        class AjaxHandler {
            constructor() {

            }

            async scanWifiNetworks() {
                const response = await fetch('/scan-wifi', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                //console.log(response);
                return response.json();
            }

            async connectoToNetwork(ssid, password) {
                const response = await fetch('/connect-wifi', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ssid: ssid,
                        password: password
                    })
                });
                //console.log(response);
                return response.json();
            }
        }


        class MainViewModel {
            constructor() {
                this.ajaxHandler = new AjaxHandler();
                this.scanWifiNetworksButtonDisable = ko.observable(false);
                this.isTryToConnectToWifi = ko.observable(false);
                this.lastScanResults = ko.observableArray([]);

                this.onConnectCallback = function (ssid, encryptionType) {
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

                this.scanWifiNetworks = function () {
                    this.lastScanResults.removeAll();
                    this.scanWifiNetworksButtonDisable(true);
                    this.isTryToConnectToWifi(false);
                    this.ajaxHandler.scanWifiNetworks().then((response) => {
                        this.lastScanResults(transformWifiScanResultToViewModel(response, (ssid, encryptionType) => {
                            this.onConnectCallback(ssid, encryptionType);
                        }));
                    }).finally(() => {
                        this.scanWifiNetworksButtonDisable(false);
                    });
                };

            }


        };

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

    </script>

    <script type="text/html" id="wifi-network-rssi-value">
        <!-- <span data-bind="text: $data"></span> dBm -->
    <!-- ko if: $data >= -30 -->
    <span>Amazing</span>
    <!-- /ko -->

    <!-- ko if: -70 <= $data &&  $data < -30 -->
    <span>Excellent</span>
    <!-- /ko -->

    <!-- ko if: -85 <= $data && $data < -70 -->
    <span>Good</span>
    <!-- /ko -->

    <!-- ko if: -100 <= $data && $data < -85 -->
    <span>Fair</span>
    <!-- /ko -->

    <!-- ko if: $data < -100 -->
    <span>Poor</span>
    <!-- /ko -->
    </script>

    <script type="text/html" id="wifi-network-list-item">
            <td data-bind="text: ssid"></td>            
            <td style="width: 50px;" data-bind="template: { name: 'wifi-network-rssi-value', data: rssi }"></td>
            <td data-bind="text: encryptionType" style="width: 150px;"></td>        
            <td style="width: 50px;"><button style="height: 30px;" data-bind="click:onConnectClick">Connect</button></td>        
    </script>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }

        th,
        td {
            text-align: left;
            padding: 12px 5px;
        }

        tr:nth-child(even) {
            background-color: #D6EEEE;
        }
    </style>
    <script type="text/javascript">
        function init() {
            if (ko) {
                document.getElementById("main-app").style.display = "block";
                document.getElementById("ko-js-error").style.display = "none";
                const mainViewModel = new MainViewModel();
                ko.applyBindingsToDescendants(mainViewModel, document.getElementById("main-app"));
                mainViewModel.scanWifiNetworks();
            }
        }
    </script>
</head>

<body onload="init()">
    <div id="main-app" style="display: none;">
        <div>
            <button
                data-bind='click: scanWifiNetworks, disable: scanWifiNetworksButtonDisable'>scanWifiNetworks</button>
        </div>
        <div data-bind="ifnot: isTryToConnectToWifi()">
            <table>
                <thead>
                    <tr>
                        <th>SSID</th>
                        <th>Signal</th>
                        <th>Encryption Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody data-bind="foreach: lastScanResults">
                    <tr data-bind="template: { name: 'wifi-network-list-item', data: $data }"></tr>
                </tbody>
            </table>
        </div>
        <div data-bind="if: isTryToConnectToWifi()">
            Trying to connect to wifi network...
        </div>
    </div>
    <div id="ko-js-error" style="display: block;">
        knockout.js is not loaded...
    </div>
</body>

</html>
)rawliteral";