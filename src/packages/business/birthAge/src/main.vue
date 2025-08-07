<template>
    <div class="wgBirthAge">
        <div class="birthDiv">
            <label class="birthLabel">
                <span v-if="birthRequireFlag" class="requireTag">*</span>
                出生日期: 
            </label>
            <wg-date-picker
                v-bind="$attrs"
                v-model="birthDate"
                :type="dateType"
                :value-format="valueFormat"
                placeholder="请选择日期"
                @change="dateChange">
            </wg-date-picker>
        </div>
        <div class="ageDiv">
            <label class="ageLabel">年龄: </label>
            <wg-el-input
                class="ageInput" 
                v-model="age"
                placeholder="请输入年龄"
                clearable></wg-el-input>
        </div>
    </div>
</template>
<script>
import { getBirth } from '@/utils/index';
export default {
    name: 'wgBirthAge',
    props: {
        birthRequire: Boolean,
        defaultBirth: [Date, String],
        defaultAge: [Number, String],
        isChild: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        birthRequireFlag() {
            return this.birthRequire;
        },
        dateType() {
            return this.isChild ? 'datetime' : 'date';
        },
        valueFormat() {
            return this.isChild ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
        }
    },
    watch: {
        defaultBirth: {
            handler(v) {
                this.birthDate = v;
            },
            immediate: true,
        },
        defaultAge: {
            handler(v) {
                this.age = v;
            },
            immediate: true,
        },
        age(v) {
            this.$emit("change", {birthDate: this.birthDate , age: v});
        }
    },
    data() {
        return {
            birthDate: '',
            age: '',
        }
    },
    methods: {
        // 选择出生日期
        dateChange(val) {
            if (val) {
                this.getAge();
            } else {
                this.age = '';
            }
        },
        // 计算年龄
        async getAge() {
            const { data } = await getBirth({birthdayStr: this.birthDate, pattern: this.valueFormat});
            this.age = data;
        }
    }
}
</script>
<style lang="less" scoped>
.wgBirthAge {
    display: flex;
    div + div {
        margin-left: 16px;
    }
    .birthDiv {
        display: flex;
        align-items: center;
        .requireTag {
            color: #F56C6C;
        }
    }
    .ageLabel, .birthLabel {
        margin-right: 12px;
    }
    .ageDiv {
        display: flex;
        .ageLabel {
            min-width: 32px;
        }
    }
}
</style>