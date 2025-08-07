<template>
  <div class="wg-title-collapse">
    <div class="collapseDiv">
      <div class="title">
        <span>{{ title }}</span>
      </div>
      <div class="center_line"></div>
      <div class="collapseOpt" @click="optClick">
        <span :class="[{ _icon: !optFlag }]">{{ optText }}</span>
        <wg-icon
          :name="iconName"
          :class="['iconWidth', { _icon: !optFlag }]"
        ></wg-icon>
      </div>
    </div>
    <slot v-if="optFlag"></slot>
  </div>
</template>
<script>
export default {
  name: "wgTitleCollapse",
  props: {
    title: String,
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      optFlag: false,
    };
  },
  watch: {
    open: {
      handler(val) {
        this.optFlag = val;
      },
      immediate: true,
    },
  },
  computed: {
    optText() {
      return this.optFlag ? "收起" : "展开";
    },
    iconName() {
      return this.optFlag ? "icon-zuojiantou-1" : "icon-zuojiantou1";
    },
  },
  methods: {
    optClick() {
      this.optFlag = !this.optFlag;
    },
  },
};
</script>
<style lang="less" scoped>
.wg-title-collapse {
  width: 100%;
  & + & {
    margin-top: 16px;
  }
  .collapseDiv {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    letter-spacing: 0;
    font-weight: 700;
    position: relative;
    margin-bottom: 12px;
    .title {
      position: relative;
      span {
        padding-left: 8px;
        padding-right: 12px;
        color: #202122;
      }
      &::before {
        content: "";
        position: absolute;
        background-color: #22ace3;
        height: 16px;
        width: 4px;
        bottom: 0;
      }
    }
    .center_line {
      flex: 1;
      height: 1px;
      background-color: #e7ebf1;
    }
    .collapseOpt {
      cursor: pointer;
      span {
        color: #505356;
        font-weight: 400;
        padding-left: 12px;
      }
      .iconWidth {
        width: 12px;
        height: 12px;
        color: #4e5156;
        margin-bottom: 1px;
      }
      ._icon {
        color: #22ace3;
      }
    }
  }
}
</style>
