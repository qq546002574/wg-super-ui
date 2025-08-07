<template>
  <div>
<!--    <wg-date-picker manual-popup v-model="test"></wg-date-picker>-->
    <wg-button primary icon="icon-xinzeng1" @click="readOnly = !readOnly">xxxxxxxx</wg-button>
    <wg-el-input v-model="test"></wg-el-input>
    <wg-editor-plus
        customUpload
        :readOnly="readOnly"
        style="height: 500px"></wg-editor-plus>

  </div>
</template>

<script>

import { readonly } from 'vue';

export default {
  name: 'App',
  data () {
    return {
      readOnly: false,
      defaultRegisteredAddr: ['', '', '', '', ''],
      test: '',
    }
  },
}
</script>
