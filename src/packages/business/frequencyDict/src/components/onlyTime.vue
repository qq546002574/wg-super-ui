<template>
    <div class="flex align-items-center">
        <label class="_label">时间:</label>
        <wg-time-picker
            :clearable="false"
            class="_time"
            v-model="timeVal"
            value-format="HH:mm"
            format="HH:mm"
            placeholder="请选择时间点">
        </wg-time-picker>
    </div>
</template>
<script>
export default {
    props: {
        time: String,
        id: Number,
    },
    watch: {
        time: {
            handler(v) {
                this.timeVal = v;
            },
            immediate: true,
        },
        timeVal(v) {
            this.$emit('change', {value: v, id: this.id});
        },
    },
    data() {
        return {
            timeVal: '',
        }
    },
    methods: {
    }
}
</script>
<style lang="less" scoped>
._label {
    color: #202122;
    width: 36px;
}
._time {
    padding-left: 5px;
}
</style>