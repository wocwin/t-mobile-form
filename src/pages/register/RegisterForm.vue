<template>
  <div :class="['register_form',className]">
    <slot />
  </div>
</template>
<script>
const SUB_COMP = ['RegisterInput']
export default {
  name: 'RegisterForm',
  props: {
    model: Object,
    rules: Object,
    className: String
  },
  methods: {
    validation(callback) {
      const { model = {}, rules = {} } = this
      let valid = null
      this.$children.forEach(element => {
        const name = element.$options.name
        if (SUB_COMP.includes(name)) {
          const prop = element.$attrs.prop
          const value = model[prop]
          const rule = rules[prop]
          rule && rule(value, (error) => {
            valid = valid || {}
            valid[prop] = error
            element.setError(error)
          })
        }
      })
      callback(valid)
    }
  }
}
</script>