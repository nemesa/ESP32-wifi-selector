class MainViewModel {
    constructor() {

        this.ajaxHandler = new AjaxHandler();

        this.menu = {
            startup: {
                templateName: 'menu-startup',
                viewModel: new MenuStartupViewModel()
            },
            connectToWifi: {
                templateName: 'menu-connect-to-wifi',
                viewModel: new MenuConnectToWifiViewModel(this.ajaxHandler)
            },
            settings: {
                templateName: 'menu-settings',
                viewModel: new MenuSettingsViewModel(this.ajaxHandler)
            }
        }

        this.activeMenuTemplateName = ko.observable(this.menu.startup.templateName);
        this.activeMenuViewModel = ko.observable(this.menu.startup.viewModel);

        this.setMenu = (menuItem) => {
            this.activeMenuTemplateName('menu-empty');
            this.activeMenuViewModel(menuItem.viewModel); //set VM first!!!
            this.activeMenuTemplateName(menuItem.templateName);
        }

    }


};