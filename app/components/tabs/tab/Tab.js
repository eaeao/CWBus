import React, {Component} from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {inject, observer} from "mobx-react/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

@inject(["mainStore"])
@observer
export default class Tab extends Component {
    constructor() {
        super();
        this.state = {};

        this.clickTab = this.clickTab.bind(this);
    }

    render() {
        let isSelected = this.props.mainStore.tabIndex === this.props.index;
        return (
            <TouchableOpacity style={styles.tab} onPress={e => { this.clickTab(this.props.index) }}>
                <Icon name={this.props.tab.icon} size={28}
                      color={isSelected ? "#30336b" : "#CECEDB"}/>
                <Text style={[styles.tabText
                    , {color: isSelected ? "#30336b" : "#CECEDB"}]}>{this.props.tab.name}</Text>
            </TouchableOpacity>
        );
    }

    clickTab (idx) {
        this.props.mainStore.setTabIndex(idx)
    }
}

const styles = StyleSheet.create({
    tab: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    tabText: {
        fontSize: 12,
        fontWeight: "bold",
        marginTop: -3
    },
});