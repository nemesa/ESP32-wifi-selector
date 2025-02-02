class MainViewModel {
    constructor() {

        this.ajaxHandler = new AjaxHandler();
        this.connectionInfo = new ConnectionInfoViewModel(this.ajaxHandler);

        this.menu = {
            home: {
                templateName: 'menu-home',
                viewModel: new MenuHomeViewModel()
            },
            connectToWifi: {
                templateName: 'menu-connect-to-wifi',
                viewModel: new MenuConnectToWifiViewModel(this.ajaxHandler, this.connectionInfo)
            },
            settings: {
                templateName: 'menu-settings',
                viewModel: new MenuSettingsViewModel(this.ajaxHandler, this.connectionInfo)
            },
            connectionInfo: {
                templateName: 'menu-connecion-info',
                viewModel: this.connectionInfo
            },
        }

        this.activeMenuTemplateName = ko.observable(null);
        this.activeMenuViewModel = ko.observable(null);


        this.setMenu = (menuItem) => {
            this.activeMenuTemplateName('menu-empty');
            this.activeMenuViewModel(menuItem.viewModel); //set VM first!!!
            this.activeMenuTemplateName(menuItem.templateName);

            menuItem.viewModel.afterMenuRequested();
        }

        this.setMenu(this.menu.home);

        this.afterInit = () => {

        }

    }


};