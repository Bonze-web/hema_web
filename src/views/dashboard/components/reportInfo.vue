<template>
  <div class="flex">
    <span>{{report.title}}</span>
    <span v-if="businessTime === 'yesterday'" class="number">
      <span class="unit" v-if="unit === '￥'">{{unit}}</span>
      {{report.yesterdayTotal !== undefined ? report.yesterdayTotal : '*'}}
      <span class="unit" v-if="unit!=='￥'">{{unit}}</span>
    </span>
    <span v-if="businessTime === 'yesterday'">
      比前日
      <span v-if="report.yesterdayRatio >= 0" class="red">
        <i class="iconfont icon-icon-svg-jiantoucuxiangshang"></i>
        <span v-if="unit === '￥'">{{unit}}</span>
        {{report.yesterdayRatio}}
        <span class="unit" v-if="unit!=='￥'">{{unit}}</span>
      </span>
      <span v-else class="green">
        <i class="iconfont icon-icon-svg-jiantoucuxiangxia"></i>
        <span v-if="unit === '￥'">{{unit}}</span>
        {{report.yesterdayRatio ? report.yesterdayRatio: '*'}}
        <span class="unit" v-if="unit!=='￥'">{{unit}}</span>
      </span>
    </span>
    <span v-if="businessTime === 'seven'" class="number">
      <span class="unit" v-if="unit === '￥'">{{unit}}</span>
      {{report.sevenTotal !== undefined ? report.sevenTotal : '*'}}
      <span class="unit" v-if="unit!=='￥'">{{unit}}</span>
    </span>
    <span v-if="businessTime === 'seven'">
      比上周
      <span v-if="report.sevenRatio >= 0" class="red">
        <i class="iconfont icon-icon-svg-jiantoucuxiangshang"></i>
        <span v-if="unit === '￥'">{{unit}}</span>
        {{report.sevenRatio}}
        <span class="unit" v-if="unit!=='￥'">{{unit}}</span>
      </span>
      <span v-else class="green">
        <i class="iconfont icon-icon-svg-jiantoucuxiangxia"></i>
        <span v-if="unit === '￥'">{{unit}}</span>
        {{report.sevenRatio ? report.sevenRatio : '*'}}
        <span class="unit" v-if="unit!=='￥'">{{unit}}</span>
      </span>
    </span>
    <span v-if="businessTime === 'thirty'" class="number">
      <span class="unit" v-if="unit === '￥'">{{unit}}</span>
      {{report.thirtyTotal !== undefined ? report.thirtyTotal : '*'}}
      <span class="unit" v-if="unit!=='￥'">{{unit}}</span>
    </span>
    <span v-if="businessTime === 'thirty'">
      比上月
      <span v-if="report.thirtyRatio >= 0" class="red">
        <i class="iconfont icon-icon-svg-jiantoucuxiangshang"></i>
        <span v-if="unit === '￥'">{{unit}}</span>
        {{report.thirtyRatio}}
        <span class="unit" v-if="unit!=='￥'">{{unit}}</span>
      </span>
      <span v-else class="green">
        <i class="iconfont icon-icon-svg-jiantoucuxiangxia"></i>
        <span v-if="unit === '￥'">{{unit}}</span>
        {{report.thirtyRatio ? report.thirtyRatio : '*'}}
        <span class="unit" v-if="unit!=='￥'">{{unit}}</span>
      </span>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ["businessTime", "report", "unit"],
  computed: {}
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  color: #333;
  .number {
    font-size: 20px;
    margin: 6px 0px;
    color: #000;
  }
}
.unit {
  font-size: 12px;
}
.red {
  color: #ff4d4d;
  i {
    font-size: 10px;
  }
}
.green {
  color: #17c071;
  i {
    font-size: 10px;
  }
}
</style>

