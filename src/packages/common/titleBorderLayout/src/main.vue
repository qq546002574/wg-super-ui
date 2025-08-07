<template>
    <div class="wgTitleBorderLayout">
        <div class="top">
            <div class="title">{{title}}</div>
        </div>
        <div class="gapLine"></div>
        <div class="contanier">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'wgTitleBorderLayout',
    props: {
        title: String,
    }
}
</script>
<style lang="less" scoped>
.wgTitleBorderLayout {
    width: 100%;
    height: 100%;
    border-left: 1px solid #e7ebf1;
    border-right: 1px solid #e7ebf1;
    border-bottom: 1px solid #e7ebf1;
    min-height: 50px;
    .top {
        background-color: #e7ebf1;
        position: relative;
        display: block;
        height: 1px;
        width: 100%;
        margin-bottom: 24px;
        .title {
            position: absolute;
            background-color: #FFF;
            padding: 0 12px;
            font-size: 16px;
            color: #222325;
            left: 12px; 
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
        }
    }
    .contanier {
        margin: 16px 24px 24px 24px;
    }
}
</style>