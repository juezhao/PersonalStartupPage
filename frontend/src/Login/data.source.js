import React from 'react';
import FormComponent from './component/form/Form';

//data source that will use to render the login page
export const Banner20DataSource = {
  wrapper: { className: 'banner2' },
  BannerAnim: {
    children: [
      {
        name: 'elem0',
        BannerElement: { className: 'banner-user-elem' },
        page: { className: 'home-page banner2-page' },
        textWrapper: { className: 'banner2-text-wrapper' },
        bg: { className: 'bg bg0 l23x54mp8u-editor_css' },
        title: { className: 'banner2-title', children: 'Your Personal Start up page' },
        content: {
          className: 'banner2-content',
          children: <FormComponent/> ,
        },
      },
    ],
  },
};
