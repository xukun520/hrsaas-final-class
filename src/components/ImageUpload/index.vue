<template>
  <div>
    <el-upload
      action='#'
      :limit='1'
      list-type='picture-card'
      :file-list='imageList'
      :on-change='changeFile'
      :before-upload='beforeUpload'
      :http-request='uploadImg'
      :on-preview='handlePictureCardPreview'
      :on-remove='handleRemove'
      :class='{disabled:isShowImgUploadBox}'
    >
      <i class='el-icon-plus'></i>
    </el-upload>
    <el-progress :percentage='percent' v-if='showProgress' style='width: 180px;margin-top: 10px'></el-progress>
    <el-dialog :visible.sync='visible'
               title='头像预览'
               align='center'
               width='40%'
    >
      <el-image :src='imgUrl' alt='' style='width: 100%' />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDA7xWp35rQp69xxcAbuh6dsqjZBasct99',
  SecretKey: '34sUuA9wZx8RUtTw85wIMBjALHx2wb6P'
})
export default {
  name: 'index',
  data() {
    return {
      imageList: [],
      imgUrl: '',
      visible: false,
      imgId: null,
      percent: 0,
      showProgress: false
    }
  },
  methods: {
    // 预览图片
    handlePictureCardPreview(file) {
      this.imgUrl = file.url
      this.visible = true
    },
    // 删除上传图片
    handleRemove(file, fileList) {
      this.imageList = fileList
    },
    // 选择头像时触发change事件
    changeFile(file, fileList) {
      this.imageList = fileList.map(item => item)
    },
    // 上传头像前的处理
    beforeUpload(file) {
      const imgType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
      const imgSize = 3 * 1024 * 1024
      if (!imgType.some(item => item === file.type)) {
        this.$message.error('上传头像的格式只能为JPEG,PNG,GIF,JPG')
        return false
      }
      if (file.size > imgSize) {
        this.$message.error('头像不能大于3M')
        return false
      }
      this.imgId = file.uid
      this.showProgress = true
      return true
    },
    // 上传头像到腾讯云服务器
    uploadImg(params) {
      if (params.file) {
        cos.putObject({
          Bucket: 'vue-backstage-1257724550',
          Region: 'ap-guangzhou',
          StorageClass: 'STANDARD',
          Key: params.file.name,
          Body: params.file,
          onProgress: (progressData) => {
            console.log(progressData)
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            this.imageList = this.imageList.map(item => {
              if (item.uid === this.imgId) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            setTimeout(() => {
              this.showProgress = false
              this.percent = 0
            }, 1500)
          }
        })
      }
    }
  },
  computed: {
    isShowImgUploadBox() {
      return this.imageList.length === 1
    }
  }
}
</script>

<style scoped>

</style>
<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
