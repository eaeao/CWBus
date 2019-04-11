import React, {Component} from "react";
import {ActionSheetIOS, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {inject, observer} from "mobx-react/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from "react-native-firebase";

@inject(["mainStore"])
@observer
export default class RouteHeader extends Component {
    constructor() {
        super();
        this.state = {
            routeTime: '',
            isShownMenu: false
        };

        this.timTableList = null;
        this.clickMenu = this.clickMenu.bind(this);
        this.setIsShownMenu = this.setIsShownMenu.bind(this);
        this.getRouteTimeForNow = this.getRouteTimeForNow.bind(this);
    }

    render() {
        if(this.state.isShownMenu && !this.props.mainStore.isShownMenu) {
            this.setIsShownMenu(this.props.mainStore.isShownMenu);
        }

        return (
            <View style={styles.card}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.routeNo, {backgroundColor: this.props.mainStore.routeColorByStart[this.props.route.start]}]}>
                        {this.props.route.no}
                    </Text>
                    <Text style={styles.routeName}>{this.props.route.start} <Icon name={'dots-horizontal'} size={20} color={'#CCC'}/> {this.props.route.end}</Text>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuBtn}
                            onPress={this.clickMenu}>
                            <Icon name={'dots-vertical'} size={20} color={'#CCC'}/>
                        </TouchableOpacity>
                        {
                            this.state.isShownMenu
                                ? <View style={styles.menuContents}>
                                    {
                                        this.props.menu.map((ele, idx) => {
                                            return <TouchableOpacity style={[styles.menuContent, this.props.menu.length === idx+1 ? {borderBottomWidth: 0} : null]}
                                                                     key={idx}
                                                                     onPress={()=>{
                                                                         ele._function(this);
                                                                         this.setState({...this.state, isShownMenu: false});
                                                                         this.props.mainStore.setIsShownMenu(false);
                                                                         if (!__DEV__) {
                                                                             firebase.analytics().logEvent(`Click`, {
                                                                                 hitType: 'event',
                                                                                 eventCategory: 'Click',
                                                                                 eventAction: `click_RouteMenu (${ele._name})`,
                                                                                 eventLabel: `RouteMenu (${ele._name})`
                                                                             });
                                                                         }
                                                                     }}>
                                                <Text style={styles.menuContentText}>{ ele._name }</Text>
                                            </TouchableOpacity>
                                        })
                                    }
                                </View>
                                : null
                        }
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 10}}>
                    <View style={{flex: 0}}>
                        <Text style={[styles.passageTitle, {color: this.props.mainStore.routeColorByStart[this.props.route.start]}]}>주요경유지</Text>
                        {
                            this.props.route.passage.map((passage, idx) => <Text key={idx} style={styles.passageName}>{passage}</Text>)
                        }
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.routeTime}>{this.state.routeTime}</Text>
                    </View>
                </View>
                <FlatList
                    ref={ref=>{this.timTableList = ref}}
                    extraData={this.state.routeTime}
                    style={styles.routeTimes}
                    data={[...this.props.route.times]}
                    renderItem={({item, index}) => {
                        return <View style={{padding: 5}}>
                            <TouchableOpacity style={this.state.routeTime === item ? styles.routeTimesItemActive : null}
                                              onPress={e => {
                                                  this.setState({...this.state, routeTime: item}, () => {
                                                      setTimeout(() => { if(this.timTableList) this.timTableList.scrollToIndex({animated:true, index: index, viewPosition: 0.5}) }, 100);
                                                  });
                                                  if (!__DEV__) {
                                                      firebase.analytics().logEvent(`Click`, {
                                                          hitType: 'event',
                                                          eventCategory: 'Click',
                                                          eventAction: `click_RouteHeaderTime ${this.props.route.no}.${this.props.route.start} > ${this.props.route.end} (${item})`,
                                                          eventLabel: `RouteHeaderTime ${this.props.route.no}.${this.props.route.start} > ${this.props.route.end} (${item})`
                                                      });
                                                  }
                                              }}>
                                <Text style={styles.routeTimesItemText}>{item}</Text>
                            </TouchableOpacity>
                        </View>}
                    }
                    onScrollToIndexFailed={(e)=>{}}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    nestedScrollEnabled={true}
                />
            </View>
        );
    }

    componentDidMount(): void {
        let _thisTime = this.getRouteTimeForNow();
        this.setState({...this.state, routeTime: _thisTime, isShownMenu: false}, () => {
            let _idx = this.props.route.times.indexOf(_thisTime) > -1 ? this.props.route.times.indexOf(_thisTime) : 0;
            setTimeout(() => { if(this.timTableList) this.timTableList.scrollToIndex({animated:true, index: _idx, viewPosition: 0.5}) }, 500);
            this.props.mainStore.setIsShownMenu(false);
        });
        if (!__DEV__) {
            firebase.analytics().logEvent(`Load`, {
                hitType: 'event',
                eventCategory: 'Load',
                eventAction: `load_RouteHeader ${this.props.route.no}.${this.props.route.start} > ${this.props.route.end}`,
                eventLabel: `RouteHeader ${this.props.route.no}.${this.props.route.start} > ${this.props.route.end}`
            });
            firebase.analytics().logEvent(`Load`, {
                hitType: 'event',
                eventCategory: 'Load',
                eventAction: `load_RouteHeader ${this.props.route.no}.${this.props.route.start} > ${this.props.route.end} (${_thisTime})`,
                eventLabel: `RouteHeader ${this.props.route.no}.${this.props.route.start} > ${this.props.route.end} (${_thisTime})`
            });
        }
    }

    clickMenu(){
        Platform.select({
            ios: () => {
                ActionSheetIOS.showActionSheetWithOptions({
                        options: ['취소', ...this.props.menu.map(menu => menu._name)],
                        cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                        if (buttonIndex > 0) {
                            this.props.menu[buttonIndex-1]._function(this);
                        }
                    })
            },
            android: () => {
                this.setState({...this.state, isShownMenu: !this.props.mainStore.isShownMenu});
                this.props.mainStore.setIsShownMenu(!this.props.mainStore.isShownMenu);
            }
        })();
        if (!__DEV__) {
            firebase.analytics().logEvent(`Click`, {
                hitType: 'event',
                eventCategory: 'Click',
                eventAction: `click_RouteHeaderMenu`,
                eventLabel: `RouteHeaderMenu`
            });
        }
    }

    setIsShownMenu(_bool){
        setTimeout(() => {
            this.setState({...this.state, isShownMenu: _bool});
        }, 0);
    }

    getRouteTimeForNow(): string {
        const _routeTimes = this.props.route.times.filter(ele => {
            let _time = new Date();
            _time.setHours(ele.split(':')[0]);
            _time.setMinutes(ele.split(':')[1]);
            _time.setSeconds(0);
            return _time >= new Date();
        });
        return _routeTimes[0] || this.props.route.times[0];
    }
}

