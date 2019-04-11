import {action, observable} from "mobx";

export default class ObservableMainStore {
    @observable data = null;
    @observable tabIndex = 0;
    @observable favorites = null;

    @observable searchedRoute = null;
    @observable isShownKeyboard = false;
    @observable isShownMenu = false;

    @observable routeColorByStart = {'와수리': '#686de0', '신철원': '#f9ca24', '이평리': '#ff7979'};
    @observable routeColorByNo = {
        '1': this.routeColorByStart['신철원'], '2': this.routeColorByStart['이평리'], '3': this.routeColorByStart['신철원'],
        '4': this.routeColorByStart['와수리'], '7': this.routeColorByStart['신철원'], '8': this.routeColorByStart['신철원'],
        '9': this.routeColorByStart['이평리'], '10': this.routeColorByStart['이평리'], '11': this.routeColorByStart['이평리'],
        '12': this.routeColorByStart['이평리'], '13': this.routeColorByStart['이평리'], '14': this.routeColorByStart['와수리'],
        '15': this.routeColorByStart['와수리'], '16': this.routeColorByStart['와수리'], '17': this.routeColorByStart['와수리'],
        '18': this.routeColorByStart['와수리']
    };

    @action setData(_data) {
        this.data = _data;
    }

    @action setTabIndex(idx) {
        this.tabIndex = idx;
    }

    @action setFavorites(favorites) {
        this.favorites = favorites;
    }

    @action addFavorite(favorite) {
        if(!this.favorites) this.favorites = [];
        if (this.favorites.indexOf(favorite) < 0) {
            this.favorites.push(favorite);
        }
    }

    @action removeFavorite(favorite) {
        if(!this.favorites) this.favorites = [];
        let idx = this.favorites.indexOf(favorite);
        if (idx > -1) {
            this.favorites.splice(idx, 1);
        }
    }

    @action setSearchedRoute(_route) {
        this.searchedRoute = _route;
    }

    @action setIsShownKeyboard(_bool) {
        this.isShownKeyboard = _bool;
    }

    @action setIsShownMenu(_bool) {
        this.isShownMenu = _bool;
    }
}