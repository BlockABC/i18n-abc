<template>
    <div :title="$t('文本 template attrs vue')">{{$t('文本 template vue')}}</div>
</template>
<script>
const $t = (text) => text
export default {
  mounted() {
    console.log($t('文本 script vue'))
  },
  methods: {
    $t
  }
}
</script>