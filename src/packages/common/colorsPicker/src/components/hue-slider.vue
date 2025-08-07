<template>
  <div>
    <div class="el-color-hue-slider hueslider" style="width:276px;">
      <div class="el-color-hue-slider__bar hueslider" @click="handleClick" ref="bar"></div>
      <div class="el-color-hue-slider__thumb"
          :style="{
            left: thumbLeft + 'px',
            top: '0px'
          }"
          ref="thumb">
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from '../draggable';

  export default {

    props: {
      color: {
        required: true
      },
    },

    data() {
      return {
        thumbLeft: 0,
        thumbTop: 0
      };
    },

    computed: {
      hueValue() {
        const hue = this.color.get('hue');
        return hue;
      }
    },

    watch: {
      hueValue() {
        this.update();
      }
    },

    methods: {
      handleClick(event) {
        const thumb = this.$refs.thumb;
        const target = event.target;

        if (target !== thumb) {
          this.handleDrag(event);
        }
      },

      handleDrag(event) {
        const rect = this.$el.getBoundingClientRect();
        const { thumb } = this.$refs;
        let hue;
        // 将色块条调成设计稿的样子（原本是竖向，现调整为横向）
        let left = event.clientX - rect.left;
        left = Math.min(left, rect.width - thumb.offsetWidth / 2);
        left = Math.max(thumb.offsetWidth / 2, left);

        hue = Math.round((left - thumb.offsetWidth / 2) / (rect.width - thumb.offsetWidth) * 360);

        this.color.set('hue', hue);
      },

      getThumbLeft() {
        const el = this.$el;
        const hue = this.color.get('hue');

        if (!el) return 0;
        const thumb = this.$refs.thumb;
        return Math.round(hue * (el.offsetWidth - thumb.offsetWidth / 2) / 360);
      },

      getThumbTop() {
        const el = this.$el;
        const hue = this.color.get('hue');

        if (!el) return 0;
        const thumb = this.$refs.thumb;
        return Math.round(hue * (el.offsetHeight - thumb.offsetHeight / 2) / 360);
      },

      update() {
        this.thumbLeft = this.getThumbLeft();
        this.thumbTop = this.getThumbTop();
      },
    },

    mounted() {
      const { bar, thumb } = this.$refs;

      const dragConfig = {
        drag: (event) => {
          this.handleDrag(event);
        },
        end: (event) => {
          this.handleDrag(event);
        },
      };

      draggable(bar, dragConfig);
      draggable(thumb, dragConfig);
      this.update();
    }
  };
</script>
<style lang="less">
.hueslider{
    border-radius: 6px;
  }
</style>
