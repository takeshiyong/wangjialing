/* * 弹窗组件*/

<template>
  <transition name="show">
    <div class="modal-warp" v-if="show">
      <div class="operate show-content" @click="closeModal('open')" :style="`width: ${width}`">
        <el-card style="padding: 0 10px;webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,0);box-shadow: 0 2px 12px 0 rgba(0,0,0,0);">
          <div slot="header" class="clearfix">
              <span class="h4">{{modalTitle}}</span>
              <div style="float: right; padding: 3px 0;cursor:pointer;" @click="closeModal('close')">
                <i class="eocfont eoc-close"></i>
              </div>
          </div>
          <div class="slotWrap">
            <slot name="custom-modal-content"></slot>
          </div>
        </el-card>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      modal: {
        type: Boolean
      },
      modalTitle: {
        type: String
      },
      width: {
        type: String,
        default: '800px'
      }
    },
    data() {
      return {
        show: false
      }
    },
    methods: {
      closeModal(status) {
        if (status === 'open') {
          return;
        }
        this.$emit('closeModal');
      }
    },
    watch: {
      modal(val) {
        this.show = val;
      }
    }
  }

</script>

<style lang="scss" scoped>
  .modal-warp .el-card{
    border-bottom: none;
  }
  .modal-warp {
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.1);
    z-index: 999;
  }
  .operate {
    width: 800px;
    height: calc(100vh - 150px);
    margin-top: 109px;
    background: #fff;
    float: right;
    border-radius:4px;
  }
  .slotWrap{
    height: calc(100vh - 220px);
    overflow-x: hidden;
    overflow-y: auto;
    padding-right: 10px;
  }
  .show-enter-active {
    animation: fadeIn .5s;
  }

  .show-leave-active {
    animation: fadeIn .5s reverse;
  }

  .show-enter-active .show-content {
    animation: fadeInRight .5s;
  }

  .show-leave-active .show-content {
    animation: fadeInRight .5s reverse;
  }
  @media (max-width: 800px) {
    .operate {
      width: 100vw;
      height: calc(100vh - 110px);
      margin-top: 70px;
      background: #fff;
      float: right;
    }
  }
</style>
