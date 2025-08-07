<template>
  <div class="el-transfer wg-transfer">
    <wg-transfer-panel
      v-bind="$props"
      ref="leftPanel"
      :data="sourceData"
      :title="titles[0] || ''"
      :default-checked="leftDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onSourceCheckedChange"
    >
      <slot name="left-footer"></slot>
    </wg-transfer-panel>
    <div class="el-transfer__buttons">
      <div class="wg-transfer__buttons">
        <div style="margin-bottom: 10px">
          <wg-button
            size="xsmall"
            :primary="leftChecked.length !== 0"
            @click.native="addToRight"
            icon="icon-youjiantou"
            :disabled="leftChecked.length === 0"
          >
            <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
            <!-- <i class="el-icon-arrow-right"></i> -->
          </wg-button>
        </div>
        <div>
          <wg-button
            size="xsmall"
            :primary="rightChecked.length !== 0"
            @click.native="addToLeft"
            icon="icon-zuojiantou"
            :disabled="rightChecked.length === 0"
          >
            <!-- <i class="el-icon-arrow-left"></i> -->
            <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
          </wg-button>
        </div>
      </div>
    </div>
    <wg-transfer-panel
      v-bind="$props"
      ref="rightPanel"
      :data="targetData"
      :title="titles[1] || ''"
      :filter-method="filterMethodRight?filterMethodRight:filterMethod"
      :default-checked="rightDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onTargetCheckedChange"
    >
      <slot name="right-footer"></slot>
    </wg-transfer-panel>
  </div>
</template>
<script>
import { Transfer } from 'element-ui';
import WgTransferPanel from './wg-transfer-panel.vue';

export default {
  extends: Transfer,
  components: {
    WgTransferPanel,
  },
  name: 'wgTransfer',
  props: {
    filterMethodRight:Function
  },
  computed:{}
};
</script>
<style lang="less" scoped>
@import './transfer.less';
</style>
