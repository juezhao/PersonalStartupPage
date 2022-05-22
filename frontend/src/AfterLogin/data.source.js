import React from 'react';
import 'boxicons'
import Banner1Main from './component/banner1Main';
import Calendar from './component/calendar/Calendar';
import News from './component/news';

//data source for the banner
export const Banner10DataSource = {
  wrapper: { className: 'banner1' },
  BannerAnim: {
    children: [
      {
        name: 'elem0',
        BannerElement: { className: 'banner-user-elem' },
        textWrapper: { className: 'banner1-text-wrapper' },
        bg: { className: 'bg bg0' },
        title: {
          className: 'banner1-title',
          children: 'Welcome back',
        },
        content: {
          className: 'banner1-content',
          children: <Banner1Main />,
        },
      },
      {
        name: 'elem1',
        BannerElement: { className: 'banner-user-elem' },
        textWrapper: { className: 'banner1-text-wrapper' },
        bg: { className: 'bg bg1' },
        title: {
          className: 'banner1-title',
          children:
            'Your personal calendar',
        },
        content: {
          className: 'banner1-content',
          children: <Calendar/>,
        },
      },
      {
        name: 'elem2',
        BannerElement: { className: 'banner-user-elem' },
        textWrapper: { className: 'banner1-text-wrapper' },
        bg: { className: 'bg bg2' },
        title: {
          className: 'banner1-title',
          children:
            'Breaking News Today',
        },
        content: {
          className: 'banner1-content',
          children: <News />,
        },
      },
    ],
  },
};
//data source for the footer
export const Footer20DataSource = {
  wrapper: { className: 'home-page-wrapper footer2-wrapper' },
  OverPack: { className: 'home-page footer2', playScale: 0.05 },
  copyright: {
    className: 'copyright',
    children: [
      {
        name: 'image',
        children:'',
        className: 'copyright-logo',
      },
      {
        name: 'group',
        children: 'Developed by Yuhuai Luo, Yi Li, Baisong/Isaac Lin, Jue Zhao',
        className: 'copyright-group',
      },
      {
        name: 'image2',
        children:
          'https://gw.alipayobjects.com/zos/rmsportal/fgGmQUfiUfSBfvsQpfOj.svg',
        className: 'copyright-line',
      },
      {
        name: 'copyright',
        children: 'Your personal start up page',
        className: 'copyright-text',
      },
    ],
  },
  links: {
    className: 'links',
    children: [
      {
        name: 'logout',
        href: '/logout',
        className: 'links-weibo',
        children:
          <box-icon name='log-out-circle' animation='tada-hover' color='#f5f65b' size='lg'></box-icon>,
          
      },
      {
        name: 'userProfile',
        // href: '#',
        className: 'links-zhihu',
        children:
        <box-icon name='user-circle' animation='tada-hover' color='#f1fd6e' size='lg' ></box-icon>,
      },
    ],
  },
};
