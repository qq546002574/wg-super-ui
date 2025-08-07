<script>
import StepsItem from './item.vue';
export default {
  name: 'wgSteps',

  props: {
    width: String,
    dataSource: {
      type: Array,
      default: [],
    },
    serial: Boolean, //带序号的模式，在序号模式下，icon将不生效
    vertical: Boolean,
    activeKey: [String,Number],
    loading: Boolean,
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
  methods: {
    changeTag(val, record) {
      this.initialActiveKey = val;
      this.$emit('change', val, record);
    },
  },
  mounted() {
    document.getElementById(`steps-scroll-${this.initialActiveKey}`)?.scrollIntoView(); //跳往指定的时间节点
  },

  render() {
    // let slots = this.$slots.default || [];

    const { dataSource, initialActiveKey, changeTag, vertical, initialLoading, width, serial } = this;

    const index = this.dataSource.findIndex((c) => c.key === this.initialActiveKey);

    if (initialLoading)
      return (
        <div class="wg-steps-loading">
          <wg-icon name="icon-shuaxin" class="_icon" />
          加载中....
        </div>
      );

    return (
      <div class="wg-steps-com">
        <div class={vertical ? `wg-steps standard` : `wg-steps wg-steps-vertical`}>
          {dataSource.map((c, i) => {
            let active = i < index;
            let activeMain = i === index;
            const serialId = i + 1;
            return (
              <StepsItem
                width={width}
                vertical={vertical}
                serial={serial}
                serialId={serialId}
                changeTag={changeTag}
                active={active}
                activeMain={activeMain}
                record={c}
                activeKey={c.key}
                icon={c.icon}
                label={c.label}
                value={c.value}
                actived={c.actived}
                disabled={c.disabled}
                valueRender={c.valueRender}
                labelRender={c.labelRender}
              />
            );
          })}
        </div>
      </div>
    );
  },
};
</script>
<style lang="less">
@import './main.less';
</style>
