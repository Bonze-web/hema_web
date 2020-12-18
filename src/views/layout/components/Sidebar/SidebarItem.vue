<template>
  <div class="menu-wrapper">
    <template v-for="item in menus" v-if="!item.hidden && item.visibleChildren.length > 0" >

      <router-link v-if="item.visibleChildren.length===0" :to="{path: item.path, query: item.query, params: item.params}" :key="item.name">
        <el-menu-item :index="item.path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" :title="item.meta.title">{{item.meta.title}}</span>
        </el-menu-item>
      </router-link>

      <router-link v-else-if="item.visibleChildren.length===1 && !item.visibleChildren[0].children && !item.alwaysShow" :to="{path: item.path+'/'+item.visibleChildren[0].path, query: item.visibleChildren[0].query, params: item.visibleChildren[0].params}" :key="item.visibleChildren[0].name">
        <el-menu-item :index="item.path+'/'+item.visibleChildren[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <!-- <svg-icon v-if="item.visibleChildren[0].meta&&item.visibleChildren[0].meta.icon" :icon-class="item.visibleChildren[0].meta.icon"></svg-icon> -->
          <span v-if="item.visibleChildren[0].meta&&item.visibleChildren[0].meta.title" :title="item.visibleChildren[0].meta.title">{{item.visibleChildren[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" :title="item.meta.title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.visibleChildren">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.visibleChildren.length>0" :routes="[child]" :key="child.path">
          </sidebar-item>
          <router-link v-else :to="{path: item.path+'/'+child.path, query: child.query, params: child.params}" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <!-- <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon> -->
              <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
export default {
  name: "SidebarItem",

  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    menus: function() {
      for (var menu of this.routes) {
        this.initVisibleChildren(menu);
      }
      return this.routes;
    }
  },

  methods: {
    /**
     * 取可见的子路由
     */
    initVisibleChildren(route) {
      if (!route || !route.children || route.hidden) {
        route.visibleChildren = [];
      } else {
        route.visibleChildren = route.children.filter(item => !item.hidden);
        route.visibleChildren.forEach(element => {
          this.initVisibleChildren(element);
        });
      }
    }
  }
};
</script>
<style lang="scss">
.menu-wrapper {
  .el-tooltip {
    position: relative !important;
    left: none !important;
    padding: 0px !important;
    span {
      right: -165px !important;
    }
  }
  .el-tooltip__popper {
    display: none;
  }
  .el-menu-item, .el-submenu__title{
    height: 40px;
    line-height: 40px;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // overflow: hidden;
  }

  .el-submenu.is-opened .el-menu li:before {
    top: 0;
    bottom: 0;
    height: auto;
    background: #E9EAF2;
    border: none;
    content: "";
    left: 26px;
    position: absolute;
    display: block;
    width: 1px;
    z-index: 1;
  }
  
}
</style>

