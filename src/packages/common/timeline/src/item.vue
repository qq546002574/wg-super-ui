<script>
export default {
  props: {
    label: String,
    value: String,
    activeKey: String,
    active: Boolean,
    changeTag: Function,
    valueRender: Function,
    valueSubRender: Function,
    labelRender: Function,
    icon: String, //时间轴节点传过来的图标
    width: String, //时间轴内容区域的长度
    accordion: Boolean, //手风琴效果
    vertical: Boolean,
    disabled: Boolean,
    actived: Boolean,
    record: Object,
  },
  methods: {
    standardDetailRender() {},

    standardRender() {
      const { label, value, active, activeKey, disabled, actived, record, accordion, width, icon } = this;
      const { changeTag, labelRender, valueRender, valueSubRender } = this;

      const nodeClass = [
        `${active ? 'wg-timeline-item__node active' : 'wg-timeline-item__node'}`,
        `${icon ? `wg-timeline-icon` : ''}`,
      ];

      const rightClass = [
        `${active ? 'wg-timeline-item__right active ' : 'wg-timeline-item__right'}`,
        `${disabled ? 'wg-disabled' : ''}`,
        `${actived ? 'wg-actived' : ''}`,
      ];

      const valueRenderCss = [
        `${accordion ? 'wg-timeline-item__value accordion' : 'wg-timeline-item__value small'}`,
      ];

      let accordionCss = ['mb20'];
      if (accordion) accordionCss = [`${active ? 'accordion-active' : 'accordion-no'}`];

      const valueStyle = width ? { width: width } : {};

      const valueSubRenderCss = [
        'wg-timeline-item__value-sub'
      ]

      console.log(icon)

      return (
        <div
          style={valueStyle}
          id={`timeline-scroll-${activeKey}`}
          class={disabled ? `wg-timeline-item wg-disabled` : 'wg-timeline-item'}
          onClick={(e,v) => {
            if (disabled && !actived) return;
            changeTag(activeKey, record);
            console.log('e==========:',e, e.path[1]);
            console.log('=========',window.getComputedStyle(e.path[1]).height);
          }}
        >
          <div class="wg-timeline-item__left">
            {
              icon ? (
                <wg-icon name={icon} class={nodeClass} />
              ) : (
                <div class={nodeClass}>
                  {active && <div class="wg-timeline-item__node_active"/>}
                </div>
              )
            }
            <div class="wg-timeline-item__line"></div>
          </div>
          <div class={rightClass}>
            <div class="wg-timeline-item__label">{labelRender ? labelRender() : label}</div>
            <div class={accordionCss}>
              <div class={valueRenderCss}>{valueRender ? valueRender() : <span title={value}>{value}</span>}</div>
              {
                valueSubRender && (
                  <div class={valueSubRenderCss}>
                  {
                    valueSubRender()
                  }
                  </div>
                )
              }
            </div>
          </div>
        </div>
      );
    },
    verticalRender() {
      const { label, value, active, activeKey, disabled, actived, record } = this;
      const { changeTag, labelRender, valueRender } = this;

      const nodeClass = [`${active ? 'wg-timeline-item__node active ' : 'wg-timeline-item__node'}`]; //wg-disabled

      const rightClass = [
        `${active ? 'wg-timeline-item__right standard_active ' : 'wg-timeline-item__right'}`,
        `${disabled ? 'wg-disabled' : ''}`,
        `${actived ? 'wg-actived' : ''}`,
      ];

      return (
        <div
          id={`timeline-scroll-${activeKey}`}
          class={disabled ? `wg-timeline-item standard_position wg-disabled` : 'wg-timeline-item standard_position'}
          onClick={() => {
            if (disabled && !actived) return;
            changeTag(activeKey, record);
          }}
        >
          <div class="wg-timeline-item__left__standard">
            <div class={nodeClass}>
              {active && <div class="wg-timeline-item__node_active"/>}
            </div>
            <div class={rightClass}>
              <div class="wg-timeline-item__label">{labelRender ? labelRender() : label}</div>
              {valueRender ? (
                <div class="wg-timeline-item__value small">{valueRender()}</div>
              ) : (
                value && (
                  <div class="wg-timeline-item__value small">
                    <span title={value}>{value}</span>
                  </div>
                )
              )}
            </div>
            <div class="wg-timeline-item__line"></div>
          </div>
        </div>
      );
    },
  },

  render() {
    const { vertical } = this;
    return vertical ? this.verticalRender() : this.standardRender();
  },
};
</script>
<style lang="less">
// @import './main.less';
</style>
