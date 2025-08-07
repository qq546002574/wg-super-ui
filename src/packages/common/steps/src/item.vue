<script>
export default {
  props: {
    icon: String, //图标
    width: String, //步骤条内容区域的长度
    label: String,
    value: String,
    activeKey: [String,Number], //当前活跃的key
    active: Boolean, //激活状态之前的状态，表示已经走过的步骤
    activeMain: Boolean, //主要激活状态
    changeTag: Function,
    valueRender: Function,
    labelRender: Function,
    serial: Boolean, //序号模式，带序号情况下，icon将不生效
    serialId: Number, //当前序号
    vertical: Boolean,
    disabled: Boolean,
    actived: Boolean,
    record: Object,
  },
  methods: {
    standardRender() {
      const { label, value, active, activeKey, disabled, actived, record, activeMain, icon, width, serial, serialId } =
        this;

      console.log('======================icon:', icon);
      const { changeTag, labelRender, valueRender } = this;

      const model = serial ? 'serial' : icon ? 'icon' : ''; //当前步骤条所处模式

      const nodeClass = [
        `${active ? 'wg-steps-item__node active' : 'wg-steps-item__node'}`,
        `${activeMain ? 'active active-main' : ''}`,
        `${model === 'icon' ? `wg-steps-icon` : ``}`,
        `${model === 'serial' ? `wg-steps-serial` : ``}`,
      ];

      const lineClass = [
        `${active ? 'wg-steps-item__line line-active' : 'wg-steps-item__line'}`,
        // `${activeMain? 'active active-main':''}`,
      ];

      const labelClass = [
        `${activeMain ? 'wg-steps-item__label active ' : 'wg-steps-item__label'}`,
        // `${disabled? "wg-disabled" : ''}`,
        // `${actived? "wg-actived" : ''}`,
      ];

      const noActive = !active && !activeMain;

      const valueStyle = width ? { width: width } : {};
      console.log('valueStyle:', valueStyle);

      return (
        <div id={`steps-scroll-${activeKey}`} class={noActive ? `wg-steps-item wg-disabled` : 'wg-steps-item'}>
          <div class="wg-steps-item__left">
            {model === 'icon' ? (
              <wg-icon name={icon} class={nodeClass} />
            ) : active && model === 'serial' ? (
              <wg-icon name="icon-qiyong" class="wg-steps-serial-icon active" />
            ) : (
              <div class={nodeClass}>
                <span>{serial && serialId}</span>
              </div>
            )}

            <div class={lineClass}></div>
          </div>
          <div class={`${model !== 'serial' && 'wg-steps-serial__right'}  wg-steps-item__right`}>
            <div class={labelClass}>{labelRender ? labelRender() : label}</div>
            <div class="wg-steps-item__value small" style={valueStyle}>
              {valueRender ? valueRender() : <span title={value}>{value}</span>}
            </div>
          </div>
        </div>
      );
    },
    verticalRender() {
      const { label, value, active, activeKey, disabled, actived, record, activeMain, icon, width, serial, serialId } =
        this;

      console.log('======================icon:', icon);
      const { changeTag, labelRender, valueRender } = this;

      const model = serial ? 'serial' : icon ? 'icon' : ''; //当前步骤条所处模式

      const nodeClass = [
        `${active ? 'wg-steps-item__node active' : 'wg-steps-item__node'}`,
        `${activeMain ? 'active active-main' : ''}`,
        `${model === 'icon' ? `wg-steps-icon-right` : `wg-steps-noicon`}`,
        `${model === 'serial' ? `wg-steps-serial` : ``}`,
      ];

      const lineClass = [
        `${active ? 'wg-steps-item__line line-active' : 'wg-steps-item__line'}`,
        // `${activeMain? 'active active-main':''}`,
      ];

      const labelClass = [
        `${activeMain ? 'wg-steps-item__label active ' : 'wg-steps-item__label'}`,
        // `${disabled? "wg-disabled" : ''}`,
        // `${actived? "wg-actived" : ''}`,
      ];

      const rightClass = [
        `${active ? 'wg-steps-item__right  standard_active ' : 'wg-steps-item__right'}`,
        // `${disabled ? 'wg-disabled' : ''}`,
        // `${actived ? 'wg-actived' : ''}`,
      ];

      const noActive = !active && !activeMain;

      const valueStyle = width ? { width: width } : {};
      console.log('valueStyle:', valueStyle);

      return (
        <div id={`steps-scroll-${activeKey}`} class={noActive ? `wg-steps-item vertical flex afs wg-disabled` : 'wg-steps-item vertical flex afs'}>
          <div class="wg-steps-item__left">
              {model === 'icon' ? (
                <wg-icon name={icon} class={nodeClass} />
              ) : active && model === 'serial' ? (
                <wg-icon name="icon-qiyong" class="wg-steps-serial-icon active" />
              ) : (
                <div class={nodeClass}>
                  <span>{serial && serialId}</span>
                </div>
              )}
            </div>
            <div class={rightClass} style={valueStyle}>
                <div class="wg-steps-item__label flex">
                  <div>{labelRender ? labelRender() : label}</div>
                  <div class={lineClass}></div>
                </div>
                {valueRender ? (
                  <div class="wg-steps-item__value steps-item_right small" style={valueStyle}>{valueRender()}</div>
                ) : (
                  value && (
                    <div class="wg-steps-item__value steps-item_right small" style={valueStyle}>
                      <span title={value}>{value}</span>
                    </div>
                  )
                )}
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
