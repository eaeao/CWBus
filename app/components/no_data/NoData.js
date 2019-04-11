import React, {Component} from "react";
import {StyleSheet, View, Text} from "react-native";
import {inject, observer} from "mobx-react/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

@inject(["mainStore"])
@observer
export default class NoData extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <Icon name={this.props.icon} size={55} color={'rgba(0, 0, 0, 0.2)'}/>
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.message}>{this.props.message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        marginTop: 150,
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        marginTop: 20,
    },
    message: {
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        marginTop: 15,
        paddingHorizontal: 30
    }
});