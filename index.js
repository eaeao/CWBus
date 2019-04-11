/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from "mobx-react/native";

import App from './app/App';
import MainStore from './app/store/mainStore';

const mainStore = new MainStore();

export default class CWBus extends Component {
  render() {
    return (
      <Provider mainStore={mainStore}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('CWBus', () => CWBus);