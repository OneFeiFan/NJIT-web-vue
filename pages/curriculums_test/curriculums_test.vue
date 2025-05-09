<template>
  <view>

  </view>

</template>

<script>
import UPicker from "@/uni_modules/uview-ui/components/u-picker/u-picker.vue";

export default {
  components: {UPicker},
  data() {
    return {
      show: true,
      columns: [
        ['中国', '美国'],
        ['深圳', '厦门', '上海', '拉萨']
      ],
      columnData: [
        ['深圳', '厦门', '上海', '拉萨'],
        ['得州', '华盛顿', '纽约', '阿拉斯加']
      ]
    }
  },
  methods: {
    changeHandler(e) {
      const {
        columnIndex,
        value,
        values, // values为当前变化列的数组内容
        index,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs.uPicker
      } = e
      // 当第一列值发生变化时，变化第二列(后一列)对应的选项
      if (columnIndex === 0) {
        // picker为选择器this实例，变化第二列对应的选项
        picker.setColumnValues(1, this.columnData[index])
      }
    },
    // 回调参数为包含columnIndex、value、values
    confirm(e) {
      console.log('confirm', e)
      this.show = false
    }
  }
}
</script>
