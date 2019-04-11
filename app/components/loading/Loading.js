import React, {Component} from "react";
import {Animated, StyleSheet, View} from "react-native";
import {inject, observer} from "mobx-react/native";
import firebase from 'react-native-firebase';
import axios from 'axios'

@inject(["mainStore"])
@observer
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            animatedValue: new Animated.Value(0.3),
            data: null,
            loaded: false,
        };

        this.getBusData = this.getBusData.bind(this);
    }

    render() {
        const animatedStyle = {
            transform: [{ scale: this.state.animatedValue}]
        }
        return (
            <View style={styles.container}>
                <Animated.Image
                    style={[styles.splash, animatedStyle]}
                    source={require('./ic_launcher.png')}
                />
            </View>
        );
    }

    componentDidMount() {
        if (__DEV__) {
            this.state.animatedValue.setValue(1);
            this.setState({...this.state, loaded: true}, () => {
                if (this.state.loaded && this.state.data) {
                    this.props.mainStore.setData(this.state.data);
                }
            });
        } else {
            firebase.analytics().setCurrentScreen('Loading');
            firebase.analytics().logEvent(`Page`, {
                hitType: 'event',
                eventCategory: 'Page',
                eventAction: 'move_Loading',
                eventLabel: 'Loading'
            });
            this.state.animatedValue.setValue(0.3);
            Animated.spring(this.state.animatedValue, {
                toValue: 1,
                friction: 3
            }).start(() => {
                this.setState({...this.state, loaded: true}, () => {
                    if (this.state.loaded && this.state.data) {
                        this.props.mainStore.setData(this.state.data);
                    }
                });
            })
        }
        this.getBusData();
    }

    async getBusData() {
        let {data} = await axios.get('https://jerrypark.me/cwbus/');
        this.setState({...this.state, data: data},() => {
            if (this.state.loaded && this.state.data) {
                this.props.mainStore.setData(this.state.data);
            }
        });
    }

}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: "#FFF",
        alignItems: 'center',
        justifyContent: 'center',
    },
    splash: {
        width: '50%',
        resizeMode: 'contain',
    }
});