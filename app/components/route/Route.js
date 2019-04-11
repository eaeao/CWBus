import React, {Component} from "react";
import {AlertIOS, AsyncStorage, FlatList, Platform, ToastAndroid, View} from "react-native";
import {inject, observer} from "mobx-react/native";
import Svg, {Rect} from 'react-native-svg';
import firebase from "react-native-firebase";
import Search from "./search/Search"
import RouteHeader from "./route_header/RouteHeader";
import RouteStop from "./route_stop/RouteStop";
import NoData from "../no_data/NoData";

@inject(["mainStore"])
@observer
export default class Route extends Component {
    constructor() {
        super();
        this.state = {};

        this.addFavorite = this.addFavorite.bind(this);

        this.routeMenu = [
            {_name: '즐겨찾기 추가', _function: this.addFavorite}
        ];
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Search />
                {
                    this.props.mainStore.searchedRoute
                        ? <FlatList
                            style={{paddingTop: 78, paddingLeft: 20, paddingRight: 20}}
                            data={[...this.props.mainStore.searchedRoute.routes]}
                            ListHeaderComponent={<RouteHeader route={this.props.mainStore.searchedRoute} menu={this.routeMenu} />}
                            ListFooterComponent={<View style={{flexDirection: 'row', height: 90}}>
                                <Svg height="100%" width="50" style={{flex: 0}}>
                                    <Rect x="20" y="0" width="20" height="100%" fill="#D0D0D0" strokeWidth="0" stroke="rgb(0,0,0)"/>
                                    <Rect x="20" y="0" width="20" height="100%" fill="#D0D0D0" strokeWidth="0" stroke="rgb(0,0,0)"/>
                                </Svg>
                            </View>}
                            renderItem={({item}) => <RouteStop stop={item} />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        : <NoData style={{marginTop: 170}} icon={'magnify-close'} title={'검색된 노선이 없습니다.'}
                                  message={'검색창에서 원하시는 노선을 검색해주세요.'} />
                }
            </View>
        );
    }

    componentDidMount(): void {
        if (!__DEV__) {
            firebase.analytics().setCurrentScreen('Route');
            firebase.analytics().logEvent(`Page`, {
                hitType: 'event',
                eventCategory: 'Page',
                eventAction: 'move_Route',
                eventLabel: 'Route'
            });
        }
    }

    addFavorite(self) {
        setTimeout(async (_no) => {
            try {
                if (!this.props.mainStore.favorites || (this.props.mainStore.favorites && this.props.mainStore.favorites.indexOf(_no) < 0)) {
                    Platform.select({
                        ios: () => {
                            AlertIOS.alert('즐겨찾기에 추가하였습니다.');
                        },
                        android: () => {
                            ToastAndroid.showWithGravity(
                                '즐겨찾기에 추가하였습니다.',
                                ToastAndroid.SHORT,
                                ToastAndroid.CENTER,
                            );
                        }
                    })();
                    if (!__DEV__) {
                        firebase.analytics().logEvent(`Event`, {
                            hitType: 'event',
                            eventCategory: 'Event',
                            eventAction: `add_favorite_${_no}`,
                            eventLabel: `favorite_${_no}`
                        });
                    }
                } else {
                    Platform.select({
                        ios: () => {
                            AlertIOS.alert('이미 추가된 노선입니다.');
                        },
                        android: () => {
                            ToastAndroid.showWithGravity(
                                '이미 추가된 노선입니다.',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER,
                            );
                        }
                    })();
                    if (!__DEV__) {
                        firebase.analytics().logEvent(`Event`, {
                            hitType: 'event',
                            eventCategory: 'Event',
                            eventAction: `already_added_favorite_${_no}`,
                            eventLabel: `favorite_${_no}`
                        });
                    }
                }
                this.props.mainStore.addFavorite(_no);
                await AsyncStorage.setItem('@CWBus:favorites', JSON.stringify(this.props.mainStore.favorites));
            } catch (error) {
                console.error(error);
            }
        }, 0, self.props.route.no);
    }
}