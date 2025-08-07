<script>
import TimelineItem from './item.vue';
export default {
  name: 'wgTimeline',

  props: {
    reverse: {
      type: Boolean,
      default: false,
    },
    dataSource: {
      type: Array,
      default: [],
    },
    // value: [String,Number], // v-model
    width: String, //步骤条内容区域的长度
    accordion: Boolean, //手风琴效果
    vertical: Boolean,
    activeKey: [String,Number],
    simple: Boolean,
    loading: Boolean,
  },
  model: {
    prop: 'activeKey',
  },
  data() {
    return {
      initialActiveKey: this.activeKey,
      initialLoading: this.loading,
    };
  },
  watch: {
    activeKey(val) {
      this.initialActiveKey = val;
    },
    loading(val) {
      this.initialLoading = val;
    },
  },
  computed: {
    leftButDisabled() {
      const index = this.dataSource.findIndex((c) => c.key === this.initialActiveKey);
      return index === 0;
    },
    rightButDisabled() {
      const index = this.dataSource.findIndex((c) => c.key === this.initialActiveKey);
      return index === this.dataSource.length - 1;
    },
  },

  provide() {
    return {
      wgTimeline: this,
    };
  },
  methods: {
    changeTag(val, record) {
      this.initialActiveKey = val;
      
      this.$emit('input', val);
      this.$emit('change', val, record);
    },
    clickBut(type) {
      const { dataSource, initialActiveKey } = this;
      const { changeTag } = this;
      const t = dataSource.filter((c) => {
        if (c.disabled) {
          //如果是禁用状态要判断c.actived的状态
          if (c.actived) return c;
        } else {
          return c;
        }
      });
      let index = t.findIndex((c) => c.key === initialActiveKey);
      switch (type) {
        case 'left': {
          //后退
          if (index < 1) return; //如果没有找到或者获取当前是第一个选项，不需要做任何操作
          index = index - 1;

          console.log(index);
          break;
        }
        case 'right': {
          const len = t.length - 1;
          if (index === len) return; //如果是最后一个，不需要做任何操作
          index = index + 1;
        }
      }
      const val = t[index];
      changeTag(val.key, val);
      document.getElementById(`timeline-scroll-${val.key}`).scrollIntoView(); //跳往指定的时间节点
    },
  },
  mounted() {
    document.getElementById(`timeline-scroll-${this.initialActiveKey}`)?.scrollIntoView(); //跳往指定的时间节点
  },

  render() {
    const reverse = this.reverse;
    const classes = {
      'el-timeline': true,
      'is-reverse': reverse,
    };
    let slots = this.$slots.default || [];
    if (reverse) {
      slots = slots.reverse();
    }

    const { dataSource, initialActiveKey, changeTag, vertical, simple, initialLoading, accordion, width } = this;

    const { clickBut, leftButDisabled, rightButDisabled } = this;

    if (initialLoading)
      return (
        <div class="wg-timeline-loading">
          <wg-icon name="icon-shuaxin" class="_icon" />
          加载中....
        </div>
      );

    return (
      <div class="wg-timeline-com">
        {vertical && !simple && (
          <div style={{ marginRight: '16px' }}>
            <wg-button
              disabled={leftButDisabled}
              onClick={clickBut.bind(this, 'left')}
              class="wg-timeline-button"
              plain
              icon="icon-zuojiantou"
            />
          </div>
        )}
        <div class={vertical ? `wg-timeline standard` : `wg-timeline wg-timeline-vertical`}>
          {dataSource.map((c) => {
            return (
              <TimelineItem
                record={c}
                width={width}
                accordion={accordion}
                vertical={vertical}
                changeTag={changeTag}
                active={initialActiveKey === c.key}
                activeKey={c.key}
                label={c.label}
                value={c.value}
                actived={c.actived}
                disabled={c.disabled}
                valueRender={c.valueRender}
                labelRender={c.labelRender}
                icon={c.icon}
                valueSubRender={c.valueSubRender}
              ></TimelineItem>
            );
          })}
        </div>
        {vertical && !simple && (
          <div style={{ marginLeft: '16px' }}>
            <wg-button
              disabled={rightButDisabled}
              onClick={clickBut.bind(this, 'right')}
              class="wg-timeline-button"
              plain
              icon="icon-youjiantou"
            />
          </div>
        )}
      </div>
    );
  },
};
</script>
<style lang="less">
@import './main.less';
</style>
