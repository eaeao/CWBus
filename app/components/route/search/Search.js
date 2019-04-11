import React, {Component} from "react";
import {BackHandler, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {inject, observer} from "mobx-react/native";
import {isIphoneX} from '../../../is-iphone-x';
import SearchResult from './search_result/SearchResult'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from "react-native-firebase";

@inject(["mainStore"])
@observer
export default class Search extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
        };

        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this.resetSearchedRoute = this.resetSearchedRoute.bind(this);
        this.cleanSearch = this.cleanSearch.bind(this);
    }

    render() {
        let filteredData = null;
        if (this.props.mainStore.isShownKeyboard) {
            filteredData = this.props.mainStore.data.buses.filter(bus => {
                let _no = bus.no.includes(this.state.query);
                let _start = bus.start.includes(this.state.query);
                let _routes = bus.routes.map(ele => ele.route).join(',').includes(this.state.query);
                let _end = bus.end.includes(this.state.query);
                return _no || _start || _routes || _end;
            })
        }
        return (
            <View style={[styles.container, this.props.mainStore.isShownKeyboard ? {height: '100%', paddingBottom: 20} : null]}>
                <View style={styles.card}>
                    <View style={{paddingHorizontal: 15}}>
                        {
                            this.props.mainStore.searchedRoute
                                ? <TouchableOpacity style={styles.resultLine} onPress={this.resetSearchedRoute}>
                                    <Text style={[styles.routeNo, {backgroundColor: this.props.mainStore.routeColorByStart[this.props.mainStore.searchedRoute.start]}]}>
                                        {this.props.mainStore.searchedRoute.no}
                                    </Text>
                                    <Text style={styles.routeInfo}>{
                                        this.props.mainStore.searchedRoute.start
                                    }<Icon name={'dots-horizontal'} size={12} color={'#CCC'}/>{
                                        this.props.mainStore.searchedRoute.passage.join(', ')
                                    }<Icon name={'dots-horizontal'} size={12} color={'#CCC'}/>{
                                        this.props.mainStore.searchedRoute.end
                                    }</Text>
                                </TouchableOpacity>
                                : <View style={styles.inputLine}>
                                    <Icon name={'magnify'} size={25} color={'#f9ca24'}/>
                                    <TextInput
                                        ref={ref => {
                                            this.searchInput = ref
                                        }}
                                        style={styles.inputs}
                                        onChangeText={query => this.setState({...this.state, query})}
                                        value={this.state.query}
                                        onFocus={this._keyboardDidShow}
                                        placeholder={`검색 (노선번호, 정류장명 등)`}/>
                                </View>
                        }
                        <TouchableOpacity style={styles.resultClean} onPress={this.cleanSearch}>
                            <Icon name={'close-circle'} size={26} color={'#CCC'}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.props.mainStore.isShownKeyboard
                        ? <View style={[styles.searchResult, isIphoneX() ? {marginBottom: 10} : null]}>
                            {
                                filteredData.length > 0
                                    ? <FlatList
                                        data={filteredData}
                                        renderItem={({item}) => <SearchResult route={item} query={this.state.query}/>}
                                        keyExtractor={(item, index) => index.toString()}
                                        keyboardDismissMode={'on-drag'}
                                        keyboardShouldPersistTaps={'always'}
                                    />
                                    : <Text style={styles.noData}>해당하는 노선이 없습니다.</Text>
                            }
                        </View>
                        : null
                }
            </View>
        );
    }

    componentDidMount(): void {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.props.mainStore.isShownKeyboard) {
                this.setState({...this.state, query: ''});
                this.props.mainStore.setIsShownKeyboard(false);
                setTimeout(() => {
                    if(this.searchInput) this.searchInput.blur();
                }, 0)
                return true;
            }
            return false;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    _keyboardDidShow(): void {
        setTimeout(() => {
            this.props.mainStore.setIsShownKeyboard(true);
            if (!__DEV__) {
                firebase.analytics().logEvent(`Click`, {
                    hitType: 'event',
                    eventCategory: 'Click',
                    eventAction: `click_Seach`,
                    eventLabel: `Search`
                });
            }
        }, 0)
    }

    resetSearchedRoute(): void {
        this.props.mainStore.setSearchedRoute(null);
        this.setState({...this.state, query: ''});
        setTimeout(() => {
            this.searchInput.focus();
            if (!__DEV__) {
                firebase.analytics().logEvent(`Click`, {
                    hitType: 'event',
                    eventCategory: 'Click',
                    eventAction: `click_SeachReset`,
                    eventLabel: `SearchReset`
                });
            }
        }, 0)
    }

    cleanSearch() {
        this.props.mainStore.setSearchedRoute(null);
        this.setState({...this.state, query: ''});
        this.props.mainStore.setIsShownKeyboard(false);
        setTimeout(() => {
            if(this.searchInput) this.searchInput.blur();
        }, 0)
        if (!__DEV__) {
            firebase.analytics().logEvent(`Click`, {
                hitType: 'event',
                eventCategory: 'Click',
                eventAction: `click_SeachClean`,
                eventLabel: `SeachClean`
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: "100%",
        height: 'auto',
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
        zIndex: 1,
    },
    card: {
        width: '100%',
        minHeight: 40,
        borderRadius: 7,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: "#000000",
                shadowOffset: {
                    width: 0,
                    height: 10,
                },
                shadowOpacity: 0.09,
                shadowRadius: 13
            },
            android: {
                borderBottomWidth: 3,
                borderBottomColor: 'rgba(0, 0, 0, 0.05)',
                borderRightWidth: 1,
                borderRightColor: 'rgba(0, 0, 0, 0.05)',
            },
        }),
    },
    inputLine: {
        width: "100%",
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#EEEEEE',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        overflow: 'hidden',
    },
    inputs: {
        width: '100%',
        paddingLeft: 5,
        flex: 0
    },
    resultLine: {
        width: "100%",
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#EEEEEE',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        overflow: 'hidden',
    },
    resultClean: {
        position: 'absolute',
        top:11,
        right:10,
    },
    routeNo: {
        backgroundColor: '#f9ca24',
        color: '#FFF',
        paddingHorizontal: 3,
        borderRadius: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        overflow: 'hidden',
    },
    routeInfo: {
        width: '100%',
        paddingVertical: 10,
        marginLeft: 5,
        flex: 0,
        color: '#444'
    },
    searchResult: {
        width: '100%',
        minHeight: '50%',
        borderRadius: 7,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        backgroundColor: '#FFFFFF',
        flex: 1,
        marginTop: 10,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: "#000000",
                shadowOffset: {
                    width: 0,
                    height: 10,
                },
                shadowOpacity: 0.09,
                shadowRadius: 13
            }
        }),
    },
    noData: {
        textAlign: 'center',
        marginTop: 30
    }
});