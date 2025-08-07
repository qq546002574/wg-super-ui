<template>
    <div class="timeGrop">
        <div class="flex align-items-center">
            <label class="_label">星期:</label>
            <wg-el-select 
                v-model="selectVal" 
                class="_time">
                <wg-el-option
                    v-for="(item, index) in options" 
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                </wg-el-option>
            </wg-el-select>
        </div>
        <div class="flex align-items-center">
            <label class="timeLabel">时间:</label>
            <wg-time-picker
                :clearable="false"
                class="_time"
                v-model="timeVal"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="时间点">
            </wg-time-picker>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        time: Array,
        id: Number,
    },
    watch: {
        time: {
            handler(v) {
                this.selectVal = v[0];
                this.timeVal = v[1];
            },
            immediate: true,
        },
        selectVal(v) {
            const data = [v, this.timeVal];
            this.$emit('change', {value: data, id: this.id});
        },
        timeVal(v) {
            const data = [this.selectVal, v];
            this.$emit('change', {value: data, id: this.id});
        },
    },
    data() {
        return {
            selectVal: '',
            timeVal: '',
            options: [{
                label: '星期一',
                value: '1',
            },{
                label: '星期二',
                value: '2',
            },{
                label: '星期三',
                value: '3',
            },{
                label: '星期四',
                value: '4',
            },{
                label: '星期五',
                value: '5',
            },{
                label: '星期六',
                value: '6',
            },{
                label: '星期日',
                value: '7',
            },]
        }
    },
    methods: {
    }
}
</script>
<style lang="less" scoped>
.timeGrop{
    display: flex;
    justify-content: space-between;
    align-items: center;

    ._label {
        color: #202122;
        width: 36px;
    }
    .timeLabel {
        color: #202122;
        width: 44px;
    }
    ._time {
        padding-left: 5px;
    }
    /deep/ .wg-el-input {
        width: 90px;
    }
    /deep/ .el-date-editor.el-input{
        width: 90px;
    }
}
</style>