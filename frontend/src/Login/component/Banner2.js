import React from "react";
import QueueAnim from "rc-queue-anim";
import  { TweenOneGroup } from "rc-tween-one";
import BannerAnim, { Element } from "rc-banner-anim";
import { isImg } from "../utils";
import "rc-banner-anim/assets/index.css";

const BgElement = Element.BgElement;
export default function Banner(props) {
  // Get the dataSource from props and render the children of BannerAnim
  const { datasource, ismobile } = props;
  const childrenToRender = datasource.BannerAnim.children.map((item, i) => {
    const elem = item.BannerElement;
    const elemClassName = elem.className;
    delete elem.className;
    const bg = item.bg;
    const textWrapper = item.textWrapper;
    const title = item.title;
    const content = item.content;
    const page = item.page;
    const follow = !ismobile
      ? {
          delay: 1000,
          minMove: 0.1,
          data: [
            {
              id: `bg${i}`,
              value: 15,
              type: "x",
            },
            { id: `wrapperBlock${i}`, value: -15, type: "x" },
          ],
        }
      : null;
    return (
      <Element
        key={i.toString()}
        followParallax={follow}
        {...elem}
        prefixCls={elemClassName}
      >
        <BgElement key="bg" {...bg} id={`bg${i}`} />
        <div {...page}>
          <QueueAnim
            type={["bottom", "top"]}
            delay={200}
            key="text"
            {...textWrapper}
            id={`wrapperBlock${i}`}
          >
            <div key="content" {...content}>
              {content.children}
            </div>
            <div key="logo" {...title}>
              {typeof title.children === "string" &&
              title.children.match(isImg) ? (
                <img src={title.children} width="100%" alt="img" />
              ) : (
                title.children
              )}
            </div>
          </QueueAnim>
        </div>
      </Element>
    );
  });
  return (
    <div {...props} {...datasource.wrapper}>
      <TweenOneGroup
        key="bannerGroup"
        enter={{ opacity: 0, type: "from" }}
        leave={{ opacity: 0 }}
        component=""
      >
        <BannerAnim key="BannerAnim" {...datasource.BannerAnim}>
          {childrenToRender}
        </BannerAnim>
      </TweenOneGroup>
    </div>
  );
}
