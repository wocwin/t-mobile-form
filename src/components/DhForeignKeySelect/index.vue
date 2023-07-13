<template>
  <div class="foreign_key_select">
    <div class="place-holder" :style="{ height: menuSettings.navBarHeight + 'px'}"></div>
    <nav-bar :title="title" :isGoBack="true" :isGoBackEvent="true" />
    <div v-if="!searchDisabled" class="search_wrap">
      <div @click="onSearchClick" class="search_input_wrap">
        <van-search class="van-search" :value="search" :readonly="useLicensePlateKeyboard" @change="onChange" :placeholder="placeholder" @search="onSearch" />
      </div>
      <view class="search_handle" @click="onSearch">搜索</view>
    </div>
    <scroll-view scroll-y :enable-flex="true" :class="['list-content', 'flex-box', 'flex-col', searchDisabled ? 'search-disabled' : '']" @scrolltolower="onReachBottom">
      <van-cell v-for="(list, key) in formatListData"
        :key="key"
        is-link
        :data-name="list"
        @click="itemHandle(list, key)">
        <div slot="title">
          <span v-if="!extraField">{{ list }}</span>
          <span v-if="extraField">{{ list.plateNum }}</span>
          <span v-if="extraField && list.contractSharerName">({{ list.contractSharerName}})</span>
          <span v-if="extraField && list.carStatusDesc">({{ list.carStatusDesc}})</span>
        </div>
      </van-cell>
    </scroll-view>
    <dh-keyword v-if="useLicensePlateKeyboard" :isShow="showKeyboard" @ok="ok" @cancel="cancel" @inputchange="keyboardInputchange" />
    <slot />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DhKeyword from '@/components/DhKeyword'
export default {
  name: 'DhForeignKeySelect',
  components: {
    DhKeyword
  },
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
    extraField: {
      type: Boolean,
      default: false
    },
    resTransform: Function,
    searchDisabled: Boolean,
    pagingDisabled: Boolean,
    useLicensePlateKeyboard: Boolean,
    initDisabled: Boolean
  },
  data () {
    return {
      showKeyboard: false,
      search: '',
      originListData: [], // 原始数据
      transformListData: [], // 转换后数据
      formatListData: [], // 格式化最终适配组件显示的数据
      paging: {
        pageSize: 30,
        current: 1,
        total: 0
      },
      selected: null
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
          // } else if (this.extraField) {
          //   return `${item} ()`
          } else {
            return item
          }
        })
        this.paging.current = pageNum
        this.paging.total = res.data.total
      }
    },
    itemHandle (item, key) {
      this.selected = item
      this.$emit('select', this.transformListData[key])
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
    onSearchClick () {
      if (this.useLicensePlateKeyboard) {
        this.plateInput()
      }
    },
    // 打开车牌键盘
    plateInput () {
      this.showKeyboard = true
    },
    ok () {
      this.getListData()
      this.cancel()
    },
    // 隐藏车牌键盘
    cancel () {
      this.showKeyboard = false
    },
    keyboardInputchange (val) {
      if (this.search.length >= 8 && val !== 'delete') {
        return false
      }
      if (val === 'delete') {
        this.search = this.search.slice(0, this.search.length - 1)
      } else {
        this.search += val
      }
    }
  }
}
</script>
<style lang="scss">
.foreign_key_select {
  width: 100%;
  height: 100%;
  background: #f7f8fa;
  .search_wrap {
    display: flex;
    background-color: #fff;
    align-items: center;
    height: 54px;
    .search_input_wrap {
      flex-grow: 1;
    }
    .van-search {
      width: 100%;
      height: 54px;
      &.disabled {
        pointer-events: none;
      }
    }
    .search_handle {
      position: relative;
      z-index: 11;
      flex-shrink: 0;
      margin-left: -15px;
      padding: 10px;
      font-size: 14px;
    }
  }
  .list-content {
    height: calc(100% - 142px);
    &.search-disabled {
      height: calc(100% - 88px);
    }
  }
}
</style>
