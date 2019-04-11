import React, {Component} from "react";
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {inject, observer} from "mobx-react/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from "react-native-firebase";

@inject(["mainStore"])
@observer
export default class SearchResult extends Component {
    constructor() {
        super();
        this.state = {};

        this.onSelectedResult = this.onSelectedResult.bind(this);
    }

    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={this.onSelectedResult}>
                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                    <Text style={[styles.routeNo, {backgroundColor: this.props.mainStore.routeColorByStart[this.props.route.start]}]}>{ this.props.route.no }</Text>
                    <Text style={styles.routeInfo}>{
                        this.props.route.start
                    }<Icon name={'dots-horizontal'} size={12} color={'#CCC'}/>{
                        this.props.route.passage.join(', ')
                    }<Icon name={'dots-horizontal'} size={12} color={'#CCC'}/>{
                        this.props.route.end
                    }</Text>
                </View>
                { this.props.query !== ''
                    ? <Text style={{color: '#aaa', fontSize: 13}}>관련 경유지 : {
                    this.props.route.routes.map(ele=>ele.route).filter(route => {
                        return this.props.route.passage.includes(route)
                            || (this.props.query !== '' && route.includes(this.props.query))
                    }).map((route, idx) => {
                        return (this.props.query !== '' && route.includes(this.props.query))
                            ? <Text key={idx} style={{color: "#ff6992"}}>{ route } </Text>
                            : <Text key={idx}>{ route } </Text>;
                    })
                }</Text>
                    : null }
            </TouchableOpacity>
        );
    }

    onSelectedResult() {
        this.props.mainStore.setSearchedRoute(this.props.route);
        Keyboard.dismiss();
        setTimeout(() => { this.props.mainStore.setIsShownKeyboard(false); }, 0)
        if (!__DEV__) {
            firebase.analytics().logEvent(`Click`, {
                hitType: 'event',
                eventCategory: 'Click',
                eventAction: `click_SeachResult ${this.props.route.id}`,
                eventLabel: `SeachResult ${this.props.route.id}`
            });
            firebase.analytics().logEvent(`Search`, {
                hitType: 'event',
                eventCategory: 'Search',
                eventAction: `search_Query ${this.props.query}`,
                eventLabel: `Query ${this.props.query}`
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        marginHorizontal: 10
    },
    routeNo: {
        width: 35,
        backgroundColor: '#f9ca24',
        color: '#FFF',
        paddingHorizontal: 3,
        textAlign: 'center',
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
    }
});