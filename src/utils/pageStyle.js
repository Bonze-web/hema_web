import Vue from 'vue';

export default {
  install() {
    Vue.prototype.handleScroll = function() {
      // var scrollTop = e.target.documentElement.scrollTop || e.target.body.scrollTop;
      // 主要内容区域
      // var appWrapper = document.getElementsByClassName('app-wrapper')[0];
      // 内容区域高度
      // var appWrapperHei = window.getComputedStyle(document.getElementsByClassName('app-wrapper')[0], null).height.replace('px', '');
      // 获取菜单栏宽度
      var sidebarWidth = window
        .getComputedStyle(
          document.getElementsByClassName("sidebar-container")[0],
          null
        )
        .width.replace("px", "");

      // 顶部标题按钮区域
      var topBox = document.getElementsByClassName("common-title")[0];
      // 内容区域
      var content = document.getElementsByClassName("coupon-content")[0];

      if (topBox) {
        topBox.style.width =
          document.body.clientWidth - sidebarWidth - 100 + "px";
        topBox.style.position = "fixed";
        topBox.style.top = 50 + "px";
        topBox.style.zIndex = 1000;
        topBox.style.boxShadow = "0px 7px 5px -5px #f1f1f1";
      }
      if (content) {
        content.style.marginTop = 60 + "px";
      }
      // if (topBox) {
      //   if (scrollTop > 90) {
      //     topBox.style.width = (document.body.clientWidth - sidebarWidth) + 'px';
      //     topBox.style.position = 'fixed';
      //     topBox.style.top = 50 + 'px';
      //     topBox.style.zIndex = 1000;
      //     topBox.style.boxShadow = '0px 7px 5px -5px #f1f1f1';
      //     appWrapper.style.padding = 0;
      //   } else {
      //     topBox.style.position = 'inherit';
      //     topBox.style.zIndex = 0;
      //     topBox.style.width = 'inherit';
      //     appWrapper.style.paddingTop = 20 + 'px';
      //     appWrapper.style.paddingBottom = 20 + 'px';
      //     appWrapper.style.paddingLeft = 50 + 'px';
      //     appWrapper.style.paddingRight = 50 + 'px';
      //   }
      // }
    }
  }
}
