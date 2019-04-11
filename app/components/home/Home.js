import React, {Component} from "react";
import {AsyncStorage, FlatList, Text, View} from "react-native";
import {inject, observer} from "mobx-react/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'react-native-firebase';
import RouteHeader from "../route/route_header/RouteHeader";
import NoData from "../no_data/NoData";


@inject(["mainStore"])
@observer
export default class Home extends Component {
    constructor() {
        super();
        this.state = {};

        this.searchRoute = this.searchRoute.bind(this);
        this.removeFavorite = this.removeFavorite.bind(this);

        this.routeMenu = [
            {_name: '노선 보기', _function: this.searchRoute},
            {_name: '즐겨찾기 삭제', _function: this.removeFavorite},
        ];
    }

    render() {
        let favorites = this.props.mainStore.favorites ? this.props.mainStore.favorites.map(no => {
            let _bus = this.props.mainStore.data.buses.filter(bus => bus.no === no) || [];
            if (_bus.length > 0) return _bus[0];
        }) : [];
        return (
            <View>
                <FlatList
                    style={{height: "100%",paddingTop: 20, paddingLeft: 20, paddingRight: 20}}
                    data={favorites}
                    ListHeaderComponent={<View>
                        {this.props.mainStore.favorites === null ? firstVisitMsg : null}
                        {favorites.length === 0 ? <NoData icon={'bus-alert'} title={'추가된 노선이 없습니다.'}
                                                          message={'노선탭에서 원하시는 노선을 즐겨찾기에 추가해주세요.'} /> : null}
                    </View>}
                    ListFooterComponent={<View style={{paddingBottom: 20}} />}
                    renderItem={({item}) => <View style={{marginBottom: 20}}><RouteHeader route={item} menu={this.routeMenu} /></View>}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }

    componentDidMount(): void {
        if (!__DEV__) {
            firebase.analytics().setCurrentScreen('Home');
            firebase.analytics().logEvent(`Page`, {
                hitType: 'event',
                eventCategory: 'Page',
                eventAction: 'move_Home',
                eventLabel: 'Home'
            });
        }
    }

    searchRoute(self) {
        this.props.mainStore.setTabIndex(1);
        this.props.mainStore.setSearchedRoute(self.props.route);
        if (!__DEV__) {
            firebase.analytics().logEvent(`Event`, {
                hitType: 'event',
                eventCategory: 'Event',
                eventAction: `review_route_${self.props.route.no}`,
                eventLabel: `route_${self.props.route.no}`
            });
        }
    }

    removeFavorite(self) {
        setTimeout(async (_no) => {
            try {
                this.props.mainStore.removeFavorite(_no);
                await AsyncStorage.setItem('@CWBus:favorites', JSON.stringify(this.props.mainStore.favorites));
                if (!__DEV__) {
                    firebase.analytics().logEvent(`Event`, {
                        hitType: 'event',
                        eventCategory: 'Event',
                        eventAction: `remove_favorite_${self.props.route.no}`,
                        eventLabel: `favorite_${self.props.route.no}`
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }, 0, self.props.route.no);
    }
}

const firstVisitMsg = <View style={{
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: '#30336b',
    padding: 15,
    marginBottom: 20,
    overflow: 'hidden',
}}>
    <Icon name={'bus'} size={25} color={'#FFF'}/>
    <Text style={{color: '#FFF', marginLeft: 10}}>철원버스에 오신 것을 환영합니다!</Text>
</View>;