class ConnectionInfoViewModel {
    constructor(ajaxHandler) {

        this.ajaxHandler = ajaxHandler
        this.doConnectionPolling = ko.observable(false);

        this.startPolling = () => {
            console.log("start polling");
            this.doConnectionPolling(true);
        }

        this.stopPolling = () => {
            console.log("stop polling");
            this.doConnectionPolling(false);
        }

        this.ipAddress = ko.observable('');

        this.hasIpAddress = ko.pureComputed(() => {
            if (this.doConnectionPolling() && this.ipAddress()) {
                return true;
            }
            return false;
        }, this);

        ko.computed(() => {
            if (this.doConnectionPolling()) {
                this.startPolling();
            }
            else {
                this.stopPolling();
            }
        }, this);

        this.inPoll = false;

        const interval = setInterval(() => {
            const doPolling = this.doConnectionPolling();
            if (doPolling) {
                try {
                    if (!this.inPoll) {
                        this.inPoll = true;
                        this.ajaxHandler.connectionInfo().then((response) => {
                            this.ipAddress(response.ipAddress);                            
                        }).catch((error) => {
                            console.log(error);
                        }).finally(() => {
                            this.inPoll = false;
                        });
                    }
                } catch (error) {
                    this.inPoll = false;
                }
            }
        }, 5000);

        this.killTimer = () => {
            clearInterval(interval);
        }
    }
};