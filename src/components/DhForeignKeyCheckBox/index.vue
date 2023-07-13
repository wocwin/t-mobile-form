<template>
  <div class="foreign_key_check_box">
    <div class="place-holder" :style="{ height: menuSettings.navBarHeight + 'px'}"></div>
    <nav-bar :title="title" :isGoBack="true" :isGoBackEvent="true" />
    <div v-if="!searchDisabled" class="search_wrap">
      <van-search ref="search" class="van-search" use-action-slot :value="search" @change="onChange" :placeholder="placeholder" @search="onSearch">
        <view slot="action" @click.stop="onSearch">搜索</view>
      </van-search>
    </div>
    <scroll-view scroll-y :class="['list-content', 'flex-box', 'flex-col', searchDisabled ? 'search-disabled' : '']" @scrolltolower="onReachBottom">
      <van-checkbox-group :value="checked" @change="checkChange">
        <van-cell-group>
          <van-cell v-for="(list, key) in formatListData"
            :key="list"
            :title="list"
            clickable
            :data-name="list"
            value-class="value-class"
            @click="itemHandle(key)">
            <van-checkbox :class="'checkboxes-' + key" :name="list"/>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </scroll-view>
    <van-button :class="{ show: checked.length > 0 }" block class="submit_btn" type="primary" @click="submit">确认</van-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DhForeignKeyCheckBox',
  props: {
    title: {
      type: String,
      default: '选择供应商'
    },
    placeholder: {
      type: String,
      default: '请输入供应商'
    },
    apiName: {
      type: String,
      default: 'listSupplierName'
    },
    fieldFilter: {
      type: String,
      default: 'name'
    },
    params: {
      type: Object,
      default: () => ({})
    },
    valueField: String,
    resField: {
      type: String,
      default: 'data.rows'
    },
    resTransform: Function,
    searchDisabled: Boolean,
    pagingDisabled: Boolean,
    initDisabled: Boolean
  },
  data () {
    return {
      search: '',
      originListData: [], // 原始数据
      transformListData: [], // 转换后数据
      formatListData: [], // 格式化最终适配组件显示的数据
      paging: {
        pageSize: 30,
        current: 1,
        total: 0
      },
      checked: []
    }
  },
  computed: {
    ...mapGetters([
      'menuSettings'
    ])
  },
  onLoad () {
    Object.assign(this.$data, this.$options.data()) // 处理视图退出后数据被缓存的问题
    if (!this.initDisabled) {
      this.$nextTick(() => {
        this.getListData()
      })
    }
  },
  methods: {
    onReachBottom () {
      if (!this.pagingDisabled) {
        this.getListData(true)
      }
    },
    onChange (e) {
      this.search = e.mp.detail
    },
    async onSearch () {
      this.checked = []
      this.getListData()
    },
    async getListData (paging = false) {
      const pageNum = paging ? this.paging.current + 1 : 1
      if (pageNum > 1 && Math.ceil(this.paging.total / this.paging.pageSize) < pageNum) return
      const res = await this.$http(this.apiName, {
        ...(this.fieldFilter ? {
          [this.fieldFilter]: this.search
        } : {}),
        ...this.params,
        ...(!this.pagingDisabled ? {
          pageNum,
          pageSize: this.paging.pageSize
        } : {})
      })
      if (res.success) {
        const rows = this.getPropByPath(res, this.resField)
        this.originListData = paging ? [ ...this.originListData, ...rows ] : rows
        // 因无法在渲染时动态取值，故在此预格式化显示内容
        this.transformListData = this.resTransform ? this.resTransform(this.originListData) : this.originListData
        this.formatListData = this.transformListData.map(item => {
          if (item instanceof Object && this.valueField) {
            return this.getPropByPath(item, this.valueField)
          } else {
            return item
          }
        })
        this.paging.current = pageNum
        this.paging.total = res.data.total
      }
    },
    checkChange (e) {
      this.checked = e.mp.detail
    },
    itemHandle (key) {
      this.$root.$mp.page.selectComponent(`.checkboxes-${key}`).toggle()
    },
    getPropByPath (obj, path) {
      let tempObj = obj
      path = path.replace(/\[(\w+)\]/g, '.$1')
      path = path.replace(/^\./, '')

      let keyArr = path.split('.')
      let i = 0
      for (let len = keyArr.length; i < len - 1; ++i) {
        if (!tempObj) break
        let key = keyArr[i]
        if (key in tempObj) {
          tempObj = tempObj[key]
        } else {
          return null
        }
      }
      return tempObj ? tempObj[keyArr[i]] : null
    },
    submit () {
      this.$emit('submit', this.checked)
    }
  }
}
</script>
<style lang="scss">
.foreign_key_check_box {
  width: 100%;
  height: 100%;
  background: #f7f8fa;
  .value-class {
    flex: none !important;
  }
  .search_wrap {
    height: 54px;
    .van-search {
      width: 100%;
      height: 54px;
      &.disabled {
        pointer-events: none;
      }
    }
  }
  .list-content {
    height: calc(100% - 142px);
    &.search-disabled {
      height: calc(100% - 88px);
    }
  }
  .submit_btn {
    position: absolute;
    right: 32rpx;
    bottom: 32rpx;
    left: 32rpx;
    transform: translateY(150%);
    transition: transform 350ms;
    &.show {
      transform: translateY(0);
    }
  }
}
</style>
