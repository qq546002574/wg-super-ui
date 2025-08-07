<script>
export default {
  name: 'wgLeftRightLayout',
  props: {
    leftTitle: String,
    rightTitle: String,
  },
  methods: {
    renderLeftHeader(){
      const { leftTitle, $slots } = this;
      return (
        <div class="header flex jsb ac line">
          { leftTitle && <wg-title class="title" >{leftTitle}</wg-title> }
          <div class="flex ac">
            {
              $slots.leftBtn
            }
          </div>
        </div>
      )
    },
    renderRightHeader(){
      const { rightTitle, $slots } = this;
      return (
        <div class="header flex ac jsb">
          { 
            rightTitle ? 
              <wg-title class="title" >{rightTitle}</wg-title>
              : $slots.rightBtn && <div/>
          }
          <div class="flex ac">
            {
              $slots.rightBtn
            }
          </div>
        </div>
      )
    }
  },
  render(){
    const { $slots, $attrs } = this;
    const { leftTitle , rightTitle } = this;
    return (
      <div attrs={$attrs} class="wgLeftRightLayout">
        <div class="_left">
          {
            (leftTitle || $slots.leftBtn) && this.renderLeftHeader()
          }
          <div class="left_content">
            {
              $slots.leftContent
            }
          </div>
        </div>
        <div class="_right">
          {
            (rightTitle || $slots.rightBtn) && this.renderRightHeader()
          }
          <div class="right_content">
            {
              $slots.rightContent
            }
          </div>
        </div>
      </div>
    )
  }
};
</script>
<style lang="less" scoped>
@headerHeight:53px;
.wgLeftRightLayout {
  display: flex;
  ._left {
    display: flex;
    flex-direction: column;
    // width: 325px;
    min-width: 325px;
    border-right: 1px solid #e7ebf1;
    .left_content {
      flex: 1;
      overflow:hidden;
    }
    .header {
      padding: 12px 10px 10px 10px;
      height:@headerHeight;
    }
  }
  ._right {
    display: flex;
    flex-direction: column;
    .header {
      padding: 12px 16px 10px 10px;
      height:@headerHeight;
    }
    .right_content {
      flex: 1;
      overflow:hidden;
    }
    flex: 1;
    // width: calc(100% - 325px);
  }
  
  .line {
    border-bottom: 1px solid #e7ebf1;
  }
  
  
}
</style>
