import React, {Component} from "react";
import {AsyncStorage, BackHandler, Platform, StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {inject, observer} from "mobx-react/native";
import RNUxcam from 'react-native-ux-cam';
import {UXCamAPIKey} from './api_key';
import {isIphoneX} from './is-iphone-x';
import Loading from "./components/loading/Loading"
import Tabs from "./components/tabs/Tabs"
import Home from "./components/home/Home"
import Route from "./components/route/Route"

const views = [<Home />, <Route />];
RNUxcam.startWithKey(UXCamAPIKey);

@inject(["mainStore"])
@observer
export default class App extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return <TouchableWithoutFeedback disabled={!this.props.mainStore.isShownMenu}
                                         onPress={()=>{ this.props.mainStore.setIsShownMenu(false); }}>
            {
                this.props.mainStore.data
                    ? <View style={[styles.container, isIphoneX() ? {paddingTop: 25} : null]}>
                        <View style={{flex: 1}}>{views[this.props.mainStore.tabIndex]}</View>
                        {!this.props.mainStore.isShownKeyboard ? <Tabs style={{flex: 0}} /> : null}
                    </View>
                    : <Loading />
            }
        </TouchableWithoutFeedback>;
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.props.mainStore.isShownMenu) {
                this.props.mainStore.setIsShownMenu(false);
                return true;
            }
            return false;
        });

        setTimeout(async (_no) => {
            try {
                let favorite = await AsyncStorage.getItem('@CWBus:favorites');
                this.props.mainStore.setFavorites(JSON.parse(favorite));
            } catch (error) {
                // Error saving data
            }
        }, 0);
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }
}

const styles = StyleSheet.create({
    container: {
        ...Platform.select({
            ios: {
                paddingTop: 15
            },
            android: {
                paddingTop: 0
            },
        }),
        height: "100%",
        backgroundColor: "#ecf0f1"
    },
});