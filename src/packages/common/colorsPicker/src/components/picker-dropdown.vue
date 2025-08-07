<template>
  <div class="pickerdropdown">
    <sv-panel ref="sl" :color="color"></sv-panel>
    <div class="marginL12"> 
      <hue-slider ref="hue" :color="color"></hue-slider>
    </div>
  </div>
</template>

<script>
  import SvPanel from './sv-panel';
  import HueSlider from './hue-slider';

  export default {

    components: {
      SvPanel,
      HueSlider,
    },

    props: {
      color: {
        required: true
      },
    },

    data() {
      return {};
    },
  };
</script>
<style lang="less">
.marginL12{
  margin:12px 0;
}
</style>
