/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-24 18:39:02
 * @Last Modified by: qiuz
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import './index.less';

import { registerMicroApps, start, initGlobalState, runAfterFirstMounted } from 'qiankun';
import { HeaderBar } from 'components';

import { MENU_LIST } from './mock';
import { useViewport } from 'hooks';

const { Header, Content, Footer } = Layout;

Spin.setDefaultIndicator(
  <div className="loading__box">
    <div className="loading__box-lds">
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default class Dashboard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      subAppList: []
    };
  }

  componentDidMount() {
    const { width } = useViewport();
    const loader = (loading: any) => {
      const container = document.getElementById('subapp-container');
      ReactDOM.render(
        <>
          <Spin
            style={{
              position: 'fixed',
              top: '50%',
              left: 'calc(50% - 100px)',
              zIndex: 99,
              zoom: width <= 600 ? 0.3 : 1
            }}
            spinning={loading}
          />
          <div id="subapp-viewport" />
        </>,
        container
      );
    };
    const subAppList = MENU_LIST.map((menu: any) => {
      return {
        name: menu.title,
        entry: `//${window.location.host}${menu.entry}`,
        container: '#subapp-viewport',
        loader,
        activeRule: menu.url
      };
    });
    this.setState({
      loading: true,
      subLoader: loader,
      subAppList
    });

    registerMicroApps(subAppList);

    const { setGlobalState } = initGlobalState({
      routePrefix: '/q'
    });

    /**
     * Step4 启动应用
     */
    start({ sandbox: { experimentalStyleIsolation: true } });
  }

  render() {
    return (
      <BrowserRouter>
        <Layout className="widgets-layout">
          <Header className="header">
            <div className="logo">
              <a href="/">Qiuz</a>
            </div>
            <HeaderBar />
          </Header>
          <Content className="site-layout-background">
            <div id="subapp-container" className="view"></div>
          </Content>
          <Footer className="widgets-layout-container-footer">Widgets ©2021 Created by qiuz</Footer>
        </Layout>
      </BrowserRouter>
    );
  }
}
