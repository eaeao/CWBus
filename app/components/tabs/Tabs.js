import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import {inject, observer} from "mobx-react/native";
import {isIphoneX} from '../../is-iphone-x';
import Tab from "./tab/Tab"

@inject(["mainStore"])
@observer
export default class Tabs extends Component {
    constructor() {
        super();
        this.state = {
            tabs: [
                {icon: 'home', name: '홈'},
                {icon: 'bus', name: '노선'},
            ]
        };
    }

    render() {
        return (
            <View style={[styles.tabs, isIphoneX() ? {height: 75, paddingBottom: 20} : null]}>
                {
                    this.state.tabs.map((ele, idx) => {
                        return <Tab key={idx} index={idx} tab={ele} />
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        height: 55,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: -10,
        },
        shadowOpacity: 0.07,
        shadowRadius: 30,
        elevation: 10
    },
});