import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {inject, observer} from "mobx-react/native";
import Svg, {Circle, Rect} from 'react-native-svg';

@inject(["mainStore"])
@observer
export default class RouteStop extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={styles.line}>
                <Svg height="100%" width="50" style={{flex: 0}}>
                    <Rect x="20" y="0" width="20" height="100%" fill="#D0D0D0" strokeWidth="0" stroke="rgb(0,0,0)"/>
                    <Circle cx="30" cy="25" r="18" strokeWidth="0" fill="#D0D0D0"/>
                    <Circle cx="30" cy="25" r="10" strokeWidth="0" fill="#FFF"/>
                </Svg>
                <View style={styles.stop}>
                    <View style={{flexDirection: 'row', marginBottom: 5}}>
                        <Text style={styles.stopName}>{this.props.stop.route}</Text>
                    </View>
                    <View style={styles.stops}>
                        {
                            this.props.stop.no.map(no => {
                                return <Text key={no} style={[styles.stopNo, {backgroundColor: this.props.mainStore.routeColorByNo[no.split('-')[0]]}]}>{no}</Text>
                            })
                        }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    line: {
        flexDirection: 'row',
        minHeight: 50,
    },
    stop: {
        flex: 1,
        paddingTop: 12,
        paddingLeft: 5
    },
    stopName: {
        fontSize: 16,
        flex: 0,
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        backgroundColor: '#FFF',
        overflow: 'hidden',
    },
    stops: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection:'row',
    },
    stopNo: {
        width: 28,
        lineHeight: 28,
        marginRight: 3,
        marginBottom: 3,
        borderRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor: '#AAA',
        color: '#FFF',
        textAlign: 'center',
        letterSpacing: -1,
        overflow: 'hidden',
    }
});