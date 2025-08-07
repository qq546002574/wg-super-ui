<template>
  <div class="noDataDiv">
    <div class="noData">
      <el-image :src="imgUrl" :class="[{ largerImg: type === 'rightBox' }, { smallImg: type === 'small' }]"></el-image>
      <span>{{ text }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'wgEmpty',
  props: {
    noDataType: {
      type: String,
      default: 'rightBox',
    },
    text: {
      type: String,
      default: '暂无数据',
    },
  },
  watch: {
    noDataType: {
      handler(val) {
        this.type = val;
      },
      immediate: true,
    },
  },
  computed: {
    imgUrl() {
      const url =
        this.type === 'rightBox'
          ? '/public/assets/images/noData/nodata.png'
          : '/public/assets/images/noData/smallNoData.png'
      return url;
    },
  },
  data() {
    return {
      type: '',
    };
  },
};
</script>
<style lang="less" scoped>
.noDataDiv {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.noData {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .largerImg {
    width: 52px;
    height: 49px;
  }
  .smallImg {
    width: 42px;
  }
  span {
    font-size: 14px;
    padding-top: 12px;
    color: #888888;
  }
}
</style>