const styles = StyleSheet.create({
    card: {
        position: 'relative',
        width: '100%',
        minHeight: 40,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        backgroundColor: '#FFFFFF',
        paddingTop: 15,
        paddingHorizontal: 15,
    },
    routeNo: {
        backgroundColor: '#f9ca24',
        color: '#FFF',
        fontSize: 20,
        paddingHorizontal: 5,
        borderRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        overflow: 'hidden',
    },
    routeName: {
        marginLeft: 10,
        fontSize: 20,
        color: '#444',
    },
    menuContainer: {
        position: 'absolute',
        width: 30,
        height: 30,
        top: -5,
        right: -13,
    },
    menuBtn: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuContents: {
        position: 'absolute',
        width: 100,
        top: 20,
        left: -90,
        paddingVertical: 3,
        paddingHorizontal: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: '#f0f0f0',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 100
    },
    menuContent: {
        padding:5,
        borderBottomWidth: 1,
        borderBottomColor: '#fafafa'
    },
    menuContentText: {
        fontSize: 14,
        textAlign: 'center',
    },
    passageTitle: {
        color: '#f9ca24',
        textAlign: 'center',
        marginBottom: 3,
        borderRadius: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        overflow: 'hidden',
    },
    passageName: {
        lineHeight: 16,
        textAlign: 'center',
    },
    routeTime: {
        lineHeight: 70,
        fontSize: 60,
        color: '#444',
        textAlign: 'right',
    },
    routeTimes: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        borderBottomWidth: 0,
    },
    routeTimesItemActive: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        overflow: 'hidden',
    },
    routeTimesItemText: {
        fontSize: 20,
        color: '#444',
        marginVertical: 15,
        paddingHorizontal: 20,
        borderLeftWidth: 0,
        borderRightWidth: 1,
        borderRightColor: '#f0f0f0',
    }
});