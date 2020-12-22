<template>
  <div id="tags-view-container" class="tags-view-container">
    <span class="el-tabs__nav-prev is-disabled" @click="handleScrollPane(-280)" v-if="tagsButtonShow">
      <i class="el-icon-arrow-left"></i>
    </span>
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <span class="el-tabs__nav-next" @click="handleScrollPane(280)" v-if="tagsButtonShow">
      <i class="el-icon-arrow-right"></i>
    </span>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
import path from "path";
import Bus from "@/utils/bus.js";

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      tagsButtonShow: false,
      screenWidth: document.documentElement.clientWidth, // 屏幕宽度
      screenHeight: document.documentElement.clientHeight // 屏幕高度
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    routes() {
      return this.$router.options.routes;
    }
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
      this.tagsButtonShowChange();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    this.initTags();
    this.addTags();
    var _this = this;
    window.onresize = function() {
      // 定义窗口大小变更通知事件
      _this.screenWidth = document.documentElement.clientWidth; // 窗口宽度
      _this.screenHeight = document.documentElement.clientHeight; // 窗口高度
      _this.$refs.scrollPane.setScrollData(0);
      _this.tagsButtonShowChange();
    };
  },
  methods: {
    isActive(route) {
      return (
        route.path === this.$route.path || route.path === this.$route.path + "/"
      );
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    filterAffixTags(routes, basePath = "/") {
      let tags = [];
      if (!routes || routes.length === 0) {
        return;
      }
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch("tagsView/addVisitedView", tag);
        }
      }
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("tagsView/addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("tagsView/updateVisitedView", this.$route);
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        const { fullPath } = view;
        console.log(fullPath);
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
    },
    closeSelectedTag(view) {
      console.log(view, this.routes, this.route);
      this.$store
        .dispatch("tagsView/delView", view)
        .then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view);
          }
        });
      // 关闭单个
      Bus.$emit("removeCache", "closeSelectedTag", view);
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      // 关闭其他
      Bus.$emit("removeCache", "closeOthersTags", this.selectedTag);
      this.$store
        .dispatch("tagsView/delOthersViews", this.selectedTag)
        .then(() => {
          this.moveToCurrentTag();
        });
    },
    closeAllTags(view) {
      this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
        // 关闭所有
        Bus.$emit("removeCache", "closeAllTags");
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
          // to reload home page
          this.$router.replace({ path: "/redirect" + view.fullPath });
        } else {
          this.$router.push("/");
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    },
    handleScrollPane(e) {
      if (e > 0) {
        this.$refs.scrollPane.handleScrollData(e);
      } else {
        this.$refs.scrollPane.handleScrollData(e);
      }
    },
    tagsButtonShowChange() {
      if (typeof this.$refs.scrollPane === "undefined") {
        this.tagsButtonShow = false;
        return;
      }
      const owidth = this.$refs.scrollPane.$refs.scrollContainer.$refs.wrap
        .offsetWidth;
      // let twidth = this.$refs.tagItemWapper.offsetWidth;  这里不能用这个，这里有动画会延迟
      const twidth = this.visitedViews.length * 140;
      if (twidth > owidth - 44) {
        this.tagsButtonShow = true;
      } else {
        this.tagsButtonShow = false;
        this.$refs.scrollPane.setScrollData(0);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tags-view-container {
  min-height: 26px;
  width: calc(100% + 100px);
  margin-left: -50px;
  padding: 4px 0;
  background: #fff;
  // border-bottom: 1px solid #d8dce5;
  border-radius: 2px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  position: relative;
  margin-bottom: 10px;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-flex;
      position: relative;
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      padding: 10px 0;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      width: 140px;
      font-size: 12px;
      // margin-left: 5px;
      // margin-top: 4px;
      justify-content: space-between;
      align-items: center;
      border-left: 0;
      &:first-of-type {
        margin-left: 15px;
        border-left: 1px solid #d8dce5;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #409eff;
        color: #fff;
        border-color: #409eff;
        // &::before {
        //   content: "";
        //   background: #fff;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    top: 50%;
    margin-top: -6px;
    line-height: 12px;
  }
  .el-tabs__nav-prev {
    left: 5px;
  }
  .el-tabs__nav-next {
    right: 5px;
  }
  .scroll-container {
    width: calc(100% - 44px) !important;
    margin-left: 22px;
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close

.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      display: inline-block;
      &:before {
        transform: scale(0.9);
        vertical-align: -3px;
        display: none;
      }
    }
    &.active,
    &:hover {
      .el-icon-close {
        &:before {
          display: inline-block;
        }
      }
    }
  }
  .el-scrollbar__wrap {
    margin-bottom: -16px !important;
  }
}
</style>
