<template>
    <el-tooltip class="item" effect="dark" placement="bottom">
      <div slot="content">
          <p>{{ messages }}</p>
      </div>
      <wg-icon name="icon-bangzhu1" class="iconTip"></wg-icon>
    </el-tooltip>
</template>
<script>
export default {
    name: 'wgTheadTooltips',
    props: {
        messages: String,
    }
}
</script>
<style lang="less" scoped>
.iconTip {
    margin-left: 5px;
    &:hover{
        cursor: pointer;
    }
}
</style>